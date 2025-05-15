import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Filter } from "lucide-react";
import Pagination from "../common/Pagination";
import { useAllVendorCategoryQuery, useVendorServices } from "@/hooks/vendor/useVendor";
import { IService, IServiceResponse } from "@/types/interfaces/vendor";
import { Spinner } from "../ui/spinner";
import { Badge } from "../ui/badge";

interface IVendorServicesPageProps {
  handleIsCreateService(): void;
  handleIsEditingService(data : IServiceResponse) : void;
}

const VendorServicesPage = ({ handleIsCreateService , handleIsEditingService}: IVendorServicesPageProps) => {
  const {data : categories } = useAllVendorCategoryQuery();
  console.log('categoriees : ',categories);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const [filters, setFilters] = useState({ category: "", location: "" });
  const [appliedFilters, setAppliedFilters] = useState({ category: "", location: "" });
  const [currentPage, setCurrentPage] = useState(1);

  const queryFilters = {
    serviceTitle: appliedSearchTerm,
    category: appliedFilters.category,
    location: appliedFilters.location,
    page: currentPage,
    limit: 3,
  };

  const { data, isLoading, error } = useVendorServices(queryFilters);

  const handleSearch = () => {
    setAppliedSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const services: IServiceResponse[] = data?.data || [];
  const totalPages = Math.max(1, Math.ceil((data?.total || 0) / 3));
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Services</h1>
        <Button variant={"outline"} onClick={handleIsCreateService}>Create new service</Button>
      </div>

      <div className="mb-6 flex space-x-4">
        <div className="flex-grow flex">
          <Input placeholder="Search services..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) =>{
            if(e.key === "Enter") {
              handleSearch()
            }
          }}/>
          <Button variant={"outline"} className="ml-2" onClick={handleSearch} disabled={isLoading}>
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filter Services</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <label className="block mb-2">Category</label>
                <Select value={filters.category} onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      categories && categories.categories.map((category)=> (
                        <SelectItem value={category._id}>{category.title}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block mb-2">Location</label>
                <Input placeholder="City or State" value={filters.location} onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant={"outline"} onClick={applyFilters}>
                <Search className="mr-2 h-4 w-4" /> Apply Filters
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <Spinner/>
      ) : error ? (
        <div className="text-center py-10 text-red-500">Error: {error.message}</div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service._id} className="hover:shadow-lg transition-shadow">
                  <Badge
                    variant="outline"
                    className={`
                      relative top-2 left-3 
                      ${service.isPublished 
                        ? "bg-green-500 text-white border-green-600" 
                        : "bg-yellow-300 text-gray-800 border-yellow-400"
                      }
                    `}
                  >
                    {service.isPublished ? "Published" : "Draft"}
                  </Badge>
                <CardHeader>
                  <CardTitle>{service.serviceTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">{service.serviceDescription || "No description available"}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">Category: {service.category?.title.toString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold ">From ₹{service.sessionDurations[0]?.price || "N/A"}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex space-x-2">
                    {(service.tags || []).slice(0, 2).map((tag) => (
                      <span key={tag} className=" text-secondary-foreground px-2 py-1 rounded-full text-xs border-2">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" onClick={()=> handleIsEditingService(service)}>Edit</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          {services.length === 0 && <div className="text-center py-10 text-muted-foreground">No services found. Try adjusting your search or filters.</div>}

          <Pagination onPageChange={handlePageChange} currentPage={currentPage} totalPages={totalPages} />
        </>
      )}
    </div>
  );
};

export default VendorServicesPage;