"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface FileStatus {
  file: File
  status: "pending" | "processing" | "success" | "failed"
  result?: {
    success: boolean
    conversionId?: string
    error?: string
    vendor?: string
    invoiceNumber?: string
    total?: number
    currency?: string
  }
}

export default function BulkConvertPage() {
  const router = useRouter()
  const [fileStatuses, setFileStatuses] = useState<FileStatus[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = async (fileStatus: FileStatus, index: number) => {
    // Update status to processing
    setFileStatuses((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], status: "processing" }
      return updated
    })

    try {
      const formData = new FormData()
      formData.append("file", fileStatus.file)

      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Conversion failed")
      }

      // Fetch conversion details to get vendor, invoice number, etc.
      const conversionResponse = await fetch(`/api/conversion/${data.conversionId}`)
      const conversionData = await conversionResponse.json()

      // Update status to success
      setFileStatuses((prev) => {
        const updated = [...prev]
        updated[index] = {
          ...updated[index],
          status: "success",
          result: {
            success: true,
            conversionId: data.conversionId,
            vendor: conversionData.data?.vendor || "Unknown",
            invoiceNumber: conversionData.data?.invoiceNumber || "—",
            total: conversionData.data?.total || 0,
            currency: conversionData.data?.currency || "GBP",
          },
        }
        return updated
      })

      // Refresh dashboard to update credits
      router.refresh()
    } catch (err) {
      // Update status to failed
      setFileStatuses((prev) => {
        const updated = [...prev]
        updated[index] = {
          ...updated[index],
          status: "failed",
          result: {
            success: false,
            error: err instanceof Error ? err.message : "Conversion failed",
          },
        }
        return updated
      })
    }
  }

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return

    const pdfFiles = Array.from(fileList).filter(
      (file) => file.type === "application/pdf" || file.name.endsWith(".pdf")
    )

    if (pdfFiles.length === 0) {
      setError("Please select PDF files only")
      return
    }

    // Check file sizes
    const oversizedFiles = pdfFiles.filter((file) => file.size > 10 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      setError(
        `Some files are too large (max 10MB): ${oversizedFiles.map((f) => f.name).join(", ")}`
      )
      return
    }

    setError(null)

    // Add new files to the list
    const newFileStatuses: FileStatus[] = pdfFiles.map((file) => ({
      file,
      status: "pending" as const,
    }))

    const startIndex = fileStatuses.length
    setFileStatuses((prev) => [...prev, ...newFileStatuses])

    // Start processing all new files concurrently
    newFileStatuses.forEach((fileStatus, i) => {
      const index = startIndex + i
      // Small delay to ensure state is updated
      setTimeout(() => processFile(fileStatus, index), 10)
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
    // Reset input so same file can be selected again
    if (e.target) {
      e.target.value = ""
    }
  }

  const removeFile = (index: number) => {
    setFileStatuses((prev) => prev.filter((_, i) => i !== index))
  }

  const hasResults = fileStatuses.length > 0
  const allComplete = fileStatuses.every(
    (fs) => fs.status === "success" || fs.status === "failed"
  )
  const processingCount = fileStatuses.filter((fs) => fs.status === "processing").length
  const successCount = fileStatuses.filter((fs) => fs.status === "success").length
  const failedCount = fileStatuses.filter((fs) => fs.status === "failed").length

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-primary-600 hover:text-primary-700 font-medium mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Bulk Convert</span> Invoices
          </h1>
          <p className="text-gray-600">
            Upload multiple PDF invoices and convert them all at once
          </p>
        </div>

        {/* Drag and Drop Upload Area */}
        {!hasResults && (
          <div className="w-full max-w-4xl mx-auto mb-8">
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 transition-all ${
                isDragging
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-300 bg-white"
              }`}
            >
              <div className="text-center">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-16 w-16 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-primary mb-2"
                  disabled={processingCount > 0}
                >
                  Choose PDF Files
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                  disabled={processingCount > 0}
                />

                <p className="text-sm text-gray-500 mt-2">
                  or drag and drop your PDF files here
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Maximum file size: 10MB per file • Each conversion uses 1 credit
                </p>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results Table - Show immediately when files are added */}
        {hasResults && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Conversion Results</h2>
                <div className="text-sm text-gray-600">
                  {processingCount > 0 && (
                    <span className="text-primary-600">
                      Processing {processingCount}...
                    </span>
                  )}{" "}
                  {successCount > 0 && (
                    <span className="text-green-600">
                      {successCount} successful
                    </span>
                  )}
                  {failedCount > 0 && (
                    <span className="text-red-600">
                      {failedCount > 0 && successCount > 0 ? ", " : ""}
                      {failedCount} failed
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fileStatuses.map((fileStatus, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {fileStatus.status === "processing" && (
                          <div className="flex items-center">
                            <div className="relative w-6 h-6">
                              <div className="absolute inset-0 border-2 border-primary-200 rounded-full"></div>
                              <div className="absolute inset-0 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <span className="ml-2 text-xs text-gray-600">Processing...</span>
                          </div>
                        )}
                        {fileStatus.status === "success" && (
                          <div className="flex items-center">
                            <svg
                              className="w-6 h-6 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="ml-2 text-xs text-green-600 font-medium">
                              Success
                            </span>
                          </div>
                        )}
                        {fileStatus.status === "failed" && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Failed
                          </span>
                        )}
                        {fileStatus.status === "pending" && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {fileStatus.file.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {fileStatus.result?.vendor || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {fileStatus.result?.invoiceNumber || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {fileStatus.result?.currency && fileStatus.result?.total
                          ? `${fileStatus.result.currency} ${fileStatus.result.total.toFixed(2)}`
                          : "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {fileStatus.status === "success" && fileStatus.result?.conversionId ? (
                          <div className="flex gap-2">
                            <a
                              href={`/api/download/${fileStatus.result.conversionId}/invoice-details`}
                              className="text-primary-600 hover:text-primary-700 font-medium"
                              download
                            >
                              CSV
                            </a>
                            <span className="text-gray-300">|</span>
                            <a
                              href={`/api/download/${fileStatus.result.conversionId}/line-items`}
                              className="text-primary-600 hover:text-primary-700 font-medium"
                              download
                            >
                              Line Items
                            </a>
                            <span className="text-gray-300">|</span>
                            <a
                              href={`/api/download/${fileStatus.result.conversionId}/excel`}
                              className="text-primary-600 hover:text-primary-700 font-medium"
                              download
                            >
                              Excel
                            </a>
                            <span className="text-gray-300">|</span>
                            <Link
                              href={`/convert/${fileStatus.result.conversionId}`}
                              className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                              View
                            </Link>
                          </div>
                        ) : fileStatus.status === "failed" ? (
                          <span className="text-gray-400 text-xs">
                            {fileStatus.result?.error || "N/A"}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <Link href="/dashboard" className="btn-primary">
                  Back to Dashboard
                </Link>
                <div className="flex gap-3">
                  {allComplete && (
                    <button
                      onClick={() => {
                        setFileStatuses([])
                        setError(null)
                      }}
                      className="btn-secondary"
                    >
                      Convert More Files
                    </button>
                  )}
                  {!allComplete && (
                    <div className="text-sm text-gray-600 flex items-center">
                      <div className="relative w-4 h-4 mr-2">
                        <div className="absolute inset-0 border-2 border-primary-200 rounded-full"></div>
                        <div className="absolute inset-0 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      Processing {processingCount} file{processingCount !== 1 ? "s" : ""}...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add More Files Button - Show when results table is visible */}
        {hasResults && allComplete && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary"
            >
              Add More Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  )
}
