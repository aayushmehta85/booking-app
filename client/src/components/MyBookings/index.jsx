import { useEffect, useState } from 'react'
import { _get } from '../../../service/apiService'
import { Link, useParams } from 'react-router-dom'
import Icon from '../Common/Icons'
import BookingDates from './dependencies/BookingDates'
import PlaceImg from '../Common/PlaceImg'
import MyBookingDetail from './dependencies/MyBookingDetail'

const MyBookings = () => {
  const { action } = useParams();
  const [bookingData, setBookingData] = useState([])
  const [selecetedBookingDetail, setSelecetedBookingDetail] = useState({})
  
  useEffect(() => {
    getBookingDetails()
  }, [])
  
  const getBookingDetails = async () => {
    try { 
      const response = await _get('/bookings');
      if (response?.data?.status === "200") {
        setBookingData(response.data.data || [])
      }
    } catch (e) {
      console.log('error occured while getting booking data', e);
    }
  }


  return (
		<>
			{!action ? (
				<div>
					{bookingData?.length > 0 ?
						bookingData.map((booking) => {
							const { _id, place } = booking;
							const { title, photos, price } = place;
							return (
								<Link
                  key={_id}
                  onClick={()=>setSelecetedBookingDetail(booking)}
									to={`/my-account/bookings/${_id}`}
									className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden mt-2"
								>
									<div className="w-48">
										<PlaceImg photos={photos} />
									</div>
									<div className="py-2 pr-3 grow">
										<h2 className="text-xl">{title}</h2>
										<div className="text-xl">
											<BookingDates booking={booking} className="mb-2 mt-4 text-gray-500" />
											<div className="flex gap-1">
												<Icon type="bank-card" />
												<span className="text-2xl">Total price: ₹{price}</span>
											</div>
										</div>
									</div>
								</Link>
							);
						}):<div className='flex justify-center text-2xl h-96 items-center'>Currently you don't have any bookings...</div>}
				</div>
			) : (
          <MyBookingDetail id={action} bookingDetails={selecetedBookingDetail}/>
			)}
		</>
	);
}

export default MyBookings