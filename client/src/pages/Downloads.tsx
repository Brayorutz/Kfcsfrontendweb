import { Section } from "@/components/Section";
import { FileText, FileDown, Calendar, Bell, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const downloadCategories = [
  {
    title: "Financial Reports",
    icon: FileText,
    description: "Latest audited financial statements, annual reports, and investor information.",
    files: [{
      name: "ANNUAL REPORT AND FINANCIAL STATEMENTS FOR THE YEAR ENDED 31ST DECEMBER 2025",
      size: "2.5 MB",
      date: "2025",
      url: "/attached_assets/ANNUAL REPORT AND FINANCIAL STATEMENTS FOR THE YEAR ENDED 31ST DECEMBER 2025.pdf"
    }]
  },
  {
    title: "AGM Reports",
    icon: Calendar,
    description: "Annual General Meeting reports including financial statements and chairman's reports.",
    files: []
  },
  {
    title: "Meeting Minutes",
    icon: FileText,
    description: "Official records of board meetings and general assembly discussions.",
    files: []
  },
  {
    title: "Memos & Notices",
    icon: Bell,
    description: "Important internal communications and member notifications.",
    files: []
  },
  {
    title: "Adverts & Tenders",
    icon: Info,
    description: "Current job openings, tender opportunities, and public notices.",
    files: []
  }
];

export default function Downloads() {
  return (
    <div className="pt-20 bg-white min-h-screen">
      <div className="bg-primary py-20 md:py-32 text-center text-white relative overflow-hidden">
        <div className="relative z-10 container mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">Downloads</h1>
          <p className="text-xl max-w-2xl mx-auto text-primary-foreground/90">
            Access important documents, reports, and notices for Kabianga Farmers Cooperative Society members.
          </p>
        </div>
      </div>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {downloadCategories.map((category) => (
            <div key={category.title} className="bg-white p-8 rounded-2xl shadow-sm border border-border hover:shadow-md transition-all flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-secondary/10 rounded-xl">
                  <category.icon className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold text-primary">{category.title}</h2>
                  <p className="text-muted-foreground text-sm">{category.description}</p>
                </div>
              </div>
              
              <div className="space-y-3 mt-auto">
                {category.files.length === 0 ? (
                  <div className="p-8 text-center py-12 border-2 border-dashed border-muted rounded-xl">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-sm">Currently there is no data available for this category.</p>
                  </div>
                ) : (
                  category.files.map((file) => (
                    <div key={file.name} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-transparent hover:border-secondary/20 transition-colors group">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors" />
                        <div>
                          <p className="font-medium text-foreground">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{file.size} • {file.date}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-secondary hover:text-secondary hover:bg-secondary/10" asChild>
                        <a href="/annual-report">View</a>
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section background="muted" className="text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-primary mb-4">Need Help?</h2>
          <p className="text-muted-foreground mb-8">
            If you cannot find a specific document or need older records, please contact our office directly or visit the customer service desk.
          </p>
          <Button variant="default" size="lg" className="rounded-full px-8" asChild>
            <a href="/contact">Contact Support</a>
          </Button>
        </div>
      </Section>
    </div>
  );
}
