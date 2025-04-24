import { useState, useRef, ChangeEvent } from "react";
import { 
  Smile, 
  Paperclip, 
  Image, 
  MapPin, 
  Send, 
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { chatService } from "@/services/chat/chatService";
import { toast } from "sonner";
import { MessageType } from "@/types/Chat";

interface MessageInputProps {
  conversationId: string;
  onSendMessage: (message: any) => void;
}

export function MessageInput({ conversationId, onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<{
    url: string;
    type: string;
    file?: File;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
    if ((!message.trim() && !mediaPreview) || isUploading) return;

    try {
      let messageToSend: any = {
        text: message,
        type: "text" as MessageType,
      };

      if (mediaPreview) {
        setIsUploading(true);
        
        if (mediaPreview.file) {
          const uploadResult = await chatService.uploadMedia(mediaPreview.file);
          
          messageToSend = {
            text: message,
            type: uploadResult.type,
            mediaUrl: uploadResult.url,
            mediaType: mediaPreview.file.type,
            fileName: uploadResult.name,
            fileSize: uploadResult.size,
          };
        }
      }

      const newMessage = await chatService.sendMessage(conversationId, messageToSend);
      
      onSendMessage(newMessage);
      
      setMessage("");
      setMediaPreview(null);
      setIsUploading(false);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
      setIsUploading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 10MB.");
      return;
    }
    
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const type = file.type.startsWith("image/") 
        ? "image" 
        : file.type.startsWith("video/") 
          ? "video" 
          : "file";
      
      setMediaPreview({
        url: fileReader.result as string,
        type,
        file,
      });
    };
    
    fileReader.readAsDataURL(file);
  };

  const handleShareLocation = async () => {
    try {
      const location = await chatService.shareLocation();
      
      const messageToSend = {
        text: "Shared a location",
        type: "location" as MessageType,
        location,
      };
      
      const newMessage = await chatService.sendMessage(conversationId, messageToSend);
      onSendMessage(newMessage);
    } catch (error) {
      console.error("Error sharing location:", error);
      toast.error("Failed to share location. Please check your permissions and try again.");
    }
  };

  const renderMediaPreview = () => {
    if (!mediaPreview) return null;
    
    return (
      <div className="relative mt-2 mb-2 inline-block">
        {mediaPreview.type === "image" ? (
          <img 
            src={mediaPreview.url} 
            alt="Upload preview" 
            className="max-h-32 max-w-xs rounded-md object-contain"
          />
        ) : mediaPreview.type === "video" ? (
          <video 
            src={mediaPreview.url} 
            className="max-h-32 max-w-xs rounded-md object-contain"
            controls
          />
        ) : (
          <div className="flex items-center bg-muted p-2 rounded-md">
            <div className="bg-muted-foreground/10 p-2 rounded-md mr-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">
                {mediaPreview.file?.name || "File"}
              </p>
              {mediaPreview.file && (
                <p className="text-xs text-muted-foreground">
                  {(mediaPreview.file.size / 1024).toFixed(1)} KB
                </p>
              )}
            </div>
          </div>
        )}
        
        <button
          className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white"
          onClick={() => setMediaPreview(null)}
        >
          <X size={14} />
        </button>
      </div>
    );
  };

  return (
    <div className="p-3 border-t">
      {renderMediaPreview()}
      
      <div className="flex items-end space-x-2">
        <div className="flex-1 bg-muted rounded-lg">
          <Textarea
            placeholder="Type a message..."
            className="min-h-10 max-h-32 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none bg-transparent"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          
          <div className="flex items-center p-2 gap-1.5">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <Smile className="h-5 w-5 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" align="start">
                <div className="grid grid-cols-8 gap-2">
                  {["😀", "😂", "😍", "🥰", "😊", "🤔", "😎", "👍", 
                    "👏", "🙏", "❤️", "🔥", "⚡", "🎉", "🎊", "🎁"].map((emoji) => (
                    <button
                      key={emoji}
                      className="flex items-center justify-center h-8 w-8 rounded hover:bg-muted cursor-pointer"
                      onClick={() => setMessage((prev) => prev + emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
              accept="image/*,video/*,application/*"
            />
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 rounded-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-5 w-5 text-muted-foreground" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 rounded-full"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = "image/*";
                  fileInputRef.current.click();
                }
              }}
            >
              <Image className="h-5 w-5 text-muted-foreground" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 rounded-full"
              onClick={handleShareLocation}
            >
              <MapPin className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
        
        <Button 
          className="rounded-full h-10 w-10 p-0 flex items-center justify-center bg-chat-primary hover:bg-chat-secondary"
          disabled={(!message.trim() && !mediaPreview) || isUploading}
          onClick={handleSendMessage}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
