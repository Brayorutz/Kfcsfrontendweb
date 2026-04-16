import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LogOut, Upload, Users, FileText, Trash2, Download, Plus, Eye, EyeOff,
  FolderOpen, User, Shield, UserCheck, UsersRound, KeyRound, AlertTriangle,
  Newspaper, Edit3, Image, CalendarIcon, Trash
} from "lucide-react"; // CalendarIcon is imported here, but we'll use LucideCalendarIcon for clarity in the NewsManagerComponent
import { useNews, NewsItem } from "@/lib/useNews";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon as LucideCalendarIcon } from "lucide-react"; // Alias to avoid potential conflict with Calendar component
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

interface UserInfo {
  role: "manager" | "director";
  username: string;
  fullName: string;
  id?: string;
  mustChangePassword?: boolean;
}

interface DirectorAccount {
  id: string;
  username: string;
  fullName: string;
  createdAt: string;
}

interface DirectorFile {
  id: string;
  directorId: string;
  filename: string;
  originalName: string;
  uploadedAt: string;
  uploadedBy: string;
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
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
  });
}

function LoginForm({ onLogin }: { onLogin: (user: UserInfo) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/directors/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
      } else {
        onLogin(data);
        toast({ title: `Welcome, ${data.fullName}` });
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
      <Card className="w-full max-w-sm shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">Directors Portal</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Sign in to access your portal</p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dp-username">Username</Label>
              <Input
                id="dp-username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dp-password">Password</Label>
              <div className="relative">
                <Input
                  id="dp-password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">{error}</p>
            )}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function ForcePasswordChange({ user, onChanged, onLogout }: {
  user: UserInfo;
  onChanged: (updated: UserInfo) => void;
  onLogout: () => void;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/directors/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Password updated", description: "Welcome to the Directors Portal!" });
        onChanged({ ...user, mustChangePassword: false });
      } else {
        setError(data.message || "Failed to change password.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 px-4">
      <div className="w-full max-w-md">
        {/* Warning banner */}
        <div className="flex items-start gap-3 bg-amber-100 border border-amber-300 text-amber-800 rounded-2xl px-4 py-3 mb-5">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Password change required</p>
            <p className="text-xs mt-0.5">You must set a new password before you can access the portal. Your temporary password is <strong>123456</strong>.</p>
          </div>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-7 h-7 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-primary">Set Your Password</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Hello <strong>{user.fullName}</strong>, please choose a secure password.</p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Current (Temporary) Password</Label>
                <div className="relative">
                  <Input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="Enter 123456"
                    required
                  />
                  <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>New Password</Label>
                <div className="relative">
                  <Input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                  />
                  <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Confirm New Password</Label>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">{error}</p>
              )}

              <Button type="submit" className="w-full gap-2" disabled={loading}>
                <KeyRound className="w-4 h-4" />
                {loading ? "Updating..." : "Set New Password & Enter Portal"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <button
          onClick={onLogout}
          className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Sign out and go back
        </button>
      </div>
    </div>
  );
}

