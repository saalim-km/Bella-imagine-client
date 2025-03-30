import { useState } from "react";
// import { mockVendor, mockServices, mockWorkSamples } from "@/data/mockData";
import VendorProfile from "../../components/User/vendor-details/VendorProfile";
// import ServiceCard from "@/components/ServiceCard";
// import WorkSampleGallery from "@/components/WorkSampleGallery";
// import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Camera, 
  Search, 
  SlidersHorizontal, 
  CheckSquare, 
  CalendarDays, 
  MessageCircle 
} from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/headers/Header";
import Footer from "@/components/common/Footer";
import { useParams } from "react-router-dom";

const VendorDetails = () => {
  const {id} = useParams()
  console.log('id kitti : ',id);
  return (
    <div>
      <Header/>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          {/* <VendorProfile vendor={} /> */}
        </div>
        
        {/* <Tabs defaultValue="services" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
            <TabsList className="h-10">
              <TabsTrigger value="services" className="flex items-center gap-2">
                <CheckSquare size={16} />
                <span>Services</span>
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="flex items-center gap-2">
                <Camera size={16} />
                <span>Work Samples</span>
              </TabsTrigger>
              <TabsTrigger value="availability" className="flex items-center gap-2">
                <CalendarDays size={16} />
                <span>Availability</span>
              </TabsTrigger>
            </TabsList>
            
            <Button 
              variant="outline" 
              onClick={}
              className="sm:self-end flex items-center gap-2"
            >
              <MessageCircle size={16} />
              Contact Vendor
            </Button>
          </div>
          
          <TabsContent value="services">
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle>Available Services</CardTitle>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        type="search"
                        placeholder="Search services..."
                        className="pl-8 w-full sm:w-[200px]"
                        value={searchQuery}
                        onChange={}
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal size={16} className="text-gray-500" />
                      <Select value={servicesSort} onValueChange={setServicesSort}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                          <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                          <SelectItem value="duration-low-high">Duration: Short to Long</SelectItem>
                          <SelectItem value="duration-high-low">Duration: Long to Short</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {searchQuery && (
                  <div className="mb-4">
                    <Badge variant="outline" className="gap-1 px-2 py-1">
                      <span>Search: {searchQuery}</span>
                      <button 
                        className="ml-1 text-gray-500 hover:text-gray-700"
                        onClick={() => setSearchQuery("")}
                      >
                        ×
                      </button>
                    </Badge>
                  </div>
                )}
                
                {sortedServices.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedServices.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        onBookNow={handleBookNow}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-700">No services found</h3>
                    <p className="text-gray-500 mt-2">
                      Try different search terms or clear your filters
                    </p>
                    {searchQuery && (
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setSearchQuery("")}
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="portfolio">
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle>Work Samples</CardTitle>
                  
                  <div>
                    {selectedTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm text-gray-500">Active filters:</span>
                        {selectedTags.map(tag => (
                          <Badge 
                            key={tag} 
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => handleTagClick(tag)}
                          >
                            {tag}
                            <span className="ml-1">×</span>
                          </Badge>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => setSelectedTags([])}
                        >
                          Clear all
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <WorkSampleGallery
                  workSamples={mockWorkSamples}
                  selectedTags={selectedTags}
                  onTagClick={handleTagClick}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="availability">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Check Availability & Book</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="mb-6">
                  <Select defaultValue={mockServices[0].id}>
                    <SelectTrigger className="w-full sm:w-[300px]">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockServices.map(service => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.serviceTitle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <AvailabilityCalendar service={mockServices[0]} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs> */}
        
        {/* Contact Vendor Dialog */}
        {/* <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Contact {mockVendor.name}</DialogTitle>
              <DialogDescription>
                Send a message to inquire about services or availability.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Your Name</label>
                <Input id="name" placeholder="Enter your name" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <Input id="subject" placeholder="What is this regarding?" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <textarea 
                  id="message" 
                  rows={4} 
                  className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Type your message here..."
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setContactDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleContactVendor}>
                  Send Message
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog> */}
      </div>
    </div>
  );
};

export default VendorDetails;
