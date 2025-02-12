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

interface Chapter {
  name: string;
  url: string;
}

interface NovelDetail {
  name: string;
  url: string;
  source_id: string;
  size: string;
  author: string;
  status: string;
  cover_url: string;
  classify: string;
  introduce: string | null;
  last_update_time: string;
  last_chapter_name: string;
}

interface ChapterResponse {
  chapter_list: Chapter[];
  next_page: string;
}

export const getNovelChapters = (novel: NovelDetail): Promise<ChapterResponse> => {
  return api.post('/novel/chapter', {
    novel
  });
}; 