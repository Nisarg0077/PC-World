import axios from "axios";

const fetchProducts = async () => {
  try {
    const response = await axios.post("http://localhost:5000/api/products"); // Adjust the backend URL
    return response.data; // Axios already parses JSON response
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export default fetchProducts;
