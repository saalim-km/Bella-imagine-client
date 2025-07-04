import { useGetCommunityMembers } from "@/hooks/community/useCommunity";
import { useState } from "react";
import { useParams } from "react-router-dom";


interface IFilters {
    page : number;
    limit : number;
}

const CommunityMembers = ()=> {
    const {slug} = useParams()
    
    if(!slug) {
        return(
            <p>slug is requird to fetch community members</p>
        )
    }


    const [filters,setFilters] = useState<IFilters>({page : 1 , limit : 6})

    const {data : members , isLoading} = useGetCommunityMembers({slug : slug ,limit : filters.limit , page : filters.page })
    console.log(members);
    return(
        <>
            <h1>community members</h1>
        </>
    )
}


export default CommunityMembers