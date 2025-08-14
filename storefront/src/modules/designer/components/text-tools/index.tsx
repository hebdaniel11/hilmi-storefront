"use client"

const TextTools = () => {

  const handleAddText = () => {
    console.log("Add text button clicked")
    // In a later step, we will add the logic to add text to the Fabric.js canvas.
  }

  return (
    <div>
      <button
        onClick={handleAddText}
        className="w-full px-4 py-2 bg-black text-white rounded-md text-sm font-medium"
      >
        Add Text
      </button>
    </div>
  )
}

export default TextTools
