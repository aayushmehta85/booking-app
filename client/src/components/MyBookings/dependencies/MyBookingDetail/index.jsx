import { useState } from "react";
import AddressLink from "../../../PlaceDetailPageComp/AddressLink";
import PlaceGallery from "../../../PlaceDetailPageComp/PlaceGallery";
import BookingDates from "../BookingDates";
import { _post } from "../../../../../service/apiService";

const MyBookingDetail = ({ bookingDetails }) => {

	const [bookingStatus, setBookingStatus] = useState(bookingDetails?.status || "rejected");
	
	const cancelBookingHandler = async (id) => {
		try {
			const response = await _post(`/cancel-booked-users/${id}`);
			if (response?.data?.status === '200') {
				setBookingStatus("rejected")
			}
		} catch (e) {
			console.log('error occurred');
		}
	};
  return (
		<div className="my-8">
			<div className="flex justify-between">
				<div>
					<h1 className="text-3xl">{bookingDetails?.place?.title}</h1>
					<AddressLink className="my-2 block">{bookingDetails?.place?.address}</AddressLink>
				</div>

				<div className="p-3 pr-0 text-center">
					<div>
						Status:
						<span className="font-semibold ml-1">
							{bookingStatus === 'approved' ? 'Booked' : 'Booking Cancel'}
						</span>
					</div>
					{bookingStatus === 'approved' && (
						<button className="primary" onClick={() => cancelBookingHandler(bookingDetails._id)}>
							Cancel Booking
						</button>
					)}
				</div>
			</div>

			<div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
				<div>
					<h2 className="text-2xl mb-4">Your booking information:</h2>
					{bookingDetails && <BookingDates booking={bookingDetails} />}
				</div>
				<div className="bg-primary p-6 text-white rounded-2xl">
					<div>Total price</div>
					<div className="text-3xl">₹{bookingDetails?.place?.price}</div>
				</div>
			</div>
			{bookingDetails?.place && <PlaceGallery place={bookingDetails.place} />}
		</div>
	);
}

export default MyBookingDetail;