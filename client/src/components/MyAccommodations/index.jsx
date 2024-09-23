import { Link, useParams } from 'react-router-dom';
import Icon from '../Common/Icons';
import AccommodationForm from './dependencies/AccommodationForm';
import { useEffect, useState } from 'react';
import { _get, _post } from '../../../service/apiService';
import { truncateString } from '../../utils';
import PlaceImg from '../Common/PlaceImg';

const MyAccommodations = () => {
	const { action } = useParams();

	const [placesData, setPlacesData] = useState([]);

	useEffect(() => {
		getAllPlacesData();
	}, [action]);

	const getAllPlacesData = async () => {
		try {
			const response = await _get('/user-places');
			if (response.data.status === '200' && response?.data?.data) {
				setPlacesData(response.data.data || []);
			}
		} catch (e) {
			console.log('err occurred while calling places API',e);
		}
	};

	const removeAccomodation = async (id) => {
		try {
			const response = await _post(`/delete-user-place/${ id }`);
			if (response?.data?.status === "200") {
				const updatedArr = placesData.filter(place => place._id !== id)
				setPlacesData(updatedArr);
			}
		} catch (e) {
			console.log("remove api failed.")
		}
	}

	return (
		<div>
			{!action ? (
				<div className="text-center">
					<Link
						className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
						to="/my-account/places/new"
					>
						<Icon type="plus-icon" />
						Add new place
					</Link>
					<div className="mt-4">
						{placesData?.length > 0 &&
							placesData.map((place) => {
								const { title, _id, photos, description } = place;
								return (
									<div key={_id} className="relative">
										<Link
											to={`/my-account/places/${_id}`}
											className="mt-4 flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl"
										>
											<div className="flex w-32 h-32 bg-gray-<300 grow shrink-0">
												<PlaceImg photos={photos} />
											</div>
											<div className="grow-0 shrink text-left">
												<h2 className="text-xl">{title}</h2>
												<p className="text-sm mt-2">
													{description && truncateString(description, 900)}
												</p>
											</div>
										</Link>
										<div
											className="absolute top-2 right-2 cursor-pointer text-white bg-black bg-opacity-50 rounded-2xl py-1 px-2"
											onClick={() => removeAccomodation(_id)}
										>
											<Icon type="trash" />
										</div>
									</div>
								);
							})}
					</div>
				</div>
			) : (
				<AccommodationForm isEdit={action !== 'new'} id={action} />
			)}
		</div>
	);
};

export default MyAccommodations;
