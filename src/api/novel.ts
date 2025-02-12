import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 5000
});

export const searchNovels = (keyword: string) => {
  return api.get('/novel/search', {
    params: { keyword }
  });
}; 