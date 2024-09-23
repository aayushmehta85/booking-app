import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from 'date-fns';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";
import { _post } from "../../../../service/apiService";


const BookingWidget = ({ place }) => {
	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		checkIn: '',
		checkOut: '',
    numberOfGuests: 1,
  });
  
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

	useEffect(() => {
    if (user) {
      const formDataCopy = { ...formData }
      formDataCopy["name"] = user.name;
			setFormData(formDataCopy)
		}
	}, [user]);

	let numberOfNights = 0;
	if (formData?.checkIn && formData?.checkOut) {
		numberOfNights = differenceInCalendarDays(
			new Date(formData.checkOut),
			new Date(formData.checkIn)
		);
	}

  const bookThisPlace = async () => {
    const payload = { ...formData, place: place._id, price: numberOfNights * place.price };
    try {
      const response = await _post('/bookings', payload);
      if (response?.data?.status === "200") {
        const bookingId = response?.data?.data?._id
          navigate(`/my-account/bookings/${bookingId}`);
      }
    } catch (e) {
      console.log("error occured while booking.")
    }
	};
  
  const inputChangeHandler = (e, type)=>{
    const value = e.target.value;
    const formDataCopy = { ...formData }
    formDataCopy[type] = value;
    setFormData(formDataCopy);
  }

  const getMinDate = (type) => {
    const currentDate = new Date();
    const nextDay = new Date(type === 'nextDay' ? formData.checkIn: currentDate);
		if (type === "nextDay") {
      nextDay.setDate(currentDate.getDate() + 1);
      
    }
    const year = nextDay.getFullYear();
		const month = String(nextDay.getMonth() + 1).padStart(2, '0'); // Months are zero-based
		const day = String(nextDay.getDate()).padStart(2, '0');

		const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

	return (
		<div className="bg-white shadow p-4 rounded-2xl">
			<div className="text-2xl text-center">Price: ₹{place?.price} / per night</div>
			<div className="border rounded-2xl mt-4">
				<div className="flex">
					<div className="py-3 px-4">
						<label>Check in:</label>
						<input
							type="date"
							min={getMinDate()}
							value={formData.checkIn}
							onChange={(e) => inputChangeHandler(e, 'checkIn')}
						/>
					</div>
					<div className="py-3 px-4 border-l">
						<label>Check out:</label>
						<input
							type="date"
							min={getMinDate('nextDay')}
							value={formData.checkOut}
							onChange={(e) => inputChangeHandler(e, 'checkOut')}
							disabled={!formData.checkIn}
						/>
					</div>
				</div>
				<div className="py-3 px-4 border-t">
					<label>Number of guests:</label>
					<input
						type="number"
						value={formData.numberOfGuests}
						onChange={(e) => inputChangeHandler(e, 'numberOfGuests')}
						min={1}
					/>
				</div>
				{numberOfNights > 0 && (
					<div className="py-3 px-4 border-t">
						<label>Your full name:</label>
						<input
							type="text"
							value={formData.name}
							onChange={(e) => inputChangeHandler(e, 'name')}
						/>
						<label>Phone number:</label>
						<input
							type="tel"
							value={formData.phone}
							onChange={(e) => inputChangeHandler(e, 'phone')}
							maxLength={10}
						/>
					</div>
				)}
			</div>
			<button onClick={bookThisPlace} className="primary mt-4">
				Book this place
				{numberOfNights > 0 && <span> ₹{numberOfNights * place?.price}</span>}
			</button>
		</div>
	);
};

export default BookingWidget; 