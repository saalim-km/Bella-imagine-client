"use client"
import { useState } from "react"
import type { IServiceResponse } from "@/types/interfaces/vendor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Camera, Package } from "lucide-react"
import { useParams } from "react-router-dom"
import Pagination from "@/components/common/Pagination"
import { ServiceDetailsModal } from "@/components/modals/ServiceDetailsModal"
import { LoadingBar } from "@/components/ui/LoadBar"
import { VendorProfile } from "./VendorProfile"
import type { IBaseUser } from "@/types/interfaces/User"
import { useGetPhotographerDetailsVendor } from "@/hooks/vendor/useVendor"
import { useGetPhotographerDetailsClient } from "@/hooks/client/useClient"
import { Card } from "@/components/ui/card"
import { MasonryPortfolio } from "./WorkSample"
import { ServicesAccordion } from "./ServiceCard"

interface VendorDetails {
  user: IBaseUser
}

const VendorDetails = ({ user }: VendorDetails) => {
  const { id } = useParams() as { id: string }
  const [servicePage, setServicePage] = useState<number>(1)
  const [samplePage, setSamplePage] = useState<number>(1)
  const [selectedService, setSelectedService] = useState<IServiceResponse | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const sampleLimit = 2 // Increased for masonry display
  const serviceLimit = 2

  const {
    data: clientData,
    isLoading: isClientLoading,
    error: isClientError,
  } = useGetPhotographerDetailsClient(
    {
      sampleLimit: sampleLimit,
      samplePage: samplePage,
      serviceLimit: serviceLimit,
      servicePage: servicePage,
      enabled: user.role === "client",
    },
    id,
  )

  const {
    data: vendorData,
    isLoading: isVendorLoading,
    error: isVendorError,
  } = useGetPhotographerDetailsVendor(
    {
      sampleLimit: sampleLimit,
      samplePage: samplePage,
      serviceLimit: serviceLimit,
      servicePage: servicePage,
      enabled: user.role === "vendor",
    },
    id,
  )

  if (isClientLoading || isVendorLoading) {
    return <LoadingBar />
  }

  const vendorDetails = clientData?.data ? clientData.data : vendorData?.data

  if (!vendorDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <p className="text-destructive mb-4">An error occurred while fetching photographer details</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      </div>
    )
  }

  const handleViewServiceDetails = (service: IServiceResponse) => {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedService(null)
  }

  if (isClientError || isVendorError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <p className="text-destructive mb-4">An error occurred. Please try again later.</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Photographer Profile Section */}
      <VendorProfile vendor={vendorDetails} />

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <Tabs defaultValue="portfolio" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="bg-background border border-border rounded-lg p-1">
              <TabsTrigger
                value="portfolio"
                className="flex items-center gap-2 px-4 py-2 rounded-md data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 dark:data-[state=active]:bg-orange-900/30 dark:data-[state=active]:text-orange-300"
              >
                <Camera className="w-4 h-4" />
                <span className="font-medium">Portfolio</span>
              </TabsTrigger>
              <TabsTrigger
                value="services"
                className="flex items-center gap-2 px-6 py-3 rounded-md data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 dark:data-[state=active]:bg-orange-900/30 dark:data-[state=active]:text-orange-300"
              >
                <Package className="w-4 h-4" />
                <span className="font-medium">Services & Pricing</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Portfolio</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore our curated collection of wedding photography showcasing artistic vision, technical expertise,
                and creative storytelling.
              </p>
            </div>

            {vendorDetails.workSamples && vendorDetails.workSamples.length > 0 ? (
              <MasonryPortfolio workSamples={vendorDetails.workSamples} />
            ) : (
              <Card className="p-12 text-center bg-background">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">No Portfolio Available</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    This photographer hasn't uploaded any portfolio samples yet.
                  </p>
                </div>
              </Card>
            )}

            {vendorDetails.samplePagination &&
              vendorDetails.samplePagination.total > vendorDetails.samplePagination.limit && (
                <div className="flex justify-center pt-4">
                  <Pagination
                    totalPages={Math.ceil(vendorDetails.samplePagination.total / vendorDetails.samplePagination.limit)}
                    currentPage={vendorDetails.samplePagination.page}
                    onPageChange={(page: number) => setSamplePage(page)}
                  />
                </div>
              )}
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Services & Pricing</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover our photography services and packages, each designed to capture your special moments with
                professional excellence.
              </p>
            </div>

            <ServicesAccordion services={vendorDetails.services || []} onViewDetails={handleViewServiceDetails} />

            {vendorDetails.servicePagination &&
              vendorDetails.servicePagination.total > vendorDetails.servicePagination.limit && (
                <div className="flex justify-center pt-4">
                  <Pagination
                    totalPages={Math.ceil(
                      vendorDetails.servicePagination.total / vendorDetails.servicePagination.limit,
                    )}
                    currentPage={vendorDetails.servicePagination.page}
                    onPageChange={(page: number) => setServicePage(page)}
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
}

export default VendorDetails
