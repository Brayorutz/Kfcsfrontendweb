import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileDown, Upload, Trash2, Calendar, Download, Plus, Lock, Unlock, Tag, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Category {
  name: string;
  viewOnly: boolean;
  isFinancial: boolean;
  createdAt?: string;
}

interface DownloadItem {
  id: string;
  filename: string;
  originalName: string;
  category: string;
  description: string;
  uploadedAt: string;
  size: number;
  mimetype: string;
  viewOnly: boolean;
  fileUrl: string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' });
}

const FINANCIAL_CATS = ['Annual Reports', 'Financial Statements', 'Audit Reports', 'Board Minutes', 'Others'];

export function UnifiedDownloadsManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allFiles, setAllFiles] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const { toast } = useToast();

  const fetchCategories = useCallback(async () => {
    const res = await fetch('/api/manager/categories');
    if (res.ok) {
      const data: Category[] = await res.json();
      setCategories(data);
      if (data.length > 0 && !selectedCategory) setSelectedCategory(data[0].name);
    }
  }, [selectedCategory]);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/public/all-downloads');
      if (res.ok) setAllFiles(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchFiles();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedCategory) return;
    setUploading(true);
    try {
      const isFinancial = FINANCIAL_CATS.includes(selectedCategory);
      const form = new FormData();
      form.append('file', selectedFile);

      let res: Response;
      if (isFinancial) {
        form.append('category', selectedCategory);
        res = await fetch('/api/manager/financial-files', { method: 'POST', body: form });
      } else {
        form.append('category', selectedCategory);
        form.append('description', description);
        res = await fetch('/api/manager/downloads', { method: 'POST', body: form });
      }

      if (!res.ok) throw new Error((await res.json()).message || 'Upload failed');
      toast({ title: 'Upload successful', description: `"${selectedFile.name}" added to ${selectedCategory}` });
      setSelectedFile(null);
      setDescription('');
      const input = document.getElementById('unified-download-file') as HTMLInputElement;
      if (input) input.value = '';
      await fetchFiles();
    } catch (err) {
      toast({ title: 'Upload failed', description: err instanceof Error ? err.message : 'Upload failed', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item: DownloadItem) => {
    if (!confirm(`Delete "${item.originalName}"? This cannot be undone.`)) return;
    try {
      const isFinancial = item.viewOnly && FINANCIAL_CATS.includes(item.category);
      const endpoint = isFinancial
        ? `/api/manager/financial-files/${item.id}`
        : `/api/manager/downloads/${item.id}`;
      const res = await fetch(endpoint, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast({ title: 'File deleted' });
      setAllFiles(f => f.filter(x => x.id !== item.id));
    } catch {
      toast({ title: 'Delete failed', variant: 'destructive' });
    }
  };

  const handleAddCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;
    setAddingCategory(true);
    try {
      const res = await fetch('/api/manager/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed');
      const cat: Category = await res.json();
      setCategories(prev => [...prev, cat]);
      setSelectedCategory(cat.name);
      setNewCategoryName('');
      toast({ title: 'Category created', description: `"${cat.name}" added as a downloadable category` });
    } catch (err) {
      toast({ title: 'Failed to create category', description: err instanceof Error ? err.message : 'Error', variant: 'destructive' });
    } finally {
      setAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (name: string) => {
    if (!confirm(`Delete category "${name}"? Files in this category won't be affected.`)) return;
    try {
      const res = await fetch(`/api/manager/categories/${encodeURIComponent(name)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).message);
      setCategories(c => c.filter(x => x.name !== name));
      if (selectedCategory === name) setSelectedCategory(categories[0]?.name || '');
      toast({ title: 'Category deleted' });
    } catch (err) {
      toast({ title: 'Cannot delete category', description: err instanceof Error ? err.message : 'Error', variant: 'destructive' });
    }
  };

  const filesByCategory = categories.map(cat => ({
    ...cat,
    files: allFiles.filter(f => f.category === cat.name),
  })).filter(c => c.files.length > 0);

  const uncategorized = allFiles.filter(f => !categories.find(c => c.name === f.category));

  const selectedCat = categories.find(c => c.name === selectedCategory);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif font-bold text-primary mb-2 flex items-center gap-3">
          <FileDown className="w-8 h-8" />
          Downloads Manager
        </h2>
        <p className="text-muted-foreground">Upload and manage all public downloads. Financial categories are view-only; others are downloadable.</p>
      </div>

      {/* Category management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tag className="w-5 h-5" /> Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <div key={cat.name} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${cat.viewOnly ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-green-50 border-green-200 text-green-800'}`}>
                {cat.viewOnly ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                {cat.name}
                {!cat.isFinancial && (
                  <button onClick={() => handleDeleteCategory(cat.name)} className="ml-1 text-muted-foreground hover:text-destructive">
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="New category name..."
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
              className="max-w-sm"
            />
            <Button onClick={handleAddCategory} disabled={!newCategoryName.trim() || addingCategory} variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            <Lock className="w-3 h-3 inline mr-1" />Financial categories are view-only for the public.
            <Unlock className="w-3 h-3 inline ml-2 mr-1" />Custom categories are downloadable.
          </p>
        </CardContent>
      </Card>

      {/* Upload form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" /> Upload File
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.name} value={cat.name}>
                        <div className="flex items-center gap-2">
                          {cat.viewOnly ? <Lock className="w-3.5 h-3.5 text-primary" /> : <Unlock className="w-3.5 h-3.5 text-green-600" />}
                          {cat.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCat && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    {selectedCat.viewOnly
                      ? <><Lock className="w-3 h-3 text-primary" /> Public can view only</>
                      : <><Unlock className="w-3 h-3 text-green-600" /> Public can download</>
                    }
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Description (optional)</Label>
                <Input
                  placeholder="Short description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  disabled={selectedCat?.isFinancial}
                />
              </div>
              <div className="space-y-2">
                <Label>File {selectedCat?.isFinancial ? '(PDF only)' : '(any type, max 100MB)'}</Label>
                <label
                  htmlFor="unified-download-file"
                  className="flex items-center gap-3 border-2 border-dashed border-muted rounded-xl p-4 cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <FileDown className="w-8 h-8 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Click to select file</p>
                    {selectedFile && <p className="text-xs text-primary mt-0.5">{selectedFile.name} ({formatSize(selectedFile.size)})</p>}
                  </div>
                </label>
                <Input
                  id="unified-download-file"
                  type="file"
                  accept={selectedCat?.isFinancial ? 'application/pdf' : undefined}
                  onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                  className="sr-only w-0 h-0"
                />
              </div>
            </div>
            <Button type="submit" className="gap-2" disabled={!selectedFile || !selectedCategory || uploading}>
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading...' : 'Upload File'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Files list */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileDown className="w-5 h-5" />
              Published Files ({allFiles.length})
            </CardTitle>
            <Button variant="outline" size="sm" onClick={fetchFiles} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filesByCategory.length === 0 && uncategorized.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileDown className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No files uploaded yet.</p>
            </div>
          ) : (
            <div className="divide-y">
              {filesByCategory.map(cat => (
                <div key={cat.name}>
                  <div className="px-6 py-3 bg-muted/30 flex items-center gap-2">
                    {cat.viewOnly ? <Lock className="w-4 h-4 text-primary" /> : <Unlock className="w-4 h-4 text-green-600" />}
                    <span className="font-semibold">{cat.name}</span>
                    <Badge variant="secondary">{cat.files.length}</Badge>
                    <span className="text-xs text-muted-foreground ml-1">
                      {cat.viewOnly ? '(view-only)' : '(downloadable)'}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                    {cat.files.map(file => (
                      <div key={file.id} className="group/card p-3 border rounded-xl hover:shadow-sm transition-all bg-card">
                        <div className="flex items-start gap-2">
                          <FileDown className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium line-clamp-2 leading-tight">{file.originalName}</p>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(file.uploadedAt)}
                              <span>·</span>
                              {formatSize(file.size)}
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover/card:opacity-100 transition-all flex-shrink-0">
                            <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors text-primary" title={file.viewOnly ? 'View' : 'Download'}>
                              {file.viewOnly ? <Eye className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                            </a>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:bg-destructive/5" onClick={() => handleDelete(file)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
