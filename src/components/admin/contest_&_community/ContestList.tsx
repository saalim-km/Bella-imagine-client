import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  MoreHorizontal, 
  Pencil, 
  Trash, 
  EyeIcon, 
  AlertTriangle,
  Clock,
  Users,
  Calendar,
  Search,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Pagination from "@/components/common/Pagination";

interface Contest {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  status: "active" | "upcoming" | "ended";
  participants: number;
  category?: string;
}

const ContestList = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const contests: Contest[] = [
    {
      id: "weekly",
      title: "Weekly Challenge: Street Photography",
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      participants: 32,
      status: "active",
      category: "street"
    },
    {
      id: "monthly",
      title: "Photo of the Month: Nature",
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      participants: 75,
      status: "active",
      category: "landscape"
    },
    {
      id: "portrait",
      title: "Portrait Challenge",
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      participants: 0,
      status: "upcoming",
      category: "portrait"
    },
    {
      id: "yearly",
      title: "Best of 2024",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-12-31"),
      participants: 210,
      status: "active"
    },
    {
      id: "wedding",
      title: "Wedding Photography Showcase",
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      participants: 48,
      status: "ended",
      category: "wedding"
    }
  ];
  
  const handleDelete = () => {
    if (selectedContest) {
      // In a real app, this would be an API call
      toast({
        title: "Contest deleted",
        description: `${selectedContest.title} has been removed.`,
      });
      setDeleteDialogOpen(false);
      setSelectedContest(null);
    }
  };
  
  const confirmDelete = (contest: Contest) => {
    setSelectedContest(contest);
    setDeleteDialogOpen(true);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "upcoming":
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Upcoming</Badge>;
      case "ended":
        return <Badge variant="secondary">Ended</Badge>;
      default:
        return null;
    }
  };
  
  // Filter contests based on status and search query
  const filteredContests = contests.filter(contest => {
    const matchesStatus = statusFilter === "all" || contest.status === statusFilter;
    const matchesSearch = contest.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  
  return (
    <>
          <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Contest Management</h1>
          
          <Button asChild>
            <Link to="/admin/contests/create">
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
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] shrink-0">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Contests</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ended">Ended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contest</TableHead>
                <TableHead className="hidden md:table-cell">Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Participants</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No contests found
                  </TableCell>
                </TableRow>
              ) : (
                filteredContests.map((contest) => (
                  <TableRow key={contest.id}>
                    <TableCell>
                      <div className="font-medium">{contest.title}</div>
                      {contest.category && (
                        <div className="text-sm text-muted-foreground mt-0.5">
                          Category: {contest.category}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>
                          {contest.startDate.toLocaleDateString()} - {contest.endDate.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm mt-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>
                          {contest.status === "active" && (
                            `${Math.ceil((contest.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left`
                          )}
                          {contest.status === "upcoming" && (
                            `Starts in ${Math.ceil((contest.startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days`
                          )}
                          {contest.status === "ended" && "Completed"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(contest.status)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{contest.participants}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/contests/entries/${contest.id}`} className="flex items-center cursor-pointer">
                              <EyeIcon className="h-4 w-4 mr-2" />
                              View Entries
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/contests/create?edit=${contest.id}`} className="flex items-center cursor-pointer">
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => confirmDelete(contest)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Contest
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedContest?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* <Pagination/> */}
    </>
  );
};

export default ContestList;
