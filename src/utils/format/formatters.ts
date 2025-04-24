import { Message } from "@/types/Chat";

export function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
}

export function formatMessagePreview(message: Message): string {
  if (message.isDeleted) {
    return "This message was deleted";
  }
  
  switch (message.type) {
    case "text":
      return message.text;
    case "image":
      return "📷 Image";
    case "video":
      return "🎥 Video";
    case "file":
      return `📎 ${message.fileName || "File"}`;
    case "location":
      return "📍 Location";
    default:
      return "";
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  } else {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }
}
