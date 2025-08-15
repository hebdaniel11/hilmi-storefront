"use client"

import { useRef, useState } from "react"
import DecorationTechniques, { DecorationTechnique } from "../decoration-techniques"

interface ArtworkUploaderProps {
  onArtworkUpload?: (artwork: {
    imageUrl: string
    technique: DecorationTechnique
  }) => void
}

const ArtworkUploader: React.FC<ArtworkUploaderProps> = ({ onArtworkUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [selectedTechnique, setSelectedTechnique] = useState<DecorationTechnique | undefined>()

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

  const handleTechniqueSelect = (technique: DecorationTechnique) => {
    setSelectedTechnique(technique)
  }

  const handleAddToCanvas = () => {
    if (uploadedImage && selectedTechnique && onArtworkUpload) {
      console.log('Calling onArtworkUpload with:', { imageUrl: uploadedImage, technique: selectedTechnique })
      onArtworkUpload({
        imageUrl: uploadedImage,
        technique: selectedTechnique
      })
      // Don't reset immediately - let the canvas load the image first
      // setTimeout(() => {
      //   setUploadedImage(null)
      //   setSelectedTechnique(undefined)
      //   if (fileInputRef.current) {
      //     fileInputRef.current.value = ''
      //   }
      // }, 1000)
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
      
      {!uploadedImage ? (
        <div className="border-2 border-dashed border-gray-200 p-8 text-center rounded-lg">
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
      ) : (
        <div className="space-y-4">
          <div>
            <h4 className="text-md font-medium mb-2">Uploaded Artwork</h4>
            <div className="p-2 border border-gray-200 rounded-lg">
              <img src={uploadedImage} alt="Uploaded artwork" className="max-w-full h-auto max-h-32 object-contain" />
            </div>
            <button
              className="mt-2 text-sm text-gray-600 underline"
              onClick={() => {
                setUploadedImage(null)
                setSelectedTechnique(undefined)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''
                }
              }}
            >
              Remove & upload different image
            </button>
          </div>

          <div>
            <h4 className="text-md font-medium mb-2">Decoration Technique</h4>
            <DecorationTechniques
              selectedTechnique={selectedTechnique}
              onTechniqueSelect={handleTechniqueSelect}
            />
          </div>

          {selectedTechnique && (
            <button
              onClick={handleAddToCanvas}
              className="w-full px-4 py-2 bg-black text-white rounded-md text-sm font-medium"
            >
              Add to Canvas
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default ArtworkUploader
