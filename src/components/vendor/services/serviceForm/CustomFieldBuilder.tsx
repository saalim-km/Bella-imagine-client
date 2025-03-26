import React, { useState } from "react";
import { AlertCircle, Plus, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { CustomField } from "@/types/vendor";

interface CustomFieldBuilderProps {
  fields: CustomField[];
  updateFields: (fields: CustomField[]) => void;
}

export const CustomFieldBuilder: React.FC<CustomFieldBuilderProps> = ({
  fields,
  updateFields,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fieldTypes = [
    { value: "string", label: "Text" },
    { value: "number", label: "Number" },
    { value: "boolean", label: "Yes/No" },
    { value: "array", label: "Dropdown" },
    { value: "date", label: "Date" },
  ];

  const addField = () => {
    updateFields([
      ...fields,
      {
        name: "",
        type: "string", // Default to "string" as per schema
        required: false,
        options: []
      }
    ]);
  };

  const removeField = (index: number) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    updateFields(newFields);
    
    const newErrors = { ...errors };
    delete newErrors[`name-${index}`];
    setErrors(newErrors);
  };

  const updateField = (index: number, field: keyof CustomField, value: any) => {
    const newFields = [...fields];
    
    if (field === "name") {
      if (!value.trim()) {
        setErrors({
          ...errors,
          [`name-${index}`]: "Field name is required"
        });
      } else {
        const isDuplicate = fields.some((f, i) => i !== index && f.name.trim() === value.trim());
        if (isDuplicate) {
          setErrors({
            ...errors,
            [`name-${index}`]: "Field name must be unique"
          });
        } else {
          const newErrors = { ...errors };
          delete newErrors[`name-${index}`];
          setErrors(newErrors);
        }
      }
    }

    // Reset options if type changes to non-array
    if (field === "type" && value !== "array") {
      newFields[index].options = [];
    }
    
    newFields[index] = {
      ...newFields[index],
      [field]: value
    };
    
    updateFields(newFields);
  };

  const addOption = (fieldIndex: number) => {
    const newFields = [...fields];
    if (!newFields[fieldIndex].options) {
      newFields[fieldIndex].options = [];
    }
    newFields[fieldIndex].options?.push("");
    updateFields(newFields);
  };

  const updateOption = (fieldIndex: number, optionIndex: number, value: string) => {
    const newFields = [...fields];
    if (newFields[fieldIndex].options) {
      newFields[fieldIndex].options![optionIndex] = value;
      updateFields(newFields);
    }
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const newFields = [...fields];
    if (newFields[fieldIndex].options) {
      newFields[fieldIndex].options!.splice(optionIndex, 1);
      updateFields(newFields);
    }
  };

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div key={index} className="p-4 border rounded-md space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Custom Field {index + 1}</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeField(index)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Field Name</Label>
              <Input
                value={field.name}
                onChange={(e) => updateField(index, "name", e.target.value)}
                placeholder="Enter field name"
                className={errors[`name-${index}`] ? "border-red-500" : ""}
              />
              {errors[`name-${index}`] && (
                <div className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors[`name-${index}`]}
                </div>
              )}
            </div>
            
            <div>
              <Label className="text-sm">Field Type</Label>
              <Select
                value={field.type}
                onValueChange={(value) => updateField(index, "type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field type" />
                </SelectTrigger>
                <SelectContent>
                  {fieldTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-sm">Required Field</Label>
              <Switch
                checked={field.required}
                onCheckedChange={(checked) => updateField(index, "required", checked)}
              />
            </div>
            
            {field.type === "array" && (
              <div className="space-y-3">
                <Label className="text-sm">Dropdown Options</Label>
                
                {field.options?.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex space-x-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                      placeholder={`Option ${optionIndex + 1}`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index, optionIndex)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addOption(index)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Option
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
      
      <Button type="button" variant="outline" onClick={addField} className="w-full">
        <Plus className="h-4 w-4 mr-2" /> Add Custom Field
      </Button>
    </div>
  );
};