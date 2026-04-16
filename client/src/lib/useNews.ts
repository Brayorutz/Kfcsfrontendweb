import { useState, useEffect } from 'react';

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  videoUrl?: string;
}

export function useNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/news', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch news');
      const data = await response.json();
      setNews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const createNews = async (formData: FormData) => {
    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to create news');
      const newItem = await response.json();
      setNews(prev => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create news');
    }
  };

  const updateNews = async (id: number, formData: FormData) => {
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to update news');
      const updatedItem = await response.json();
      setNews(prev => prev.map(item => item.id === id ? updatedItem : item));
      return updatedItem;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update news');
    }
  };

  const deleteNews = async (id: number) => {
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete news');
      setNews(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete news');
    }
  };

  return {
    news,
    loading,
    error,
    refetch: fetchNews,
    createNews,
    updateNews,
    deleteNews,
  };
}
