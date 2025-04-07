import VendorProfile from "../../components/User/vendor-details/VendorProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookImageIcon,
  Camera, 
  CheckSquare, 
  MessageCircle 
} from "lucide-react";
import Header from "@/components/headers/Header";
import { Link, useParams } from "react-router-dom";
import { useGetPhotographerDetails } from "@/hooks/client/useClient";
import { Spinner } from "@/components/ui/spinner";
import ServiceCard from "@/components/User/vendor-details/ServiceCard";
import WorkSample from "@/components/User/vendor-details/WorkSample";
import Pagination from "@/components/common/Pagination";

const VendorDetails = () => {
  const {id} = useParams()
  const {data : vendor , isLoading , error} = useGetPhotographerDetails(id || '')  

  console.log(vendor);
  if(isLoading) {
    return <Spinner/>
  }

  if(!vendor) {
    return <div>An error occured please try again later</div>
  }
  return (
    <div>
      <Header/>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 mt-24">
        <div className="mb-8">
          <VendorProfile vendor={vendor} />
        </div>
        
        <Tabs defaultValue="services" className="space-y-6">
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
            </TabsList>
          </div>
          
          <TabsContent value="services">
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle>Available Services</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vendor.services.map((service) => (
                      <ServiceCard
                        vendorId={id || ''}
                        key={service._id}
                        service={service}
                      />
                    ))}
                  </div>
                <Pagination totalPages={3} currentPage={1} onPageChange={()=> console.log('page changed')}/>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="portfolio">
            <Card className="shadow-sm">
              <CardHeader>
                <div className="">
                  <CardTitle>Work Samples</CardTitle>
                    {vendor.workSamples.map((work,indx)=> (
                      <WorkSample workSample={work} key={indx}/>
                    ))}
                </div>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VendorDetails;
