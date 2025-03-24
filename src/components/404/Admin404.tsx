import { Link } from "react-router-dom";
import {
  ArrowLeft,
  LayoutDashboard,
  Settings,
  Calendar,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export const Admin404 = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="bg-primary">
          <h1 className="text-2xl font-bold text-primary-foreground">
            Admin Portal
          </h1>
        </CardHeader>

        <CardContent className="p-8 text-center">
          <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-destructive/10 mb-6">
            <span className="text-5xl font-bold text-destructive">404</span>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2">
            Page Not Found
          </h2>
          <p className="text-muted-foreground mb-8">
            The admin page you're looking for doesn't exist or has been moved.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link to="/admin/dashboard" className="block">
              <Button
                variant="outline"
                className="w-full h-auto p-4 justify-start gap-2"
              >
                <LayoutDashboard className="w-5 h-5 text-primary" />
                <span className="font-medium">Dashboard</span>
              </Button>
            </Link>

            <Link to="/admin/users" className="block">
              <Button
                variant="outline"
                className="w-full h-auto p-4 justify-start gap-2"
              >
                <Users className="w-5 h-5 text-primary" />
                <span className="font-medium">Users</span>
              </Button>
            </Link>

          </div>

          <Button variant="link" asChild>
            <Link to="/admin/dashboard" className="inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin Home
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="mt-6 text-sm text-muted-foreground">
        Admin Portal • Bella Imagine
      </div>
    </div>
  );
};