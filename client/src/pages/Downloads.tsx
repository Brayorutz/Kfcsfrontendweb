import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Ban, Calendar, FolderOpen, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Section } from "@/components/Section";
import { useToast } from "@/hooks/use-toast";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

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
  return new Date(iso).toLocaleDateString("en-KE", {
    year: "numeric", month: "short", day: "numeric"
  });
}

function PDFViewer({ file, onClose }: { file: DownloadItem; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const renderTaskRef = useRef<any>(null);

  useEffect(() => {
    const stop = (e: Event) => e.preventDefault();
    const stopKey = (e: KeyboardEvent) => {
      if (e.key === 'F12' || (e.ctrlKey && ['c','p','a','s','u','v','i'].includes(e.key))) e.preventDefault();
    };
    document.addEventListener('contextmenu', stop);
    document.addEventListener('keydown', stopKey);
    document.addEventListener('selectstart', stop);
    document.addEventListener('dragstart', stop);
    document.body.style.userSelect = 'none';
    return () => {
      document.removeEventListener('contextmenu', stop);
      document.removeEventListener('keydown', stopKey);
      document.removeEventListener('selectstart', stop);
      document.removeEventListener('dragstart', stop);
      document.body.style.userSelect = '';
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setCurrentPage(1);
    setPdfDoc(null);
    setTotalPages(0);

    pdfjsLib.getDocument(file.fileUrl).promise
      .then((doc: any) => {
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load document. Please try again.");
        setLoading(false);
      });
  }, [file.fileUrl]);

  const renderPage = useCallback(async (doc: any, pageNum: number) => {
    if (!canvasRef.current || !doc) return;

    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
      renderTaskRef.current = null;
    }

    const page = await doc.getPage(pageNum);
    const containerWidth = containerRef.current?.clientWidth ?? 800;
    const viewport = page.getViewport({ scale: 1 });
    const scale = (containerWidth - 32) / viewport.width;
    const scaledViewport = page.getViewport({ scale });

    const canvas = canvasRef.current;
    canvas.height = scaledViewport.height;
    canvas.width = scaledViewport.width;

    const context = canvas.getContext("2d");
    const renderTask = page.render({ canvasContext: context, viewport: scaledViewport });
    renderTaskRef.current = renderTask;

    try {
      await renderTask.promise;
    } catch (e: any) {
      if (e?.name !== "RenderingCancelledException") {
        console.error("Render error:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (pdfDoc && currentPage) {
      renderPage(pdfDoc, currentPage);
    }
  }, [pdfDoc, currentPage, renderPage]);

  return (
    <div className="flex flex-col h-full select-none">
      <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-primary/5 to-secondary/5 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-primary truncate">{file.originalName}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
              <Badge variant="secondary" className="text-xs">{file.category}</Badge>
              <span>{formatDate(file.uploadedAt)}</span>
              <span>{formatSize(file.size)}</span>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onClose} className="flex-shrink-0 ml-4">
          <Ban className="w-4 h-4 mr-1" /> Close
        </Button>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto bg-gray-200 flex flex-col items-center py-4 px-4 min-h-0">
        {loading && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">Loading document...</p>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-destructive">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
        {!loading && !error && (
          <canvas
            ref={canvasRef}
            className="shadow-xl rounded max-w-full"
            style={{ pointerEvents: 'none' }}
          />
        )}
      </div>

      {!loading && !error && totalPages > 0 && (
        <div className="p-3 border-t bg-muted/50 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Ban className="w-3.5 h-3.5" />
            View-only — download and copy are disabled
          </span>
        </div>
      )}
    </div>
  );
}

export default function Downloads() {
  const [items, setItems] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingFile, setViewingFile] = useState<DownloadItem | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/public/all-downloads")
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setItems(data))
      .catch(() => toast({ title: "Error loading documents", description: "Please refresh the page", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, []);

  const categories = Array.from(new Set(items.map(i => i.category))).sort();

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-primary/20 rounded-full border-t-primary/60 animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary/10 via-white to-secondary/10">
        <Section>
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-6 py-3 rounded-full mb-6">
              <FolderOpen className="w-6 h-6" />
              <span className="text-xl font-bold">Public Documents</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-black bg-gradient-to-r from-primary via-primary/80 to-foreground bg-clip-text text-transparent mb-6 leading-tight">
              Downloads
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Official KFCS documents and files. Financial records are <strong>view-only</strong>; other documents can be downloaded.
            </p>
          </div>
        </Section>
      </div>

      <Section className="pb-20">
        <div className="max-w-6xl mx-auto space-y-12">

          {items.length === 0 ? (
            <Card className="text-center py-20">
              <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
              <h3 className="text-2xl font-bold text-muted-foreground mb-2">No Documents Yet</h3>
              <p className="text-muted-foreground">Documents will appear here once uploaded by management.</p>
            </Card>
          ) : (
            categories.map(category => {
              const catItems = items.filter(i => i.category === category);
              if (catItems.length === 0) return null;
              const isViewOnly = catItems[0].viewOnly;
              return (
                <div key={category}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isViewOnly ? 'bg-primary/10' : 'bg-green-100'}`}>
                      {isViewOnly
                        ? <FileText className="w-5 h-5 text-primary" />
                        : <Download className="w-5 h-5 text-green-700" />
                      }
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif font-bold">{category}</h2>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        {isViewOnly
                          ? <><Ban className="w-3 h-3" /> View-only</>
                          : <><Download className="w-3 h-3" /> Downloadable</>
                        }
                        {" · "}{catItems.length} file{catItems.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {catItems.map(item => (
                      <Card key={item.id} className={`hover:shadow-md transition-all border-2 ${isViewOnly ? 'hover:border-primary/30' : 'hover:border-green-400/40'}`}>
                        <CardHeader className="pb-2 pt-5">
                          <div className="flex items-start gap-3">
                            <FileText className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isViewOnly ? 'text-primary' : 'text-green-700'}`} />
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-sm leading-snug line-clamp-2">{item.originalName}</p>
                              {item.description && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{item.description}</p>
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs flex-shrink-0">{formatSize(item.size)}</Badge>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2 ml-8">
                            <Calendar className="w-3 h-3" />
                            {formatDate(item.uploadedAt)}
                          </div>
                        </CardHeader>
                        <CardContent className="pb-5 pt-0">
                          {isViewOnly ? (
                            <Button
                              variant="outline"
                              className="w-full h-10 hover:bg-primary hover:text-white gap-2 border-primary/30"
                              onClick={() => setViewingFile(item)}
                            >
                              <Eye className="w-4 h-4" />
                              View Document
                              <Ban className="w-3.5 h-3.5 ml-auto opacity-60" />
                            </Button>
                          ) : (
                            <a href={item.fileUrl} download={item.originalName} className="block">
                              <Button
                                variant="outline"
                                className="w-full h-10 hover:bg-green-600 hover:text-white gap-2 border-green-300"
                              >
                                <Download className="w-4 h-4" />
                                Download
                              </Button>
                            </a>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Section>

      {/* PDF Viewer Dialog */}
      <Dialog open={!!viewingFile} onOpenChange={open => { if (!open) setViewingFile(null); }}>
        <DialogContent className="max-w-5xl p-0 max-h-[92vh] h-[92vh] flex flex-col">
          <VisuallyHidden>
            <DialogTitle>{viewingFile?.originalName ?? "Document Viewer"}</DialogTitle>
          </VisuallyHidden>
          {viewingFile && (
            <PDFViewer file={viewingFile} onClose={() => setViewingFile(null)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
