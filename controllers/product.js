import axios from 'axios';

const ENDPOINT_URL = process.env.ENDPOINT_URL || "https://api.mercadolibre.com";

export const searchProducts = async (req, res) => {
  const { query } = req;

  try {
    const product = await axios.get(
      `${ENDPOINT_URL}/sites/MLA/search?q=${query.q}`
    );

    if (product) {
      res.send(product.data);
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