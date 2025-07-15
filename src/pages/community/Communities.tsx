import { useState, useMemo, useCallback } from "react"
import { debounce } from "lodash"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal, Filter, X, TrendingUp, Users, Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { PageLayout } from "@/components/community/layout/CommunityLayout"
import { CommunityGrid } from "@/components/community/CommunityGrid"
import { useAllClientCategories } from "@/hooks/client/useClient"
import { useGetAllCommunitiesClient, useGetAllCommunitiesVendor } from "@/hooks/community/useCommunity"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { useAllVendorCategoryQuery } from "@/hooks/vendor/useVendor"

const Communities = () => {
  const user = useSelector((state: RootState) => {
    if (state.client.client) return state.client.client
    if (state.vendor.vendor) return state.vendor.vendor
    return undefined
  })

  const [limit] = useState(12)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [membershipFilter, setMembershipFilter] = useState("all")
  const [sortOption, setSortOption] = useState("newest")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const { data: categoriesDataClient } = useAllClientCategories(user?.role === "client")
  const { data: categoriesDataVendor } = useAllVendorCategoryQuery(user?.role === "vendor")

  const debouncedSetSearch = useMemo(() => debounce((value) => setSearchTerm(value), 300), [])

  const handleSearchChange = useCallback(
    (e: any) => {
      debouncedSetSearch(e.target.value)
    },
    [debouncedSetSearch],
  )

  const {
    data: communitiesForClient,
    isLoading,
    isError,
  } = useGetAllCommunitiesClient({
    page: 1,
    limit,
    search: searchTerm,
    category: categoryFilter === "all" ? undefined : categoryFilter,
    membership: membershipFilter === "all" ? undefined : membershipFilter,
    sort: sortOption,
    enabled: user?.role === "client",
  })

  const { data: communitiesForVendor } = useGetAllCommunitiesVendor({
    page : 1,
    limit,
    search: searchTerm,
    category: categoryFilter === "all" ? undefined : categoryFilter,
    membership: membershipFilter === "all" ? undefined : membershipFilter,
    sort: sortOption,
    enabled: user?.role === "vendor",
  })

  const categories = categoriesDataClient?.data?.data ? categoriesDataClient.data : categoriesDataVendor?.data
  const communities = communitiesForClient?.data.data ? communitiesForClient?.data : communitiesForVendor?.data
  const totalCommunities = communities?.total || 0

  
  const resetFilters = () => {
    setSearchTerm("")
    setCategoryFilter("all")
    setMembershipFilter("all")
    setSortOption("newest")
  }

  const activeFiltersCount = [categoryFilter !== "all", membershipFilter !== "all", searchTerm !== ""].filter(
    Boolean,
  ).length

  const getSortIcon = (sort: string) => {
    switch (sort) {
      case "members":
        return <Users className="w-4 h-4" />
      case "newest":
        return <Calendar className="w-4 h-4" />
      default:
        return <TrendingUp className="w-4 h-4" />
    }
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto space-y-6 p-4">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Communities</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Discover and join communities that match your interests
              </p>
            </div>
            <Badge
              variant="secondary"
              className="text-sm px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
            >
              {totalCommunities.toLocaleString()} communities
            </Badge>
          </div>

          {/* Search and Filter Bar */}
          <Card className="p-4 bg-white dark:bg-background border border-gray-200 dark:border-gray-800">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search communities by name, description, or tags..."
                    className="pl-10 h-10 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-400 bg-gray-50 dark:bg-gray-800"
                    onChange={handleSearchChange}
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                      onClick={() => setSearchTerm("")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Sort and Filter Controls */}
              <div className="flex gap-2">
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[160px] h-10 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      {getSortIcon(sortOption)}
                      <SelectValue placeholder="Sort by" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">
                      <div className="flex items-center gap-2">
                        Newest
                      </div>
                    </SelectItem>
                    <SelectItem value="oldest">
                      <div className="flex items-center gap-2">
                        Oldest
                      </div>
                    </SelectItem>
                    <SelectItem value="members">
                      <div className="flex items-center gap-2">
                        Most Members
                      </div>
                    </SelectItem>
                    <SelectItem value="name">
                      <div className="flex items-center gap-2">
                        Name (A-Z)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px] h-10 border-gray-200 dark:border-gray-700">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories?.data?.map((category) => (
                      <SelectItem key={category._id} value={category._id || ""}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 px-3 border-gray-200 dark:border-gray-700 relative bg-transparent"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-orange-500 text-white">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <SheetHeader>
                      <SheetTitle className="flex items-center gap-2">
                        <SlidersHorizontal className="h-5 w-5" />
                        Filter Communities
                      </SheetTitle>
                      <SheetDescription>Refine your search results with advanced filters</SheetDescription>
                    </SheetHeader>

                    <div className="mt-6 space-y-6">
                      {/* Membership Filter */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Membership Status</h3>
                        <div className="space-y-3">
                          {[
                            { value: "all", label: "All Communities", desc: "Show all available communities" },
                            { value: "member", label: "My Communities", desc: "Communities you've joined" },
                            { value: "non-member", label: "Not Joined", desc: "Communities you haven't joined" },
                          ].map((option) => (
                            <div key={option.value} className="flex items-start space-x-3">
                              <Checkbox
                                id={option.value}
                                checked={membershipFilter === option.value}
                                onCheckedChange={() => setMembershipFilter(option.value)}
                                className="mt-1"
                              />
                              <div className="space-y-1">
                                <label htmlFor={option.value} className="text-sm font-medium cursor-pointer">
                                  {option.label}
                                </label>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{option.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Category Filter */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Categories</h3>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="all-categories"
                              checked={categoryFilter === "all"}
                              onCheckedChange={() => setCategoryFilter("all")}
                            />
                            <label htmlFor="all-categories" className="text-sm font-medium cursor-pointer">
                              All Categories
                            </label>
                          </div>
                          {categories?.data?.map((category) => (
                            <div key={category._id} className="flex items-center space-x-3">
                              <Checkbox
                                id={category._id}
                                checked={categoryFilter === category._id}
                                onCheckedChange={() => setCategoryFilter(category._id!)}
                              />
                              <label htmlFor={category._id} className="text-sm cursor-pointer">
                                {category.title}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Reset Button */}
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                          onClick={() => {
                            resetFilters()
                            setIsFilterOpen(false)
                          }}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Reset All Filters
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchTerm || categoryFilter !== "all" || membershipFilter !== "all") && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-500 dark:text-gray-400">Active filters:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="text-xs">
                    Search: "{searchTerm}"
                    <Button variant="ghost" size="sm" className="ml-1 h-3 w-3 p-0" onClick={() => setSearchTerm("")}>
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                )}
                {categoryFilter !== "all" && (
                  <Badge variant="secondary" className="text-xs">
                    Category: {categories?.data?.find((c) => c._id === categoryFilter)?.title}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-3 w-3 p-0"
                      onClick={() => setCategoryFilter("all")}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                )}
                {membershipFilter !== "all" && (
                  <Badge variant="secondary" className="text-xs">
                    {membershipFilter === "member" ? "My Communities" : "Not Joined"}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-3 w-3 p-0"
                      onClick={() => setMembershipFilter("all")}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-gray-500 hover:text-gray-700"
                  onClick={resetFilters}
                >
                  Clear all
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Content Section */}
        {isError ? (
          <Card className="p-8 text-center bg-red-50 dark:bg-orange-900 border-red-200 dark:border-red-800">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Error loading communities</h3>
              <p className="text-red-600 dark:text-red-300">Something went wrong. Please try again later.</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </Card>
        ) : !isLoading && communities?.data.length || 0 > 0 ? (
          <CommunityGrid communities={communities ? communities.data : []} />
        ) : !isLoading ? (
          <Card className="p-12 text-center bg-gray-50 dark:bg-gray-800/50">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">No communities found</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                We couldn't find any communities matching your criteria. Try adjusting your search or filter settings.
              </p>
              <Button variant="outline" onClick={resetFilters}>
                <X className="w-4 h-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          </Card>
        ) : null}
      </div>
    </PageLayout>
  )
}

export default Communities
