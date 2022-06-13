import axios from "axios";

const nodeAddress = process.env.REACT_APP_NODE_ADDRESS;
console.log({nodeAddress});

const http = axios.create({
  baseURL: nodeAddress,
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