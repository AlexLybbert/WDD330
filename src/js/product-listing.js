import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';
import { qs, loadHeaderFooter, getParam } from './utils.mjs';

loadHeaderFooter();

const category = getParam('category');
// first create an instance of the ExternalServices class.
const dataSource = new ExternalServices();
// then get the element you want the product list to render in
const listElement = qs('.product-list');
// then create an instance of the ProductList class and send it the correct information.
const myList = new ProductList(category, dataSource, listElement);
// finally call the init method to show the products
myList.init();

// Update the page title with the category
const heading = qs('.products h2');
const formattedCategory = category
  .split('-')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');
heading.textContent = `Top Products: ${formattedCategory}`;
