import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Camera,
  Calendar,
  MessageSquare,
  TrendingUp,
  Award,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useGetDashBoard } from "@/hooks/admin/useAllCategory";
import { LoadingBar } from "@/components/ui/LoadBar";
import { DashboardData } from "@/services/admin/adminService";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const ITEMS_PER_PAGE = 5;

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [currentPage, setCurrentPage] = useState({
    users: 1,
    bookings: 1,
    posts: 1,
  });

  const { data: dashboardData, isLoading, isError } = useGetDashBoard();

  useEffect(() => {
    setData(dashboardData?.data ? dashboardData?.data : null);
  }, [dashboardData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handlePageChange = (
    section: "users" | "bookings" | "posts",
    direction: "prev" | "next"
  ) => {
    setCurrentPage((prev) => ({
      ...prev,
      [section]:
        direction === "prev"
          ? Math.max(1, prev[section] - 1)
          : prev[section] + 1,
    }));
  };

  const getPaginatedData = (
    items: any[],
    section: "users" | "bookings" | "posts"
  ) => {
    const startIndex = (currentPage[section] - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return items.slice(startIndex, endIndex);
  };

  const hasNextPage = (
    items: any[],
    section: "users" | "bookings" | "posts"
  ) => {
    return currentPage[section] * ITEMS_PER_PAGE < items.length;
  };

  if (isLoading) {
    return <LoadingBar />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p>
            an error occured to fetch dashboard stats , please try again later
          </p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <AdminLayout>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold dark:text-gray-200">Dashboard</h1>
            <p className="dark:text-gray-400 mt-2">
              Monitor platform activity and key metrics
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-background">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Clients
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.totalClients.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Photographers
                </CardTitle>
                <Camera className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.totalVendors.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Bookings
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.totalBookings.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Posts
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.totalPosts.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Booking Trends */}
            <Card className="bg-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Booking Trends (Last 12 Months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.bookingTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* New Users Trend */}
            <Card className="bg-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  New Users (Last 12 Months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.newUsersTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#82ca9d"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Photographers and Post Distribution */}
<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
  {/* Top Photographers - Improved Layout */}
  <Card className="bg-background">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-lg">
        <Award className="h-6 w-6 text-amber-500" />
        Top Photographers
      </CardTitle>
      <CardDescription>By number of bookings</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.topPhotographers}
            layout="vertical"
            margin={{ left: 120, right: 20, top: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis 
              type="number" 
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number) => [`${value} bookings`, 'Bookings']}
              labelFormatter={(value, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.name;
                }
                return value;
              }}
              contentStyle={{ 
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar
              dataKey="bookingCount"
              radius={[0, 4, 4, 0]}
              name="Bookings"
            >
              {data.topPhotographers.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Additional Stats Summary */}
      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Total Bookings: </span>
            <span className="font-semibold">
              {data.topPhotographers.reduce((sum, photographer) => sum + photographer.bookingCount, 0)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Top Performer: </span>
            <span className="font-semibold">
              {data.topPhotographers[0]?.name.split(' ')[0] || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Post Distribution - Improved Layout */}
  <Card className="bg-background">
    <CardHeader className="pb-3">
      <CardTitle className="text-lg">Post Distribution by Media Type</CardTitle>
      <CardDescription>Breakdown of content types</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.postDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ mediaType, count }) => 
                `${mediaType === 'none' ? 'Text' : mediaType}: ${count}`
              }
              outerRadius={100}
              innerRadius={60}
              paddingAngle={2}
              dataKey="count"
            >
              {data.postDistribution.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number, name: string) => [
                value, 
                name === 'none' ? 'Text Posts' : `${name.charAt(0).toUpperCase() + name.slice(1)} Posts`
              ]}
              contentStyle={{ 
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Summary Stats */}
      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Total Posts: </span>
            <span className="font-semibold">
              {data.postDistribution.reduce((sum, type) => sum + type.count, 0)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Most Common: </span>
            <span className="font-semibold">
              {data.postDistribution.reduce((max, type) => 
                type.count > max.count ? type : max
              ).mediaType === 'none' ? 'Text' : 'Image'}
            </span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</div>

          {/* Recent Activity Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Users */}
            <Card className="bg-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getPaginatedData(data.recentUsers, "users").map((user) => (
                    <div key={user._id} className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.profileImage || "/placeholder.svg"}
                          className="object-cover"
                        />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium dark:text-gray-200 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Badge
                        variant={
                          user.role === "vendor" ? "default" : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange("users", "prev")}
                    disabled={currentPage.users === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-500">
                    Page {currentPage.users} of{" "}
                    {Math.ceil(data.recentUsers.length / ITEMS_PER_PAGE)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange("users", "next")}
                    disabled={!hasNextPage(data.recentUsers, "users")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card className="bg-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getPaginatedData(data.recentBookings, "bookings").map(
                    (booking) => (
                      <div key={booking._id} className="space-y-2">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-medium truncate">
                            {booking.serviceDetails.serviceTitle}
                          </p>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>
                            {booking.userId.name} → {booking.vendorId.name}
                          </span>
                          <span>{formatCurrency(booking.totalPrice)}</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          {formatDate(booking.createdAt)}
                        </p>
                      </div>
                    )
                  )}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange("bookings", "prev")}
                    disabled={currentPage.bookings === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-500">
                    Page {currentPage.bookings} of{" "}
                    {Math.ceil(data.recentBookings.length / ITEMS_PER_PAGE)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange("bookings", "next")}
                    disabled={!hasNextPage(data.recentBookings, "bookings")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Posts */}
            <Card className="bg-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Recent Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getPaginatedData(data.recentPosts, "posts").map((post) => (
                    <div key={post._id} className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={post.userId.profileImage || "/placeholder.svg"}
                            className="object-cover"
                          />
                          <AvatarFallback>
                            {post.userId.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {post.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {post.userId.name} • {post.userType}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>
                          {post.likeCount} likes • {post.commentCount} comments
                        </span>
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange("posts", "prev")}
                    disabled={currentPage.posts === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-500">
                    Page {currentPage.posts} of{" "}
                    {Math.ceil(data.recentPosts.length / ITEMS_PER_PAGE)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange("posts", "next")}
                    disabled={!hasNextPage(data.recentPosts, "posts")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
