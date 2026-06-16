"use client"

import * as React from "react"
import {
  AlertCircleIcon,
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  ExternalLinkIcon,
  FileArchiveIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  GridIcon,
  HeadphonesIcon,
  ImageIcon,
  ListIcon,
  SearchIcon,
  SortAscIcon,
  SortDescIcon,
  Trash2Icon,
  UploadCloudIcon,
  UploadIcon,
  VideoIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type InputHTMLAttributes,
} from "react"

export type FileMetadata = {
  name: string
  size: number
  type: string
  url: string
  id: string
}

export type FileWithPreview = {
  file: File | FileMetadata
  id: string
  preview?: string
}

export type FileUploadOptions = {
  maxFiles?: number // Only used when multiple is true, defaults to Infinity
  maxSize?: number // in bytes
  accept?: string
  multiple?: boolean // Defaults to false
  initialFiles?: FileMetadata[]
  onFilesChange?: (files: FileWithPreview[]) => void // Callback when files change
  onFilesAdded?: (addedFiles: FileWithPreview[]) => void // Callback when new files are added
}

export type FileUploadState = {
  files: FileWithPreview[]
  isDragging: boolean
  errors: string[]
}

export type FileUploadActions = {
  addFiles: (files: FileList | File[]) => void
  removeFile: (id: string) => void
  clearFiles: () => void
  clearErrors: () => void
  handleDragEnter: (e: DragEvent<HTMLElement>) => void
  handleDragLeave: (e: DragEvent<HTMLElement>) => void
  handleDragOver: (e: DragEvent<HTMLElement>) => void
  handleDrop: (e: DragEvent<HTMLElement>) => void
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void
  openFileDialog: () => void
  getInputProps: (
    props?: InputHTMLAttributes<HTMLInputElement>
  ) => InputHTMLAttributes<HTMLInputElement> & {
    ref: React.Ref<HTMLInputElement>
  }
}

