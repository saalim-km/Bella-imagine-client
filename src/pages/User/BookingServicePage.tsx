import Header from '@/components/headers/Header'
import { Spinner } from '@/components/ui/spinner'
import BookingPage from '@/components/User/booking/BookingComp'
import { useGetServiceQuery } from '@/hooks/client/useClient'
import { IServiceResponse } from '@/types/vendor'
import { useParams } from 'react-router-dom'

const BookingServicePage = () => {
  const {id} = useParams()
  console.log('id kitti',id);

  const {data: service , isLoading} = useGetServiceQuery(id as string)
console.log(service);
  if(isLoading) {
    return <Spinner/>
  }
  return (
    <>
      <Header/>
      <BookingPage service={service as IServiceResponse}/>
    </>
  )
}

export default BookingServicePage