import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Star, StarOff, Pencil, Trash2 } from "lucide-react";
import { BigModal } from "@/components/modals/BigModalReusable";
import { Badge } from "@/components/ui/badge";
import { DataTable, type ColumnDef } from "@/components/common/Table";
import { ReusableDropdown } from "@/components/common/ReusableDropdown";
import { ReusableAlertDialog } from "@/components/common/AlertDialogue";
import { Link } from "react-router-dom";
import { Community } from "@/types/interfaces/Community";
import {
  useDeleteCommunity,
  useGetlAllCommunity,
} from "@/hooks/community-contest/useCommunity";
import { toast } from "sonner";
import { handleError } from "@/utils/Error/error-handler.utils";

// Define the Community interface

export default function Communities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [communityToDelete, setCommunityToDelete] = useState<string | null>(
    null
  );
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 4;
  console.log("current page for fetching : ", currentPage);
  const {
    data,
    isLoading,
    refetch: refetchCommunities,
  } = useGetlAllCommunity({ page: currentPage, limit: itemsPerPage });
  const { mutate: deleteCommunity } = useDeleteCommunity();
  const communities = data?.data || [];
  const totalPages = Math.max(1, Math.ceil(data?.total! / itemsPerPage));

  const filteredCommunities = communities.filter((community: Community) =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (communityId: string) => {
    setCommunityToDelete(communityId);
    setDeleteDialogOpen(true);
  };

  const handleViewDetails = (community: Community) => {
    setSelectedCommunity(community);
    setViewDetailsOpen(true);
  };

  const handleDeleteCommunity = () => {
    deleteCommunity(communityToDelete as string, {
      onSuccess: (data) => {
        toast.success(data.message);
        setCommunityToDelete(null);
        refetchCommunities();
      },
      onError: (err) => {
        setCommunityToDelete(null);
        handleError(err);
      },
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  // Columns for All Communities Tab
  const allColumns: ColumnDef<Community>[] = [
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      cell: (community) => (
        <a
          href={`/communities/${community._id}`}
          className="hover:underline font-medium"
        >
          {community.name}
        </a>
      ),
    },
    {
      id: "members",
      header: "Members",
      accessorKey: "memberCount",
    },
    {
      id: "status",
      header: "Status",
      cell: (community) => (
        <Badge variant={community.isFeatured ? "secondary" : "outline"}>
          {community.isFeatured ? "Featured" : "Standard"}
        </Badge>
      ),
    },
    {
      id: "createdAt",
      header: "CreatedAt",
      cell: (community) => {
        const date = new Date(community.createdAt!).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "short",
            day: "numeric",
          }
        );

        return <Badge variant={"default"}>{date}</Badge>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: (community) => (
        <div className="flex justify-end">
          <ReusableDropdown
            actions={[
              { type: "label", label: "Actions" },
              {
                label: "View Details",
                onClick: () => handleViewDetails(community),
              },
              {
                label: "Edit",
                href: `/admin/community/edit/${community.slug}`,
                icon: <Pencil className="h-4 w-4" />,
              },
              {
                label: "Manage Members",
                href: `/communities/${community._id}/members`,
              },
              { type: "separator" },
              {
                label: "Delete",
                onClick: () => handleDeleteClick(community._id),
                danger: true,
                icon: <Trash2 className="h-4 w-4" />,
              },
            ]}
          />
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Communities</h1>
          <p className="text-muted-foreground">
            Manage photography communities on the platform
          </p>
        </div>
        <Link to={"/admin/community/new"}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Community
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search communities..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Communities</TabsTrigger>
        </TabsList>

        {/* All */}
        <TabsContent value="all" className="mt-4">
          <DataTable
            data={filteredCommunities}
            columns={allColumns}
            onPageChange={handlePageChange}
            isLoading={isLoading}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </TabsContent>
      </Tabs>

      {/* Delete Dialog */}
      <ReusableAlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setCommunityToDelete(null);
        }}
        onConfirm={handleDeleteCommunity}
        title="Delete Community"
        description="Are you sure you want to delete this community? This action cannot be undone and all community data will be
            permanently removed."
      />

      {/* View Details Big Modal */}
      <BigModal
        open={viewDetailsOpen}
        onOpenChange={setViewDetailsOpen}
        title={<>
          {selectedCommunity?.slug}
          <br/>
          <br/>
          {selectedCommunity?.name}
        </>}
      >
        {selectedCommunity && (
          <div className="space-y-6">
            {/* Images */}
            <div className="flex flex-col md:flex-row gap-4">
              {selectedCommunity.coverImage && (
                <img
                  src={selectedCommunity.coverImage}
                  alt="Cover"
                  className="w-full md:w-2/3 h-48 object-cover rounded-md"
                />
              )}
              {selectedCommunity.iconImage && (
                <img
                  src={selectedCommunity.iconImage}
                  alt="Icon"
                  className="w-24 h-24 rounded-full border p-1 bg-white"
                />
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Members</p>
                <p className="font-semibold">{selectedCommunity.memberCount}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Posts</p>
                <p className="font-semibold">{selectedCommunity.postCount}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Privacy</p>
                <Badge
                  variant={
                    selectedCommunity.isPrivate ? "destructive" : "outline"
                  }
                >
                  {selectedCommunity.isPrivate ? "Private" : "Public"}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Featured</p>
                <Badge
                  variant={selectedCommunity.isFeatured ? "default" : "outline"}
                >
                  {selectedCommunity.isFeatured ? "Yes" : "No"}
                </Badge>
              </div>
            </div>

            {/* Rules */}
            {selectedCommunity.rules && selectedCommunity.rules.length > 0 && (
              <div>
                <p className="font-semibold mb-2">Rules:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {selectedCommunity.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Timestamps */}
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                Created At:{" "}
                {selectedCommunity.createdAt &&
                  new Date(selectedCommunity.createdAt!).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
              </p>
              <p>
                Last Updated:{" "}
                {selectedCommunity.updatedAt &&
                  new Date(selectedCommunity.updatedAt!).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
              </p>
            </div>
          </div>
        )}
      </BigModal>
    </div>
  );
}
