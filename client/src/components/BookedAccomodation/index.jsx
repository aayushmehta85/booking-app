import { useEffect, useState } from 'react'
import PlaceImg from '../Common/PlaceImg';
import { Link, useParams } from 'react-router-dom';
import { _get } from '../../../service/apiService';
import { truncateString } from '../../utils';
import BookedUsersDetails from './dependencies/BookedUsersDetails';

const BookedAccomodation = () => {
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
			console.log('err occurred while calling places API', e);
		}
  };
  
  return (
		<>
			{!action ? (
				<div className="mt-4">
					{placesData?.length > 0 ? (
						placesData.map((place) => {
							const { title, _id, photos, description } = place;
							return (
								<div key={_id} className="relative">
									<Link
										to={`/my-account/booked-places/${_id}`}
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
								</div>
							);
						})
					) : (
						<div className="flex justify-center text-2xl h-96 items-center">
							No booking is done for this place.
						</div>
					)}
				</div>
			) : (
				<BookedUsersDetails id={action} />
			)}
		</>
	);
}

export default BookedAccomodation