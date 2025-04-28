"use client"

import { useState } from "react"
import { useCloudinary } from "@/hooks/cloudinary/useCloudinary"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface CommunityFormProps {
  initialData?: {
    name: string
    description: string
    rules: string[]
    coverImageUrl: string | null
    iconImageUrl: string | null
    isPrivate: boolean
    isFeatured: boolean
  }
  onSubmit: (data: any) => void
  isSubmitting?: boolean
}

export function CommunityForm({ initialData, onSubmit, isSubmitting }: CommunityFormProps) {
  const [name, setName] = useState(initialData?.name || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [rules, setRules] = useState(initialData?.rules.join("\n") || "")
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(initialData?.coverImageUrl || null)
  const [iconImageUrl, setIconImageUrl] = useState<string | null>(initialData?.iconImageUrl || null)
  const [isPrivate, setIsPrivate] = useState(initialData?.isPrivate || false)
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false)

  // Cloudinary hooks for cover image
  const {
    openWidget: openCoverWidget,
    isReady: isCoverReady,
    isLoading: isCoverLoading,
    error: coverError,
  } = useCloudinary(
    {
      cloudName: "your-cloud-name",
      uploadPreset: "your-upload-preset",
      multiple: false,
      folder: "community/cover",
      cropping: true,
    },
    (results) => {
      const uploadedImage = results[0]
      setCoverImageUrl(uploadedImage.info.secure_url)
    }
  )

  // Cloudinary hooks for icon image
  const {
    openWidget: openIconWidget,
    isReady: isIconReady,
    isLoading: isIconLoading,
    error: iconError,
  } = useCloudinary(
    {
      cloudName: "your-cloud-name",
      uploadPreset: "your-upload-preset",
      multiple: false,
      folder: "community/icon",
      cropping: true,
      croppingAspectRatio: 1, // Make square for icons
    },
    (results) => {
      const uploadedImage = results[0]
      setIconImageUrl(uploadedImage.info.secure_url)
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = {
      name,
      description,
      rules: rules.split("\n").filter(Boolean),
      coverImageUrl,
      iconImageUrl,
      isPrivate,
      isFeatured,
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto">
      
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Community Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter community name"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter community description"
          rows={4}
          required
        />
      </div>

      {/* Rules */}
      <div className="space-y-2">
        <Label htmlFor="rules">Rules (one per line)</Label>
        <Textarea
          id="rules"
          value={rules}
          onChange={(e) => setRules(e.target.value)}
          placeholder="Enter community rules"
          rows={6}
        />
      </div>

      {/* Cover Image Upload */}
      <div className="space-y-2">
        <Label>Cover Image</Label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            onClick={openCoverWidget}
            disabled={!isCoverReady || isCoverLoading}
            variant="secondary"
          >
            {isCoverLoading ? "Loading..." : "Upload Cover Image"}
          </Button>
          {coverError && <p className="text-sm text-red-500">{coverError.message}</p>}
        </div>
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt="Cover Image Preview"
            className="rounded-xl shadow-md w-full h-48 object-cover"
          />
        ) : (
          <Skeleton className="w-full h-48 rounded-xl" />
        )}
      </div>

      {/* Icon Image Upload */}
      <div className="space-y-2">
        <Label>Icon Image</Label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            onClick={openIconWidget}
            disabled={!isIconReady || isIconLoading}
            variant="secondary"
          >
            {isIconLoading ? "Loading..." : "Upload Icon Image"}
          </Button>
          {iconError && <p className="text-sm text-red-500">{iconError.message}</p>}
        </div>
        {iconImageUrl ? (
          <img
            src={iconImageUrl}
            alt="Icon Image Preview"
            className="rounded-full shadow-md w-24 h-24 object-cover"
          />
        ) : (
          <Skeleton className="w-24 h-24 rounded-full" />
        )}
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch id="isPrivate" checked={isPrivate} onCheckedChange={setIsPrivate} />
          <Label htmlFor="isPrivate">Private Community</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="isFeatured" checked={isFeatured} onCheckedChange={setIsFeatured} />
          <Label htmlFor="isFeatured">Featured Community</Label>
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : initialData ? "Update Community" : "Create Community"}
      </Button>
    </form>
  )
}
