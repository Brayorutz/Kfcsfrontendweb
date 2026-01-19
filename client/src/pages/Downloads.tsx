import { Section } from "@/components/Section";
import { FileText, FileDown, Calendar, Bell, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const downloadCategories = [
  {
    title: "AGM Reports",
    icon: Calendar,
    description: "Annual General Meeting reports including financial statements and chairman's reports.",
    files: [
      { name: "KFCS Annual Report 2024", size: "2.4 MB", date: "Jan 2025" },
      { name: "KFCS Annual Report 2023", size: "2.1 MB", date: "Jan 2024" }
    ]
  },
  {
    title: "Meeting Minutes",
    icon: FileText,
    description: "Official records of board meetings and general assembly discussions.",
    files: [
      { name: "AGM Minutes - December 2024", size: "1.2 MB", date: "Dec 2024" },
      { name: "Special General Meeting - June 2024", size: "850 KB", date: "Jun 2024" }
    ]
  },
  {
    title: "Memos & Notices",
    icon: Bell,
    description: "Important internal communications and member notifications.",
    files: [
      { name: "Notice on Milk Price Adjustment", size: "450 KB", date: "Feb 2025" },
      { name: "Member Education Workshop Schedule", size: "620 KB", date: "Jan 2025" }
    ]
  },
  {
    title: "Adverts & Tenders",
    icon: Info,
    description: "Current job openings, tender opportunities, and public notices.",
    files: [
      { name: "Tender for Milk Transport Services 2025", size: "1.5 MB", date: "Feb 2025" },
      { name: "Job Advertisement - Extension Officer", size: "520 KB", date: "Jan 2025" }
    ]
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
                {category.files.map((file) => (
                  <div key={file.name} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-transparent hover:border-secondary/20 transition-colors group">
                    <div className="flex items-center gap-3">
                      <FileDown className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors" />
                      <div>
                        <p className="font-medium text-foreground">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{file.size} • {file.date}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-secondary hover:text-secondary hover:bg-secondary/10">
                      Download
                    </Button>
                  </div>
                ))}
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