export const useFileUpload = (
  options: FileUploadOptions = {}
): [FileUploadState, FileUploadActions] => {
  const {
    maxFiles = Infinity,
    maxSize = Infinity,
    accept = "*",
    multiple = false,
    initialFiles = [],
    onFilesChange,
    onFilesAdded,
  } = options

  const [state, setState] = useState<FileUploadState>({
    files: initialFiles.map((file) => ({
      file,
      id: file.id,
      preview: file.url,
    })),
    isDragging: false,
    errors: [],
  })

  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback(
    (file: File | FileMetadata): string | null => {
      if (file instanceof File) {
        if (file.size > maxSize) {
          return `File "${file.name}" exceeds the maximum size of ${formatBytes(maxSize)}.`
        }
      } else {
        if (file.size > maxSize) {
          return `File "${file.name}" exceeds the maximum size of ${formatBytes(maxSize)}.`
        }
      }

      if (accept !== "*") {
        const acceptedTypes = accept.split(",").map((type) => type.trim())
        const fileType = file instanceof File ? file.type || "" : file.type
        const fileExtension = `.${file instanceof File ? file.name.split(".").pop() : file.name.split(".").pop()}`

        const isAccepted = acceptedTypes.some((type) => {
          if (type.startsWith(".")) {
            return fileExtension.toLowerCase() === type.toLowerCase()
          }
          if (type.endsWith("/*")) {
            const baseType = type.split("/")[0]
            return fileType.startsWith(`${baseType}/`)
          }
          return fileType === type
        })

        if (!isAccepted) {
          return `File "${file instanceof File ? file.name : file.name}" is not an accepted file type.`
        }
      }

      return null
    },
    [accept, maxSize]
  )

  const createPreview = useCallback(
    (file: File | FileMetadata): string | undefined => {
      if (file instanceof File) {
        return URL.createObjectURL(file)
      }
      return file.url
    },
    []
  )

  const generateUniqueId = useCallback((file: File | FileMetadata): string => {
    if (file instanceof File) {
      return `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    }
    return file.id
  }, [])

  const clearFiles = useCallback(() => {
    setState((prev) => {
      // Clean up object URLs
      prev.files.forEach((file) => {
        if (
          file.preview &&
          file.file instanceof File &&
          file.file.type.startsWith("image/")
        ) {
          URL.revokeObjectURL(file.preview)
        }
      })

      if (inputRef.current) {
        inputRef.current.value = ""
      }

      const newState = {
        ...prev,
        files: [],
        errors: [],
      }

      onFilesChange?.(newState.files)
      return newState
    })
  }, [onFilesChange])

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      if (!newFiles || newFiles.length === 0) return

      const newFilesArray = Array.from(newFiles)
      const errors: string[] = []

      // Clear existing errors when new files are uploaded
      setState((prev) => ({ ...prev, errors: [] }))

      // In single file mode, clear existing files first
      if (!multiple) {
        clearFiles()
      }

      // Check if adding these files would exceed maxFiles (only in multiple mode)
      if (
        multiple &&
        maxFiles !== Infinity &&
        state.files.length + newFilesArray.length > maxFiles
      ) {
        errors.push(`You can only upload a maximum of ${maxFiles} files.`)
        setState((prev) => ({ ...prev, errors }))
        return
      }

      const validFiles: FileWithPreview[] = []

      newFilesArray.forEach((file) => {
        // Only check for duplicates if multiple files are allowed
        if (multiple) {
          const isDuplicate = state.files.some(
            (existingFile) =>
              existingFile.file.name === file.name &&
              existingFile.file.size === file.size
          )

          // Skip duplicate files silently
          if (isDuplicate) {
            return
          }
        }

        // Check file size
        if (file.size > maxSize) {
          errors.push(
            multiple
              ? `Some files exceed the maximum size of ${formatBytes(maxSize)}.`
              : `File exceeds the maximum size of ${formatBytes(maxSize)}.`
          )
          return
        }

        const error = validateFile(file)
        if (error) {
          errors.push(error)
        } else {
          validFiles.push({
            file,
            id: generateUniqueId(file),
            preview: createPreview(file),
          })
        }
      })

      // Only update state if we have valid files to add
      if (validFiles.length > 0) {
        // Call the onFilesAdded callback with the newly added valid files
        onFilesAdded?.(validFiles)

        setState((prev) => {
          const newFiles = !multiple
            ? validFiles
            : [...prev.files, ...validFiles]
          onFilesChange?.(newFiles)
          return {
            ...prev,
            files: newFiles,
            errors,
          }
        })
      } else if (errors.length > 0) {
        setState((prev) => ({
          ...prev,
          errors,
        }))
      }

      // Reset input value after handling files
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    },
    [
      state.files,
      maxFiles,
      multiple,
      maxSize,
      validateFile,
      createPreview,
      generateUniqueId,
      clearFiles,
      onFilesChange,
      onFilesAdded,
    ]
  )

  const removeFile = useCallback(
    (id: string) => {
      setState((prev) => {
        const fileToRemove = prev.files.find((file) => file.id === id)
        if (
          fileToRemove &&
          fileToRemove.preview &&
          fileToRemove.file instanceof File &&
          fileToRemove.file.type.startsWith("image/")
        ) {
          URL.revokeObjectURL(fileToRemove.preview)
        }

        const newFiles = prev.files.filter((file) => file.id !== id)
        onFilesChange?.(newFiles)

        return {
          ...prev,
          files: newFiles,
          errors: [],
        }
      })
    },
    [onFilesChange]
  )

  const clearErrors = useCallback(() => {
    setState((prev) => ({
      ...prev,
      errors: [],
    }))
  }, [])

  const handleDragEnter = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setState((prev) => ({ ...prev, isDragging: true }))
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return
    }

    setState((prev) => ({ ...prev, isDragging: false }))
  }, [])

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent<HTMLElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setState((prev) => ({ ...prev, isDragging: false }))

      // Don't process files if the input is disabled
      if (inputRef.current?.disabled) {
        return
      }

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        // In single file mode, only use the first file
        if (!multiple) {
          const file = e.dataTransfer.files[0]
          addFiles([file])
        } else {
          addFiles(e.dataTransfer.files)
        }
      }
    },
    [addFiles, multiple]
  )

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        addFiles(e.target.files)
      }
    },
    [addFiles]
  )

  const openFileDialog = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }, [])

  const getInputProps = useCallback(
    (props: InputHTMLAttributes<HTMLInputElement> = {}) => {
      return {
        ...props,
        type: "file" as const,
        onChange: handleFileChange,
        accept: props.accept || accept,
        multiple: props.multiple !== undefined ? props.multiple : multiple,
        ref: inputRef,
      }
    },
    [accept, multiple, handleFileChange]
  )

  return [
    state,
    {
      addFiles,
      removeFile,
      clearFiles,
      clearErrors,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      handleFileChange,
      openFileDialog,
      getInputProps,
    },
  ]
}

// Helper function to format bytes to human-readable format
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i]
}

// ---------- Demo initial files ----------
const defaultInitialFiles = [
  {
    name: "brochure.pdf",
    size: 528737,
    type: "application/pdf",
    url: "https://originui.com",
    id: "brochure.pdf-1744638436563-8u5xuls",
  },
  {
    name: "cover.png",
    size: 182873,
    type: "image/png",
    url: "https://originui.com",
    id: "cover.png-1744638436563-8u5xuls",
  },
  {
    name: "report.xlsx",
    size: 352873,
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    url: "https://originui.com",
    id: "report.xlsx-1744638436563-8u5xuls",
  },
]

// ---------- Types ----------
type UploadEntry = {
  id: string
  file: File | { name: string; type: string; size: number }
  preview?: string // object URL or remote URL injected by hook
}

// ---------- Utilities ----------
const isRealFile = (f: unknown): f is File =>
  typeof window !== "undefined" && typeof File !== "undefined" && f instanceof File

const getName = (e: UploadEntry) => (isRealFile(e.file) ? e.file.name : e.file.name)
const getType = (e: UploadEntry) => (isRealFile(e.file) ? e.file.type : e.file.type || "")
const getSize = (e: UploadEntry) => (isRealFile(e.file) ? e.file.size : e.file.size ?? 0)

const getExt = (name: string) => {
  const dot = name.lastIndexOf(".")
  return dot > -1 ? name.slice(dot + 1).toLowerCase() : ""
}

const getPreviewUrl = (e: UploadEntry) => {
  return e.preview || (e as any).url || ""
}

const niceSubtype = (mime: string) => {
  if (!mime) return "UNKNOWN"
  const parts = mime.split("/")
  return (parts[1] || parts[0] || "unknown").toUpperCase()
}

const getFileIcon = (entry: UploadEntry) => {
  const name = getName(entry)
  const type = getType(entry)
  const ext = getExt(name)

  if (
    type.includes("pdf") ||
    ext === "pdf" ||
    type.includes("word") ||
    ext === "doc" ||
    ext === "docx" ||
    type.includes("text") ||
    ext === "txt" ||
    ext === "md"
  ) {
    return <FileTextIcon className="size-4 opacity-60 text-blue-400" aria-hidden="true" />
  }
  if (
    type.includes("zip") ||
    type.includes("archive") ||
    ext === "zip" ||
    ext === "rar" ||
    ext === "7z" ||
    ext === "tar"
  ) {
    return <FileArchiveIcon className="size-4 opacity-60 text-yellow-500" aria-hidden="true" />
  }
  if (
    type.includes("excel") ||
    ext === "xls" ||
    ext === "xlsx" ||
    ext === "csv"
  ) {
    return <FileSpreadsheetIcon className="size-4 opacity-60 text-emerald-400" aria-hidden="true" />
  }
  if (type.startsWith("video/") || ["mp4", "mov", "webm", "mkv"].includes(ext)) {
    return <VideoIcon className="size-4 opacity-60 text-rose-400" aria-hidden="true" />
  }
  if (type.startsWith("audio/") || ["mp3", "wav", "flac", "m4a"].includes(ext)) {
    return <HeadphonesIcon className="size-4 opacity-60 text-indigo-400" aria-hidden="true" />
  }
  if (type.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) {
    return <ImageIcon className="size-4 opacity-60 text-purple-400" aria-hidden="true" />
  }
  return <FileIcon className="size-4 opacity-60 text-neutral-400" aria-hidden="true" />
}

export interface FileUploadProps {
  onFileSelect?: (file: File) => void
  onFilesChange?: (files: FileWithPreview[]) => void
  onFilesAdded?: (addedFiles: FileWithPreview[]) => void
  accept?: string
}

// ---------- Component ----------
export default function FileUpload({ onFileSelect, onFilesChange, onFilesAdded, accept = "*" }: FileUploadProps) {
  // Tunables
  const maxSize = 20 * 1024 * 1024 // 20MB
  const maxFiles = 20
  const [view, setView] = React.useState<"list" | "grid">("list")
  const [query, setQuery] = React.useState("")
  const [sortBy, setSortBy] = React.useState<"name" | "type" | "size">("name")
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc")
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const [copied, setCopied] = React.useState<string | null>(null)

  const handleAddedCallback = useCallback((added: FileWithPreview[]) => {
    // Notify the user callback of the real added Javascript Files
    added.forEach(item => {
      if (item.file instanceof File && onFileSelect) {
        onFileSelect(item.file);
      }
    });
    if (onFilesAdded) {
      onFilesAdded(added);
    }
  }, [onFileSelect, onFilesAdded]);

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: true,
    maxFiles,
    maxSize,
    accept,
    initialFiles: [], // Start clean for Auto-ML ingestion
    onFilesChange,
    onFilesAdded: handleAddedCallback,
  })

  React.useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(null), 1200)
    return () => clearTimeout(t)
  }, [copied])

  const totalSize = React.useMemo(
    () => files.reduce((acc, f) => acc + getSize(f as UploadEntry), 0),
    [files]
  )

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = q
      ? files.filter((f: UploadEntry) => {
          const name = getName(f).toLowerCase()
          const type = getType(f).toLowerCase()
          const ext = getExt(name)
          return name.includes(q) || type.includes(q) || ext.includes(q)
        })
      : files

    const sorter = (a: UploadEntry, b: UploadEntry) => {
      let cmp = 0
      if (sortBy === "name") {
        cmp = getName(a).localeCompare(getName(b))
      } else if (sortBy === "type") {
        cmp = getType(a).localeCompare(getType(b))
      } else {
        cmp = getSize(a) - getSize(b)
      }
      return sortDir === "asc" ? cmp : -cmp
    }

    return [...base].sort(sorter)
  }, [files, query, sortBy, sortDir])

  const allSelected = selected.size > 0 && filtered.length > 0 && filtered.every((f) => selected.has(f.id))
  const noneSelected = selected.size === 0

  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const toggleAll = () =>
    setSelected((prev) => {
      if (filtered.length === 0) return prev
      const everySelected = filtered.every((f) => prev.has(f.id))
      if (everySelected) return new Set()
      return new Set(filtered.map((f) => f.id))
    })

  const removeSelected = () => {
    filtered.forEach((f) => {
      if (selected.has(f.id)) removeFile(f.id)
    })
    setSelected(new Set())
  }

  const downloadOne = (entry: UploadEntry) => {
    const url = getPreviewUrl(entry)
    if (!url) return
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const downloadSelected = () => {
    filtered.forEach((f) => {
      if (selected.has(f.id)) downloadOne(f as UploadEntry)
    })
  }

  const copyLink = async (entry: UploadEntry) => {
    const url = getPreviewUrl(entry)
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      setCopied(entry.id)
    } catch {
      // noop
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-full mx-auto font-sans">
      
      {/* -- Drop area (always shown) -- */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        className="border-neutral-800 data-[dragging=true]:bg-indigo-500/10 data-[dragging=true]:border-indigo-500 has-[input:focus]:border-indigo-500 rounded-3xl border border-dashed p-8 bg-zinc-950/60 backdrop-blur-md transition-all duration-300 shadow-xl relative overflow-hidden"
        aria-label="Drop files here or use the select button to upload"
      >
        <input
          {...getInputProps({
            "aria-label": "Upload files",
          })}
          className="sr-only"
        />
        <div className="flex flex-col items-center justify-center text-center gap-4 py-4">
          <div className="bg-zinc-900 flex size-14 shrink-0 items-center justify-center rounded-3xl border border-white/5 shadow-inner group">
            <UploadIcon className="size-6 text-slate-400 group-hover:text-white transition-colors animate-pulse" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-white text-base">Drop your CSV, Excel, or ZIP files here</p>
            <p className="text-slate-400 text-xs">
              Fully supports automated imputer parsing · Max {formatBytes(maxSize)} per dataset
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium cursor-pointer transition-all duration-300" 
            onClick={openFileDialog}
          >
            <UploadCloudIcon className="-ms-1 mr-2 size-4 text-indigo-400" aria-hidden="true" />
            Ingest worksheets
          </Button>
        </div>
      </div>

      {/* -- Top toolbar (Show if we have uploaded items) -- */}
      {files.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-950/40 border border-white/5 rounded-2xl p-3.5 mt-2">
          <div className="flex items-center gap-3">
            <h3 className="text-xs font-semibold text-slate-200">
              Active Session Inbound files <span className="text-indigo-400">({files.length})</span>
            </h3>
            <span className="text-slate-500 text-xs font-mono">• {formatBytes(totalSize)}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ingest queue..."
                className="bg-black/40 ring-offset-background border-white/10 placeholder:text-slate-500 h-8 w-44 rounded-xl border pl-8 pr-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                aria-label="Search files"
              />
              <SearchIcon
                className="text-slate-400 pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 opacity-70"
                aria-hidden="true"
              />
            </div>

            <Button
              variant="outline"
              size="icon"
              className="size-8 rounded-xl border-white/10 bg-white/5 hover:bg-white/10"
              onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
              aria-label={`Toggle sort direction to ${sortDir === "asc" ? "descending" : "ascending"}`}
            >
              {sortDir === "asc" ? (
                <SortAscIcon className="size-3.5 text-slate-350" />
              ) : (
                <SortDescIcon className="size-3.5 text-slate-350" />
              )}
            </Button>

            <div className="flex items-center gap-1">
              <Button
                variant={view === "list" ? "default" : "outline"}
                size="icon"
                className="size-8 rounded-xl border-white/10 bg-white/5"
                onClick={() => setView("list")}
                aria-pressed={view === "list"}
                title="List view"
              >
                <ListIcon className="size-3.5" />
              </Button>
              <Button
                variant={view === "grid" ? "default" : "outline"}
                size="icon"
                className="size-8 rounded-xl border-white/10 bg-white/5"
                onClick={() => setView("grid")}
                aria-pressed={view === "grid"}
                title="Grid view"
              >
                <GridIcon className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* -- When we have files -- */}
      {filtered.length > 0 ? (
        <div className="transition-all duration-300">
          {/* Bulk actions bar */}
          <div className="flex items-center justify-between gap-2 my-2 px-1">
            <div className="flex items-center gap-2 text-xs">
              <label className="inline-flex cursor-pointer items-center gap-1.5 text-slate-400 select-none">
                <input
                  type="checkbox"
                  className="accent-indigo-500 rounded border-white/10 focus:ring-opacity-40"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label={allSelected ? "Unselect all" : "Select all"}
                />
                <span className="hover:text-white transition-colors">
                  {selected.size} of {filtered.length} loaded files selected
                </span>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl h-7 text-xs border-white/5 hover:bg-white/5 text-slate-300"
                onClick={removeSelected}
                disabled={noneSelected}
              >
                <Trash2Icon className="-ms-0.5 mr-1.5 size-3.5 text-rose-450 opacity-80" aria-hidden="true" />
                Deregister Selected
              </Button>
            </div>
          </div>

          {view === "list" ? (
            <div className="bg-zinc-950/45 overflow-hidden rounded-2xl border border-white/15 shadow-2xl">
              <Table>
                <TableHeader className="text-xs">
                  <TableRow className="bg-white/5 border-b border-white/10 hover:bg-white/5">
                    <TableHead className="h-9 w-10 py-2">
                      <span className="sr-only">Select</span>
                    </TableHead>
                    <TableHead className="h-9 py-2 text-white font-bold font-mono">Worksheet Pipeline</TableHead>
                    <TableHead className="h-9 py-2 text-white font-bold font-mono">Subtype</TableHead>
                    <TableHead className="h-9 py-2 text-white font-bold font-mono">Bytes Size</TableHead>
                    <TableHead className="h-9 w-40 py-2 text-right text-white font-bold font-mono">Operations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-[13px]">
                  {filtered.map((entry: UploadEntry) => {
                    const name = getName(entry)
                    const type = getType(entry)
                    const size = getSize(entry)
                    const url = getPreviewUrl(entry)
                    const isSelected = selected.has(entry.id)
                    const percentOfMax = Math.min(100, Math.round((size / maxSize) * 100))

                    return (
                      <TableRow key={entry.id} className="border-b border-white/5 hover:bg-white/[0.02]" data-selected={isSelected || undefined}>
                        <TableCell className="py-2.5">
                          <input
                            type="checkbox"
                            className="accent-indigo-500 rounded"
                            checked={isSelected}
                            onChange={() => toggleOne(entry.id)}
                            aria-label={`Select ${name}`}
                          />
                        </TableCell>
                        <TableCell className="max-w-64 py-2.5 font-medium">
                          <span className="flex items-center gap-2">
                            <span className="shrink-0">{getFileIcon(entry)}</span>
                            <span className="truncate text-white text-xs">{name}</span>
                          </span>
                          {/* Size bar */}
                          <div className="mt-1 h-1 w-44 overflow-hidden rounded bg-white/5 border border-white/5">
                            <div
                              className="h-full bg-indigo-500"
                              style={{ width: `${percentOfMax}%` }}
                              aria-hidden="true"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-400 py-2.5 font-mono text-[11px]">
                          {niceSubtype(type)}
                        </TableCell>
                        <TableCell className="text-slate-400 py-2.5 font-mono text-[11px]">
                          {formatBytes(size)}
                        </TableCell>
                        <TableCell className="py-2.5 text-right whitespace-nowrap">
                          {url && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-slate-400 hover:text-white size-8 hover:bg-white/5 cursor-pointer"
                              aria-label={`Open ${name}`}
                              onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
                              title="Open live preview"
                            >
                              <ExternalLinkIcon className="size-3.5" />
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-slate-400 hover:text-white size-8 hover:bg-white/5 cursor-pointer"
                            aria-label={`Download ${name}`}
                            onClick={() => downloadOne(entry)}
                            title="Download"
                          >
                            <DownloadIcon className="size-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-slate-450 hover:text-rose-400 size-8 hover:bg-rose-500/10 cursor-pointer"
                            aria-label={`Remove ${name}`}
                            onClick={() => removeFile(entry.id)}
                            title="Remove file"
                          >
                            <Trash2Icon className="size-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            // Grid view
            <div
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 mt-2"
              role="list"
              aria-label="Files grid"
            >
              {filtered.map((entry: UploadEntry) => {
                const name = getName(entry)
                const type = getType(entry)
                const size = getSize(entry)
                const url = getPreviewUrl(entry)
                const isImage = type.startsWith("image/")
                const isSelected = selected.has(entry.id)

                return (
                  <div
                    key={entry.id}
                    role="listitem"
                    className="border-neutral-800 bg-zinc-950/50 hover:border-zinc-750 transition-all duration-350 group relative flex flex-col overflow-hidden rounded-2xl border"
                    data-selected={isSelected || undefined}
                  >
                    {/* Selection checkbox */}
                    <label className="bg-black/60 backdrop-blur-md absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-lg p-1.5 border border-white/5">
                      <input
                        type="checkbox"
                        className="accent-indigo-500 size-3.5 rounded"
                        checked={isSelected}
                        onChange={() => toggleOne(entry.id)}
                        aria-label={`Select ${name}`}
                      />
                    </label>

                    {/* Preview */}
                    <div className="relative h-20 w-full overflow-hidden bg-white/5 border-b border-white/5 flex items-center justify-center">
                      {isImage && url ? (
                        <img
                          src={url}
                          alt={name}
                          className="h-full w-full object-cover"
                          draggable={false}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          {getFileIcon(entry)}
                        </div>
                      )}
                    </div>

                    {/* Meta + actions */}
                    <div className="flex flex-1 flex-col gap-1.5 p-3">
                      <div className="truncate text-xs font-bold text-white" title={name}>
                        {name}
                      </div>
                      <div className="text-slate-400 text-[10px] font-mono uppercase tracking-wider">
                        {niceSubtype(type)} · {formatBytes(size)}
                      </div>
                      <div className="mt-auto flex items-center justify-end gap-0.5 pt-2 border-t border-white/5">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7 text-slate-400 hover:text-white"
                          onClick={() => downloadOne(entry)}
                          title="Download"
                        >
                          <DownloadIcon className="size-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-slate-400 hover:text-rose-450 size-7"
                          onClick={() => removeFile(entry.id)}
                          title="Remove"
                        >
                          <Trash2Icon className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ) : null}

      {/* -- Errors -- */}
      {errors.length > 0 && (
        <div
          className="text-rose-400 flex items-center gap-1.5 text-xs bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl mt-2 font-mono"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircleIcon className="size-3.5 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  )
}
