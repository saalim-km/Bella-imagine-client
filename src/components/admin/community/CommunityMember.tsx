import { useParams } from "react-router-dom";


const CommunityMembers = () => {
  const { slug } = useParams();


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
