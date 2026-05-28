export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener('touchend', (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener('click', callback);
}

// get the product id from the query string
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

export function alertMessage(message, scroll = true) {
  const main = qs('main');
  const existingAlert = qs('.alert-message');
  const alert = document.createElement('div');
  const alertText = document.createElement('p');
  const closeButton = document.createElement('button');

  if (existingAlert) {
    existingAlert.remove();
  }

  alert.classList.add('alert-message');
  alert.setAttribute('role', 'alert');
  alertText.textContent = message;
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'Close message');
  closeButton.textContent = 'X';
  closeButton.addEventListener('click', () => alert.remove());
  alert.append(alertText, closeButton);
  main.insertAdjacentElement('afterbegin', alert);

  if (scroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export function renderListWithTemplate(template, parentElement, list, position = 'afterbegin', clear = false) {
  const htmlStrings = list.map(template);
  // if clear is true we need to clear out the contents of the parent.
  if (clear) {
    parentElement.innerHTML = '';
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback();
  }
}

async function loadTemplate(path) {
  const response = await fetch(path);
  return await response.text();
}

export async function loadHeaderFooter() {
  const header = await loadTemplate('/partials/header.html');
  const footer = await loadTemplate('/partials/footer.html');
  renderWithTemplate(header, qs('#header'));
  renderWithTemplate(footer, qs('#footer'));
}
