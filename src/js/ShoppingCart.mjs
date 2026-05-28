import { getLocalStorage, qs, renderListWithTemplate } from './utils.mjs';

function cartItemTemplate(item) {
  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img
        src="${item.Image}"
        alt="${item.Name}"
      />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}

export default class ShoppingCart {
  constructor(listElement) {
    this.listElement = listElement;
    this.cartItems = [];
  }

  init() {
    this.cartItems = getLocalStorage('so-cart') || [];
    this.renderList(this.cartItems);
    this.renderCartFooter();
  }

  renderList(list) {
    renderListWithTemplate(cartItemTemplate, this.listElement, list, 'afterbegin', true);
  }

  renderCartFooter() {
    const cartFooter = qs('.cart-footer');
    const cartTotal = qs('#cartTotal');

    if (!cartFooter || !cartTotal) {
      return;
    }

    if (this.cartItems.length === 0) {
      cartFooter.classList.add('hide');
      return;
    }

    const total = this.cartItems.reduce((sum, item) => sum + Number(item.FinalPrice), 0);
    cartTotal.textContent = total.toFixed(2);
    cartFooter.classList.remove('hide');
  }
}
