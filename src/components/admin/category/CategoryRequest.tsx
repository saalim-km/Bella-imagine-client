import { useGetAllCategoryRequest, useUpdateCategoryRequest } from "@/hooks/admin/useAllCategory";
import { DataTable, ColumnDef } from "@/components/common/Table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { handleError } from "@/utils/Error/errorHandler";
import { Badge } from "@/components/ui/badge";

const CategoryRequest = () => {
  const { data, isLoading, refetch } = useGetAllCategoryRequest();
  const { mutate: updateRequest } = useUpdateCategoryRequest();

  const handleApprove = (categoryId: string, vendorId: string) => {
    updateRequest(
      { vendorId, categoryId, status: "approved" },
      {
        onSuccess: (data) => {
          refetch();
          toast.success(data.message);
        },
        onError: (err) => {
          handleError(err);
        },
      }
    );
  };

  const handleReject = (categoryId: string, vendorId: string) => {
    updateRequest(
      { vendorId, categoryId, status: "rejected" },
      {
        onSuccess: (data) => {
          refetch();
          toast.success(data.message);
        },
        onError: (err) => {
          handleError(err);
        },
      }
    );
  };

  const categoryRequests = data?.categoryRequest ?? [];

  const columns: ColumnDef<any>[] = [
    {
      id: "vendor",
      header: "Vendor",
      cell: (row) => row.vendorId?.name || "N/A",
    },
    {
      id: "email",
      header: "Email",
      cell: (row) => row.vendorId?.email || "N/A",
    },
    {
      id: "category",
      header: "Category",
      cell: (row) => row.categoryId?.title || "N/A",
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Badge
          className={`${
            row.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : row.status === "approved"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) =>
        row.status === "pending" && (
          <div className="flex gap-2">
            <Button variant="default" onClick={() => handleApprove(row.categoryId._id, row.vendorId._id)}>
              Approve
            </Button>
            <Button variant="destructive" onClick={() => handleReject(row.categoryId._id, row.vendorId._id)}>
              Reject
            </Button>
          </div>
        ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Category Join Requests</h2>
      <DataTable data={categoryRequests} columns={columns} isLoading={isLoading} />
    </div>
  );
};

export default CategoryRequest;
