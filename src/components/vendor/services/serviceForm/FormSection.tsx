
import React from "react";

interface FormSectionProps {
  title: string;
  subtitle: string;
  index: number;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ 
  title, 
  subtitle, 
  index, 
  children 
}) => {
  return (
    <div className=" rounded-md shadow-sm border  p-6 mb-6">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <div className="bg-primary  rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
            {index + 1}
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <p className=" ml-9">{subtitle}</p>
      </div>
      {children}
    </div>
  );
};
