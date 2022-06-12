import axios from "axios";

const http = axios.create({
  baseURL: 'http://localhost:5001/',
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
});

export const postTransaction = async (body: any) => {
  const response = await http.post<string>('transaction', body);
  return response.data;
};

export const postNetworkConnect = async (body: any) => {
  const response = await http.post<any>('network/connect', body);
  return response.data;
};