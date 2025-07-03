import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Search, Filter, ImageIcon } from "lucide-react";
import Pagination from "../common/Pagination";
import { useAllVendorWorkSample, useDeleteWorkSample, useVendorServices } from "@/hooks/vendor/useVendor";
import { IWorkSampleResponse } from "@/types/interfaces/vendor";
import { Spinner } from "../ui/spinner";
import { ReusableAlertDialog } from "../common/AlertDialogue";
import { toast } from "sonner";
import { handleError } from "@/utils/Error/error-handler.utils";
import { communityToast } from "../ui/community-toast";
import WorkSampleCard from "./work-sample/WorkSampleCard"; // Make sure the path is correct
import { Badge } from "../ui/badge";

interface IVendorWorkSamplePageProps {
  handleIsCreateWorkSample(): void;
  handleIsWorkSampleEditing(workSample: IWorkSampleResponse): void;
}

const VendorWorkSample = ({ handleIsCreateWorkSample, handleIsWorkSampleEditing }: IVendorWorkSamplePageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    service: "",
    isPublished: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [worksampleId, setWorkSampleId] = useState('');
  const [isWorkSampleDelete, setIsWorkSampleDelete] = useState(false);

  const { data: services } = useVendorServices({ page: 1, limit: 20 });

  const queryFilters = {
    title: searchTerm,
    service: filters.service,
    isPublished: filters.isPublished !== "" ? filters.isPublished === "true" : undefined,
    page: currentPage,
    limit: 3,
  };

  const { data, isLoading, error, refetch } = useAllVendorWorkSample(queryFilters);
  const { mutate: deleteWorkSample } = useDeleteWorkSample();
  
  const handleSearch = () => {
    setCurrentPage(1);
    refetch();
  };

  const applyFilters = () => {
    setCurrentPage(1);
    refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleWorkSampleDelete = (id: string) => {
    setIsWorkSampleDelete(true);
    setWorkSampleId(id);
  };

  const handleOnSuccessDeleteWorkSample = () => {
    if (!worksampleId) {
      toast.error("Work sample ID is required");
      setIsWorkSampleDelete(false);
      return;
    }
    deleteWorkSample(worksampleId, {
      onSuccess: (data) => {
        communityToast.success({ title: data?.message });
        refetch();
      },
      onError: (err) => {
        handleError(err);
      },
    });
    setIsWorkSampleDelete(false);
  };

  const handleOnCancelWorkSample = () => {
    setIsWorkSampleDelete(false);
    setWorkSampleId('');
  };

  const resetFilters = () => {
    setFilters({
      service: "",
      isPublished: ""
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
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
              <DialogDescription>
                Narrow down your work samples by service or status
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <label className="block mb-2">Service</label>
                <Select
                  value={filters.service}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, service: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services?.data?.data.map((service) => (
                      <SelectItem 
                        key={service._id} 
                        value={service._id || "undefined"}
                        disabled={!service._id}
                      >
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
                  onValueChange={(value) => setFilters(prev => ({ ...prev, isPublished: value }))}
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
            <div className="flex justify-between">
              <Button variant="ghost" onClick={resetFilters}>
                Reset Filters
              </Button>
              <Button onClick={applyFilters}>
                Apply Filters
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter indicators */}
      {(filters.service || filters.isPublished || searchTerm) && (
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchTerm && (
            <Badge variant="outline" className="text-sm">
              Search: "{searchTerm}"
            </Badge>
          )}
          {filters.service && (
            <Badge variant="outline" className="text-sm">
              Service: {services?.data?.data.find(s => s._id === filters.service)?.serviceTitle || filters.service}
            </Badge>
          )}
          {filters.isPublished && (
            <Badge variant="outline" className="text-sm">
              Status: {filters.isPublished === "true" ? "Published" : "Draft"}
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Clear all
          </Button>
        </div>
      )}

      {isLoading ? (
        <Spinner />
      ) : error ? (
        <div className="text-center py-10 text-red-500">Error: {error.message}</div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workSamples.map((sample) => (
              <WorkSampleCard
                key={sample._id}
                workSample={sample}
                onEdit={() => handleIsWorkSampleEditing(sample)}
                onDelete={() => handleWorkSampleDelete(sample._id || '')}
              />
            ))}
          </div>

          {workSamples.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-1">No work samples found</h3>
              <p className="text-sm">
                Try adjusting your search or filters, or create a new work sample
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleIsCreateWorkSample}
              >
                Create New Work Sample
              </Button>
            </div>
          )}

          <Pagination
            onPageChange={handlePageChange}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </>
      )}
      <ReusableAlertDialog 
        confirmLabel="Delete" 
        onCancel={handleOnCancelWorkSample} 
        onConfirm={handleOnSuccessDeleteWorkSample} 
        open={isWorkSampleDelete} 
        confirmVariant="destructive"
      />
    </div>
  );
};

export default VendorWorkSample;