import axios from "axios";

const httpClient = axios.create({
  baseURL: "https://api.github.com/users",
  timeout: 10000,
  headers: {
    Accept: "application/vnd.github+json",
  },
});

export default httpClient;
