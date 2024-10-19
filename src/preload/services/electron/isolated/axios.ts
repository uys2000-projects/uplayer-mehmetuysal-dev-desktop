import type { AxiosRequestConfig } from "axios";

const get = async (url: string, data?: object) => {
  console.log("test");
  const axios = require("axios");
  return axios.get(url, data);
};

const post = async <T extends object>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig<T>
) => {
  const axios = require("axios");
  return axios.post(url, data, config);
};
export const axios = {
  get: get,
  post: post,
};
