import React from "react";
import { IServiceResponse } from "@/types/vendor";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  service: IServiceResponse;
  onViewDetails: (service: IServiceResponse) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onViewDetails }) => {
  return (
    <Card
      className="h-full shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg"
      onClick={(e) => {
        e.stopPropagation();
        onViewDetails(service);
      }}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold ">{service.serviceTitle}</CardTitle>
        </div>
        <CardDescription className="line-clamp-2 ">{service.serviceDescription}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium">Experience</h3>
            <Badge className="mt-1">{service.yearsOfExperience} Years</Badge>
          </div>
          <div>
            <h3 className="text-sm font-medium">Starting at</h3>
            <Badge variant="secondary" className="mt-1">
              ₹{service.sessionDurations.length > 0
                ? Math.min(...service.sessionDurations.map((s) => s.price))
                : "N/A"}
            </Badge>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Style Specialties</h3>
          <div className="flex flex-wrap gap-2">
            {service.styleSpecialty.slice(0, 3).map((style, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">{style}</Badge>
            ))}
            {service.styleSpecialty.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{service.styleSpecialty.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full mt-4 text-blue-600 border-blue-600 hover:bg-blue-50"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(service);
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;