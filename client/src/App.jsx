import { Route, Routes } from 'react-router-dom';
import './App.css';

import DefaultLayout from './layout/DefaultLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { UserContextProvider } from './components/UserContext';
import MyAccountPage from './pages/MyAccountPage';
import PlaceDetailPage from './pages/PlaceDetailPage';

function App() {
	
	return (
		<UserContextProvider>
			<Routes>
				<Route path="/" element={<DefaultLayout />}>
					<Route index element={<HomePage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/my-account/:subpage?" element={<MyAccountPage />} />
					<Route path="/my-account/:subpage/:action" element={<MyAccountPage />} />
					<Route path="/place/:id" element={<PlaceDetailPage />} />
				</Route>
			</Routes>
		</UserContextProvider>
	);
}

export default App;
