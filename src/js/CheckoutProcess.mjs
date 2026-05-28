import { alertMessage, getLocalStorage, qs, setLocalStorage } from './utils.mjs';

const TAX_RATE = 0.06;
const BASE_SHIPPING = 10;
const EXTRA_ITEM_SHIPPING = 2;

function toCurrency(amount) {
  return Number(amount).toFixed(2);
}

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: 1,
  }));
}

export default class CheckoutProcess {
  constructor(dataSource, cartKey) {
    this.dataSource = dataSource;
    this.cartKey = cartKey;
    this.items = [];
    this.subtotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.items = getLocalStorage(this.cartKey) || [];

    if (this.items.length === 0) {
      this.showMessage('Your cart is empty.');
      qs('#checkoutForm').classList.add('hide');
      return;
    }

    this.calculateItemSummary();
    qs('#zip').addEventListener('change', () => {
      this.calculateOrderTotal();
    });
    qs('#checkoutForm').addEventListener('submit', (event) => {
      event.preventDefault();
      if (!event.target.checkValidity()) {
        event.target.reportValidity();
        return;
      }
      this.checkout(event.target);
    });
  }

  calculateItemSummary() {
    this.subtotal = this.items.reduce((sum, item) => sum + Number(item.FinalPrice), 0);
    qs('#subtotal').textContent = toCurrency(this.subtotal);
  }

  calculateOrderTotal() {
    this.shipping = BASE_SHIPPING + EXTRA_ITEM_SHIPPING * (this.items.length - 1);
    this.tax = this.subtotal * TAX_RATE;
    this.orderTotal = this.subtotal + this.shipping + this.tax;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    qs('#shipping').textContent = toCurrency(this.shipping);
    qs('#tax').textContent = toCurrency(this.tax);
    qs('#orderTotal').textContent = toCurrency(this.orderTotal);
  }

  async checkout(form) {
    if (this.orderTotal === 0) {
      this.calculateOrderTotal();
    }

    const submitButton = qs('button[type="submit"]', form);
    submitButton.disabled = true;
    this.showMessage('Submitting order...');

    const order = formDataToJSON(form);
    order.cardNumber = order.cardNumber.replace(/\D/g, '');
    order.code = order.code.replace(/\D/g, '');
    order.orderDate = new Date().toISOString();
    order.items = packageItems(this.items);
    order.shipping = this.shipping;
    order.tax = toCurrency(this.tax);
    order.orderTotal = toCurrency(this.orderTotal);

    try {
      await this.dataSource.checkout(order);
      setLocalStorage(this.cartKey, []);
      window.location.href = '/checkout/success.html';
    } catch (error) {
      alertMessage(this.formatErrorMessage(error));
      this.showMessage('Unable to submit order.');
      submitButton.disabled = false;
    }
  }

  formatErrorMessage(error) {
    if (!error) {
      return 'Unable to submit order.';
    }

    if (typeof error === 'string') {
      return error;
    }

    const message = error.message || error;

    if (typeof message === 'string') {
      return message;
    }

    if (Array.isArray(message)) {
      return message.join(' ');
    }

    if (typeof message === 'object') {
      let errorText = '';

      Object.values(message).forEach((value) => {
        if (Array.isArray(value)) {
          errorText += `${value.join(' ')} `;
        } else {
          errorText += `${value} `;
        }
      });

      return errorText.trim();
    }

    return 'Unable to submit order.';
  }

  showMessage(message) {
    qs('#checkoutMessage').textContent = message;
  }
}
