import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Ban, Calendar, FolderOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Section } from "@/components/Section";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface FinancialFile {
  id: string;
  category: string;
  filename: string;
  originalName: string;
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
  return new Date(iso).toLocaleDateString("en-KE", {
    year: "numeric", month: "short", day: "numeric"
  });
}

export default function Downloads() {
  const [files, setFiles] = useState<FinancialFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<FinancialFile | null>(null);
  const [viewingFile, setViewingFile] = useState(false);
  const { toast } = useToast();

  const CATEGORIES = [
    { id: "annual-reports", label: "Annual Reports", badge: "📊" },
    { id: "financial-statements", label: "Financial Statements", badge: "💰" },
    { id: "audit-reports", label: "Audit Reports", badge: "🔍" },
    { id: "board-minutes", label: "Board Minutes", badge: "📋" },
    { id: "others", label: "Others", badge: "📄" }
  ];

  useEffect(() => {
    fetchFinancialFiles();
  }, []);

  const fetchFinancialFiles = async () => {
    try {
      const res = await fetch("/api/public/financial-files");
      if (res.ok) {
        const data = await res.json();
        setFiles(data);
      }
    } catch (err) {
      toast({
        title: "Error loading documents",
        description: "Please refresh the page",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryFiles = (categoryId: string) => {
    return files.filter(f => f.category.toLowerCase().replace(/\s+/g, '-') === categoryId);
  };

  const openViewer = (file: FinancialFile) => {
    setSelectedFile(file);
    setViewingFile(true);
  };

  const AntiDownloadViewer = ({ file }: { file: FinancialFile }) => {
    useEffect(() => {
      const handleContextMenu = (e: MouseEvent) => e.preventDefault();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'F12' || (e.ctrlKey && (e.key === 'c' || e.key === 'p' || e.key === 'a' || e.key === 's' || e.key === 'u' || e.key === 'v' || e.key === 'i'))) {
          e.preventDefault();
        }
        if (e.key.toLowerCase() === 'printscreen') e.preventDefault();
      };
      const handleSelectStart = (e: MouseEvent) => e.preventDefault();

      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('selectstart', handleSelectStart);
      document.addEventListener('dragstart', handleSelectStart);
      
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      document.body.style.MozUserSelect = 'none';

      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('selectstart', handleSelectStart);
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
        document.body.style.MozUserSelect = '';
      };
    }, []);

    return (
      <div className="max-w-6xl mx-auto p-6 select-none">
        <div className="bg-white rounded-2xl shadow-2xl border overflow-hidden select-none">
          <div className="p-6 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <FileText className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">{file.originalName}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <Badge variant="secondary">{file.category}</Badge>
                  <span>{formatDate(file.uploadedAt)}</span>
                  <span>{formatSize(file.size)}</span>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setViewingFile(false)}
              className="flex items-center gap-2"
            >
              <Ban className="w-4 h-4" />
              Close Viewer
            </Button>
          </div>
          <div className="h-[75vh] md:h-[85vh] p-1 bg-gray-50">
            <embed 
              src={`/${encodeURI(`financial-records/${file.filename}`)}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`} 
              type="application/pdf"
              className="w-full h-full border-none select-none pointer-events-auto"
              title={file.originalName}
            />
          </div>
          <div className="p-6 border-t border-border bg-muted/50 text-center text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-2">
              <Ban className="w-4 h-4" />
              <span>View-only access. Right-click, copy, print, and download disabled for document security.</span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <Section>
          <div className="text-center py-20">
            <div className="w-12 h-12 border-2 border-primary/20 rounded-full border-t-primary/60 animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading documents...</p>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary/10 via-white to-secondary/10">
        <Section>
          <div className="text-center py-20">
            <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-6 py-3 rounded-full mb-6">
              <FolderOpen className="w-6 h-6" />
              <span className="text-xl font-bold">Public Documents</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-black bg-gradient-to-r from-primary via-primary/80 to-foreground bg-clip-text text-transparent mb-6 leading-tight">
              Financial Records
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              View official KFCS financial reports and documents. <strong>View-only access</strong> - no downloads permitted.
            </p>
          </div>
        </Section>
      </div>

      <Section className="pb-20">
        <div className="max-w-6xl mx-auto space-y-8">
          {CATEGORIES.map((cat) => {
            const catFiles = getCategoryFiles(cat.id);
            if (catFiles.length === 0) return null;
            
            return (
              <Card key={cat.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-primary/5 pb-1">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <span className="text-2xl">{cat.badge}</span>
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-serif">{cat.label}</CardTitle>
                      <p className="text-sm text-muted-foreground">{catFiles.length} document{catFiles.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                    {catFiles.map((file) => (
                      <Card key={file.id} className="hover:shadow-md transition-all group border hover:border-primary/30">
                        <CardHeader className="pb-3 pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3 text-sm font-medium text-primary">
                              <FileText className="w-5 h-5 flex-shrink-0 mt-0.5" />
                              <span className="truncate max-w-[180px]">{file.originalName}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">{formatSize(file.size)}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                            <Calendar className="w-3 h-3" />
                            {formatDate(file.uploadedAt)}
                          </div>
                        </CardHeader>
                        <CardContent className="pb-6 pt-0">
                          <Dialog open={viewingFile && selectedFile?.id === file.id} onOpenChange={() => {
                            if (viewingFile && selectedFile?.id === file.id) setViewingFile(false);
                          }}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                className="w-full h-12 group hover:bg-primary hover:text-white transition-all justify-center gap-2 border-2 hover:border-primary/50 shadow-sm hover:shadow-primary/25"
                                onClick={() => openViewer(file)}
                              >
                                <Eye className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                                <span className="font-semibold">View Document</span>
                                <Ban className="w-4 h-4 ml-auto opacity-70" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-7xl p-0 max-h-[95vh] h-[95vh]">
                              <AntiDownloadViewer file={file} />
                            </DialogContent>
                          </Dialog>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {files.length === 0 && (
            <Card className="text-center py-20">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-2xl font-bold text-muted-foreground mb-2">No Documents Available</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Financial records will appear here once uploaded by management. Check back soon.
              </p>
              <Button variant="outline" onClick={fetchFinancialFiles}>
                Refresh
              </Button>
            </Card>
          )}
        </div>
      </Section>

      {viewingFile && selectedFile && (
        <Dialog open={viewingFile} onOpenChange={setViewingFile}>
          <DialogContent className="max-w-7xl p-0 max-h-[95vh] h-[95vh]">
            <AntiDownloadViewer file={selectedFile} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

