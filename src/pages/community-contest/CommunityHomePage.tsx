
import { useState } from "react";
import { Link } from "react-router-dom";
import { PageLayout } from "@/components/community-contest/layout/CommunityLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Users, Calendar } from "lucide-react";
import { useGetlAllCommunity } from "@/hooks/community-contest/useCommunity";
import { CommunityCard } from "../../components/community-contest/community/CommunityCard";

const CommunityHomePage = () => {
  const [activeTab, setActiveTab] = useState("featured");
  
  // const {data  , isLoading} = useGetlAllCommunity({page : 1 , limit : 5});
  // const commnities = data?.data || []
  return (
    <PageLayout containerClassName="py-6 md:py-8 mt-36">
    </PageLayout>
  );
};

export default CommunityHomePage;