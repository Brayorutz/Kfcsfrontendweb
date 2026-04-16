import { useState, useEffect } from 'react';

interface PdfViewerProps {
  url: string;
  title: string;
}

export function PdfViewer({ url, title }: PdfViewerProps) {
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    // Use PDF.js viewer (common CDN, or self-host)
    setPdfUrl(`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(url)}`);
  }, [url]);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white max-w-6xl max-h-[90vh] w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-primary">{title}</h2>
          <button className="text-2xl text-gray-500 hover:text-gray-700">&times;</button>
        </div>
        <iframe 
          src={pdfUrl} 
          className="w-full flex-1 border-0"
          title={title}
        />
      </div>
    </div>
  );
}

