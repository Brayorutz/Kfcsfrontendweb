import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { X, FileText } from "lucide-react";

export default function AnnualReport() {
  return (
    <div className="pt-20 bg-white min-h-screen">
      <div className="bg-primary py-12 text-center text-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
            Annual Report 2025
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Kabianga Farmers Cooperative Society - Financial Statements for the Year Ended 31st December 2025
          </p>
        </div>
      </div>

      <Section>
        <div className="max-w-6xl mx-auto p-8">
          <div className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden">
            <div className="p-8 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/20 rounded-xl">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold text-primary">
                    ANNUAL REPORT AND FINANCIAL STATEMENTS FOR THE YEAR ENDED 31ST DECEMBER 2025
                  </h2>
                  <p className="text-sm text-muted-foreground">Confidential Document - View Only</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.history.back() || (window.location.href = '/downloads')}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Close
              </Button>
            </div>
            <div className="h-[80vh] md:h-[85vh]">
                <embed 
                  src="/attached_assets/ANNUAL REPORT AND FINANCIAL STATEMENTS FOR THE YEAR ENDED 31ST DECEMBER 2025.pdf#toolbar=0&navpanes=0&scrollbar=0" 
                  type="application/pdf" 
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="Annual Report"
                />
            </div>
            <div className="p-8 border-t border-border bg-muted/30 text-center text-sm text-muted-foreground">
              <p>This document is provided for viewing purposes only. Downloading or printing is not permitted for security reasons.</p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

