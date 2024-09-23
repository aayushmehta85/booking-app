import { useState } from 'react';
import { Link } from 'react-router-dom';
import { NOTIFICATION_TYPE, REGISTER_FIELD_ERROR_MSG } from '../../utils/contants';
import { _post } from '../../../service/apiService';
import InputField from '../../components/Common/InputField';
import Notification from '../../components/Common/Notification';

const RegisterPage = () => {
	const [registerDetails, setRegisterDetails] = useState({
		name: '',
		email: '',
		password: '',
	});

	const [formErrorStatus, setFormErrorStatus] = useState({
		name: '',
		email: '',
		password: '',
	});

	const [notification, setNotification] = useState({
		type: null,
		message: null,
	});

	const handleInputChange = (e, type) => {
		let registerDetailsCopy = { ...registerDetails };
		let _value = e.target.value;
		if (type === 'name') {
			registerDetailsCopy[type] = /^[a-zA-Z\s]+$/.test(_value) ? _value : '';
		}
		else {
			registerDetailsCopy[type] = _value;
		}

		setRegisterDetails(registerDetailsCopy);
	};

	const verifyErrorHandler = (type = null, key = null) => {
		let formStatus = { ...formErrorStatus };
		const formDataKeys = ['name', 'email', 'password'];
		if (type === 'submit') {
			const checkField = formDataKeys.every(formKey => registerDetails[formKey] && formStatus[formKey]?.hasError === false);
			if (!checkField) {
				formDataKeys.forEach(formKey => {
					if (!registerDetails[formKey]) {
						formStatus[formKey] = {
							errorMessage: REGISTER_FIELD_ERROR_MSG[formKey].required,
							hasError: true,
						};
					}
				})
			}
			setFormErrorStatus(formStatus);
			return checkField;
		} else {
			if (!registerDetails[key]) {
				formStatus[key] = {
					errorMessage: REGISTER_FIELD_ERROR_MSG[key].required,
					hasError: true,
				};
			} else {
				if (key === 'email' && !(/^[^@]+@[^@]+\.[^@]+$/.test(registerDetails[key]))) {
					formStatus[key] = {
						errorMessage: REGISTER_FIELD_ERROR_MSG[key].invalid,
						hasError: true,
					};
				} else {
					formStatus[key] = {
						errorMessage: '',
						hasError: false,
					};
				}
				
			}
			setFormErrorStatus(formStatus);
		}
	};

	const handleRegisterUser = async (e) => {
		e.preventDefault();
		if (verifyErrorHandler('submit')) {
			try {
				const responseData = await _post('/register', registerDetails);
				setRegisterDetails({
					name: '',
					email: '',
					password: '',
				});
				setNotification({
					type: NOTIFICATION_TYPE.SUCCESS,
					message: 'Registration successfull. Now you can log in',
				});
			} catch (e) {
				setNotification({
					type: NOTIFICATION_TYPE.ERROR,
					message: 'Registration failed. Please try again later',
				});
			}
		} else {
			setNotification({
				type: NOTIFICATION_TYPE.ERROR,
				message: 'Please fill all fields correctly.',
			});
		}
	};

	return (
		<div className="mt-4 grow flex items-center justify-around">
			<div className="mb-64">
				{notification?.message && (
					<Notification notification={notification} setNotification={setNotification} />
				)}
				<h1 className="text-4xl text-center mb-5">Register</h1>
				<div className="max-w-5xl mx-auto">
					<InputField
						type="text"
						placeholder="John Doe"
						value={registerDetails?.name}
						onChangeHandler={(e) => handleInputChange(e, 'name')}
						onBlurHandler={(e) => verifyErrorHandler(e, 'name')}
						errorMessage={formErrorStatus['name']?.errorMessage}
					/>
					<InputField
						type="email"
						placeholder="your@email.com"
						value={registerDetails?.email}
						onChangeHandler={(e) => handleInputChange(e, 'email')}
						onBlurHandler={(e) => verifyErrorHandler(e, 'email')}
						errorMessage={formErrorStatus['email']?.errorMessage}
					/>
					<InputField
						type="password"
						placeholder="password"
						value={registerDetails?.password}
						onChangeHandler={(e) => handleInputChange(e, 'password')}
						onBlurHandler={(e) => verifyErrorHandler(e, 'password')}
						errorMessage={formErrorStatus['password']?.errorMessage}
					/>
					<button className="primary mt-3" onClick={handleRegisterUser}>
						Register
					</button>
					<div className="text-center py-2 text-gray-500">
						Already a member?
						<Link className="underline text-black ml-1" to="/login">
							Login
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RegisterPage;
