import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Upload, Trash2, Download, Eye, Calendar } from 'lucide-react';
import { useFinancialRecords, type FinancialFile } from '@/lib/useFinancialRecords';
import { useToast } from '@/hooks/use-toast';
 // formatSize and formatDate defined locally below


const CATEGORIES = [
  { value: 'Annual Reports', label: 'Annual Reports' },
  { value: 'Financial Statements', label: 'Financial Statements' },
  { value: 'Audit Reports', label: 'Audit Reports' },
  { value: 'Board Minutes', label: 'Board Minutes' },
  { value: 'Others', label: 'Others' },
];

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

export function FinancialRecordsManager() {
  const { files, loading, fetchFiles, uploadFile, deleteFile } = useFinancialRecords();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].value);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      await uploadFile(selectedFile, selectedCategory);
      toast({
        title: 'Upload successful',
        description: `${selectedFile.name} added to ${selectedCategory}`,
      });
      setSelectedFile(null);
      setSelectedCategory(CATEGORIES[0].value);
      const fileInput = document.getElementById('financial-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err) {
      toast({
        title: 'Upload failed',
        description: err instanceof Error ? err.message : 'Upload failed',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    try {
      await deleteFile(id);
      toast({ title: 'File deleted' });
    } catch (err) {
      toast({
        title: 'Delete failed',
        description: err instanceof Error ? err.message : 'Delete failed',
        variant: 'destructive',
      });
    }
  };

  const filesByCategory = files.reduce((acc, file) => {
    const cat = file.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(file);
    return acc;
  }, {} as Record<string, FinancialFile[]>);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-serif font-bold text-primary mb-3 flex items-center gap-3">
          <FileText className="w-8 h-8" />
          Financial Records Manager
        </h2>
        <p className="text-lg text-muted-foreground">Upload categorized PDFs for public view-only access on /downloads</p>
      </div>

      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload New Document
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>PDF File</Label>
                  <label 
                    htmlFor="financial-file" 
                    className="block border-2 border-dashed border-muted rounded-2xl p-8 text-center hover:border-primary/50 transition-colors h-32 flex flex-col items-center justify-center cursor-pointer bg-background hover:bg-accent"
                  >
                    <FileText className="w-12 h-12 text-muted-foreground mb-3" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Click to select PDF</p>
                      <p className="text-xs text-muted-foreground/70">Max 50MB</p>
                    </div>
                  </label>
                  <Input
                    id="financial-file"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="sr-only w-0 h-0"
                  />

                {selectedFile && (
                  <div className="flex items-center gap-2 text-sm text-primary bg-primary/5 p-2 rounded-lg">
                    <FileText className="w-4 h-4" />
                    {selectedFile.name} ({formatSize(selectedFile.size)})
                  </div>
                )}
              </div>
            </div>
            <Button type="submit" className="gap-2 w-full md:w-auto" disabled={!selectedFile || uploading || loading}>
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading...' : 'Upload PDF'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Files List */}
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Published Documents ({files.length})
            </CardTitle>
            <Button variant="outline" onClick={fetchFiles} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {Object.entries(filesByCategory).length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No financial documents yet</p>
              <p className="text-sm mt-2">Upload your first document using the form above.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {Object.entries(filesByCategory).map(([category, catFiles]) => (
                <div key={category} className="group">
                  <div className="p-6 bg-muted/30 sticky top-0 z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-lg px-3 py-1 h-auto">{category} ({catFiles.length})</Badge>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                    {catFiles.map((file) => (
                      <div key={file.id} className="group/card p-4 border rounded-xl hover:shadow-md transition-all bg-card hover:bg-background">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium text-sm line-clamp-2 leading-tight">{file.originalName}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(file.uploadedAt)}
                                <span>•</span>
                                {formatSize(file.size)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-all ml-auto">
                            <a
                              href={`/financial-records/${file.filename}`}
                              download={file.originalName}
                              className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              title="Download (Manager only)"
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
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

