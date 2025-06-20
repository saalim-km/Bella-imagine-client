import { useState, useMemo, useCallback } from "react";
import { debounce } from "lodash";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { PageLayout } from "@/components/community-contest/layout/CommunityLayout";
import { CommunityGrid } from "@/components/community-contest/community/CommunityGrid";
import { CreateCommunityDialog } from "@/components/community-contest/community/CreateCommunityDialogue";
import { useGetAllCommunities } from "@/hooks/community-contest/useCommunity";
import { useAllClientCategories } from "@/hooks/client/useClient";

const Communities = () => {
  const [page,setPage] = useState(1);
  const [limit] = useState(8); // Fixed limit for pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [membershipFilter, setMembershipFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const {data : categoriesData} = useAllClientCategories()
  // Debounced search handler
  const debouncedSetSearch = useMemo(
    () => debounce((value) => setSearchTerm(value), 500),
    []
  );

  // Handle search input change
  const handleSearchChange = useCallback(
    (e : any) => {
      debouncedSetSearch(e.target.value);
    },
    [debouncedSetSearch]
  );

  // Fetch communities using external hook
  const { data, isLoading, isError } = useGetAllCommunities({
    page,
    limit,
    search: searchTerm,
    category: categoryFilter === "all" ? undefined : categoryFilter,
    membership: membershipFilter === "all" ? undefined : membershipFilter,
    sort: sortOption,
  });

  // Extract unique categories from data
  const categories = categoriesData?.data?.data
  const handleCreateCommunity = (communityData : any) => {
    console.log("Creating community:", communityData);
    toast.success("Community created successfully! Awaiting approval.");
    setIsCreateDialogOpen(false);
  };

  return (
    <PageLayout>
        <div className="my-20">
    <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="font-serif tracking-tighter text-9xl sm:text-4xl mb-2">Photography Communities</h1>
            <p className="text-muted-foreground">
              Join communities, share your work, and connect with other photographers.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs px-2 py-0 h-5">
              {data?.data?.total || 0} communities
            </Badge>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Community
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search communities..."
                className="pl-10"
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="md:w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="members">Most Members</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="md:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category._id} value={category._id || ''}>
                    {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Filter Communities</SheetTitle>
                  <SheetDescription>
                    Refine the community results based on your preferences.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Membership</h3>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="all"
                          checked={membershipFilter === "all"}
                          onCheckedChange={() => setMembershipFilter("all")}
                        />
                        <label htmlFor="all" className="text-sm">All Communities</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="member"
                          checked={membershipFilter === "member"}
                          onCheckedChange={() => setMembershipFilter("member")}
                        />
                        <label htmlFor="member" className="text-sm">My Communities</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="non-member"
                          checked={membershipFilter === "non-member"}
                          onCheckedChange={() => setMembershipFilter("non-member")}
                        />
                        <label htmlFor="non-member" className="text-sm">Not Joined</label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Categories</h3>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="all-categories"
                          checked={categoryFilter === "all"}
                          onCheckedChange={() => setCategoryFilter("all")}
                        />
                        <label htmlFor="all-categories" className="text-sm">All Categories</label>
                      </div>
                      {categories?.map((category) => (
                        <div key={category._id} className="flex items-center space-x-2">
                          <Checkbox
                            id={category._id}
                            checked={categoryFilter === category._id}
                            onCheckedChange={() => setCategoryFilter(category._id!)}
                          />
                          <label htmlFor={category._id} className="text-sm">{category.title}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setCategoryFilter("all");
                      setMembershipFilter("all");
                      setSortOption("newest");
                    }}
                  >
                    Reset All Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {isError ? (
          <div className="flex flex-col items-center justify-center p-10 text-center bg-secondary/30 rounded-lg">
            <h3 className="text-xl font-medium mb-2">Error loading communities</h3>
            <p className="text-muted-foreground mb-4">Please try again later.</p>
          </div>
        ) : !isLoading && data?.data?.data?.length! > 0 ? (
          <CommunityGrid communities={data?.data.data!} />
        ) : (
          <div className="flex flex-col items-center justify-center p-10 text-center bg-secondary/30 rounded-lg">
            <h3 className="text-xl font-medium mb-2">No communities found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setMembershipFilter("all");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
        </div>

      <CreateCommunityDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateCommunity}
      />
    </PageLayout>
  );
};

export default Communities;