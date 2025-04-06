
import React, { useState } from "react";
import { AlertCircle, Plus, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FeaturesListProps {
  label: string;
  values: string[];
  updateValues: (values: string[]) => void;
}

export const FeaturesList: React.FC<FeaturesListProps> = ({
  label,
  values,
  updateValues,
}) => {
  const [newItem, setNewItem] = useState("");
  const [error, setError] = useState("");

  const addItem = () => {
    if (!newItem.trim()) {
      setError(`${label} cannot be empty`);
      return;
    }

    if (values.includes(newItem.trim())) {
      setError(`This ${label.toLowerCase()} already exists`);
      return;
    }

    updateValues([...values, newItem.trim()]);
    setNewItem("");
    setError("");
  };

  const removeItem = (index: number) => {
    const updatedValues = [...values];
    updatedValues.splice(index, 1);
    updateValues(updatedValues);
  };

  return (
    <div className="space-y-3">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder={`Add ${label}`}
          value={newItem}
          onChange={(e) => {
            setNewItem(e.target.value);
            if (e.target.value.trim()) setError("");
          }}
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
        />
        <Button type="button" onClick={addItem}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-1 flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" />
          {error}
        </div>
      )}

      <div className="space-y-2 mt-2">
        {values.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between  px-3 py-2 rounded-md"
          >
            <span className="text-sm">{item}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeItem(index)}
            >
              <Trash className="h-4 w-4 " />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
