import { useState } from "react";
import { IService, IServiceResponse, IVendorDetails, IWorkSampleResponse } from "@/types/interfaces/vendor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button";
import { Camera, CheckSquare } from "lucide-react";
import { useParams } from "react-router-dom";
import { useGetPhotographerDetails } from "@/hooks/client/useClient";
import { Spinner } from "@/components/ui/spinner";
import ServiceCard from "@/components/User/vendor-details/ServiceCard";
import Pagination from "@/components/common/Pagination";
import { ServiceDetailsModal } from "@/components/modals/ServiceDetailsModal";
import WorkSample from "@/components/User/vendor-details/WorkSample";
import VendorProfile from "./VendorProfile";

const VendorDetails = () => {
 const { id } = useParams() as { id: string }
  const [servicePage, setServicePage] = useState<number>(1)
  const [samplePage, setSamplePage] = useState<number>(1)
  const [selectedService, setSelectedService] = useState<IServiceResponse | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  let sampleLimit = 3;
  let serviceLimit = 3;
  const { data: vendor, isLoading, error } = useGetPhotographerDetails({sampleLimit : sampleLimit , samplePage : samplePage , serviceLimit : serviceLimit , servicePage : servicePage} , id)

  if(!vendor){
    return (
      <p>Vendor not found please try again later</p>
    )
  }

  const vendorDetails =  vendor.data
  console.log(vendorDetails);
  const handleViewServiceDetails = (service: IServiceResponse) => {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedService(null)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    )
  }

  if (error || !vendor) {
    return (
      <div className="flex justify-center items-center h-screen text-foreground">
        An error occurred. Please try again later.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-16 pt-32">
        {/* Photographer Profile Section */}
        <section className="mb-16">
          <VendorProfile vendor={vendorDetails} />
        </section>

        {/* Tabs for Services and Portfolio */}
        <Tabs defaultValue="services" className="space-y-12">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <TabsList className="h-14 bg-muted/30 border border-border/10 rounded-full p-1">
              <TabsTrigger
                value="services"
                className="flex items-center gap-2 px-6 py-2.5 rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                <CheckSquare size={18} />
                <span className="text-sm uppercase tracking-wider">Services</span>
              </TabsTrigger>
              <TabsTrigger
                value="portfolio"
                className="flex items-center gap-2 px-6 py-2.5 rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                <Camera size={18} />
                <span className="text-sm uppercase tracking-wider">Portfolio</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-2"
            >
              <h2 className="font-serif text-3xl text-foreground">Services</h2>
              <p className="text-muted-foreground max-w-2xl">
                Explore the range of photography services offered, each tailored to capture your special moments with
                artistic precision.
              </p>
            </motion.div>

            {vendorDetails.services?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {vendorDetails.services.map((service: any) => (
                  <ServiceCard key={service._id} service={service} onViewDetails={handleViewServiceDetails} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 border border-border/10 rounded-lg bg-muted/5">
                <p className="text-muted-foreground text-center mb-4">No services available at the moment.</p>
                <Button variant="outline">Contact Photographer</Button>
              </div>
            )}

            {vendorDetails.servicePagination && vendorDetails.servicePagination.total > vendorDetails.servicePagination.limit && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  totalPages={Math.ceil(vendorDetails.servicePagination.total / vendorDetails.servicePagination.limit)}
                  currentPage={vendorDetails.servicePagination.page}
                  onPageChange={(page: number) => setServicePage(page)}
                />
              </div>
            )}
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-2"
            >
              <h2 className="font-serif text-3xl text-foreground">Portfolio</h2>
              <p className="text-muted-foreground max-w-2xl">
                A curated collection of work showcasing the photographer's style, expertise, and artistic vision.
              </p>
            </motion.div>

            {vendorDetails && vendorDetails.workSamples.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {vendorDetails.workSamples.map((work: IWorkSampleResponse, idx: number) => (
                  <WorkSample workSample={work} key={idx} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 border border-border/10 rounded-lg bg-muted/5">
                <p className="text-muted-foreground text-center mb-4">No portfolio samples available.</p>
                <Button variant="outline">Contact Photographer</Button>
              </div>
            )}

            {vendorDetails.samplePagination && vendorDetails.samplePagination.total > vendorDetails.samplePagination.limit && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  totalPages={Math.ceil(vendorDetails.samplePagination.total / vendorDetails.samplePagination.limit)}
                  currentPage={vendorDetails.samplePagination.page}
                  onPageChange={(page: number) => setSamplePage(page)}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Service Details Modal */}
        {selectedService && (
          <ServiceDetailsModal
            service={selectedService}
            vendorId={id || ""}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  )
};

export default VendorDetails;