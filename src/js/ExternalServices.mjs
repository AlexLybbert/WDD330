const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  const jsonResponse = await res.json();

  if (res.ok) {
    return jsonResponse;
  }

  throw { name: 'servicesError', message: jsonResponse };
}

function normalizeProduct(product) {
  // Some of the local json files use Image instead of Images.
  if (!product.Images) {
    product.Images = {
      PrimaryMedium: product.Image,
      PrimaryLarge: product.Image,
    };
  }
  return product;
}

async function getLocalProducts(category) {
  const response = await fetch(`/json/${category}.json`);
  const data = await convertToJson(response);

  let products = data;
  if (data.Result) {
    products = data.Result;
  }

  return products.map(normalizeProduct);
}

export default class ExternalServices {
  async getData(category) {
    if (!baseURL) {
      return getLocalProducts(category);
    }

    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result.map(normalizeProduct);
  }

  async findProductById(id) {
    if (!baseURL) {
      const categories = ['tents', 'backpacks', 'sleeping-bags'];

      for (const category of categories) {
        const products = await getLocalProducts(category);
        const product = products.find((item) => item.Id.toLowerCase() === id.toLowerCase());

        if (product) {
          return product;
        }
      }
    }

    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return normalizeProduct(data.Result);
  }

  async checkout(order) {
    const response = await fetch(`${baseURL}checkout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });
    return convertToJson(response);
  }
}
