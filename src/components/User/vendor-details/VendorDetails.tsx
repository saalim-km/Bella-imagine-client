"use client"

import { useState } from "react"
import type { IServiceResponse, IWorkSampleResponse } from "@/types/interfaces/vendor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Camera, CheckSquare, Grid3X3, List } from "lucide-react"
import { useParams } from "react-router-dom"
import ServiceCard from "@/components/User/vendor-details/ServiceCard"
import Pagination from "@/components/common/Pagination"
import { ServiceDetailsModal } from "@/components/modals/ServiceDetailsModal"
import WorkSample from "@/components/User/vendor-details/WorkSample"
import { LoadingBar } from "@/components/ui/LoadBar"
import { VendorProfile } from "./VendorProfile"
import type { IBaseUser } from "@/types/interfaces/User"
import { useGetPhotographerDetailsVendor } from "@/hooks/vendor/useVendor"
import { useGetPhotographerDetailsClient } from "@/hooks/client/useClient"
import { Card } from "@/components/ui/card"

interface VendorDetails {
  user: IBaseUser
}

const VendorDetails = ({ user }: VendorDetails) => {
  const { id } = useParams() as { id: string }
  const [servicePage, setServicePage] = useState<number>(1)
  const [samplePage, setSamplePage] = useState<number>(1)
  const [selectedService, setSelectedService] = useState<IServiceResponse | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [portfolioView, setPortfolioView] = useState<"grid" | "list">("grid")

  const sampleLimit = 2
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Photographer Profile Section */}
        <section className="mb-8">
          <VendorProfile vendor={vendorDetails} />
        </section>

        {/* Tabs for Services and Portfolio */}
        <Tabs defaultValue="services" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <TabsList className="bg-background border border-border rounded-lg p-1 w-fit">
              <TabsTrigger
                value="services"
                className="flex items-center gap-2 px-4 py-2 rounded-md data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 dark:data-[state=active]:bg-orange-900/30 dark:data-[state=active]:text-orange-300"
              >
                <CheckSquare className="w-4 h-4" />
                <span className="text-sm font-medium">Services</span>
              </TabsTrigger>
              <TabsTrigger
                value="portfolio"
                className="flex items-center gap-2 px-4 py-2 rounded-md data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 dark:data-[state=active]:bg-orange-900/30 dark:data-[state=active]:text-orange-300"
              >
                <Camera className="w-4 h-4" />
                <span className="text-sm font-medium">Portfolio</span>
              </TabsTrigger>
            </TabsList>

            {/* Portfolio View Toggle - Only show on portfolio tab */}
            <div className="flex items-center gap-2">
              <Button
                variant={portfolioView === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setPortfolioView("grid")}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={portfolioView === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setPortfolioView("list")}
                className="h-8 w-8 p-0"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Services & Packages</h2>
              <p className="text-muted-foreground">
                Explore our photography services, each tailored to capture your special moments with artistic precision.
              </p>
            </div>

            {vendorDetails.services?.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {vendorDetails.services.map((service: any) => (
                  <ServiceCard
                    key={service._id}
                    service={service}
                    onViewDetails={handleViewServiceDetails}
                    workSample={vendorDetails.workSamples[0]}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center bg-background">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <CheckSquare className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">No Services Available</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    This photographer hasn't added any services yet. Contact them directly for custom packages.
                  </p>
                  <Button variant="outline">Contact Photographer</Button>
                </div>
              </Card>
            )}

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

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Portfolio</h2>
              <p className="text-muted-foreground">
                A curated collection showcasing artistic vision, technical expertise, and creative style.
              </p>
            </div>

            {vendorDetails.workSamples && vendorDetails.workSamples.length > 0 ? (
              <div
                className={
                  portfolioView === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-6"
                }
              >
                {vendorDetails.workSamples.map((work: IWorkSampleResponse, idx: number) => (
                  <WorkSample key={idx} workSample={work} viewMode={portfolioView} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center bg-background">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">No Portfolio Available</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    This photographer hasn't uploaded any portfolio samples yet. Check back later or contact them
                    directly.
                  </p>
                  <Button variant="outline">Contact Photographer</Button>
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
