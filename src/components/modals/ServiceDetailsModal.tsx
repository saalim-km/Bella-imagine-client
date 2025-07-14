import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Award, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DialogClose, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { IServiceResponse } from "@/types/interfaces/vendor";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface ServiceModalProps {
  service: IServiceResponse;
  vendorId: string;
  isOpen: boolean;
  onClose: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export const ServiceDetailsModal = ({ service, vendorId, isOpen, onClose }: ServiceModalProps) => {
  const user = useSelector((state : RootState)=> {
    if(state.client.client) return state.client.client;
    if(state.vendor.vendor) return state.vendor.vendor;
    return undefined;
  })


  if(!user){
    return <p>user not found please try again later , or please relogin to continue</p>
  }

  if (!service) return null;

  // Fallback location if service.location is invalid or missing
  const serviceLocation = service.location && service.location.lat && service.location.lng
    ? { lat: service.location.lat, lng: service.location.lng }
    : { lat: 0, lng: 0 }; // Default to (0,0) if no location

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[98vh] overflow-hidden  rounded-lg shadow-xl p-0">
        <DialogHeader className="px-8 pt-8 pb-4 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold ">{service.serviceTitle}</DialogTitle>
          </div>
          <DialogDescription className=" mt-2">{service.serviceDescription}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] px-8">
          <motion.div
            className="space-y-8 py-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Key Info */}
              <div className="space-y-6">
                <motion.div variants={itemVariants} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Award className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold ">Experience & Specialties</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="">{service.yearsOfExperience} Years of Experience</Badge>
                  </div>
                  <h4 className="text-sm font-medium  mb-2">Style Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {service.styleSpecialty.map((style, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">{style}</Badge>
                    ))}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-lg font-semibold ">Session Duration & Pricing</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Duration</TableHead>
                        <TableHead>Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {service.sessionDurations.map((session, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{session.durationInHours} hr</TableCell>
                          <TableCell>₹{session.price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-lg font-semibold ">Equipment</h3>
                  <ul className="list-disc list-inside text-sm ">
                    {service.equipment.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-lg font-semibold ">Features</h3>
                  <ul className="list-disc list-inside text-sm ">
                    {service.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Right Column - Map and Additional Info */}
              <div className="space-y-6">
                <motion.div variants={itemVariants} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold ">Service Location</h3>
                  </div>
                  <div className=" rounded-xl overflow-hidden border">
                    <div className="h-[300px] w-full">
                      <LoadScript
                        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
                        loadingElement={
                          <div className="flex justify-center items-center h-full">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                          </div>
                        }
                      >
                        <GoogleMap
                          center={serviceLocation}
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
                          <Marker position={serviceLocation} />
                        </GoogleMap>
                      </LoadScript>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm ">
                    <MapPin size={16}/>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold ">Available Dates</h3>
                  </div>
                  {service.availableDates && service.availableDates.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead><Calendar size={14} className="mr-1 inline" /> Date</TableHead>
                          <TableHead><Clock size={14} className="mr-1 inline" /> Time Slots</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {service.availableDates.map((date, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{date.date}</TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {date.timeSlots.map((slot, slotIdx) => {
                                  // Helper to format "HH:mm" to "h:mm AM/PM"
                                  const formatTime = (timeStr: string) => {
                                    const [hour, minute] = timeStr.split(":").map(Number);
                                    const ampm = hour >= 12 ? "PM" : "AM";
                                    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
                                    return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
                                  };
                                  return (
                                    <div key={slotIdx} className="text-xs">
                                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)} ({slot.capacity} slots)
                                    </div>
                                  );
                                })}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-sm">No available dates.</p>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Policies and Terms */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold ">Policies & Terms</h3>
              </div>
              <div className=" rounded-xl p-6 space-y-4 border">
                <div>
                  <h4 className="text-md font-medium  mb-2">Cancellation Policies</h4>
                  <ul className="list-disc list-inside text-sm ">
                    {service.cancellationPolicies.map((policy, idx) => (
                      <li key={idx}>{policy}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-md font-medium  mb-2">Terms & Conditions</h4>
                  <ul className="list-disc list-inside text-sm ">
                    {service.termsAndConditions.map((term, idx) => (
                      <li key={idx}>{term}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </ScrollArea>

        <DialogFooter className="px-8 py-6 flex justify-end gap-3  border-t">
          <DialogClose asChild>
            <Button variant="outline">
              Close
            </Button>
          </DialogClose>
            {user.role !== 'vendor' && (
              <Link to={`/booking/${service._id}/${vendorId}`}>
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Book Now
                </Button>
              </Link>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};