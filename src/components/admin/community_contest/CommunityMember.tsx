import { useLocation, useParams } from "react-router-dom"

const CommunityMembers = ()=> {
    const {id} = useParams()
    console.log(id);
    return(
        <>
            <h1>community members</h1>
        </>
    )
}


export default CommunityMembers