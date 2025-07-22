import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { formatSize } from '../lib/utils';

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null;
      onFileSelect?.(file);
    },
    [onFileSelect]
  );

  const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: { 'application/pdf': ['.pdf'] },
      maxSize: maxFileSize,
    });

  const file = acceptedFiles[0] || null;

  return (
    <div className="w-full border border-[#303030] rounded-md p-4 bg-[#0f0f0f] text-white transition hover:bg-[#1a1a1a]">
      <div {...getRootProps()} className="cursor-pointer">
        <input {...getInputProps()} />
        <div className="space-y-4">
          {file ? (
            <div
              className="flex items-center justify-between gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <img src="/images/pdf.png" alt="pdf" className="w-8 h-8" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white truncate max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-xs text-[#bbb]">{formatSize(file.size)}</p>
                </div>
              </div>
              <button
                className="p-1 hover:bg-[#222] rounded"
                onClick={() => onFileSelect?.(null)}
              >
                <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                <img src="/icons/info.svg" alt="upload" className="w-12 h-12 opacity-70" />
              </div>
              <p className="text-base text-[#ccc]">
                <span className="font-semibold text-white">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-[#888]">PDF (max {formatSize(maxFileSize)})</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
