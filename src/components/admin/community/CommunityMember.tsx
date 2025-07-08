import { useGetCommunityMembers } from "@/hooks/community/useCommunity";
import { useState } from "react";
import { useParams } from "react-router-dom";

interface IFilters {
  page: number;
  limit: number;
}

const CommunityMembers = () => {
  const { slug } = useParams();

  const [filters] = useState<IFilters>({ page: 1, limit: 6 });

  const { data: members } = useGetCommunityMembers({
    slug: slug ? slug : "",
    limit: filters.limit,
    page: filters.page,
  });
  console.log(members);

  if (!slug) {
    return <p>slug is requird to fetch community members</p>;
  }

  return (
    <>
      <h1>community members</h1>
    </>
  );
};

export default CommunityMembers;
