import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Smartphone, Download, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Portal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-muted/30">
            <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
                <CardHeader className="text-center pb-2">
                    <h1 className="text-3xl font-serif font-bold text-primary">Member Portal</h1>
                    <p className="text-muted-foreground">Secure access for KFCS members</p>
                </CardHeader>
                <CardContent className="p-8">
                    <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="memberNo">Member Number</Label>
                            <Input id="memberNo" placeholder="e.g. KFCS-001" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password / ID Number</Label>
                            <Input id="password" type="password" />
                        </div>
                        <Button type="submit" className="w-full bg-primary text-white h-10 mt-2">Login</Button>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">Forgot your credentials? Contact the office.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-muted/10">
      <div className="bg-white border-b border-border py-6">
        <div className="container mx-auto px-6 flex justify-between items-center">
             <div>
                <h1 className="text-2xl font-bold text-primary">Welcome, John Doe</h1>
                <p className="text-sm text-muted-foreground">Member #KFCS-1042 | Kabianga Village</p>
             </div>
             <Button variant="outline" onClick={() => setIsLoggedIn(false)}>Logout</Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Milk Delivered (Dec)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-primary">450 Liters</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Projected Payout</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-secondary">KES 22,500</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding Loan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-orange-600">KES 5,000</div>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Tabs defaultValue="statements">
                    <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0 mb-6">
                        <TabsTrigger value="statements" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6">Statements</TabsTrigger>
                        <TabsTrigger value="loans" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6">Loans & Advances</TabsTrigger>
                        <TabsTrigger value="profile" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6">Profile</TabsTrigger>
                    </TabsList>
                    <TabsContent value="statements" className="space-y-4">
                        <Card>
                            <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                                            <div>
                                                <p className="font-medium">Milk Delivery - Morning</p>
                                                <p className="text-xs text-muted-foreground">Dec {20-i}, 2024</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-primary">15.0 L</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="loans">
                         <Card>
                            <CardHeader><CardTitle>Apply for Advance</CardTitle></CardHeader>
                            <CardContent>
                                <Alert className="mb-6">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Eligibility</AlertTitle>
                                    <AlertDescription>You are eligible for an advance of up to KES 10,000 based on your current deliveries.</AlertDescription>
                                </Alert>
                                <div className="flex gap-4">
                                    <Input placeholder="Amount (KES)" />
                                    <Button>Request Advance</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            <div>
                 <Card className="bg-primary text-white border-none">
                    <CardContent className="p-8 text-center">
                        <Smartphone className="w-12 h-12 mx-auto mb-4 opacity-80" />
                        <h3 className="text-xl font-bold mb-2">Get the Farmer App</h3>
                        <p className="text-primary-foreground/80 mb-6 text-sm">Track your deliveries in real-time, request veterinary services, and shop for feeds directly from your phone.</p>
                        <Button variant="secondary" className="w-full gap-2">
                            <Download className="w-4 h-4" /> Download App
                        </Button>
                    </CardContent>
                 </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