function ManagerDashboard({ user, onLogout }: { user: UserInfo; onLogout: () => void }) {
  const [directors, setDirectors] = useState<DirectorAccount[]>([]);
  const [files, setFiles] = useState<DirectorFile[]>([]);
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [selectedDirectorId, setSelectedDirectorId] = useState("");
  const [uploadTarget, setUploadTarget] = useState<"specific" | "all">("specific");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [filterDirectorId, setFilterDirectorId] = useState("");
  const { toast } = useToast();

  // Manager Password Change State
  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confPass, setConfPass] = useState("");
  const [showCur, setShowCur] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState("");

  const fetchDirectors = async () => {
    const res = await fetch("/api/directors/accounts", { credentials: "include" });
    if (res.ok) setDirectors(await res.json());
  };

  const fetchFiles = async () => {
    const url = filterDirectorId
      ? `/api/directors/files?directorId=${filterDirectorId}`
      : "/api/directors/files";
    const res = await fetch(url, { credentials: "include" });
    if (res.ok) setFiles(await res.json());
  };

  useEffect(() => { fetchDirectors(); fetchFiles(); }, []);
  useEffect(() => { fetchFiles(); }, [filterDirectorId]);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingAccount(true);
    try {
      const res = await fetch("/api/directors/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: newUsername, fullName: newName }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Account created", description: `${newName} will be prompted to change their password on first login.` });
        setNewName(""); setNewUsername("");
        fetchDirectors();
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } finally {
      setCreatingAccount(false);
    }
  };

  const handleDeleteDirector = async (id: string, name: string) => {
    if (!confirm(`Delete director "${name}" and all their files?`)) return;
    const res = await fetch(`/api/directors/accounts/${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) {
      toast({ title: "Director removed" });
      fetchDirectors(); fetchFiles();
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;
    if (uploadTarget === "specific" && !selectedDirectorId) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", uploadFile);
    form.append("directorId", uploadTarget === "all" ? "all" : selectedDirectorId);
    try {
      const res = await fetch("/api/directors/files", {
        method: "POST",
        credentials: "include",
        body: form,
      });
      const data = await res.json();
      if (res.ok) {
        if (data.broadcastCount !== undefined) {
          toast({ title: "File sent to all directors", description: `${data.broadcastCount} director(s) received "${uploadFile.name}"` });
        } else {
          toast({ title: "File uploaded", description: data.originalName });
        }
        setUploadFile(null);
        const fileInput = document.getElementById("file-input") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        fetchFiles();
      } else {
        toast({ title: "Upload failed", description: data.message, variant: "destructive" });
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    const res = await fetch(`/api/directors/files/${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) { toast({ title: "File deleted" }); fetchFiles(); }
  };

  const handleManagerPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");

    if (newPass !== confPass) {
      setPassError("New passwords do not match.");
      return;
    }

    setPassLoading(true);
    try {
      const res = await fetch("/api/manager/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword: curPass, newPassword: newPass }),
      });
      
      const isJson = res.headers.get("content-type")?.includes("application/json");
      if (res.status === 404) throw new Error("Endpoint not found (404). Please ensure the server has been updated.");
      const data = isJson ? await res.json() : null;
      
      if (res.ok) {
        toast({ title: "Success", description: "Manager password has been updated." });
        setCurPass("");
        setNewPass("");
        setConfPass("");
      } else {
        setPassError(data?.message || `Error: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      console.error("Password change fetch error:", err);
      setPassError(err instanceof Error ? err.message : "Network error: The server could not be reached.");
    } finally {
      setPassLoading(false);
    }
  };

  // News Management Component
  function NewsManagerComponent() {
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const { news, loading, error, createNews, updateNews, deleteNews, refetch } = useNews();
    const { toast } = useToast();

    const formSchema = z.object({
      title: z.string().min(1, 'Title is required'),
      excerpt: z.string().min(1, 'Excerpt is required'),
      content: z.string().min(1, 'Content is required'),
      date: z.date(),
    });
    type FormDataType = z.infer<typeof formSchema>;
    const form = useForm<FormDataType>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        title: '',
        excerpt: '',
        content: '',
        date: new Date(),
      },
    });

    const newsItem = editingId ? news.find(n => n.id === editingId) : null;
    useEffect(() => {
      if (newsItem && open) {
        form.reset({
          title: newsItem.title,
          excerpt: newsItem.excerpt,
          content: newsItem.content,
          date: new Date(newsItem.date),
        });
      } else if (open) {
        form.reset({
          title: '',
          excerpt: '',
          content: '',
          date: new Date(),
        });
      }
    }, [newsItem, open, form]);

    const onSubmit = async (data: FormDataType) => {
      try {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('excerpt', data.excerpt);
        formData.append('content', data.content);
        formData.append('date', data.date.toISOString().split('T')[0]);
        if (selectedImage) {
          formData.append('image', selectedImage);
        }

        if (editingId) {
          await updateNews(editingId, formData);
          toast({ title: 'News updated' });
        } else {
          await createNews(formData);
          toast({ title: 'News created' });
        }
        setOpen(false);
        setEditingId(null);
        setSelectedImage(null);
        form.reset();
        refetch();
      } catch (err) {
        toast({
          title: 'Error',
          description: err instanceof Error ? err.message : 'Failed to save news',
          variant: 'destructive',
        });
      }
    };

    const handleDelete = async (id: number) => {
      if (!confirm('Delete this news item?')) return;
      try {
        await deleteNews(id);
        toast({ title: 'News deleted' });
        refetch();
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to delete news',
          variant: 'destructive',
        });
      }
    };

    const handleEdit = (id: number) => {
      setEditingId(id);
      setOpen(true);
    };

    if (loading) return <div className="text-center py-12 text-muted-foreground">Loading news...</div>;
    if (error) return <div className="text-center py-12 text-destructive">{error}</div>;

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-serif font-bold text-primary">Manage News</h2>
            <p className="text-muted-foreground text-lg">Create, edit and delete news articles for the website</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2" onClick={() => setEditingId(null)}>
                <Plus className="w-5 h-5" />
                {editingId ? 'Edit News' : 'Add New News'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit News Article' : 'Create New News Article'}</DialogTitle>
                <DialogDescription>
                  Fill in the details. Featured image is required, additional images can be embedded in content using <code>{`<img src="/attached_assets/news/filename.jpg">`}</code>.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter news title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt (short summary)</FormLabel>
                        <FormControl>
                          <Input placeholder="Short summary shown in news list" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <LucideCalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                      <Label>Featured Image</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                        className="mt-1"
                      />
                      {newsItem && !selectedImage && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          Current: {newsItem.image}
                        </div>
                      )}
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Full news content. You can embed additional images with: <img src='/attached_assets/news/filename.jpg' alt='description'>"
                            rows={10}
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" className="gap-2">
                      <Edit3 className="w-4 h-4" />
                      {editingId ? 'Update News' : 'Create News'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Published News ({news.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {news.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="font-medium">No news articles yet</p>
                <p className="text-sm mt-1">Create your first news article using the button above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {news.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-4 p-4 rounded-xl border hover:shadow-sm hover:border-primary/30 transition-all">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg line-clamp-1 mb-1">{item.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.excerpt}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <LucideCalendarIcon className="w-3 h-3" />
                            {item.date}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(item.id)}>
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 h-9 w-9 p-0"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
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

  const getDirectorName = (id: string) => directors.find(d => d.id === id)?.fullName || "Unknown";

  return (
    <div className="pt-[94px] min-h-screen bg-gray-50">
      <div className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-primary">KFCS Directors Portal</span>
            <span className="ml-2 text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-medium">Manager</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:block">Logged in as <strong>{user.username}</strong></span>
          <Button variant="outline" size="sm" onClick={onLogout} className="gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Tabs defaultValue="directors">
            <TabsList className="mb-6">
            <TabsTrigger value="directors" className="gap-2"><Users className="w-4 h-4" /> Directors</TabsTrigger>
            <TabsTrigger value="upload" className="gap-2"><Upload className="w-4 h-4" /> Upload File</TabsTrigger>
            <TabsTrigger value="files" className="gap-2"><FileText className="w-4 h-4" /> All Files</TabsTrigger>
            <TabsTrigger value="news" className="gap-2"><Newspaper className="w-4 h-4" /> News</TabsTrigger>
            <TabsTrigger value="password" className="gap-2"><KeyRound className="w-4 h-4" /> Password</TabsTrigger>
          </TabsList>

          <TabsContent value="directors" className="space-y-6">
            {/* Existing directors content stays the same */}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5" /> Create Director Account</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-2.5 text-xs mb-4">
                  <KeyRound className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span>A temporary password <strong>123456</strong> will be set. The director must change it on first login.</span>
                </div>
                <form onSubmit={handleCreateAccount} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                  <div className="space-y-1">
                    <Label>Full Name</Label>
                    <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. John Kamau" required />
                  </div>
                  <div className="space-y-1">
                    <Label>Username</Label>
                    <Input value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder="e.g. john.kamau" required />
                  </div>
                  <div className="sm:col-span-2">
                    <Button type="submit" disabled={creatingAccount} className="gap-2">
                      <Plus className="w-4 h-4" />{creatingAccount ? "Creating..." : "Create Account"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Director Accounts ({directors.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {directors.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>No director accounts yet. Create one above.</p>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="p-3 text-left font-medium">Full Name</th>
                          <th className="p-3 text-left font-medium">Username</th>
                          <th className="p-3 text-left font-medium hidden sm:table-cell">Created</th>
                          <th className="p-3 text-right font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {directors.map(d => (
                          <tr key={d.id} className="border-t hover:bg-muted/30">
                            <td className="p-3 font-medium">{d.fullName}</td>
                            <td className="p-3 text-muted-foreground">{d.username}</td>
                            <td className="p-3 text-muted-foreground hidden sm:table-cell">{formatDate(d.createdAt)}</td>
                            <td className="p-3 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteDirector(d.id, d.fullName)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 gap-1"
                              >
                                <Trash2 className="w-3 h-3" /> Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Upload className="w-5 h-5" /> Upload File</CardTitle>
              </CardHeader>
              <CardContent>
                {directors.length === 0 ? (
                  <p className="text-muted-foreground">Please create at least one director account first.</p>
                ) : (
                  <form onSubmit={handleUpload} className="space-y-6">
                    {/* Target toggle */}
                    <div className="space-y-2">
                      <Label>Send to</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setUploadTarget("specific")}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                            uploadTarget === "specific"
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/40 hover:bg-muted/30"
                          }`}
                        >
                          <UserCheck className={`w-5 h-5 flex-shrink-0 ${uploadTarget === "specific" ? "text-primary" : "text-muted-foreground"}`} />
                          <div>
                            <p className="font-semibold text-sm">Specific Director</p>
                            <p className="text-xs opacity-70 mt-0.5">Choose one director</p>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setUploadTarget("all")}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                            uploadTarget === "all"
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/40 hover:bg-muted/30"
                          }`}
                        >
                          <UsersRound className={`w-5 h-5 flex-shrink-0 ${uploadTarget === "all" ? "text-primary" : "text-muted-foreground"}`} />
                          <div>
                            <p className="font-semibold text-sm">All Directors</p>
                            <p className="text-xs opacity-70 mt-0.5">Broadcast to everyone</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Director selector — only shown for specific */}
                    {uploadTarget === "specific" && (
                      <div className="space-y-2">
                        <Label>Select Director</Label>
                        <select
                          className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background"
                          value={selectedDirectorId}
                          onChange={e => setSelectedDirectorId(e.target.value)}
                          required
                        >
                          <option value="">-- Choose a director --</option>
                          {directors.map(d => (
                            <option key={d.id} value={d.id}>{d.fullName} ({d.username})</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* All-directors info banner */}
                    {uploadTarget === "all" && (
                      <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl text-sm text-primary">
                        <UsersRound className="w-4 h-4 flex-shrink-0" />
                        This file will be delivered to all <strong>{directors.length}</strong> director{directors.length !== 1 ? "s" : ""}.
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>File</Label>
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/40 transition-colors">
                        <FolderOpen className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-3">Choose a file to upload (max 50MB)</p>
                        <Input
                          id="file-input"
                          type="file"
                          onChange={e => setUploadFile(e.target.files?.[0] || null)}
                          className="max-w-xs mx-auto"
                          required
                        />
                        {uploadFile && (
                          <p className="mt-2 text-xs text-primary font-medium">{uploadFile.name} ({formatSize(uploadFile.size)})</p>
                        )}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={uploading || !uploadFile || (uploadTarget === "specific" && !selectedDirectorId)}
                      className="gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      {uploading
                        ? "Uploading..."
                        : uploadTarget === "all"
                          ? `Upload to All ${directors.length} Directors`
                          : "Upload File"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Uploaded Files</CardTitle>
                  <select
                    className="border border-border rounded-md px-3 py-1.5 text-sm bg-background"
                    value={filterDirectorId}
                    onChange={e => setFilterDirectorId(e.target.value)}
                  >
                    <option value="">All Directors</option>
                    {directors.map(d => (
                      <option key={d.id} value={d.id}>{d.fullName}</option>
                    ))}
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                {files.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>No files uploaded yet.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {files.map(f => (
                      <div key={f.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{f.originalName}</p>
                            <p className="text-xs text-muted-foreground">
                              For: <span className="font-medium">{getDirectorName(f.directorId)}</span> · {formatSize(f.size)} · {formatDate(f.uploadedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <a
                            href={`/director-files/${f.filename}`}
                            download={f.originalName}
                            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          >
                            <Download className="w-3 h-3" /> Download
                          </a>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteFile(f.id, f.originalName)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <NewsManagerComponent />
          </TabsContent>

          <TabsContent value="password" className="max-w-md">
            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
                  <KeyRound className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Change Manager Password</CardTitle>
                <p className="text-sm text-muted-foreground">Update your manager account credentials</p>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleManagerPasswordChange} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Current Password</Label>
                    <div className="relative">
                      <Input
                        type={showCur ? "text" : "password"}
                        value={curPass}
                        onChange={e => setCurPass(e.target.value)}
                        placeholder="Current password"
                        required
                      />
                      <button type="button" onClick={() => setShowCur(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {showCur ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>New Password</Label>
                    <div className="relative">
                      <Input
                        type="password"
                        value={newPass}
                        onChange={e => setNewPass(e.target.value)}
                        placeholder="New password"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        type="password"
                        value={confPass}
                        onChange={e => setConfPass(e.target.value)}
                        placeholder="Confirm new password"
                        required
                      />
                    </div>
                  </div>

                  {passError && (
                    <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">
                      {passError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full gap-2"
                    disabled={passLoading}
                  >
                    <KeyRound className="w-4 h-4" />
                    {passLoading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function DirectorDashboard({ user, onLogout }: { user: UserInfo; onLogout: () => void }) {
  const [files, setFiles] = useState<DirectorFile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/directors/files", { credentials: "include" });
      if (res.ok) setFiles(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="pt-[94px] min-h-screen bg-gray-50">
      <div className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-primary">KFCS Directors Portal</span>
            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Director</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:block">
            Welcome, <strong>{user.fullName}</strong>
          </span>
          <Button variant="outline" size="sm" onClick={onLogout} className="gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary">My Documents</h1>
          <p className="text-muted-foreground text-sm mt-1">Files shared with you by the management</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading your files...</div>
            ) : files.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="font-medium">No documents yet</p>
                <p className="text-sm mt-1">The management hasn't uploaded any files for you yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {files.map((f) => (
                  <div key={f.id} className="flex items-center justify-between gap-3 p-4 rounded-xl border hover:shadow-sm hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{f.originalName}</p>
                        <p className="text-xs text-muted-foreground">{formatSize(f.size)} · Shared on {formatDate(f.uploadedAt)}</p>
                      </div>
                    </div>
                    <a
                      href={`/director-files/${f.filename}`}
                      download={f.originalName}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors flex-shrink-0"
                    >
                      <Download className="w-4 h-4" /> Download
                    </a>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DirectorsPortal() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    fetch("/api/directors/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setUser(data);
      })
      .finally(() => setCheckingSession(false));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/directors/logout", { method: "POST", credentials: "include" });
    } finally {
      setUser(null);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading session...</div>
      </div>
    );
  }

  if (!user) return <LoginForm onLogin={setUser} />;

  if (user.role === "manager") return <ManagerDashboard user={user} onLogout={handleLogout} />;

  if (user.mustChangePassword) {
    return (
      <ForcePasswordChange
        user={user}
        onChanged={setUser}
        onLogout={handleLogout}
      />
    );
  }
  return <DirectorDashboard user={user} onLogout={handleLogout} />;
}
