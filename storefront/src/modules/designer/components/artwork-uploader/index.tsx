"use client"

import { useRef, useState } from "react"

const ArtworkUploader = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
        accept=".jpg,.jpeg,.png,.svg"
      />
      <div className="border-2 border-dashed border-gray-200 p-8 text-center rounded-lg">
        {/* Upload icon removed */}
        <p className="mt-2 text-sm text-gray-600">
          We support .jpg, .jpeg, .png, .svg files up to 4.5MB
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Drag and drop or click to upload
        </p>
        <button
          className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload Artwork
        </button>
      </div>

      {uploadedImage && (
        <div className="mt-4">
          <h4 className="text-md font-medium mb-2">Uploaded Artwork</h4>
          <div className="p-2 border border-gray-200 rounded-lg">
            <img src={uploadedImage} alt="Uploaded artwork" className="max-w-full h-auto" />
          </div>
        </div>
      )}
    </div>
  )
}

export default ArtworkUploader
