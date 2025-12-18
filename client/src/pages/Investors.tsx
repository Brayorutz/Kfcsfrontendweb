import { Section } from "@/components/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, PieChart, ArrowUpRight } from "lucide-react";

const data = [
  { name: '2020', revenue: 4000 },
  { name: '2021', revenue: 5500 },
  { name: '2022', revenue: 7000 },
  { name: '2023', revenue: 8500 },
  { name: '2024', revenue: 10000 },
];

export default function Investors() {
  return (
    <div className="pt-20">
      <div className="bg-primary py-20 md:py-32 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">Investor Relations</h1>
        <p className="text-xl max-w-2xl mx-auto text-primary-foreground/90">
           Transparency, Growth, and Returns. Invest in the future of dairy.
        </p>
      </div>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="border-t-4 border-t-secondary">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-secondary" />
                        Annual Growth
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-primary mb-2">18.5%</div>
                    <p className="text-muted-foreground text-sm">Consistent year-over-year revenue growth.</p>
                </CardContent>
            </Card>
            <Card className="border-t-4 border-t-secondary">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-secondary" />
                        Dividends Paid
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-primary mb-2">KES 12M</div>
                    <p className="text-muted-foreground text-sm">Distributed to shareholders in 2024.</p>
                </CardContent>
            </Card>
            <Card className="border-t-4 border-t-secondary">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ArrowUpRight className="w-5 h-5 text-secondary" />
                        Asset Value
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-primary mb-2">KES 450M</div>
                    <p className="text-muted-foreground text-sm">Total asset base as of Dec 2024.</p>
                </CardContent>
            </Card>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-border mb-16">
             <h2 className="text-2xl font-serif font-bold mb-8 text-primary">Revenue Growth Trajectory</h2>
             <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            cursor={{ fill: 'transparent' }}
                        />
                        <Bar dataKey="revenue" fill="hsl(150 70% 35%)" radius={[4, 4, 0, 0]} barSize={60} />
                    </BarChart>
                </ResponsiveContainer>
             </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
                <h2 className="text-3xl font-serif font-bold text-primary mb-6">Financial Reports</h2>
                <div className="space-y-4">
                    {[2024, 2023, 2022].map(year => (
                        <div key={year} className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer group">
                            <span className="font-medium">Annual Report {year}</span>
                            <Button variant="ghost" size="sm" className="text-secondary group-hover:bg-white">
                                <Download className="w-4 h-4 mr-2" /> Download PDF
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                 <h2 className="text-3xl font-serif font-bold text-primary mb-6">Investor Inquiry</h2>
                 <p className="text-muted-foreground mb-6">Interested in becoming a shareholder? Contact our relations team directly.</p>
                 <form className="space-y-4">
                     <input type="text" placeholder="Full Name" className="w-full p-3 rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-secondary/50" />
                     <input type="email" placeholder="Email Address" className="w-full p-3 rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-secondary/50" />
                     <textarea placeholder="Message" rows={4} className="w-full p-3 rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-secondary/50"></textarea>
                     <Button className="w-full bg-primary text-white">Send Inquiry</Button>
                 </form>
            </div>
        </div>
      </Section>
    </div>
  );
}
