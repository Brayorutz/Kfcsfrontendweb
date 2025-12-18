import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Users, FileText, Settings, LogOut } from "lucide-react";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-zinc-900">
            <Card className="w-full max-w-sm shadow-xl border-zinc-800 bg-zinc-900 text-white">
                <CardHeader className="text-center">
                    <h1 className="text-xl font-bold">Admin Login</h1>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" className="bg-zinc-800 border-zinc-700 text-white" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" className="bg-zinc-800 border-zinc-700 text-white" />
                        </div>
                        <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">Access Dashboard</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-border min-h-screen hidden md:block">
        <div className="p-6">
            <h2 className="font-bold text-lg text-primary">KFCS Admin</h2>
        </div>
        <nav className="px-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-2 bg-primary/10 text-primary"><Users className="w-4 h-4" /> Members</Button>
            <Button variant="ghost" className="w-full justify-start gap-2"><FileText className="w-4 h-4" /> Content</Button>
            <Button variant="ghost" className="w-full justify-start gap-2"><Settings className="w-4 h-4" /> Settings</Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Member Management</h1>
              <Button variant="outline" size="sm" onClick={() => setIsLoggedIn(false)} className="gap-2">
                  <LogOut className="w-4 h-4" /> Logout
              </Button>
          </div>

          <Card className="mb-8">
              <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Applications</CardTitle>
                  <Button size="sm">Add New Member</Button>
              </CardHeader>
              <CardContent>
                  <div className="rounded-md border">
                      <table className="w-full text-sm">
                          <thead className="bg-muted">
                              <tr>
                                  <th className="p-3 text-left font-medium">Name</th>
                                  <th className="p-3 text-left font-medium">ID Number</th>
                                  <th className="p-3 text-left font-medium">Date</th>
                                  <th className="p-3 text-left font-medium">Status</th>
                                  <th className="p-3 text-right font-medium">Action</th>
                              </tr>
                          </thead>
                          <tbody>
                              {[1,2,3].map(i => (
                                  <tr key={i} className="border-b">
                                      <td className="p-3">Jane Doe</td>
                                      <td className="p-3">23456789</td>
                                      <td className="p-3">Dec 18, 2024</td>
                                      <td className="p-3"><span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">Pending</span></td>
                                      <td className="p-3 text-right">
                                          <Button variant="ghost" size="sm" className="text-primary">Approve</Button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
