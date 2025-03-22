import React, { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  index: number;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, subtitle, children, index }) => {
  return (
    <div className="form-section mb-8" style={{ '--index': index } as React.CSSProperties}>
      <div className="mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        {children}
      </div>
    </div>
  );
};
