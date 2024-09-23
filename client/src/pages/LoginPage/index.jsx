import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { NOTIFICATION_TYPE, REGISTER_FIELD_ERROR_MSG } from "../../utils/contants";
import { _post } from "../../../service/apiService";
import { UserContext } from "../../components/UserContext";
import InputField from "../../components/Common/InputField";
import Notification from "../../components/Common/Notification";

const LoginPage = () => {
	const [loginDetails, setLoginDetails] = useState({
		email: '',
		password: '',
	});

	const [formErrorStatus, setFormErrorStatus] = useState({
		email: '',
		password: '',
	});

	const [notification, setNotification] = useState({
		type: null,
		message: null,
	});

	const { setUser } = useContext(UserContext);

	let navigate = useNavigate();

	const handleInputChange = (e, type) => {
		let loginDetailsCopy = { ...loginDetails };
		let _value = e.target.value;
		if (type === 'name') {
			loginDetailsCopy[type] = /^[a-zA-Z\s]+$/.test(_value) ? _value : '';
		} else {
			loginDetailsCopy[type] = _value;
		}

		setLoginDetails(loginDetailsCopy);
	};

	const verifyErrorHandler = (type = null, key = null) => {
		let formStatus = { ...formErrorStatus };
		const formDataKeys = ['email', 'password'];
		if (type === 'submit') {
			const checkField = formDataKeys.every(
				(formKey) => loginDetails[formKey] && formStatus[formKey]?.hasError === false
			);
			if (!checkField) {
				formDataKeys.forEach((formKey) => {
					if (!loginDetails[formKey]) {
						formStatus[formKey] = {
							errorMessage: REGISTER_FIELD_ERROR_MSG[formKey].required,
							hasError: true,
						};
					}
				});
			}
			setFormErrorStatus(formStatus);
			return checkField;
		} else {
			if (!loginDetails[key]) {
				formStatus[key] = {
					errorMessage: REGISTER_FIELD_ERROR_MSG[key].required,
					hasError: true,
				};
			} else {
				if (key === 'email' && !/^[^@]+@[^@]+\.[^@]+$/.test(loginDetails[key])) {
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

	const handleLoginUser = async (e) => {
		e.preventDefault();
		if (verifyErrorHandler('submit')) {
			try {
				const responseData = await _post('/login', loginDetails);
				if (responseData?.data?.status === "200") {
					setUser(responseData?.data?.data);
					setNotification({
						type: null,
						message: null,
					});
					navigate('/');
				} else {
					setNotification({
						type: NOTIFICATION_TYPE.ERROR,
						message: responseData?.data?.description,
					});
				}
				
			} catch (e) {
				setNotification({
					type: NOTIFICATION_TYPE.ERROR,
					message: 'Login failed. Please try again later',
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
				<h1 className="text-4xl text-center mb-4">Login</h1>
				<div className="max-w-md mx-auto">
					<InputField
						type="email"
						placeholder="your@email.com"
						value={loginDetails?.email}
						onChangeHandler={(e) => handleInputChange(e, 'email')}
						onBlurHandler={(e) => verifyErrorHandler(e, 'email')}
						errorMessage={formErrorStatus['email']?.errorMessage}
					/>
					<InputField
						type="password"
						placeholder="password"
						value={loginDetails?.password}
						onChangeHandler={(e) => handleInputChange(e, 'password')}
						onBlurHandler={(e) => verifyErrorHandler(e, 'password')}
						errorMessage={formErrorStatus['password']?.errorMessage}
					/>
					<button className="primary mt-3" onClick={handleLoginUser}>
						Login
					</button>
					<div className="text-center py-2 text-gray-500">
						Don&apos;t have an account yet?
						<Link className="underline text-black ml-1" to="/register">
							Register now
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
