import { useRef, useState } from "react";
import { toast } from "sonner";
import { FileJson } from "lucide-react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@courier/ui-kit";

import { UploadIcon, XIcon } from "@/components/common/icons";

type ImportCollectionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport?: (file: File) => void | Promise<void>;
};

export function ImportCollectionModal({
  open,
  onOpenChange,
  onImport,
}: ImportCollectionModalProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const resetState = () => {
    setDragActive(false);
    setSelectedFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (isImporting) return;

    resetState();
    onOpenChange(false);
  };

  const validateFile = async (file: File) => {
    const isJson =
      file.type === "application/json" ||
      file.name.toLowerCase().endsWith(".json");

    if (!isJson) {
      toast.error("Only JSON files are supported.");
      return false;
    }

    try {
      const text = await file.text();
      JSON.parse(text);
      return true;
    } catch {
      toast.error("Invalid JSON file format.");
      return false;
    }
  };

  const handleFileSelect = async (file?: File | null) => {
    if (!file) return;

    const isValid = await validateFile(file);

    if (!isValid) {
      setSelectedFile(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    setSelectedFile(file);
  };

  const handleBrowseFile = () => {
    inputRef.current?.click();
  };

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    await handleFileSelect(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];
    await handleFileSelect(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("Please select a JSON file first.");
      return;
    }

    try {
      setIsImporting(true);

      await onImport?.(selectedFile);

      resetState();
      onOpenChange(false);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose();
          return;
        }

        onOpenChange(true);
      }}
    >
      <DialogContent
        className="
          !w-[calc(100vw-32px)] !max-w-[520px]
          gap-0 rounded-[16px]
          border border-[#E5E5E5]
          bg-white p-0 shadow-lg

          [&_[data-slot=dialog-close]]:text-[#525252]
          [&_[data-slot=dialog-close]]:hover:bg-neutral-100
          [&_[data-slot=dialog-close]]:hover:text-[#171717]
        "
      >
        <DialogHeader className="border-b border-[#E5E5E5] p-6">
          <DialogTitle className="text-xl font-semibold text-[#171717]">
            Import Collection
          </DialogTitle>
        </DialogHeader>

        <FieldGroup className="gap-5 p-6">
          <Field className="gap-2">
            <FieldDescription className="text-sm leading-6 text-[#525252]">
              Import a collection from a JSON file exported from Postman,
              Insomnia, or another API client.
            </FieldDescription>
          </Field>

          <Field className="gap-2">
            <FieldLabel className="text-[#404040]">Collection File</FieldLabel>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleBrowseFile}
              className={`
                flex min-h-[224px] cursor-pointer flex-col items-center
                justify-center rounded-[16px] border border-dashed
                px-6 py-8 text-center transition

                ${
                  dragActive
                    ? "border-[#FE9A00] bg-[#FFF7ED]"
                    : "border-[#D6D3CF] bg-[#FAFAFA]"
                }

                hover:border-[#FE9A00]
                hover:bg-[#FFF7ED]/60
              `}
            >
              {!selectedFile ? (
                <>
                  <UploadIcon width={44} height={44} iconColor="#A3A3A3" />

                  <p className="text-base font-medium text-[#171717]">
                    Drop your JSON file here
                  </p>

                  <p className="mt-2 text-sm text-[#737373]">or</p>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleBrowseFile();
                    }}
                    className="
                      mt-4 h-10 rounded-[12px]
                      border border-[#D6D3CF]
                      bg-white px-4 shadow-none
                      text-[#404040]

                      hover:bg-[#F5F5F5]
                      hover:text-[#171717]
                    "
                  >
                    Browse files
                  </Button>
                </>
              ) : (
                <div
                  className="w-full"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="mx-auto flex max-w-[360px] items-center gap-3 rounded-[12px] border border-[#E5E5E5] bg-white p-3 text-left shadow-sm">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#FFF7ED] text-[#FE9A00]">
                      <FileJson size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#171717]">
                        {selectedFile.name}
                      </p>

                      <p className="text-xs text-[#737373]">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>

                    <Button
                      type="button"
                      onClick={handleRemoveFile}
                      className="
                        p-1 h-8 w-8 rounded-full
                       text-[#A3A3A3]
                        bg-transparent
                        hover:bg-[#F5F5F5]
                        hover:text-[#171717]
                      "
                      aria-label="Remove selected file"
                    >
                      <XIcon width={16} height={16} iconColor="currentColor" />
                    </Button>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBrowseFile}
                    className="
                      mt-4 h-10 rounded-[12px]
                      border border-[#D6D3CF]
                      bg-white px-4 shadow-none
                      text-[#404040]

                      hover:bg-[#F5F5F5]
                      hover:text-[#171717]
                    "
                  >
                    Choose another file
                  </Button>
                </div>
              )}

              <input
                ref={inputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleInputChange}
              />
            </div>
          </Field>
        </FieldGroup>

        <div className="flex justify-end gap-3 border-t border-[#E5E5E5] px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isImporting}
            className="h-10 rounded-[12px]"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleImport}
            disabled={!selectedFile || isImporting}
            className="
              h-10 rounded-[12px]
              bg-[#FE9A00] text-[#171717]
              hover:bg-amber-400
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {isImporting ? "Importing..." : "Import"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
