import React from "react";
import {
  Clock,
  MapPin,
  Shield,
  Briefcase,
  Layers,
  Loader2,
} from "lucide-react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { IService } from "@/types/interfaces/vendor";

interface ServicePreviewProps {
  serviceData: IService;
}

export const ServicePreview: React.FC<ServicePreviewProps> = ({
  serviceData,
}) => {
  return (
    <div className=" rounded-xl overflow-hidden border ">
      {/* Preview Header */}
      <div className="bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold">
          {serviceData.serviceTitle || "Your Service Title"}
        </h2>
        <div className="flex items-center mt-2 text-gray-300">
          <Clock className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {serviceData.yearsOfExperience} years of experience
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="p-6 border-b">
        <h3 className="font-medium mb-2">About This Service</h3>
        <p className="">
          {serviceData.serviceDescription || "No description provided."}
        </p>
      </div>

      {/* Session Durations */}
      <div className="p-6 border-b">
        <div className="flex items-center mb-3">
          <Clock className="h-5 w-5 mr-2 " />
          <h3 className="font-medium">Session Options</h3>
        </div>
        <div className="space-y-3">
          {serviceData.sessionDurations.map((duration: any, index: number) => (
            <div
              key={index}
              className="flex justify-between items-center p-3  rounded-lg"
            >
              <div>
                <span className="font-medium">
                  {duration.durationInHours} hour
                  {duration.durationInHours !== 1 ? "s" : ""}
                </span>
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
      <div className="space-y-4 p-2 mt-4 mx-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <MapPin className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold">Service Location</h3>
        </div>
        <div className="bg-muted/20 rounded-xl overflow-hidden border">
          <div className="h-[350px] w-full">
            <LoadScript
              googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
              loadingElement={
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              }
            >
              <GoogleMap
                center={serviceData.location}
                zoom={15}
                mapContainerStyle={{ width: "100%", height: "100%" }}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                  zoomControl: true,
                  clickableIcons: false,
                }}
              >
                <Marker position={serviceData.location} />
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      </div>

      {/* Features */}
      {serviceData.features && serviceData.features.length > 0 && (
        <div className="p-6 border-b">
          <div className="flex items-center mb-3">
            <Layers className="h-5 w-5 mr-2 " />
            <h3 className="font-medium">Features</h3>
          </div>
          <ul className="space-y-2">
            {serviceData.features.map((feature: string, index: number) => (
              <li key={index} className="flex items-start">
                <svg
                  className="h-5 w-5 text-green-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Equipment */}
      {serviceData.equipment && serviceData.equipment.length > 0 && (
        <div className="p-6 border-b">
          <div className="flex items-center mb-3">
            <Briefcase className="h-5 w-5 mr-2 " />
            <h3 className="font-medium">Equipment</h3>
          </div>
          <ul className="space-y-2">
            {serviceData.equipment.map((item: string, index: number) => (
              <li key={index} className="flex items-start">
                <svg
                  className="h-5 w-5 text-blue-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4"
                  />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Policies */}
      <div className="p-6">
        <div className="flex items-center mb-3">
          <Shield className="h-5 w-5 mr-2 " />
          <h3 className="font-medium">Policies</h3>
        </div>

        {serviceData.cancellationPolicies &&
          serviceData.cancellationPolicies.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">
                Cancellation Policies:
              </h4>
              <ul className="space-y-1 text-sm ">
                {serviceData.cancellationPolicies.map(
                  (policy: string, index: number) => (
                    <li key={index}>{policy}</li>
                  )
                )}
              </ul>
            </div>
          )}

        {serviceData.termsAndConditions &&
          serviceData.termsAndConditions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">
                Terms and Conditions:
              </h4>
              <ul className="space-y-1 text-sm ">
                {serviceData.termsAndConditions.map(
                  (term: string, index: number) => (
                    <li key={index}>{term}</li>
                  )
                )}
              </ul>
            </div>
          )}
      </div>
    </div>
  );
};
