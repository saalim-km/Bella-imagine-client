import { Link } from "react-router-dom";
import {
  ArrowLeft,
  LayoutDashboard,
  BarChart,
  Calendar,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "../headers/Header";

export const Vendor404 = () => {
  return (
    <>
      <Header/> 
      <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-3xl overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground">
            <h1 className="text-2xl font-bold">Vendor Portal</h1>
          </CardHeader>

          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <div className="w-32 h-32 flex items-center justify-center bg-primary/10 rounded-lg">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary">404</div>
                  <div className="text-sm font-medium text-primary-foreground/80">
                    Not Found
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  This page is unavailable
                </h2>
                <p className="text-muted-foreground">
                  The vendor page you're looking for doesn't exist or you may
                  not have permission to access it.
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              QUICK NAVIGATION
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Link to="/vendor/dashboard" className="block">
                <Button
                  variant="outline"
                  className="w-full h-auto p-4 justify-start gap-3"
                >
                  <LayoutDashboard className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">Dashboard</div>
                    <div className="text-xs text-muted-foreground">
                      Manage your vendor account
                    </div>
                  </div>
                </Button>
              </Link>

              <Link to="/vendor/events" className="block">
                <Button
                  variant="outline"
                  className="w-full h-auto p-4 justify-start gap-3"
                >
                  <Calendar className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">My Events</div>
                    <div className="text-xs text-muted-foreground">
                      View and manage your events
                    </div>
                  </div>
                </Button>
              </Link>

              <Link to="/vendor/analytics" className="block">
                <Button
                  variant="outline"
                  className="w-full h-auto p-4 justify-start gap-3"
                >
                  <BarChart className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">Analytics</div>
                    <div className="text-xs text-muted-foreground">
                      Track performance metrics
                    </div>
                  </div>
                </Button>
              </Link>

              <Link to="/vendor/settings" className="block">
                <Button
                  variant="outline"
                  className="w-full h-auto p-4 justify-start gap-3"
                >
                  <Settings className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">Settings</div>
                    <div className="text-xs text-muted-foreground">
                      Configure your account
                    </div>
                  </div>
                </Button>
              </Link>
            </div>

            <div className="flex justify-center">
              <Button variant="link" asChild>
                <Link to="/vendor" className="inline-flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Vendor Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-sm text-muted-foreground">
          Vendor Portal • Event Management Platform
        </div>
      </div>
    </>
  );
};
