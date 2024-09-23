import AddressLink from "../../../PlaceDetailPageComp/AddressLink";
import PlaceGallery from "../../../PlaceDetailPageComp/PlaceGallery";
import BookingDates from "../BookingDates";

const MyBookingDetail = ({ bookingDetails }) => {
  return (
		<div className="my-8">
			<h1 className="text-3xl">{bookingDetails.place.title}</h1>
			<AddressLink className="my-2 block">{bookingDetails.place.address}</AddressLink>
			<div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
				<div>
					<h2 className="text-2xl mb-4">Your booking information:</h2>
					<BookingDates booking={bookingDetails} />
				</div>
				<div className="bg-primary p-6 text-white rounded-2xl">
					<div>Total price</div>
					<div className="text-3xl">₹{bookingDetails.place.price}</div>
				</div>
			</div>
			<PlaceGallery place={bookingDetails.place} />
		</div>
	);
}

export default MyBookingDetail;