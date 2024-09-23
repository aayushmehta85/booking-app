import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import Icon from '../Icons';

const Header = () => {

	const { user } = useContext(UserContext);

	return (
		<header className="flex justify-between">
			<Link to="/" className="flex items-center gap-1">
				<Icon type="logo" />
				<span className="text-primary font-bold text-xl">bnb</span>
			</Link>
			{/* <div className="flex gap-2 border border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-300">
				<div>Anywhere</div>
				<div className="border border-1 border-gray-300"></div>
				<div>Any week</div>
				<div className="border border-1 border-gray-300"></div>
				<div>Add guest</div>
				<button className="bg-primary text-white p-1 rounded-full">
					<Icon type="search" />
				</button>
			</div> */}
			<Link
				to={user?.name? "/my-account":"/login"}
				className="flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4"
			>
				<Icon type="ham-burger" />
				<div className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
					<Icon type="user-soild" />
				</div>
				{user?.name && (<div>{user?.name}</div>)}
			</Link>
		</header>
	);
};

export default Header;