import React, { useState } from "react";
import { IVendorDetails, IServiceResponse } from "@/types/vendor";
import VendorProfile from "../../components/User/vendor-details/VendorProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, CheckSquare } from "lucide-react";
import Header from "@/components/headers/Header";
import { useParams } from "react-router-dom";
import { useGetPhotographerDetails } from "@/hooks/client/useClient";
import { Spinner } from "@/components/ui/spinner";
import ServiceCard from "@/components/User/vendor-details/ServiceCard";
import WorkSample from "@/components/User/vendor-details/WorkSample";
import Pagination from "@/components/common/Pagination";
import { ServiceDetailsModal } from "@/components/modals/ServiceDetailsModal";

const VendorDetails = () => {
  const [servicePage, setServicePage] = useState<number>(1);
  const [samplePage, setSamplePage] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<IServiceResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { id } = useParams<{ id: string }>();
  const { data: vendor, isLoading, error } = useGetPhotographerDetails(id!, servicePage, samplePage);

  const vendorDetails = vendor as unknown as IVendorDetails;

  const handleViewServiceDetails = (service: IServiceResponse) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error || !vendor) {
    return <div className="flex justify-center items-center h-screen">An error occurred. Please try again later.</div>;
  }

  return (
    <div className=" min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 mt-24">
        {/* Vendor Profile Section */}
        <section className="mb-12">
          <VendorProfile vendor={vendorDetails} />
        </section>

        {/* Tabs for Services and Portfolio */}
        <Tabs defaultValue="services" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <TabsList className="h-12  shadow-sm rounded-lg">
              <TabsTrigger
                value="services"
                className="flex items-center gap-2 px-4 py-2"
              >
                <CheckSquare size={18} />
                <span>Services</span>
              </TabsTrigger>
              <TabsTrigger
                value="portfolio"
                className="flex items-center gap-2 px-4 py-2"
              >
                <Camera size={18} />
                <span>Work Samples</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card className="shadow-md rounded-lg ">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold ">Available Services</CardTitle>
              </CardHeader>
              <CardContent>
                {vendor.services?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vendor.services.map((service: IServiceResponse) => (
                      <ServiceCard
                        key={service._id}
                        service={service}
                        onViewDetails={handleViewServiceDetails}
                      />
                    ))}
                  </div>
                ) : (
                  <p className=" text-center py-4">No services available at the moment.</p>
                )}

                {vendorDetails.servicePagination && vendorDetails.servicePagination.total > vendorDetails.servicePagination.limit && (
                  <div className="mt-8">
                    <Pagination
                      totalPages={Math.ceil(vendorDetails.servicePagination.total / vendorDetails.servicePagination.limit)}
                      currentPage={vendorDetails.servicePagination.page}
                      onPageChange={(page: number) => setServicePage(page)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio">
            <Card className="shadow-md rounded-lg ">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold ">Work Samples</CardTitle>
              </CardHeader>
              <CardContent>
                {vendor.workSamples && vendor.workSamples.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vendor.workSamples.map((work: any, idx: number) => (
                      <WorkSample workSample={work} key={idx} />
                    ))}
                  </div>
                ) : (
                  <p className=" text-center py-4">No work samples available.</p>
                )}

                {vendorDetails.samplePagination && vendorDetails.samplePagination.total > vendorDetails.samplePagination.limit && (
                  <div className="mt-8">
                    <Pagination
                      totalPages={Math.ceil(vendorDetails.samplePagination.total / vendorDetails.samplePagination.limit)}
                      currentPage={vendorDetails.samplePagination.page}
                      onPageChange={(page: number) => setSamplePage(page)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
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
  );
};

export default VendorDetails;