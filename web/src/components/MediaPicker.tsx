"use client"

import { ChangeEvent, useState } from "react"
import { X } from "lucide-react"

export function MediaPicker() {
  const [preview, setPreview] = useState<string | null>(null)

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target

    if (!files) {
      return
    }

    const previewURL = URL.createObjectURL(files[0])

    setPreview(previewURL)
  }

  function removePreviewMedia() {
    setPreview(null)
  }

  return (
    <>
      <input
        onChange={onFileSelected}
        type="file"
        id="media"
        name="coverUrl"
        accept="image/*"
        className="invisible w-0 h-0"
      />

      {preview && (
        <div className="relative">
          {/* eslint-disable-next-line */}
          <img
            src={preview}
            alt=""
            className="w-full aspect-video rounded-lg object-cover"
          />

          <button
            className="rounded absolute top-2 right-2"
            onClick={removePreviewMedia}
          >
            <X className="w-6 h-6 text-red-500" />
          </button>
        </div>
      )}
    </>
  )
}
