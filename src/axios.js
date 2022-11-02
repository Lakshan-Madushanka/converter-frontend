import axios from "axios";
import { BASE_API_URL } from "./api/routes";

const apiInstance = axios.create({
  baseURL: BASE_API_URL,
  //withCredentials: true,
});
apiInstance.defaults.withCredentials = true;

export default apiInstance;
