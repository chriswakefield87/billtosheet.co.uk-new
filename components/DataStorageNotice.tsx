'use client'

import { useState, useEffect } from 'react'

export default function DataStorageNotice() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has dismissed this notice
    const dismissed = localStorage.getItem('dataStorageNoticeDismissed')
    if (!dismissed) {
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem('dataStorageNoticeDismissed', 'true')
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 relative">
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-blue-600 hover:text-blue-800 transition-colors"
        aria-label="Dismiss notice"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div className="flex items-start pr-8">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800">
            Data Storage
          </h3>
          <p className="mt-1 text-sm text-blue-700">
            We store your invoice data securely in our encrypted database. Original PDF files are not stored after processing. 
            CSV and Excel files are generated on-demand when you download them. Your conversion data is retained for 30 days 
            and then automatically deleted to protect your privacy.
          </p>
        </div>
      </div>
    </div>
  )
}
