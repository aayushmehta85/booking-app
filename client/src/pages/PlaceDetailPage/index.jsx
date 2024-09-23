import { useParams } from "react-router-dom"
import { _get } from "../../../service/apiService";
import { useEffect, useState } from "react";
import AddressLink from "../../components/PlaceDetailPageComp/AddressLink";
import PlaceGallery from "../../components/PlaceDetailPageComp/PlaceGallery";
import BookingWidget from "../../components/PlaceDetailPageComp/BookingWidget";

const PlaceDetailPage = () => {
  const { id } = useParams();
  const [pageDetails, setPageDetails] = useState();

  useEffect(() => {
    if (!id) {
      return;
    }
    getPlacePageData();
  }, [])

  const getPlacePageData = async () => {
    try {
      const response = await _get(`/place/${id}`);
      if (response.data.status === "200") {
        setPageDetails(response.data.data)
      }
      
    } catch (e) {
      console.log("error occurred while fetching pageDetails page data",e)
    }
  }

  return (
		pageDetails && (
			<div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
				<h1 className="text-3xl">{pageDetails.title}</h1>
				<AddressLink>{pageDetails.address}</AddressLink>
				<PlaceGallery place={pageDetails} />
				<div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
					<div>
						<div className="my-4">
							<h2 className="font-semibold text-2xl">Description</h2>
							{pageDetails.description}
						</div>
						Check-in: {pageDetails.checkIn}
						<br />
						Check-out: {pageDetails.checkout}
						<br />
						Max number of guests: {pageDetails.maxGuest}
					</div>
					<div><BookingWidget place={pageDetails} /></div>
				</div>
				<div className="bg-white -mx-8 px-8 py-8 border-t">
					<div>
						<h2 className="font-semibold text-2xl">Extra info</h2>
					</div>
					<div className="mb-4 mt-2 text-sm text-gray-700 leading-5">{pageDetails.extraInfo}</div>
				</div>
			</div>
		)
	);
}

export default PlaceDetailPage;