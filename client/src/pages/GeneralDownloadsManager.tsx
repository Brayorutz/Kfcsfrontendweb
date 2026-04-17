import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileDown, Upload, Trash2, Calendar, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GeneralDownload {
  id: string;
  filename: string;
  originalName: string;
  description: string;
  uploadedAt: string;
  size: number;
  mimetype: string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-KE', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

export function GeneralDownloadsManager() {
  const [files, setFiles] = useState<GeneralDownload[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/manager/downloads');
      if (res.ok) setFiles(await res.json());
    } catch {
      toast({ title: 'Failed to load downloads', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', selectedFile);
      form.append('description', description);
      const res = await fetch('/api/manager/downloads', { method: 'POST', body: form });
      if (!res.ok) throw new Error((await res.json()).message || 'Upload failed');
      toast({ title: 'Upload successful', description: selectedFile.name });
      setSelectedFile(null);
      setDescription('');
      const fileInput = document.getElementById('general-download-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      await fetchFiles();
    } catch (err) {
      toast({ title: 'Upload failed', description: err instanceof Error ? err.message : 'Upload failed', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/manager/downloads/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast({ title: 'File deleted' });
      setFiles(f => f.filter(x => x.id !== id));
    } catch {
      toast({ title: 'Delete failed', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif font-bold text-primary mb-3 flex items-center gap-3">
          <FileDown className="w-8 h-8" />
          Public Downloads Manager
        </h2>
        <p className="text-lg text-muted-foreground">Upload files that the public can freely download from the /downloads page</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload New File
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-2">
                <Label htmlFor="general-download-desc">Description (optional)</Label>
                <Input
                  id="general-download-desc"
                  placeholder="Short description of this file"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>File (any type, max 100MB)</Label>
                <label
                  htmlFor="general-download-file"
                  className="block border-2 border-dashed border-muted rounded-2xl p-8 text-center hover:border-primary/50 transition-colors h-32 flex flex-col items-center justify-center cursor-pointer bg-background hover:bg-accent"
                >
                  <FileDown className="w-12 h-12 text-muted-foreground mb-3" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Click to select file</p>
                    <p className="text-xs text-muted-foreground/70">Max 100MB · Any file type</p>
                  </div>
                </label>
                <Input
                  id="general-download-file"
                  type="file"
                  onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                  className="sr-only w-0 h-0"
                />
                {selectedFile && (
                  <div className="flex items-center gap-2 text-sm text-primary bg-primary/5 p-2 rounded-lg">
                    <FileDown className="w-4 h-4" />
                    {selectedFile.name} ({formatSize(selectedFile.size)})
                  </div>
                )}
              </div>
            </div>
            <Button type="submit" className="gap-2 w-full md:w-auto" disabled={!selectedFile || uploading}>
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading...' : 'Upload File'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Published Downloads ({files.length})
            </CardTitle>
            <Button variant="outline" onClick={fetchFiles} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {files.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <FileDown className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No downloads yet</p>
              <p className="text-sm mt-2">Upload your first file using the form above.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {files.map(file => (
                <div key={file.id} className="group/card p-4 border rounded-xl hover:shadow-md transition-all bg-card hover:bg-background">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2 min-w-0">
                      <FileDown className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-sm line-clamp-2 leading-tight">{file.originalName}</p>
                        {file.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{file.description}</p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(file.uploadedAt)}
                          <span>·</span>
                          <Badge variant="outline" className="text-xs px-1 py-0">{formatSize(file.size)}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-all ml-1 flex-shrink-0">
                      <a
                        href={`/general-downloads/${file.filename}`}
                        download={file.originalName}
                        className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/5 hover:text-destructive"
                        onClick={() => handleDelete(file.id, file.originalName)}
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
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
