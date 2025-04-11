import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { ProfileInfo } from '@/components/User/ProfileInfo'
import { useVendorDetailsQuery } from '@/hooks/admin/useVendor'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const UserDetailsPage = () => {
    const {id , role} = useParams()
    const {data , isLoading} = useVendorDetailsQuery(id!,role as 'vendor' | 'client')
    const navigate = useNavigate()
    if(isLoading){
        return <Spinner/>
    }
    console.log(location);
  return (
    <AdminLayout>
        <div>
            <Button variant={"outline"} onClick={()=> navigate('/admin/vendor-requests')} >
              Go Back
            </Button>
            {data?.user && <ProfileInfo data={data.user}/>}
        </div>
    </AdminLayout>
  )
}

export default UserDetailsPage