"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  UploadCloud,
  FileText,
  Download,
  Trash2,
  HardDrive,
  Loader2,
  AlertCircle,
  FileCode,
  Image as ImageIcon,
  File,
  CheckCircle2,
} from "lucide-react";
import type { FileRecord } from "@/app/types/database.types";

interface FileManagerProps {
  initialFiles: FileRecord[];
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

// Helper to render distinct icons based on MIME type
function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/"))
    return <ImageIcon className="w-5 h-5 text-cyan-400" />;
  if (mimeType.includes("pdf") || mimeType.includes("text"))
    return <FileText className="w-5 h-5 text-purple-400" />;
  if (
    mimeType.includes("json") ||
    mimeType.includes("javascript") ||
    mimeType.includes("html")
  )
    return <FileCode className="w-5 h-5 text-amber-400" />;
  return <File className="w-5 h-5 text-slate-400" />;
}







export function FileManager({ initialFiles }: FileManagerProps) {
  //electron execute btn
  const [isElectron, setIsElectron] = useState(false);
  const [executingId, setExecutingId] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined" && window.electronAPI?.isElectron) {
      setIsElectron(true);
    }
  }, []);
  const handleExecute = async (file: any) => {
    if (!window.electronAPI) return;

    setError(null);
    setSuccessMsg(null);

    if (!file.filename.toLowerCase().endsWith(".py")) {
      setError("Only .py files can be executed with Docker.");
      return;
    }

    // 1. Get the URL property, or fallback to your API route ID
    // Adjust this fallback route to match your actual API path if needed
    const fileUrl = file.url || file.publicUrl || file.downloadUrl || file.path || `/api/files/${file.id}`; 

    if (!fileUrl) {
      setError("File download URL could not be resolved.");
      return;
    }

    console.log("Downloading for Docker execution from:", fileUrl);

    setExecutingId(file.id);

    try {
      const res = await window.electronAPI.executePythonDocker(fileUrl, file.filename);

      if (res.success) {
        setSuccessMsg(res.message || "Execution completed!");
      } else {
        setError(res.error || "Failed to execute python file.");
      }
    } catch (err: any) {
      setError(err.message || "An execution error occurred.");
    } finally {
      setExecutingId(null);
    }
  };



  const [files, setFiles] = useState<FileRecord[]>(initialFiles);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const triggerToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  async function processUpload(file: File) {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? "Upload failed");
      }

      setFiles((prev) => [json.file as FileRecord, ...prev]);
      triggerToast(`${file.name} uploaded successfully!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processUpload(file);
  }

  // Drag and Drop handlers
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processUpload(file);
  }

  async function handleDownload(fileRecord: FileRecord) {
    setError(null);
    setActionLoadingId(`download-${fileRecord.id}`);
    try {
      const res = await fetch(`/api/files/${fileRecord.id}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? "Could not get download link");
      }

      window.open(json.url as string, "_blank");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleDelete(fileRecord: FileRecord) {
    setError(null);
    setActionLoadingId(`delete-${fileRecord.id}`);
    try {
      const res = await fetch(`/api/files/${fileRecord.id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? "Delete failed");
      }

      setFiles((prev) => prev.filter((f) => f.id !== fileRecord.id));
      triggerToast("File removed from storage.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 selection:bg-cyan-500 selection:text-black">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
              Cloud Vault
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              File Storage Manager
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs text-slate-400">
            <HardDrive className="w-4 h-4 text-cyan-400" />
            <span>{files.length} Files Preserved</span>
          </div>
        </div>

        {/* NOTIFICATION TOASTS */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-3 backdrop-blur-xl shadow-xl"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-3 backdrop-blur-xl shadow-xl"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DRAG & DROP UPLOAD ZONE */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`relative group cursor-pointer p-8 rounded-3xl border-2 border-dashed transition-all duration-300 text-center space-y-4 backdrop-blur-xl ${
            isDragging
              ? "border-cyan-400 bg-cyan-500/10 scale-[1.01]"
              : "border-white/15 bg-slate-900/40 hover:border-cyan-500/50 hover:bg-slate-900/60"
          }`}
        >
          <input
            ref={inputRef}
            id="file-upload"
            type="file"
            className="hidden"
            disabled={uploading}
            onChange={handleFileInputChange}
          />

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 w-fit mx-auto text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <UploadCloud className="w-8 h-8" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm font-bold text-white">
              {uploading
                ? "Processing and encrypting upload..."
                : "Click to upload or drag & drop"}
            </p>
            <p className="text-xs text-slate-400">
              Supports documents, binaries, images, and archives
            </p>
          </div>
        </div>

        {/* FILES LIST */}
        <div className="space-y-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2">
            Uploaded Assets
          </h2>

          {files.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/30 border border-white/10 text-slate-500 text-xs">
              No files currently indexed in this storage bucket.
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {files.map((file) => {
                  const isDownloading = actionLoadingId === `download-${file.id}`;
                  const isDeleting = actionLoadingId === `delete-${file.id}`;

                  return (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/20 transition-all group"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 shrink-0">
                          {getFileIcon(file.mime_type)}
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <p className="truncate text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {file.filename}
                          </p>
                          <p className="text-[11px] font-mono text-slate-400 flex flex-wrap items-center gap-2">
                            <span>{formatBytes(file.size)}</span>
                            <span>•</span>
                            <span className="truncate max-w-[150px]">
                              {file.mime_type}
                            </span>
                            <span>•</span>
                            <span>
                              {/* {new Date(file.created_at).toLocaleDateString()} */}
                              {new Date(file.created_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        
                        {/* EXECUTE BUTTON - Visible only for .py files inside Electron */}
                        {isElectron && file.filename.toLowerCase().endsWith(".py") && (
                          <button
                            disabled={executingId === file.id || actionLoadingId === `download-${file.id}` || actionLoadingId === `delete-${file.id}`}
                            onClick={() => handleExecute(file)}
                            className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                            title="Run script using local Docker container"
                          >
                            {executingId === file.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-current" />
                            )}
                            <span>{executingId === file.id ? "Running Docker..." : "Execute"}</span>
                          </button>
                        )}

                        {/* Standard Download Button */}
                        <button
                          disabled={executingId === file.id || actionLoadingId === `download-${file.id}` || actionLoadingId === `delete-${file.id}`}
                          onClick={() => handleDownload(file)}
                          className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 text-xs font-bold transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>

                        {/* Standard Delete Button */}
                        <button
                          disabled={executingId === file.id || actionLoadingId === `download-${file.id}` || actionLoadingId === `delete-${file.id}`}
                          onClick={() => handleDelete(file)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-all active:scale-95 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}