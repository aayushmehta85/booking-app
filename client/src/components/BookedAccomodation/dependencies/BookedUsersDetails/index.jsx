import { useEffect, useState } from 'react';
import { _get, _post } from '../../../../../service/apiService';
import Image from '../../../Common/Image';
import { formatDate } from '../../../../utils';

const BookedUsersDetails = ({ id }) => {
	const [bookedUsers, setBookedUsers] = useState();

	useEffect(() => {
		getBookedUsersDetails();
	}, []);

	const getBookedUsersDetails = async () => {
		try {
			const response = await _get(`/booked-users/${id}`);
			if (response?.data?.status === '200') {
				setBookedUsers(response?.data?.data || []);

				console.log('response.data.data', response.data.data);
			}
		} catch (e) {
			console.log('error occurred');
		}
  };
  
  const cancelBookingHandler = async (id,index) => {
    	try {
			const response = await _post(`/cancel-booked-users/${id}`);
        if (response?.data?.status === '200') {
          const bookedUserCopy = [...bookedUsers]
          bookedUserCopy[index].status = "rejected"
				  setBookedUsers(bookedUserCopy);
			}
		} catch (e) {
			console.log('error occurred');
		}
  }
	return (
		<>
			{bookedUsers?.length > 0 ? (
				<div className="flex flex-wrap -mx-3 mb-5">
					<div className="w-full max-w-full px-3 mb-6  mx-auto">
						<div className="relative flex-[1_auto] flex flex-col break-words min-w-0 bg-clip-border rounded-[.95rem] bg-white m-5">
							<div className="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-light/30">
								<div className="px-9 pt-5 flex justify-between items-stretch flex-wrap min-h-[70px] pb-0 bg-transparent">
									<div className="flex">
										<Image
											className="h-16 w-20 object-cover mr-3"
											src={bookedUsers?.[0]?.place?.photos?.[0]}
											alt="image"
										/>
										<h3 className="flex flex-col items-start justify-center m-2 ml-0 font-medium text-xl/tight text-dark">
											<span className="mr-3 text-dark">{bookedUsers?.[0]?.place?.title}</span>
											<span className="mt-1 font-medium text-secondary-dark text-lg/normal">
												{bookedUsers?.[0]?.place?.address}
											</span>
										</h3>
									</div>
								</div>

								<div className="flex-auto block py-8 pt-6 px-9">
									<div className="overflow-x-auto">
										<table className="w-full my-0 align-middle text-dark border-neutral-200">
											<thead className="align-bottom">
												<tr className="text-[0.95rem] text-secondary-dark">
													<th className="pb-3 text-start min-w-[175px]">Name</th>
													<th className="pb-3 text-center min-w-[100px]">Phone</th>
													<th className="pb-3 text-center min-w-[100px]">Check-In</th>
													<th className="pb-3 text-center min-w-[175px]">Check-Out</th>
													<th className="pb-3 text-center min-w-[100px]">Guests</th>
													<th className="pb-3 text-center min-w-[100px]">Total Paid</th>
													<th className="pb-3 text-center min-w-[50px]">Status</th>
													<th className="pb-3 text-center min-w-[50px]">Action</th>
												</tr>
											</thead>
											<tbody>
												{bookedUsers?.length > 0 &&
													bookedUsers.map((user,index) => {
														const {
															_id,
															name,
															checkIn,
															checkOut,
															phone,
															status,
															numberOfGuests,
															place,
															price = numberOfGuests * place.price,
														} = user;
														return (
															<tr key={_id} className="border-b border-dashed last:border-b-0">
																<td className="p-3 pl-0">
																	<div className="flex items-center">
																		<div className="flex flex-col justify-start">
																			<span className="mb-1 transition-colors duration-200 ease-in-out text-lg/normal text-secondary-inverse hover:text-primary">
																				{name}
																			</span>
																		</div>
																	</div>
																</td>
																<td className="p-3 pr-0 text-center">
																	<span className="text-light-inverse text-md/normal">{phone}</span>
																</td>
																<td className="p-3 pr-0 text-center">
																	<span className="text-light-inverse text-md/normal">
																		{checkIn && formatDate(checkIn)}
																	</span>
																</td>
																<td className="p-3 pr-0 text-center">
																	<span className="text-light-inverse text-md/normal">
																		{checkOut && formatDate(checkOut)}
																	</span>
																</td>
																<td className="p-3 pr-12 text-center">
																	<span className="text-center align-baseline inline-flex px-4 py-3 mr-auto items-center text-[.95rem] leading-none text-primary bg-primary-light rounded-lg">
																		{numberOfGuests}
																	</span>
																</td>
																<td className="pr-0 text-center">
																	<span className="text-light-inverse text-md/normal">{price}</span>
																</td>
																<td className="p-3 pr-0 text-center">
																	{status === 'approved' ? 'Booked' : 'Booking Cancelled'}
																</td>
																{status === 'approved' && (
																	<td className="p-3 pr-0 text-center">
																		<button className="primary" onClick={()=>cancelBookingHandler(_id,index)}>Cancel Booking</button>
																	</td>
																)}
															</tr>
														);
													})}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="flex justify-center text-2xl h-96 items-center">
					No booking is done for this place.
				</div>
			)}
		</>
	);
};

export default BookedUsersDetails;
