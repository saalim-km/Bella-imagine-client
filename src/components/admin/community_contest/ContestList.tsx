import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  CalendarPlus,
  Search,
  ArrowLeft,
  Eye,
  Pencil,
  Trash,
  Filter,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ReusableAlertDialog } from "@/components/common/AlertDialogue";
import { useGetPaginatedContestQuery } from "@/hooks/contest/useContest";
import { Spinner } from "@/components/ui/spinner";
import { ColumnDef, DataTable } from "@/components/common/Table";
import { IContest } from "@/types/Contest";
// import { DataTable, ColumnDef } from "@/components/common/DataTable";

const ContestList = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedContest, setSelectedContest] = useState<IContest | null>(null);
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    searchQuery: "",
    status: "",
  });

  const [searchInput, setSearchInput] = useState("");

  // Fetch data based on filters
  const { data: contestData, isLoading } = useGetPaginatedContestQuery({
    search: filters.searchQuery,
    status: filters.status,
  });
  const totalContest = contestData?.total || 0
  console.log('total contest : ',totalContest);
  const totalPages = Math.max(1, Math.ceil(totalContest / 5));
  console.log('total pages : ',totalPages);

  const handleDelete = () => {
    if (selectedContest) {
      toast({
        title: "Contest deleted",
        description: `${selectedContest.title} has been removed.`,
      });
      setDeleteDialogOpen(false);
      setSelectedContest(null);
    }
  };

  const handleSearchClick = () => {
    setFilters((prev) => ({ ...prev, searchQuery: searchInput, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const columns: ColumnDef<IContest>[] = [
    { id: "title", header: "Title", accessorKey: "title" },
    {
      id: "startDate",
      header: "Start Date",
      cell: (row) => new Date(row.startDate).toLocaleDateString(),
    },
    {
      id: "endDate",
      header: "End Date",
      cell: (row) => new Date(row.endDate).toLocaleDateString(),
    },
    { id: "status", header: "Status", accessorKey: "status" },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate(`/admin/contest/${row._id}`)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate(`/admin/contest/edit/${row._id}`)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              setSelectedContest(row);
              setDeleteDialogOpen(true);
            }}
          >
            <Trash className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  function resetFilter() {
    setFilters({ searchQuery: "", status: ""});
  }

  return (
    <>
      <div className="mb-6">
        <Button variant="ghost" className="mb-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Contest Management</h1>
          <Button asChild>
            <Link to="/admin/contest/create">
              <CalendarPlus className="h-4 w-4 mr-2" />
              Create Contest
            </Link>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contests..."
              className="pl-8"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Button onClick={handleSearchClick}>Search</Button>

          <Select
            value={filters.status}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger className="w-[180px] shrink-0">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ended">Ended</SelectItem>
            </SelectContent>
            
          </Select>

          <Button variant="outline" onClick={resetFilter}>
            <Filter className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <DataTable
        data={contestData?.data || []}
        columns={columns}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <ReusableAlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        title="Delete Contest"
        description={`Are you sure you want to delete ${selectedContest?.title}? This action cannot be undone.`}
      />
    </>
  );
};

export default ContestList;