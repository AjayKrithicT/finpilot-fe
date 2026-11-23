/**
 * AdminImportPage.tsx
 * Role-restricted CSV ingestion console at /admin/imports.
 * Handles 200 → ImportResultPanel, 409/400 → ErrorBanner.
 */

import { useState } from 'react';
import { UI_COPY } from '../constants/ui.constants';
import { uploadTransactionsCsv } from '../services/import.api';
import { ApiClientError } from '../services/apiClient';
import { CsvDropzone } from '../components/admin/CsvDropzone';
import { ImportResultPanel } from '../components/admin/ImportResultPanel';
import { ErrorBanner } from '../components/reusables/ErrorBanner';
import { Button } from '../components/reusables/Button';
import type { ImportBatchResponse } from '../types/import.types';

export function AdminImportPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<ImportBatchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setResult(null);
    setError(null);

    try {
      const response = await uploadTransactionsCsv(selectedFile);
      setResult(response);
      setSelectedFile(null);
    } catch (err) {
      if (err instanceof ApiClientError) {
        if (err.code === 'DUPLICATE_FILE_UPLOAD') {
          setError(UI_COPY.ERRORS.DUPLICATE_FILE);
        } else if (err.code === 'INVALID_CSV_FORMAT') {
          setError(UI_COPY.ERRORS.INVALID_CSV);
        } else {
          setError(err.message);
        }
      } else {
        setError(UI_COPY.ERRORS.GENERIC);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight">
          {UI_COPY.ADMIN_IMPORT.PAGE_TITLE}
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          {UI_COPY.ADMIN_IMPORT.PAGE_SUBTITLE}
        </p>
      </div>

      {/* Dropzone */}
      <CsvDropzone
        onFileSelected={handleFileSelected}
        isUploading={isUploading}
        selectedFile={selectedFile}
      />

      {/* Upload button */}
      {selectedFile && (
        <Button
          variant="primary"
          onClick={() => void handleUpload()}
          isLoading={isUploading}
          disabled={isUploading}
          aria-label={UI_COPY.ADMIN_IMPORT.UPLOAD_BTN}
        >
          {isUploading ? UI_COPY.ADMIN_IMPORT.UPLOADING : UI_COPY.ADMIN_IMPORT.UPLOAD_BTN}
        </Button>
      )}

      {/* Error banner (409 / 400) */}
      {error && (
        <ErrorBanner
          message={error}
          onRetry={() => { setError(null); }}
        />
      )}

      {/* Success result panel */}
      {result && <ImportResultPanel result={result} />}
    </div>
  );
}
