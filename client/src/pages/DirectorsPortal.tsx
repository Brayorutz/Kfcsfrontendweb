import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2, LogOut, Upload, Users, FileText, Trash2, Download, Plus, Eye, EyeOff,
  FolderOpen, User, Shield, UserCheck, UsersRound, Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserInfo {
  role: "manager" | "director";
  username: string;
  fullName: string;
  id?: string;
  needsPasswordChange?: boolean;
  firstLogin?: boolean;
}

interface DirectorAccount {
  id: string;
  username: string;
  fullName: string;
  createdAt: string;
  firstLogin?: boolean;
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

function LoginForm({ onLogin, onPasswordPrompt }: { 
  onLogin: (user: UserInfo) => void;
  onPasswordPrompt?: (user: UserInfo) => void;
}) {
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
        } else if (data.needsPasswordChange) {
          onPasswordPrompt?.(data);
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
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function ManagerDashboard({ user, onLogout }: { user: UserInfo; onLogout: () => void }) {
  const [directors, setDirectors] = useState<DirectorAccount[]>([]);
  const [files, setFiles] = useState<DirectorFile[]>([]);
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [selectedDirectorId, setSelectedDirectorId] = useState("");
  const [uploadTarget, setUploadTarget] = useState<"specific" | "all">("specific");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [filterDirectorId, setFilterDirectorId] = useState("");
  const { toast } = useToast();

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
        toast({ title: "Account created", description: `Director ${newName} can now log in.` });
        setNewName(""); setNewUsername(""); setNewPassword("");
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

  const getDirectorName = (id: string) => directors.find(d => d.id === id)?.fullName || "Unknown";

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
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
          <span className="text-sm text-muted-foreground hidden sm:block">Logged in as <strong>{user?.username}</strong></span>
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
          </TabsList>

          <TabsContent value="directors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5" /> Create Director Account</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateAccount} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div className="space-y-1">
                    <Label>Full Name</Label>
                    <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. John Kamau" required />
                  </div>
                  <div className="space-y-1">
                    <Label>Username</Label>
                    <Input value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder="e.g. john.kamau" required />
                  </div>
                  <div className="space-y-1">
                    <Label>Password</Label>
                    <div className="relative">
                      <Input
                        type="password"
                        value="123456"
                        readOnly
                        className="bg-muted text-muted-foreground cursor-not-allowed"
                        placeholder="123456 (default)"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Default password is <code>123456</code>. Director will be prompted to change it on first login.
                    </p>
                  </div>
                  <div className="sm:col-span-3">
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

  useEffect(() => { fetchFiles(); }, []);

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
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
          <span className="text-sm text-muted-foreground hidden sm:block">Welcome, <strong>{user?.fullName || user?.username}</strong></span>
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
                {files.map(f => (
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
  const [tempUser, setTempUser] = useState<UserInfo | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const { toast } = useToast();

  const handlePasswordPrompt = (userData: UserInfo) => {
    // Skip mandatory password change for seamless access
    setUser(userData);
    toast({ title: "Welcome Director! Please change password in settings later.", description: "Documents ready.", variant: "default" });
  };

  const handlePasswordChangeSuccess = async () => {
    if (!tempUser) return;
    const res = await fetch("/api/directors/me", { credentials: "include" });
    if (res.ok) {
      const updatedUser = await res.json();
      setUser(updatedUser);
    }
    setTempUser(null);
    setShowPasswordModal(false);
    setNewPassword("");
    setConfirmPassword("");
    toast({ title: "Success", description: "Password updated. Welcome to your portal!" });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    if (newPassword.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }
    setChangingPassword(true);
    try {
      const res = await fetch("/api/directors/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password: newPassword }),
      });
      if (res.ok) {
        handlePasswordChangeSuccess();
      } else {
        const data = await res.json();
        toast({ title: "Error", description: data.message || "Failed to change password", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Network error", variant: "destructive" });
    } finally {
      setChangingPassword(false);
    }
  };

  function PasswordChangeDialog({ 
    open, 
    onOpenChange, 
    user, 
    onSuccess 
  }: { 
    open: boolean; 
    onOpenChange: (open: boolean) => void;
    user: UserInfo | null;
    onSuccess: () => void;
  }) {
    const [showPass, setShowPass] = useState(false);

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              First Login - Set New Password
            </DialogTitle>
            <DialogDescription>
              Welcome, <strong>{user?.fullName}</strong> ({user?.username}). Please set a strong password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password (min 8 chars)</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPass ? "text" : "password"}
                  value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  // Prevent re-render loop
                }}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  // Prevent re-render loop
                }}
                required
              />
            </div>
            <DialogFooter className="gap-2">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={changingPassword || newPassword.length < 8 || newPassword !== confirmPassword}
                className="flex-1 gap-2"
              >
                {changingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Changing...
                  </>
                ) : (
                  "Set Password"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  useEffect(() => {
    fetch("/api/directors/me", { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setUser(data); })
      .finally(() => setCheckingSession(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/directors/logout", { method: "POST", credentials: "include" });
    setUser(null);
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {tempUser && (
        <PasswordChangeDialog
          open={showPasswordModal}
          onOpenChange={setShowPasswordModal}
          user={tempUser}
          onSuccess={handlePasswordChangeSuccess}
        />
      )}
      {(!user && !tempUser) ? (
        <LoginForm onLogin={setUser} onPasswordPrompt={handlePasswordPrompt} />
      ) : user?.role === "manager" ? (
        <ManagerDashboard user={user} onLogout={handleLogout} />
      ) : (
        <DirectorDashboard user={user} onLogout={handleLogout} />
      )}
    </>
  );
}
