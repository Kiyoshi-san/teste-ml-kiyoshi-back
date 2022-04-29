import axios from 'axios';

const ENDPOINT_URL = process.env.ENDPOINT_URL || "https://api.mercadolibre.com";

export const searchProducts = async (req, res) => {
  const { query } = req;

  const handleProductList = (prodData) => {
    let prodDataAux = [];
    prodData.results.map(prd => {
      if (prd) {
        prd &&
          prodDataAux.push({
            id: prd.id,
            title: prd.title,
            prices: {
              amount: prd.prices.prices[0].amount,
              currency_id: prd.prices.prices[0].currency_id,
            },
            thumbnail: prd.thumbnail,
            address: prd.address,
          });
      } else {
        return;
      }
    })

    return prodDataAux;
  };

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

  const handleBreadCrumb = (breadCrumb) => {
    const breadCrumbAux = []
    for(let i = 0; i < 3; i++) {
      breadCrumbAux.push(breadCrumb[i])
    }

    return breadCrumbAux;
  }

  try {
    const product = await axios.get(
      `${ENDPOINT_URL}/sites/MLA/search?q=${query.q ?? query.s}`
    );

    if (product) {
      if (query.q) {
        res.send({
          data: handleProductList(product.data),
          breadCrumb: handleBreadCrumb(
            product.data.available_filters[0].values
          ),
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

    if(product) {
      res.send({ product: product.data, details: details.data });
    }
  } catch(error) {
    res.status(500).send({ message: error })
  }
}
