/**
 * CsvDropzone.tsx
 * Drag-and-drop / file picker for .csv files up to 5 MB.
 * Validates type and size via validateCsvFile before calling onFileSelected.
 * Displays the required column list from CSV_UPLOAD_RULES.
 */

import { useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import { UploadCloudIcon } from 'lucide-react';
import { UI_COPY } from '../../constants/ui.constants';
import { CSV_UPLOAD_RULES } from '../../constants/theme.constants';
import { validateCsvFile } from '../../utils/validators';

interface CsvDropzoneProps {
  onFileSelected: (file: File) => void;
  isUploading: boolean;
  selectedFile: File | null;
}

export function CsvDropzone({ onFileSelected, isUploading, selectedFile }: CsvDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const processFile = (file: File) => {
    const err = validateCsvFile(file);
    if (err) {
      setValidationError(err.message);
      return;
    }
    setValidationError(null);
    onFileSelected(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset input so the same file can be re-selected after a reset
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label={UI_COPY.ARIA.DROPZONE}
        onClick={() => !isUploading && inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2
          border-dashed px-6 py-10 text-center cursor-pointer transition-colors
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]
          focus-visible:ring-offset-2
          ${isUploading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
          ${dragOver
            ? 'border-[#2563EB] bg-[#EFF6FF]'
            : 'border-[#CBD5E1] bg-white hover:border-[#2563EB] hover:bg-[#F8FAFC]'
          }`}
      >
        <UploadCloudIcon
          className={`w-10 h-10 ${dragOver ? 'text-[#2563EB]' : 'text-[#94A3B8]'}`}
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-medium text-[#0F172A]">
            {UI_COPY.ADMIN_IMPORT.DROPZONE_LABEL}
          </p>
          <p className="text-xs text-[#64748B] mt-1">
            {UI_COPY.ADMIN_IMPORT.DROPZONE_HINT}
          </p>
        </div>
        {selectedFile && (
          <p className="text-xs font-medium text-[#2563EB] bg-[#EFF6FF]
            border border-[#BFDBFE] rounded-full px-3 py-1 max-w-xs truncate">
            {selectedFile.name}
          </p>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={CSV_UPLOAD_RULES.ACCEPTED_EXTENSION}
        onChange={handleChange}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Validation error */}
      {validationError && (
        <p role="alert" className="text-xs text-[#B91C1C] bg-[#FEF2F2]
          border border-[#FECACA] rounded-lg px-3 py-2">
          {validationError}
        </p>
      )}

      {/* Required columns list */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#64748B] mb-2">
          {UI_COPY.ADMIN_IMPORT.REQUIRED_COLUMNS_TITLE}
        </p>
        <div className="flex flex-wrap gap-2">
          {CSV_UPLOAD_RULES.REQUIRED_COLUMNS.map((col) => (
            <span
              key={col}
              className="font-mono text-[12px] text-[#475569] bg-white border
                border-[#E2E8F0] rounded px-2 py-0.5"
            >
              {col}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
