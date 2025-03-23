
import React from 'react';
import { format } from 'date-fns';
import { 
  Calendar, Clock, MapPin, Tag, Shield, ScrollText, 
  Settings, Briefcase, Image, Layers
} from "lucide-react";

interface ServicePreviewProps {
  serviceData: any;
}

export const ServicePreview: React.FC<ServicePreviewProps> = ({ serviceData }) => {
  return (
    <div className=" rounded-xl overflow-hidden border ">
      {/* Preview Header */}
      <div className="bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold">{serviceData.serviceTitle || 'Your Service Title'}</h2>
        <div className="flex items-center mt-2 text-gray-300">
          <Clock className="h-4 w-4 mr-1" />
          <span className="text-sm">{serviceData.yearsOfExperience} years of experience</span>
        </div>
      </div>
      
      {/* Portfolio Images */}
      {serviceData.portfolioImages && serviceData.portfolioImages.length > 0 && (
        <div className="p-4 border-b">
          <div className="flex items-center mb-3">
            <Image className="h-5 w-5 mr-2 " />
            <h3 className="font-medium">Work Sample</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {serviceData.portfolioImages.slice(0, 3).map((src: string, index: number) => (
              <img 
                key={index}
                src={src} 
                alt={`Portfolio ${index + 1}`} 
                className="rounded h-24 w-full object-cover"
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Description */}
      <div className="p-6 border-b">
        <h3 className="font-medium mb-2">About This Service</h3>
        <p className="">{serviceData.serviceDescription || 'No description provided.'}</p>
      </div>
      
      {/* Session Durations */}
      <div className="p-6 border-b">
        <div className="flex items-center mb-3">
          <Clock className="h-5 w-5 mr-2 " />
          <h3 className="font-medium">Session Options</h3>
        </div>
        <div className="space-y-3">
          {serviceData.sessionDurations.map((duration: any, index: number) => (
            <div key={index} className="flex justify-between items-center p-3  rounded-lg">
              <div>
                <span className="font-medium">{duration.durationInHours} hour{duration.durationInHours !== 1 ? 's' : ''}</span>
                <span className="text-sm  block">Session</span>
              </div>
              <div className="text-right">
                <span className="font-medium text-lg">₹{duration.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Location */}
      <div className="p-6 border-b">
        <div className="flex items-center mb-3">
          <MapPin className="h-5 w-5 mr-2 " />
          <h3 className="font-medium">Location</h3>
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 mb-2">
            {serviceData.location.options.studio && (
              <span className=" -blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Studio
              </span>
            )}
            {serviceData.location.options.onLocation && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                On Location
              </span>
            )}
          </div>
          {serviceData.location.city && (
            <p className="">
              {serviceData.location.city}, {serviceData.location.state}, {serviceData.location.country}
            </p>
          )}
          {serviceData.location.options.onLocation && serviceData.location.travelFee > 0 && (
            <p className="text-sm  mt-1">
              Travel fee: ₹{serviceData.location.travelFee}
            </p>
          )}
        </div>
      </div>
      
      {/* Features */}
      {(serviceData.features && serviceData.features.length > 0) && (
        <div className="p-6 border-b">
          <div className="flex items-center mb-3">
            <Layers className="h-5 w-5 mr-2 " />
            <h3 className="font-medium">Features</h3>
          </div>
          <ul className="space-y-2">
            {serviceData.features.map((feature: string, index: number) => (
              <li key={index} className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Equipment */}
      {(serviceData.equipment && serviceData.equipment.length > 0) && (
        <div className="p-6 border-b">
          <div className="flex items-center mb-3">
            <Briefcase className="h-5 w-5 mr-2 " />
            <h3 className="font-medium">Equipment</h3>
          </div>
          <ul className="space-y-2">
            {serviceData.equipment.map((item: string, index: number) => (
              <li key={index} className="flex items-start">
                <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Custom Fields */}
      {(serviceData.customFields && serviceData.customFields.length > 0) && (
        <div className="p-6 border-b">
          <div className="flex items-center mb-3">
            <Settings className="h-5 w-5 mr-2 " />
            <h3 className="font-medium">Additional Information Required</h3>
          </div>
          <div className="space-y-3">
            {serviceData.customFields.map((field: any, index: number) => (
              <div key={index} className="p-3  rounded-lg">
                <p className="font-medium">
                  {field.name}{field.required && <span className="text-red-500 ml-1">*</span>}
                </p>
                <p className="text-sm ">
                  {field.type === 'text' && 'Text input'}
                  {field.type === 'number' && 'Number input'}
                  {field.type === 'boolean' && 'Yes/No selection'}
                  {field.type === 'date' && 'Date selection'}
                  {field.type === 'enum' && 'Selection from options'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Policies */}
      <div className="p-6">
        <div className="flex items-center mb-3">
          <Shield className="h-5 w-5 mr-2 " />
          <h3 className="font-medium">Policies</h3>
        </div>
        
        {serviceData.cancellationPolicies && serviceData.cancellationPolicies.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Cancellation Policies:</h4>
            <ul className="space-y-1 text-sm ">
              {serviceData.cancellationPolicies.map((policy: string, index: number) => (
                <li key={index}>{policy}</li>
              ))}
            </ul>
          </div>
        )}
        
        {serviceData.termsAndConditions && serviceData.termsAndConditions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Terms and Conditions:</h4>
            <ul className="space-y-1 text-sm ">
              {serviceData.termsAndConditions.map((term: string, index: number) => (
                <li key={index}>{term}</li>
              ))}
            </ul>
          </div>
        )}
        
        {serviceData.paymentRequired && (
          <p className="mt-4 text-sm text-amber-600 flex items-center">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Payment required before booking confirmation
          </p>
        )}
      </div>
    </div>
  );
};
