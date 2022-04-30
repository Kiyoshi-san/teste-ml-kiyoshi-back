import axios from 'axios';

const ENDPOINT_URL = process.env.ENDPOINT_URL || "https://api.mercadolibre.com";

const handleCategories = (prodData) => {
  return prodData?.filters?.filter((prdRes) => prdRes.id === "category")[0]
  ?.values[0].path_from_root.map(val => val.name);
};

export const searchProducts = async (req, res) => {
  const { query } = req;

  // Handle product Search Response
  const handlePrice = (prices) => {
    const pricesAux = prices
      .filter((prc) => {
        if(prc.type === "promotion") {
          return prc.type === "promotion";
        } else if (prc.type === "standard") {
          return prc.type === "standard";
        }
      })
      .map((val) => ({
        currency: val.currency_id,
        amount: val?.amount,
        decimals:
          val?.amount
            ?.toString()
            ?.match(/(?<=\.)\d+/)
            ?.join() || "00",
      }));
    return pricesAux[0];
  };

  const handleProductList = (prodData) => {
    let prodDataAux = [];
    prodData.results.map((prd) => {
      if (prd) {
        prd &&
          prodDataAux.push({
            id: prd.id,
            title: prd.title,
            price: handlePrice(prd.prices.prices),
            thumbnail: prd.thumbnail,
            condition: prd.condition,
            free_shipping: prd?.shipping?.free_shipping,
          });
      } else {
        return;
      }
    });

    return prodDataAux;
  };

  const handleSearchResponseData = (prodData) => {
    return {
      author: {
        name: "Kiyoshi",
        lastname: "Yodogawa",
      },
      categories: handleCategories(prodData),
      items: handleProductList(prodData),
    };
  };
  // End - Handle product Search Response

  // Handle Suggestion
  const handleSearchSuggestionsList = (prodData) => {
    let prodDataAux = [];
    for (let i = 0; i <= 9; i++) {
      if (prodData.results[i]) {
        prodData.results[i] &&
          prodDataAux.push({
            id: prodData.results[i].id,
            title: prodData.results[i].title,
          });
      } else {
        return;
      }
    }

    return prodDataAux;
  };
  // End - Handle Suggestion

  try {
    const product = await axios.get(
      `${ENDPOINT_URL}/sites/MLA/search?q=${query.q ?? query.s}`
    );

    if (product) {
      if (query.q) {
        res.send({
          data: handleSearchResponseData(product.data),
        });
      } else if (query.s) {
        res.send(handleSearchSuggestionsList(product.data));
      }
    }
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const getProductById = async(req, res) => {
  const { params } = req;

  try {
    const product = await axios.get(
      `${ENDPOINT_URL}/items/${params.id}`
    );

    const details = await axios.get(
      `${ENDPOINT_URL}/items/${params.id}/description`
    );

    const handleResponse = (product, details) => {
      return {
        author: {
          name: "Kiyoshi",
          lastname: "Yodogawa",
        },
        categories: handleCategories(product),
        items: {
          id: product.id,
          title: product.title,
          price: {
            currency: product.currency_id,
            amount: product.price,
            decimals: product?.price
              ?.toString()
              ?.match(/(?<=\.)\d+/)
              ?.join() || "00",
          },
          picture: product.pictures[0].url,
          condition: product.condition,
          free_shipping: product?.shipping?.free_shipping,
          sold_quantity: product.sold_quantity,
          description: details.plain_text,
        },
      };
    }

    if (product && details) {
      res.send(handleResponse(product.data, details.data));
    }
  } catch(error) {
    res.status(500).send({ message: error })
  }
}
