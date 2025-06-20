import { useGetCommunityMembers } from "@/hooks/community-contest/useCommunity";
import { useState } from "react";
import { useParams } from "react-router-dom";


interface IFilters {
    page : number;
    limit : number;
}

const CommunityMembers = ()=> {
    const {id} = useParams()

    if(!id) {
        return(
            <p>id is requird to fetch community members</p>
        )
    }


    const [filters,setFilters] = useState<IFilters>({page : 1 , limit : 6})

    const {data : members , isLoading} = useGetCommunityMembers({communityId : id ,limit : filters.limit , page : filters.page })
    console.log(members);
    return(
        <>
            <h1>community members</h1>
        </>
    )
}


export default CommunityMembers