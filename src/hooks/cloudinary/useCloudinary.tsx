import { useEffect, useState } from "react";

declare global {
  interface Window {
    cloudinary: any;
  }
}

type CloudinaryUploadWidgetOptions = {
  cloudName: string;
  uploadPreset: string;
  cropping?: boolean;
  croppingAspectRatio?: number;
  croppingShowDimensions?: boolean;
  croppingCoordinatesMode?: string;
  multiple?: boolean;
  maxFiles?: number;
  folder?: string;
  tags?: string[];
  resourceType?: string;
  clientAllowedFormats?: string[];
  maxFileSize?: number;
  maxImageWidth?: number;
  maxImageHeight?: number;
  sources?: string[];
  defaultSource?: string;
};

type CloudinaryUploadResult = {
  event: string;
  info: {
    secure_url: string;
    public_id: string;
    thumbnail_url: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
    original_filename: string;
    resource_type: string;
    path: string;
    url: string;
  };
};

type UseCloudinaryReturn = {
  openWidget: () => void;
  isReady: boolean;
  isLoading: boolean;
  error: Error | null;
};

export function useCloudinary(
  options: CloudinaryUploadWidgetOptions,
  onSuccess: (results: CloudinaryUploadResult[]) => void
): UseCloudinaryReturn {
  const [widget, setWidget] = useState<any>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Ensure script is loaded only once
  useEffect(() => {
    if (window.cloudinary) {
      setIsReady(true);
      setIsLoading(false);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;

    script.onload = () => {
      setIsReady(true);
      setIsLoading(false);
    };

    script.onerror = () => {
      setError(new Error("Failed to load Cloudinary widget"));
      setIsLoading(false);
    };

    document.body.appendChild(script);
  }, []);

  // Ensure widget is initialized when Cloudinary script is ready
  useEffect(() => {
    if (!isReady || widget || !window.cloudinary) return;

    try {
      const newWidget = window.cloudinary.createUploadWidget(
        {
          ...options,
          cropping: options.cropping ?? false,
          croppingAspectRatio: options.croppingAspectRatio ?? 4 / 3,
          croppingShowDimensions: options.croppingShowDimensions ?? true,
          croppingCoordinatesMode: options.croppingCoordinatesMode ?? "custom",
          multiple: options.multiple ?? true,
          maxFiles: options.maxFiles ?? 10,
          sources: options.sources ?? ["local", "url", "camera"],
          defaultSource: options.defaultSource ?? "local",
          styles: {
            palette: {
              window: "#FFFFFF",
              windowBorder: "#90A0B3",
              tabIcon: "#0078FF",
              menuIcons: "#5A616A",
              textDark: "#000000",
              textLight: "#FFFFFF",
              link: "#0078FF",
              action: "#0078FF",
              inactiveTabIcon: "#0E2F5A",
              error: "#F44235",
              inProgress: "#0078FF",
              complete: "#20B832",
              sourceBg: "#F4F5F5",
            },
            fonts: {
              default: null,
              "'Poppins', sans-serif": {
                url: "https://fonts.googleapis.com/css?family=Poppins",
                active: true,
              },
            },
          },
        },
        (error: Error, result: CloudinaryUploadResult) => {
          if (error) {
            setError(error);
            return;
          }
          if (result.event === "success") {
            onSuccess([result]);
          }
        }
      );

      setWidget(newWidget);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error initializing widget"));
    }
  }, [isReady, options, onSuccess]);

  const openWidget = () => {
    if (widget) {
      widget.open();
    } else {
      console.error("Widget not initialized. isReady:", isReady, "window.cloudinary:", !!window.cloudinary);
      setError(new Error("Widget is not initialized yet. Please try again."));
    }
  };

  return {
    openWidget,
    isReady: isReady && !!widget,
    isLoading,
    error,
  };
}
