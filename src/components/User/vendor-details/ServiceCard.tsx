
import React from "react";
import { IServiceResponse } from "@/types/vendor";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  MapPin,
  Clock,
  CheckSquare,
  Camera,
  FileText,
  Home,
  Building
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Tags from "./Tags";

interface ServiceCardProps {
  service: IServiceResponse;
  onBookNow: (service: IServiceResponse) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBookNow }) => {
  return (
    <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{service.serviceTitle}</CardTitle>
          <Badge variant="outline">{service.category.title}</Badge>
        </div>
        <CardDescription>{service.serviceDescription}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Style Specialties</h3>
          <div className="flex flex-wrap gap-1.5">
            {service.styleSpecialty.map(style => (
              <Badge key={style} variant="secondary" className="text-xs">
                {style}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Session Duration & Pricing</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {service.sessionDurations.map((session, index) => (
                <TableRow key={index}>
                  <TableCell>{session.durationInHours} hour{session.durationInHours > 1 ? 's' : ''}</TableCell>
                  <TableCell>${session.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {service.location.options.studio && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Building size={16} />
              <span>Studio</span>
            </div>
          )}
          {service.location.options.onLocation && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Home size={16} />
              <span>On-Location</span>
              {service.location.travelFee && (
                <Badge variant="outline" className="text-xs ml-1">
                  +${service.location.travelFee} Travel Fee
                </Badge>
              )}
            </div>
          )}
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="features">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <CheckSquare size={16} />
                Features
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                {service.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="equipment">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Camera size={16} />
                Equipment
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                {service.equipment.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="policies">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <FileText size={16} />
                Cancellation Policies
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                {service.cancellationPolicies.map((policy, index) => (
                  <li key={index}>{policy}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      
      <CardFooter className="flex flex-col items-start space-y-4">
        <Tags tags={service.tags} variant="outline" />
        <Button 
          className="w-full mt-2" 
          onClick={() => onBookNow(service)}
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
