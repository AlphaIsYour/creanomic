/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { useRegistrationStore } from "@/lib/store/useRegistrationStore";

interface FileUploadProps {
  onFilesChange: (urls: string[]) => void;
  maxFiles?: number;
  accept?: string;
  label?: string;
  description?: string;
}

export function FileUpload({
  onFilesChange,
  maxFiles = 5,
  accept = "image/*,application/pdf",
  label = "Upload Dokumen",
  description = "Format: JPG, PNG, atau PDF (Max 5MB per file)",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ url: string; name: string; type: string }>
  >([]);
  const [error, setError] = useState<string>("");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (uploadedFiles.length + files.length > maxFiles) {
      setError(`Maksimal ${maxFiles} file`);
      return;
    }

    setError("");
    setUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Upload failed");
        }

        const data = await response.json();
        return {
          url: data.url,
          name: file.name,
          type: file.type,
        };
      });

      const results = await Promise.all(uploadPromises);
      const newFiles = [...uploadedFiles, ...results];
      setUploadedFiles(newFiles);
      onFilesChange(newFiles.map((f) => f.url));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFilesChange(newFiles.map((f) => f.url));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <ImageIcon className="w-5 h-5 text-blue-500" />;
    }
    return <FileText className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <p className="text-xs text-gray-500">{description}</p>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#8C1007] transition-colors">
        <input
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelect}
          disabled={uploading || uploadedFiles.length >= maxFiles}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className={`cursor-pointer ${
            uploading || uploadedFiles.length >= maxFiles
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-sm font-medium text-gray-700">
            {uploading ? "Mengupload..." : "Klik untuk upload atau drag & drop"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {uploadedFiles.length}/{maxFiles} file terupload
          </p>
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-200"
            >
              <div className="flex items-center space-x-3">
                {getFileIcon(file.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {file.type.startsWith("image/") ? "Gambar" : "Dokumen PDF"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-red-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
