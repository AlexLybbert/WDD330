import CheckoutProcess from './CheckoutProcess.mjs';
import ExternalServices from './ExternalServices.mjs';
import { loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();

const checkout = new CheckoutProcess(new ExternalServices(), 'so-cart');
checkout.init();
