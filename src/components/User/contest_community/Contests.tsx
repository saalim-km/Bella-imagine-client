
import { useState } from "react";
import { Link } from "react-router-dom";
import ContestLayout from "@/components/User/contest_community/ContestLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Clock, Calendar, Users, ArrowRight, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { IContest } from "@/types/Contest";
import { useAllClientContestQuery } from "@/hooks/contest/useContest";
import { Spinner } from "@/components/ui/spinner";

interface Contest {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  participantsCount: number;
  category?: string;
  status: "active" | "upcoming" | "ended";
  featured?: boolean;
}

const Contests = () => {
  const [activeTab, setActiveTab] = useState("active");
  const {data : contest , isLoading} = useAllClientContestQuery({status : "",search : ""});
  const contests: IContest[] = contest?.data || [];

  const filteredContests = contests.filter(contest => contest.status === activeTab);
  const featuredContest = contests.find(contest => contest.featured);
  const formatDateRange = (start: Date, end: Date) => {
    const formatDate = (date: Date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    };
    return `${formatDate(new Date(start))} - ${formatDate(new Date(end))}`;
  };

  const calculateDaysRemaining = (date: Date) => {
    const diffTime = new Date(date).getTime() - Date.now();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  if(isLoading) {
    return <Spinner/>
  }
  return (
    <ContestLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Photography Contests</h1>
          <p className="text-muted-foreground">
            Participate in our community contests and showcase your best work. Winners get featured on our homepage!
          </p>
        </div>
        
        {/* Featured Contest */}
        {featuredContest && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden"
          >
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100 dark:from-blue-950 dark:to-indigo-950 dark:border-blue-900">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-blue-600">Featured Contest</Badge>
                <CardTitle className="text-xl md:text-2xl">{featuredContest.title}</CardTitle>
                <CardDescription>{featuredContest.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span>{formatDateRange(featuredContest.startDate, featuredContest.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span>{calculateDaysRemaining(featuredContest.endDate)} days remaining</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>{(featuredContest?.clientParticipants?.length || 0) + (featuredContest?.vendorParticipants?.length || 0)} participants</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link to="/contest/upload">
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Your Entry
                  </Link>
                </Button>
              </CardFooter>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-200/40 rounded-full blur-2xl" />
              <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-indigo-200/30 rounded-full blur-xl" />
            </Card>
          </motion.div>
        )}
        
        {/* Contest Tabs */}
        <Tabs defaultValue="active" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="ended">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredContests.map((contest) => (
                <Card key={contest._id} className="h-full flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{contest.title}</CardTitle>
                      <Trophy className="h-5 w-5 text-yellow-500" />
                    </div>
                    <CardDescription>{contest.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDateRange(contest.startDate, contest.endDate)}</span>
                      </div>
                      {contest.status === "active" && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{calculateDaysRemaining(contest.endDate)} days remaining</span>
                        </div>
                      )}
                      {contest.status !== "upcoming" && (
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{(featuredContest?.clientParticipants?.length || 0) + (featuredContest?.vendorParticipants?.length || 0)} participants</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    {contest.status === "active" && (
                      <Button asChild className="w-full">
                        <Link to="/contest/upload">
                          <Upload className="mr-2 h-4 w-4" />
                          Submit Entry
                        </Link>
                      </Button>
                    )}
                    {contest.status === "upcoming" && (
                      <Button variant="outline" disabled className="w-full">
                        Coming Soon
                      </Button>
                    )}
                    {contest.status === "ended" && (
                      <Button variant="outline" asChild className="w-full">
                        <Link to="#">
                          View Results
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {filteredContests.length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No {activeTab} contests at the moment.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ContestLayout>
  );
};

export default Contests;
