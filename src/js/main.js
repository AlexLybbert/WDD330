import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter, qs } from './utils.mjs';

// Load header and footer
loadHeaderFooter();

const dataSource = new ExternalServices();
const listElement = qs('.product-list');
const productList = new ProductList('tents', dataSource, listElement);

productList.init();
