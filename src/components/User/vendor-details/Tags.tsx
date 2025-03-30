
import React from "react";
import { Badge } from "@/components/ui/badge";

interface TagsProps {
  tags: string[];
  variant?: "default" | "outline" | "secondary";
  onClick?: (tag: string) => void;
}

const Tags: React.FC<TagsProps> = ({ 
  tags, 
  variant = "secondary",
  onClick
}) => {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <Badge 
          key={tag} 
          variant={variant}
          className={onClick ? "cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors" : ""}
          onClick={() => onClick && onClick(tag)}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
};

export default Tags;
