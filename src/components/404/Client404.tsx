import { Link } from "react-router-dom";
import { Home, Search, Calendar, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "../common/Header";

const Client404 = () => {
  return (
    <>
      <Header/>
      <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <Calendar className="w-64 h-64 text-primary" />
            </div>

            <h1 className="relative text-9xl font-bold text-primary">404</h1>
            <div className="relative -mt-4 text-lg font-medium text-muted-foreground">
              Page not found
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Oops! This seems to be missing
          </h2>

          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            The page you're looking for doesn't exist or has been moved. Let's
            help you find your way back to the events you love.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto mb-8">
            <Link to="/" className="block">
              <Card className="flex items-center justify-center gap-2 p-4 hover:bg-accent transition-colors">
                <Home className="w-5 h-5 text-primary" />
                <span className="font-medium">Home</span>
              </Card>
            </Link>

            <Link to="/vendors" className="block">
              <Card className="flex items-center justify-center gap-2 p-4 hover:bg-accent transition-colors">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-medium">Browse Vendors</span>
              </Card>
            </Link>

            <Link to="/tickets" className="block">
              <Card className="flex items-center justify-center gap-2 p-4 hover:bg-accent transition-colors">
                <Ticket className="w-5 h-5 text-primary" />
                <span className="font-medium">My Bookings</span>
              </Card>
            </Link>

            <Link to="/search" className="block">
              <Card className="flex items-center justify-center gap-2 p-4 hover:bg-accent transition-colors">
                <Search className="w-5 h-5 text-primary" />
                <span className="font-medium">Search</span>
              </Card>
            </Link>
          </div>

          <div className="mt-8">
            <Button variant="link" asChild>
              <Link to="/contact" className="text-primary">
                Need help? Contact support
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center justify-center gap-2 p-2 bg-card rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span className="w-2 h-2 rounded-full bg-destructive"></span>
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Client404;