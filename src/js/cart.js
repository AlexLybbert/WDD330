import ShoppingCart from './ShoppingCart.mjs';
import { qs, loadHeaderFooter } from './utils.mjs';

// Initialize shopping cart
const cartListElement = qs('.product-list');
const cart = new ShoppingCart(cartListElement);
cart.init();

// Load header and footer
loadHeaderFooter();