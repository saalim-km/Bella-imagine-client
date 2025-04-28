"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  MoreHorizontal,
  Search,
  Star,
  StarOff,
  Pencil,
  Trash2,
} from "lucide-react";
import { fetchCommunities } from "@/lib/api";
import { BigModal } from "@/components/modals/BigModalReusable";
import { Badge } from "@/components/ui/badge";
import { DataTable, type ColumnDef } from "@/components/common/Table";
import { ReusableDropdown } from "@/components/common/ReusableDropdown";
import { ReusableAlertDialog } from "@/components/common/AlertDialogue";

// Define the Community interface
interface Community {
  _id: number;
  name: string;
  members: number;
  featured: boolean;
  created: string;
  description?: string;
  coverImageUrl?: string;
  iconImageUrl?: string;
  memberCount?: number;
  postCount?: number;
  isPrivate?: boolean;
  isFeatured?: boolean;
  rules?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export default function Communities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [communityToDelete, setCommunityToDelete] = useState<number | null>(
    null
  );
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null
  );

  const { data: communities = [], isLoading } = useQuery<Community[]>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  const filteredCommunities = communities.filter((community) =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (communityId: number) => {
    setCommunityToDelete(communityId);
    setDeleteDialogOpen(true);
  };

  const handleViewDetails = (community: Community) => {
    setSelectedCommunity(community);
    setViewDetailsOpen(true);
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
      accessorKey: "members",
    },
    {
      id: "status",
      header: "Status",
      cell: (community) => (
        <Badge variant={community.featured ? "default" : "outline"}>
          {community.featured ? "Featured" : "Standard"}
        </Badge>
      ),
    },
    {
      id: "created",
      header: "Created",
      accessorKey: "created",
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
                href: `/communities/${community._id}/edit`,
                icon: <Pencil className="h-4 w-4" />,
              },
              {
                label: "Manage Members",
                href: `/communities/${community._id}/members`,
              },
              { type: "separator" },
              {
                label: community.featured ? "Unfeature" : "Feature",
                onClick: () =>
                  console.log(community.featured ? "Unfeature" : "Feature"), // Replace with actual feature/unfeature logic
                icon: community.featured ? (
                  <StarOff className="h-4 w-4" />
                ) : (
                  <Star className="h-4 w-4" />
                ),
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

  // Columns for Featured Communities Tab
  const featuredColumns: ColumnDef<Community>[] = [
    {
      id: "name",
      header: "Name",
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
      accessorKey: "members",
    },
    {
      id: "featuredSince",
      header: "Featured Since",
      cell: () => "May 10, 2025",
    },
    {
      id: "order",
      header: "Order",
      cell: () => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8">
            ↑
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            ↓
          </Button>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: () => (
        <Button variant="ghost" size="sm">
          <StarOff className="mr-2 h-4 w-4" />
          Unfeature
        </Button>
      ),
    },
  ];

  // Columns for Newest Communities Tab
  const newestColumns: ColumnDef<Community>[] = [
    {
      id: "name",
      header: "Name",
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
      accessorKey: "members",
    },
    {
      id: "created",
      header: "Created",
      accessorKey: "created",
    },
    {
      id: "status",
      header: "Status",
      cell: () => <Badge variant="outline">New</Badge>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: () => (
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      ),
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
        <Button asChild>
          <a href="/communities/new" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            New Community
          </a>
        </Button>
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
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="newest">Newest</TabsTrigger>
        </TabsList>

        {/* All */}
        <TabsContent value="all" className="mt-4">
          <DataTable
            data={filteredCommunities}
            columns={allColumns}
            onPageChange={() => {}}
            isLoading={isLoading}
          />
        </TabsContent>

        {/* Featured */}
        <TabsContent value="featured" className="mt-4">
          <DataTable
            data={filteredCommunities.filter((c) => c.featured)}
            columns={featuredColumns}
            onPageChange={() => {}}
            isLoading={isLoading}
          />
        </TabsContent>

        {/* Newest */}
        <TabsContent value="newest" className="mt-4">
          <DataTable
            data={[...filteredCommunities]
              .sort(
                (a, b) =>
                  new Date(b.created).getTime() - new Date(a.created).getTime()
              )
              .slice(0, 5)}
            columns={newestColumns}
            onPageChange={() => {}}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>

      {/* Delete Dialog */}
      <ReusableAlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={() => console.log("trigger community delete")}
        title="Delete Community"
        description="Are you sure you want to delete this community? This action cannot be undone and all community data will be
            permanently removed."
      />

      {/* View Details Big Modal */}
      <BigModal
        open={viewDetailsOpen}
        onOpenChange={setViewDetailsOpen}
        title={selectedCommunity?.name || "Community Details"}
        description={selectedCommunity?.description || ""}
      >
        {selectedCommunity && (
          <div className="space-y-6">
            {/* Images */}
            <div className="flex flex-col md:flex-row gap-4">
              {selectedCommunity.coverImageUrl && (
                <img
                  src={selectedCommunity.coverImageUrl}
                  alt="Cover"
                  className="w-full md:w-2/3 h-48 object-cover rounded-md"
                />
              )}
              {selectedCommunity.iconImageUrl && (
                <img
                  src={selectedCommunity.iconImageUrl}
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
                  new Date(selectedCommunity.createdAt).toLocaleDateString()}
              </p>
              <p>
                Last Updated:{" "}
                {selectedCommunity.updatedAt &&
                  new Date(selectedCommunity.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </BigModal>


    </div>
  );
}
