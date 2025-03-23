import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import { Spinner } from '@/components/ui/spinner'
import { ProfileInfo } from '@/components/User/ProfileInfo'
import { useVendorDetailsQuery } from '@/hooks/admin/useVendor'
import { Button } from 'react-day-picker'
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
            <button className='bg-gray-900 rounded hover:opacity-80 p-2' onClick={()=> navigate('/admin/vendor-requests')}>Go Back</button>
            {data?.user && <ProfileInfo data={data.user} />}
        </div>
    </AdminLayout>
  )
}

export default UserDetailsPage