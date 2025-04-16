import axiosClient from "./axiosClient";

const setApi = {
  getAll(page: number, size: number = 10) {
    const url = `api/sets?page=${page}&size=${size}`;
    return axiosClient.get(url);
  }
};

export default setApi;

