import React from "react";
import { IServiceResponse } from "@/types/vendor";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, CheckSquare, Camera, FileText, Home, Building } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/common/Pagination";

interface ServiceCardProps {
  service: IServiceResponse;
  vendorId : string
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service , vendorId }) => {
  
  return (
    <>
    <Card className="h-full w-96 shadow-md hover:shadow-lg transition-shadow p-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{service.serviceTitle}</CardTitle>
          <Badge variant="outline">{service.category.title}</Badge>
        </div>
        <CardDescription>{service.serviceDescription}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Years of Experience</h3>
          <Badge>{service.yearsOfExperience} Years</Badge>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Style Specialties</h3>
          <div className="flex flex-wrap gap-1.5">
            {service.styleSpecialty.map(style => (
              <Badge key={style} variant="secondary" className="text-xs">{style}</Badge>
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
                  <TableCell>{session.durationInHours} hr</TableCell>
                  <TableCell>₹{session.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Location Options</h3>
          <div className="flex flex-wrap gap-2">
            {service.location.options.studio && <Badge variant="outline">Studio</Badge>}
            {service.location.options.onLocation && <Badge variant="outline">On Location</Badge>}
            {service.location.travelFee && <Badge variant="outline">Travel Fee: ₹{service.location.travelFee}</Badge>}
          </div>
        </div>
        
        <Accordion type="single" collapsible>
          <AccordionItem value="features">
            <AccordionTrigger>Features</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside text-sm">
                {service.features.map((feature, index) => <li key={index}>{feature}</li>)}
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="equipment">
            <AccordionTrigger>Equipment</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside text-sm">
                {service.equipment.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="cancellationPolicies">
            <AccordionTrigger>Cancellation Policies</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside text-sm">
                {service.cancellationPolicies.map((policy, index) => <li key={index}>{policy}</li>)}
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="termsAndConditions">
            <AccordionTrigger>Terms & Conditions</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside text-sm">
                {service.termsAndConditions.map((term, index) => <li key={index}>{term}</li>)}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Available Dates</h3>
          {service.availableDates.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time Slots</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {service.availableDates.map((date, index) => (
                  <TableRow key={index}>
                    <TableCell>{date.date}</TableCell>
                    <TableCell>
                      {date.timeSlots.map((slot, idx) => (
                        <div key={idx} className="text-xs">
                          {slot.startTime} - {slot.endTime} ({slot.capacity} slots)
                        </div>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-gray-500">No available dates</p>
          )}
        </div>
        <Link to={`/booking/${service._id}/${vendorId}`}>
        <Button variant={"outline"} className="mt-2">Book Now</Button>
        </Link>
      </CardContent>
    </Card>
    </>
  );
};

export default ServiceCard;
