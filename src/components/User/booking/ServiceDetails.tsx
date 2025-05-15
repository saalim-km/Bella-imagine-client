
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IServiceResponse, SessionDuration } from "@/types/interfaces/vendor";

interface ServiceDetailsProps {
  service: IServiceResponse;
  selectedDuration: SessionDuration | null;
  onDurationSelect: (duration: SessionDuration) => void;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  service,
  selectedDuration,
  onDurationSelect,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-2xl">{service.serviceTitle}</CardTitle>
        <CardDescription>
          {service.yearsOfExperience} years of experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        {service.serviceDescription && (
          <div className="mb-4">
            <p className="text-muted-foreground">{service.serviceDescription}</p>
          </div>
        )}

        <div className="mb-4">
          <h3 className="font-medium mb-2">Session Duration & Pricing</h3>
          <div className="grid gap-2">
            {service.sessionDurations.map((duration, index) => (
              <div
                key={index}
                onClick={() => onDurationSelect(duration)}
                className={`p-3 border rounded-md cursor-pointer transition-colors ${
                  selectedDuration?.durationInHours === duration.durationInHours
                    ? "border-primary bg-primary/5"
                    : "hover:bg-accent"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>
                    {duration.durationInHours} hour
                    {duration.durationInHours !== 1 ? "s" : ""}
                  </span>
                  <span className="font-semibold">₹{duration.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {service.features && service.features.length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium mb-2">Features</h3>
            <div className="flex flex-wrap gap-2">
              {service.features.map((feature, index) => (
                <Badge key={index} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-4" />

        <div>
          <h3 className="font-medium mb-2">Location</h3>
          <div className="text-sm">
            {service.location.travelFee && (
              <p>
                • Available on location 
                {service.location.travelFee ? ` (Travel fee: ₹${service.location.travelFee.toFixed(2)})` : ""}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceDetails;