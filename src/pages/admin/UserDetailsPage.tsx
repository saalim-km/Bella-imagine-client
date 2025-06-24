import { AdminLayout } from '@/components/layout/AdminLayout'
import { Button } from '@/components/ui/button'
import { LoadingBar } from '@/components/ui/LoadBar'
import { ProfileInfo } from '@/components/User/ProfileInfo'
import { useVendorDetailsQuery } from '@/hooks/admin/useVendor'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

const UserDetailsPage = () => {
    const {id , role} = useParams()
    const {data , isLoading} = useVendorDetailsQuery(id!,role as 'vendor' | 'client')
    console.log(data?.data);
    const navigate = useNavigate()
    if(isLoading){
      return <LoadingBar/>
    }
  return (
    <AdminLayout>
        <div>
        <Button variant="ghost" className="mb-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
            {data?.data && <ProfileInfo data={data.data}/>}
        </div>
    </AdminLayout>
  )
}

export default UserDetailsPage