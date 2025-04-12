import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  CalendarPlus,
  List,
  Users,
  Heart,
  ImagePlus,
  Award,
  Settings,
  PieChart,
} from "lucide-react";

const ContestManagement = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Contest Management</h1>
          <p className="text-muted-foreground">
            Manage contests, review submissions, and analyze platform activity.
          </p>
        </div>

        <Button asChild>
          <Link to="/admin/contests/create">
            <CalendarPlus className="h-4 w-4 mr-2" />
            Create New Contest
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Contests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">3</div>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Participants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">327</div>
              <Users className="h-4 w-4 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Photos Submitted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">452</div>
              <ImagePlus className="h-4 w-4 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Likes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">1,284</div>
              <Heart className="h-4 w-4 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="contests">
        <TabsList>
          <TabsTrigger value="contests" className="flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            <span>Contests</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1">
            <PieChart className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contests" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contest Management</CardTitle>
              <CardDescription>
                View and manage all contests on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Active Contests</CardTitle>
                      <Trophy className="h-5 w-5 text-yellow-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center">
                        <span>Weekly Challenge: Street Photography</span>
                        <Badge count={32} label="entries" />
                      </li>
                      <li className="flex justify-between items-center">
                        <span>Photo of the Month: Nature</span>
                        <Badge count={75} label="entries" />
                      </li>
                      <li className="flex justify-between items-center">
                        <span>Best of 2024</span>
                        <Badge count={210} label="entries" />
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/admin/contests">
                        <List className="h-4 w-4 mr-2" />
                        View All Contests
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Recent Entries</CardTitle>
                      <ImagePlus className="h-5 w-5 text-purple-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span>Urban Vibes</span>
                          <span className="text-xs text-muted-foreground">
                            by Sophie Chen
                          </span>
                        </div>
                        <span className="text-xs">1h ago</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span>Mountain Sunrise</span>
                          <span className="text-xs text-muted-foreground">
                            by James Wilson
                          </span>
                        </div>
                        <span className="text-xs">3h ago</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span>Wedding Dance</span>
                          <span className="text-xs text-muted-foreground">
                            by Emma Davis
                          </span>
                        </div>
                        <span className="text-xs">5h ago</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/admin/contests/entries/weekly">
                        <Award className="h-4 w-4 mr-2" />
                        Review Entries
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/admin/contests/create">
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Create New Contest
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                View engagement statistics and platform metrics.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <PieChart className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>Analytics dashboard would be implemented here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>
                Configure platform settings and permissions.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Settings className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>Settings dashboard would be implemented here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper component for entry badges
const Badge = ({ count, label }: { count: number; label: string }) => (
  <div className="flex items-center gap-1 text-xs bg-secondary py-1 px-2 rounded-full">
    <span className="font-semibold">{count}</span>
    <span className="text-muted-foreground">{label}</span>
  </div>
);

export default ContestManagement;
