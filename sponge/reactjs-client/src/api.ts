import axios from "axios";

const http = axios.create({
  baseURL: 'http://localhost:5001/',
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
});

export const postTransaction = async (message: any) => {
  const response = await http.post<string>('transaction', message);
  return response.data;
};