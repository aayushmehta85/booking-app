import { useContext, useEffect } from 'react';
import { UserContext } from '../../components/UserContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ACCOUNT_TYPE } from './contant';
import MyProfile from '../../components/MyProfile';
import MyBookings from '../../components/MyBookings';
import MyAccommodations from '../../components/MyAccommodations';
import { _post } from '../../../service/apiService';
import Icon from '../../components/Common/Icons';

const MyAccountPage = () => {
	const { user, ready, setReady , setUser} = useContext(UserContext);
	const navigate = useNavigate();
	let { subpage } = useParams();

	if (ready && !user) navigate('/login');
	if (!subpage) subpage = ACCOUNT_TYPE.PROFILE;

	const activeLinkClasses = (type = null) => {
		let classes = 'inline-flex gap-1 py-2 px-6  rounded-full';
    if (type === subpage) return `${classes} bg-primary text-white`;
    else return `${classes} bg-gray-200`;
  };

  const logoutHandler = async () => {
    try {
      const responseData = await _post('/logout');
      navigate('/', { replace: true });
      setUser(null);
      setReady(false);
    } catch (e) {
      console.log(e)
    }
  }
  
  const pageContentHandler = () => {
		const { PROFILE, MY_BOOKINGS, MY_ACCOMMODATIONS } = ACCOUNT_TYPE;
    switch (subpage) {
      case PROFILE:
        return <MyProfile user={user} logoutHandler={logoutHandler} />;
      case MY_BOOKINGS:
        return <MyBookings user={user} />
      case MY_ACCOMMODATIONS:
        return <MyAccommodations user={user} />;
			default:
				return <MyProfile user={user} />;
		}
  }

	return (
		<div>
			<nav className="w-full flex justify-center m-8 gap-4">
				<Link className={activeLinkClasses(ACCOUNT_TYPE.PROFILE)} to={'/my-account'}>
					<Icon type="outline-user" />
					Profile
				</Link>
				<Link className={activeLinkClasses(ACCOUNT_TYPE.MY_BOOKINGS)} to={'/my-account/bookings'}>
					<Icon type="booking-list" />
					My bookings
				</Link>
				<Link
					className={activeLinkClasses(ACCOUNT_TYPE.MY_ACCOMMODATIONS)}
					to={'/my-account/places'}
				>
					<Icon type="building-icon" />
					My accommodations
				</Link>
			</nav>
			{pageContentHandler()}
		</div>
	);
};

export default MyAccountPage;
