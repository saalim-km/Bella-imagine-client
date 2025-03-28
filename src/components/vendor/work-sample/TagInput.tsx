import { useState, useEffect, useRef, KeyboardEvent, ChangeEvent } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  readOnly?: boolean;
  className?: string;
}

const TagInput = ({
  value = [],
  onChange,
  placeholder = 'Add tags...',
  maxTags = 10,
  readOnly = false,
  className,
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus the input when clicking anywhere in the container
  useEffect(() => {
    const container = containerRef.current;
    const handleClick = () => {
      if (!readOnly && inputRef.current) {
        inputRef.current.focus();
      }
    };

    if (container) {
      container.addEventListener('click', handleClick);
      return () => {
        container.removeEventListener('click', handleClick);
      };
    }
  }, [readOnly]);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    
    if (
      trimmedTag &&
      !value.includes(trimmedTag) &&
      value.length < maxTags
    ) {
      const newTags = [...value, trimmedTag];
      onChange(newTags);
    }
    
    setInputValue('');
  };

  const removeTag = (index: number) => {
    const newTags = [...value];
    newTags.splice(index, 1);
    onChange(newTags);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (readOnly) return;
    
    // Handle comma or Enter key
    if ((e.key === ',' || e.key === 'Enter') && inputValue) {
      e.preventDefault();
      const tagValues = inputValue.split(',').map(tag => tag.trim()).filter(Boolean);
      
      tagValues.forEach(tag => {
        addTag(tag);
      });
    }
    
    // Handle Backspace key - remove the last tag if input is empty
    if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    
    const newValue = e.target.value;
    
    // If the user types a comma, add the tag
    if (newValue.includes(',')) {
      const tagValues = newValue.split(',').map(tag => tag.trim()).filter(Boolean);
      
      // Add all complete tags (all except the last one if it doesn't end with a comma)
      tagValues.slice(0, -1).forEach(tag => {
        addTag(tag);
      });
      
      // Keep the last value in the input if it doesn't end with a comma
      const lastValue = newValue.endsWith(',') ? '' : tagValues[tagValues.length - 1] || '';
      setInputValue(lastValue);
    } else {
      setInputValue(newValue);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex flex-wrap items-center gap-1.5 p-1.5 min-h-10 rounded-md border bg-background animate-fade-in',
        readOnly ? 'opacity-70 cursor-not-allowed' : 'cursor-text',
        className
      )}
    >
      {value.map((tag, index) => (
        <span 
          key={`${tag}-${index}`}
          className="tag-pill group animate-scale-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {tag}
          {!readOnly && (
            <button
              type="button"
              className="ml-1 text-primary/70 hover:text-primary focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              aria-label={`Remove ${tag} tag`}
            >
              <X size={14} className="transition-transform duration-150 group-hover:scale-110" />
            </button>
          )}
        </span>
      ))}
      
      {!readOnly && value.length < maxTags && (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="flex-grow bg-transparent border-none outline-none text-sm min-w-[120px] placeholder:text-muted-foreground focus:outline-none"
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={readOnly}
        />
      )}
      
      {value.length >= maxTags && (
        <span className="text-xs text-muted-foreground ml-2">
          Max tags reached ({maxTags})
        </span>
      )}
    </div>
  );
};

export default TagInput;