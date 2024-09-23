import { useEffect, useState } from "react";
import { _get } from "../../../service/apiService";
import { Link } from "react-router-dom";
import Image from "../../components/Common/Image";

const HomePage = () => {
	const [allPlacesData, setAllPlacesData] = useState([]);

	useEffect(() => {
		getAllPlaceHandler()
	},[])

	const getAllPlaceHandler = async() => {
		try {
			const response = await _get('/places');
			if (response?.data?.status === "200", response?.data?.data) {
				setAllPlacesData(response?.data?.data);
			}
		} catch (e) {
			console.log("erro occurred while fetching home page data",e)
		}
	}
  return (
		<div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
			{
				allPlacesData?.length > 0 && allPlacesData.map(place => {
					const { title, photos, _id, address, price } = place;
					return (
						<Link to={`/place/${_id}`} key={_id}>
							<div className="bg-gray-500 mb-2 rounded-2xl flex">
								{photos?.[0] && (
									<Image
										className="rounded-2xl object-cover aspect-square"
										src={photos?.[0]}
										alt="image"
									/>
								)}
							</div>
							<h2 className="font-bold">{address}</h2>
							<h3 className="text-sm text-gray-500">{title}</h3>
							<div className="mt-1">
								<span className="font-bold">₹ {price}</span> per night
							</div>
						</Link>
					);
				})
			}
		</div>
	);
}

export default HomePage