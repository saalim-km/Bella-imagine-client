import { useState, useMemo, useCallback } from "react";
import { debounce } from "lodash";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
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
import { PageLayout } from "@/components/community-contest/layout/CommunityLayout";
import { CommunityGrid } from "@/components/community-contest/CommunityGrid";
import { useAllClientCategories } from "@/hooks/client/useClient";
import { useGetAllCommunitiesClient, useGetAllCommunitiesVendor } from "@/hooks/community-contest/useCommunity";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAllVendorCategoryQuery } from "@/hooks/vendor/useVendor";

const Communities = () => {
  const user = useSelector((state : RootState)=> {
    if(state.client.client) return state.client.client;
    if(state.vendor.vendor) return state.vendor.vendor;
    return undefined;
  })
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [membershipFilter, setMembershipFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const { data: categoriesDataClient } = useAllClientCategories(user?.role === 'client');
  const { data: categoriesDataVendor } = useAllVendorCategoryQuery(user?.role === 'vendor');


  const debouncedSetSearch = useMemo(
    () => debounce((value) => setSearchTerm(value), 500),
    []
  );

  const handleSearchChange = useCallback(
    (e: any) => {
      debouncedSetSearch(e.target.value);
    },
    [debouncedSetSearch]
  );

  const { data : communitiesForClient, isLoading, isError } = useGetAllCommunitiesClient({
    page,
    limit,
    search: searchTerm,
    category: categoryFilter === "all" ? undefined : categoryFilter,
    membership: membershipFilter === "all" ? undefined : membershipFilter,
    sort: sortOption,
    enabled : user?.role === 'client'
  });
  const { data : communitiesForVendor } = useGetAllCommunitiesVendor({
    page,
    limit,
    search: searchTerm,
    category: categoryFilter === "all" ? undefined : categoryFilter,
    membership: membershipFilter === "all" ? undefined : membershipFilter,
    sort: sortOption,
    enabled : user?.role === 'vendor'
  });

  const categories = categoriesDataClient?.data?.data ? categoriesDataClient.data : categoriesDataVendor?.data


  const communities = communitiesForClient?.data.data ? communitiesForClient?.data : communitiesForVendor?.data
  const totalCommunities = communities?.total || 0
  return (
    <PageLayout>
      <div className="space-y-8 mt-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs px-2 py-0 h-5">
              {totalCommunities} communities
            </Badge>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 " />
              <Input
                placeholder="Search communities..."
                className="pl-10 "
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="md:w-[150px] ">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="">
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="members">Most Members</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="md:w-[180px] ">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="">
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.data?.map((category) => (
                  <SelectItem key={category._id} value={category._id || ""}>
                    {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="">
                <SheetHeader>
                  <SheetTitle>Filter Communities</SheetTitle>
                  <SheetDescription>
                    Refine the community results
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
                          className=""
                        />
                        <label htmlFor="all" className="text-sm">
                          All Communities
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="member"
                          checked={membershipFilter === "member"}
                          onCheckedChange={() => setMembershipFilter("member")}
                          className=""
                        />
                        <label htmlFor="member" className="text-sm">
                          My Communities
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="non-member"
                          checked={membershipFilter === "non-member"}
                          onCheckedChange={() => setMembershipFilter("non-member")}
                          className=""
                        />
                        <label htmlFor="non-member" className="text-sm">
                          Not Joined
                        </label>
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
                          className=""
                        />
                        <label htmlFor="all-categories" className="text-sm">
                          All Categories
                        </label>
                      </div>
                      {categories?.data?.map((category) => (
                        <div
                          key={category._id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={category._id}
                            checked={categoryFilter === category._id}
                            onCheckedChange={() => setCategoryFilter(category._id!)}
                            className=""
                          />
                          <label htmlFor={category._id} className="text-sm">
                            {category.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full "
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
          <div className="flex flex-col items-center justify-center p-10 text-center  rounded-lg">
            <h3 className="text-xl font-medium mb-2">
              Error loading communities
            </h3>
            <p className="text-gray-500 mb-4">
              Please try again later.
            </p>
          </div>
        ) : !isLoading && communities?.data?.length! > 0 ? (
          <CommunityGrid communities={communities?.data!} />
        ) : (
          <div className="flex flex-col items-center justify-center p-10 text-center  rounded-lg">
            <h3 className="text-xl font-medium mb-2">No communities found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              className=""
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
    </PageLayout>
  );
};

export default Communities;