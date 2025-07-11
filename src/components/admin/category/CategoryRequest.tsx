import {
  useGetAllCategoryRequest,
  useUpdateCategoryRequest,
} from "@/hooks/admin/useAllCategory";
import { DataTable, ColumnDef } from "@/components/common/Table";
import { Button } from "@/components/ui/button";
import { handleError } from "@/utils/Error/error-handler.utils";
import { Badge } from "@/components/ui/badge";
import { ICategoryRequest } from "@/services/categories/categoryService";
import { useState } from "react";
import { communityToast } from "@/components/ui/community-toast";
import { useQueryClient } from "@tanstack/react-query";

const CategoryRequest = () => {
  const [currPage, setCurrPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useGetAllCategoryRequest({
    limit: 5,
    page: currPage,
  });
  const { mutate: updateRequest } = useUpdateCategoryRequest();

  const handleApprove = async (categoryId: string, vendorId: string) => {
    const queryKey = ["category-request", { page: currPage, limit: 5 }];

    await queryClient.cancelQueries({ queryKey: queryKey });
    const prevData = queryClient.getQueryData(queryKey);
    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (!oldData) return oldData;

      const updatedDocs = oldData.data.data.map((catReq: ICategoryRequest) => {
        const isMatching =
          catReq.categoryId?._id === categoryId &&
          catReq.vendorId?._id === vendorId;

        return isMatching ? { ...catReq, status: "approved" } : catReq;
      });

      return {
        ...oldData,
        data: {
          ...oldData.data,
          data: updatedDocs,
        },
      };
    });
    updateRequest(
      { vendorId, categoryId, status: "approved" },
      {
        onSuccess: (data) => {
          communityToast.success({ description: data?.message });
        },
        onError: (err) => {
          queryClient.setQueryData(queryKey, prevData);
          handleError(err);
        },
      }
    );
  };

  const handleReject = async (categoryId: string, vendorId: string) => {
    const queryKey = ["category-request", { page: currPage, limit: 5 }];

    await queryClient.cancelQueries({ queryKey: queryKey });
    const prevData = queryClient.getQueryData(queryKey);

    console.log("got the prev data", prevData);
    queryClient.setQueryData(queryKey, (oldData: any) => {
      console.log("old data😌😌", oldData);
      if (!oldData) return oldData;

      const updatedDocs = oldData.data.data.map((catReq: ICategoryRequest) => {
        const isMatching =
          catReq.categoryId?._id === categoryId &&
          catReq.vendorId?._id === vendorId;

        return isMatching ? { ...catReq, status: "rejected" } : catReq;
      });

      return {
        ...oldData,
        data: {
          ...oldData.data,
          data: updatedDocs,
        },
      };
    });
    updateRequest(
      { vendorId, categoryId, status: "rejected" },
      {
        onSuccess: (data) => {
          communityToast.success({ description: data?.message });
        },
        onError: (err) => {
          queryClient.setQueryData(queryKey, prevData);
          handleError(err);
        },
      }
    );
  };

  const categoryRequests = data?.data.data;
  const totalRequests = data?.data.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalRequests / 5));

  const handlePageChange = (newPage: number) => {
    if (data && newPage > 0 && newPage <= data.data.total) {
      setCurrPage(newPage);
    }
  };

  const columns: ColumnDef<ICategoryRequest>[] = [
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
            <Button
              variant="outline"
              onClick={() =>
                handleApprove(row.categoryId._id!, row.vendorId._id!)
              }
            >
              Approve
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                handleReject(row.categoryId._id!, row.vendorId._id!)
              }
            >
              Reject
            </Button>
          </div>
        ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Category Join Requests</h2>
      <DataTable
        data={categoryRequests as unknown as ICategoryRequest[]}
        columns={columns}
        totalPages={totalPages}
        currentPage={currPage}
        isLoading={isLoading}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default CategoryRequest;
