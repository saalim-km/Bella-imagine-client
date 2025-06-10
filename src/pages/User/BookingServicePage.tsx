import Header from '@/components/common/Header'
import { Spinner } from '@/components/ui/spinner'
import BookingPage from '@/components/User/booking/BookingComp'
import { useGetServiceQuery } from '@/hooks/client/useClient'
import { useParams } from 'react-router-dom'

const BookingServicePage = () => {
  const {id , vendorId} = useParams()
  const {data: service , isLoading} = useGetServiceQuery(id as string)
  if(isLoading) {
    return <Spinner/>
  }

  if(!service) {
    return (
      <p>serice not found for booking , please try again later</p>
    )
  }
  const serviceDetails = service.data;
  
  return (
    <>
      <Header/>
      <BookingPage service={serviceDetails} vendorId = {vendorId!}/>
    </>
  )
}

export default BookingServicePage