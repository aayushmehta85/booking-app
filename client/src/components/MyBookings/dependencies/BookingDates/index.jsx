import { differenceInCalendarDays, format } from 'date-fns';
import Icon from '../../../Common/Icons';

export default function BookingDates({ booking, className }) {
	return (
		<div className={`flex gap-1 ${className}`}>
			<Icon type="moon-night"/>
			{differenceInCalendarDays(new Date(booking.checkOut), new Date(booking.checkIn))} nights:
			<div className="flex gap-1 items-center ml-2">
				<Icon type="calendar" />
				{format(new Date(booking.checkIn), 'yyyy-MM-dd')}
			</div>
			&rarr;
			<div className="flex gap-1 items-center">
				<Icon type="calendar" />
				{format(new Date(booking.checkOut), 'yyyy-MM-dd')}
			</div>
		</div>
	);
}
