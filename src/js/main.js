import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { qs } from './utils.mjs';

// Initialize product list for tents on the home page
const productListElement = qs('.product-list');
const tentData = new ProductData('tents');
const productList = new ProductList('tents', tentData, productListElement);
productList.init();