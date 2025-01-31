import axios from "axios";
const fetchProductInfo = async (pid) => {
    try {
      const response = await axios.post('http://localhost:5000/api/productInfo', { pid });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch product info');
      return [];
    }
  };
  export default fetchProductInfo;