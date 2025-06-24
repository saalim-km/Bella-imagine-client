import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Filter } from "lucide-react";
import Pagination from "../common/Pagination";
import { useAllVendorWorkSample, useDeleteWorkSample, useVendorServices } from "@/hooks/vendor/useVendor";
import { IWorkSampleResponse } from "@/types/interfaces/vendor";
import { Spinner } from "../ui/spinner";
import { Badge } from "../ui/badge";
import { ReusableAlertDialog } from "../common/AlertDialogue";
import { toast } from "sonner";
import { handleError } from "@/utils/Error/error-handler.utils";

interface IVendorWorkSamplePageProps {
  handleIsCreateWorkSample(): void;
  handleIsWorkSampleEditing(workSample : IWorkSampleResponse): void;
}

const VendorWorkSample = ({ handleIsCreateWorkSample , handleIsWorkSampleEditing }: IVendorWorkSamplePageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const [filters, setFilters] = useState({ service: "", tags: "", isPublished: "" });
  const [appliedFilters, setAppliedFilters] = useState({ service: "", tags: "", isPublished: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [worksampleId , setWorkSampleId] = useState('');
  const [isWorkSampleDelete , setIsWorkSampleDelete] = useState(false);

  const { data: services } = useVendorServices({ page: 1, limit: 20 });

  const queryFilters = {
    title: appliedSearchTerm, 
    service: appliedFilters.service,
    tags: appliedFilters.tags ? appliedFilters.tags.split(",").map(tag => tag.trim()) : undefined,
    isPublished: appliedFilters.isPublished ? appliedFilters.isPublished === "true" : undefined,
    page: currentPage,
    limit: 3,
  };

  const { data, isLoading, error , refetch} = useAllVendorWorkSample(queryFilters);
  const {mutate : deleteWorkSample} = useDeleteWorkSample()
  
  const handleSearch = () => {
    setAppliedSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleWorkSampleDelete = (id : string)=> {
    setIsWorkSampleDelete(true);
    setWorkSampleId(id);
  }

  const handleOnSuccessDeleteWorkSample = ()=> {
    console.log('trigger success delete work sample',worksampleId);
    setIsWorkSampleDelete(!isWorkSampleDelete);
    deleteWorkSample(worksampleId,{
      onSuccess : (data)=> {
        toast.success(data.message);
        refetch()
      },
      onError : (err)=> {
        handleError(err)
      }
    })
  }

  const handleOnCancelWorkSample = ()=> {
    setIsWorkSampleDelete(!isWorkSampleDelete);
    setWorkSampleId('');
  }

  const workSamples: IWorkSampleResponse[] = data?.data.data || [];
  const totalPages = Math.max(1, Math.ceil((data?.data.total || 0) / 3));


  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Work Samples</h1>
        <Button variant="outline" onClick={handleIsCreateWorkSample}>
          Create New Work Sample
        </Button>
      </div>

      <div className="mb-6 flex space-x-4">
        <div className="flex-grow flex">
          <Input
            placeholder="Search work samples..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e)=> {
              if(e.key === "Enter"){
                handleSearch()
              }
            }}
          />
          <Button variant="outline" className="ml-2" onClick={handleSearch} disabled={isLoading}>
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
              <DialogTitle>Filter Work Samples</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <label className="block mb-2">Service</label>
                <Select
                  value={filters.service}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, service: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services?.data?.data.map((service) => (
                      <SelectItem key={service._id} value={service._id || ""}>
                        {service.serviceTitle || "Untitled Service"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block mb-2">Status</label>
                <Select
                  value={filters.isPublished}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, isPublished: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Published</SelectItem>
                    <SelectItem value="false">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={applyFilters}>
                <Search className="mr-2 h-4 w-4" /> Apply Filters
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <Spinner />
      ) : error ? (
        <div className="text-center py-10 text-red-500">Error: {error.message}</div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workSamples.map((sample) => (
              <Card key={sample._id} className="hover:shadow-lg transition-shadow">
                <Badge
                  variant="outline"
                  className={`
                    relative top-2 left-3 
                    ${sample.isPublished 
                      ? "bg-green-500 text-white border-green-600" 
                      : "bg-yellow-300 text-gray-800 border-yellow-400"
                    }
                  `}
                >
                  {sample.isPublished ? "Published" : "Draft"}
                </Badge>
                <CardHeader>
                  <CardTitle>{sample.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {sample.media.length > 0 ? (
                    <img
                      src={sample.media[0]}
                      alt={sample.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                      No Image
                    </div>
                  )}
                  <p className="text-muted-foreground mb-2">
                    {sample.description || "No description available"}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">Service: {sample.service?.serviceTitle || "N/A"}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex space-x-2">
                    {(sample.tags || []).slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-secondary-foreground px-2 py-1 rounded-full text-xs border-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={()=> handleIsWorkSampleEditing(sample)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={()=> handleWorkSampleDelete(sample._id|| '')}>
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {workSamples.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              No work samples found
            </div>
          )}

          <Pagination
            onPageChange={handlePageChange}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </>
      )}
      <ReusableAlertDialog confirmLabel="Delete" onCancel={handleOnCancelWorkSample} onConfirm={handleOnSuccessDeleteWorkSample} open = {isWorkSampleDelete} confirmVariant="destructive"/>
    </div>
  );
};

export default VendorWorkSample;