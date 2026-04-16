import { useState, useCallback } from 'react';

export interface FinancialFile {
  id: string;
  category: string;
  filename: string;
  originalName: string;
  uploadedAt: string;
  size: number;
  mimetype: string;
}

export function useFinancialRecords() {
  const [files, setFiles] = useState<FinancialFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/manager/financial-files', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch financial records');
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadFile = useCallback(async (file: File, category: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    setLoading(true);
    try {
      const res = await fetch('/api/manager/financial-files', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      await fetchFiles(); // Refresh list
      return await res.json();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Upload failed');
    } finally {
      setLoading(false);
    }
  }, [fetchFiles]);

  const deleteFile = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/manager/financial-files/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Delete failed');
      await fetchFiles(); // Refresh list
    } catch (err) {
      throw err instanceof Error ? err : new Error('Delete failed');
    } finally {
      setLoading(false);
    }
  }, [fetchFiles]);

  return {
    files,
    loading,
    error,
    fetchFiles,
    uploadFile,
    deleteFile,
  };
}

