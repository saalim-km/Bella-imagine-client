import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { ProfileInfo } from '@/components/User/ProfileInfo'
import { useVendorDetailsQuery } from '@/hooks/admin/useVendor'
import { useNavigate, useParams } from 'react-router-dom'

const UserDetailsPage = () => {
    const {id} = useParams()
    const {data , isLoading} = useVendorDetailsQuery(id || '')
    const navigate = useNavigate()
    if(isLoading){
        return <Spinner/>
    }
  return (
    <AdminLayout>
        <div>
            <Button variant={"outline"} onClick={()=> navigate('/admin/vendor-requests')} >
              Go Back
            </Button>
            {data?.user && <ProfileInfo data={data.user} />}
        </div>
    </AdminLayout>
  )
}

export default UserDetailsPage