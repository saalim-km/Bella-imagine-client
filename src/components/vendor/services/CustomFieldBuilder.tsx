
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Settings } from "lucide-react";

interface CustomField {
  name: string;
  type: string;
  required: boolean;
  options: string[];
}

interface CustomFieldBuilderProps {
  fields: CustomField[];
  updateFields: (fields: CustomField[]) => void;
}

const fieldTypes = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Yes/No' },
  { value: 'date', label: 'Date' },
  { value: 'enum', label: 'Select from options' }
];

export const CustomFieldBuilder: React.FC<CustomFieldBuilderProps> = ({ 
  fields, 
  updateFields 
}) => {
  const addField = () => {
    updateFields([...fields, { name: '', type: 'text', required: false, options: [] }]);
  };

  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    updateFields(newFields);
  };

  const updateField = (index: number, field: keyof CustomField, value: string | boolean | string[]) => {
    const newFields = [...fields];
    if (field === 'name' || field === 'type') {
      newFields[index][field] = value as string;
    } else if (field === 'required') {
      newFields[index][field] = value as boolean;
    } else if (field === 'options') {
      newFields[index][field] = value as string[];
    }
    
    // Reset options if type is changed from enum
    if (field === 'type' && value !== 'enum') {
      newFields[index].options = [];
    }
    
    updateFields(newFields);
  };

  const addOption = (fieldIndex: number) => {
    const newFields = [...fields];
    newFields[fieldIndex].options.push('');
    updateFields(newFields);
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const newFields = [...fields];
    newFields[fieldIndex].options = newFields[fieldIndex].options.filter((_, i) => i !== optionIndex);
    updateFields(newFields);
  };

  const updateOption = (fieldIndex: number, optionIndex: number, value: string) => {
    const newFields = [...fields];
    newFields[fieldIndex].options[optionIndex] = value;
    updateFields(newFields);
  };

  return (
    <div className="space-y-4">
      {fields.length === 0 && (
        <div className="text-center py-6   rounded-lg">
          <Settings className="mx-auto h-10 w-10  mb-2" />
          <p className="">No custom fields added yet</p>
        </div>
      )}
      
      {fields.map((field, fieldIndex) => (
        <div key={fieldIndex} className="p-4  rounded-lg relative animate-fade-in">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 opacity-70 hover:opacity-100"
            onClick={() => removeField(fieldIndex)}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`fields[${fieldIndex}].name`} className="text-sm font-medium mb-1 block">
                  Field Name
                </Label>
                <Input
                  id={`fields[${fieldIndex}].name`}
                  value={field.name}
                  onChange={(e) => updateField(fieldIndex, 'name', e.target.value)}
                  className="h-12"
                  placeholder="e.g., Preferred Camera"
                />
              </div>
              
              <div>
                <Label htmlFor={`fields[${fieldIndex}].type`} className="text-sm font-medium mb-1 block">
                  Field Type
                </Label>
                <select
                  id={`fields[${fieldIndex}].type`}
                  value={field.type}
                  onChange={(e) => updateField(fieldIndex, 'type', e.target.value)}
                  className="w-full h-12 rounded-md   px-3 py-2 bg-transparent border-2"
                >
                  {fieldTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                id={`fields[${fieldIndex}].required`}
                type="checkbox"
                checked={field.required}
                onChange={(e) => updateField(fieldIndex, 'required', e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded  focus:ring-blue-500"
              />
              <Label htmlFor={`fields[${fieldIndex}].required`} className="ml-2 block text-sm font-medium ">
                Required field
              </Label>
            </div>
            
            {field.type === 'enum' && (
              <div className="space-y-3 mt-2">
                <Label className="text-sm font-medium">Options</Label>
                
                {field.options.map((option, optionIndex) => (
                  <div 
                    key={optionIndex} 
                    className="flex items-center gap-2"
                  >
                    <div className="flex-grow">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(fieldIndex, optionIndex, e.target.value)}
                        className="h-10"
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                    </div>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(fieldIndex, optionIndex)}
                      className="flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addOption(fieldIndex)}
                  className="w-full transition-all duration-200"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Option
                </Button>
              </div>
            )}
            
            {/* Preview for this field */}
            <div className="mt-4 pt-4 ">
              <Label className="text-sm font-medium ">Preview:</Label>
              <div className="mt-2 p-3  rounded-md">
                <Label className="text-sm font-medium">
                  {field.name || 'Field Name'}{field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                
                {field.type === 'text' && (
                  <Input disabled placeholder="Text input" className="mt-1 " />
                )}
                
                {field.type === 'number' && (
                  <Input disabled type="number" placeholder="0" className="mt-1 " />
                )}
                
                {field.type === 'boolean' && (
                  <div className="mt-1 flex items-center">
                    <input 
                      type="checkbox" 
                      disabled 
                      className="h-4 w-4 text-blue-600 rounded "
                    />
                    <span className="ml-2 text-sm ">Yes/No</span>
                  </div>
                )}
                
                {field.type === 'date' && (
                  <Input disabled type="date" className="mt-1 " />
                )}
                
                {field.type === 'enum' && (
                  <select
                    disabled
                    className="w-full mt-1 h-10 rounded-md   px-3 py-2"
                  >
                    <option>Select an option</option>
                    {field.options.map((option, i) => (
                      <option key={i}>{option || `Option ${i + 1}`}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <Button
        type="button"
        onClick={addField}
        className="w-full py-3 border-dashed  "
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Custom Field
      </Button>
    </div>
  );
};