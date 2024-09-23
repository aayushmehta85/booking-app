import { useEffect, useState } from 'react';
import Icon from '../../../Common/Icons';
import { FIELD_DATA } from './contant';
import { _get, _post } from '../../../../../service/apiService';
import { useNavigate } from 'react-router-dom';
import PhotosUploader from '../PhotosUploader';

const AccommodationForm = ({ isEdit, id = null }) => {
	const [formData, setFormData] = useState({
		title: '',
		address: '',
		description: '',
		perks: [],
		extraInfo: '',
		checkIn: '',
		checkout: '',
		maxGuest: 1,
		price: 100
	});

	const [photoLink, setPhotoLink] = useState('');
	const [addedPhotos, setAddedPhotos] = useState([]);

	let navigate = useNavigate();

	useEffect(() => {
		if (isEdit) {
			getPlaceDetailHandler();
		}
	}, []);

	const btnDisableHadndler = () => {
		const formKey = [
			'title',
			'address',
			'photoLink',
			'description',
			'extraInfo',
			'checkIn',
			'checkout',
			'maxGuest',
			'price',
		];

		const isDisable = formKey.every(item => {
			if (item === "photoLink" && addedPhotos.length > 0) return true
			if (item !== "photoLink" && formData[item]) return true
			return false;
		})
		return !isDisable;
	}

	const getPlaceDetailHandler = async () => {
		try {
			const response = await _get(`/user-places/${id}`);
			if (response.data.status === '200') {
				const {title,address,description,perks,extraInfo,checkIn,checkout,maxGuest,photos,price,} = response.data.data;
				setFormData({title,address,description,perks,extraInfo,checkIn,checkout,maxGuest,price});
				setAddedPhotos(photos)
			}
		} catch (e) {
			console.log('error occured while getting places details', e);
		}
	};

	const inputChangeHandler = (e, name) => {
		const value = e.target.value;
		if (name === 'photoLink') {
			setPhotoLink(value);
			return;
		}

		setFormData({ ...formData, [name]: value });
	};

	const radioSelectHandler = (e) => {
		const { checked, name } = e.target;
		const formDataCopy = { ...formData };
		if (checked) {
			formDataCopy.perks.push(name);
		} else {
			formDataCopy.perks = formDataCopy.perks.filter((selectedName) => selectedName !== name);
		}
		setFormData(formDataCopy);
	};


	const savePlaceHandler = async (e) => {
		e.preventDefault();
		const payload = { ...formData, addedPhotos: addedPhotos, ...(isEdit ? {id}:"")};
		const url = `/save-places${isEdit ? `/${id}`: ""}`;
		try {
			const response = await _post(url, payload);
			if (response?.data?.status === '200') {
				navigate('/my-account/places', { replace: true });
			}
		} catch (err) {
			console.log('api issue while submitting', err);
		}
	};

	const renderTopTitle = (title, sub_title, required) => {
		return (
			<>
				<h2 className="text-2xl mt-4">
					{title}
					{required && <span className="absolute ml-1 text-primary text-base">*</span>}
				</h2>
				<p className="text-sm text-gray-500">{sub_title}</p>
			</>
		);
	};

	const renderFormHandler = () => {
		return FIELD_DATA.map((field) => {
			const { name, title, sub_title, type, placeholder, field_type, items = [], required } = field;
			if (field_type === 'input') {
				return (
					<>
						{renderTopTitle(title, sub_title, required)}
						<input
							type={type}
							placeholder={placeholder}
							value={formData[name]}
							onChange={(e) => inputChangeHandler(e, name)}
						/>
					</>
				);
			}
			if (field_type === 'group-input') {
				return (
					<>
						{renderTopTitle(title, sub_title, required)}
						<div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
							{field?.items?.length > 0 &&
								field?.items?.map((subFields) => {
									const { type, placeholder, label, name, required, min } = subFields;
									return (
										<div key={label}>
											<h3 className="mt-2 -mb-1">
												{label}
												{required && (
													<span className="absolute ml-1 text-primary text-base">*</span>
												)}
											</h3>
											<input
												type={type}
												placeholder={placeholder}
												value={formData[name]}
												onChange={(e) => inputChangeHandler(e, name)}
												min={min}
											/>
										</div>
									);
								})}
						</div>
					</>
				);
			}
			if (field_type === 'textarea') {
				return (
					<>
						{renderTopTitle(title, sub_title, required)}
						<textarea
							key={name}
							value={formData[name]}
							onChange={(e) => inputChangeHandler(e, name)}
						/>
					</>
				);
			}
			if (field_type === 'photos') {
				return (
					<>
						{renderTopTitle(title, sub_title, required)}
						<PhotosUploader
							name={name}
							placeholder={placeholder}
							addedPhotos={addedPhotos}
							photoLink={photoLink}
							inputChangeHandler={inputChangeHandler}
							setAddedPhotos={setAddedPhotos}
							setPhotoLink={setPhotoLink}
						/>
					</>
				);
			}
			if (field_type === 'checkbox') {
				return (
					<>
						{renderTopTitle(title, sub_title, required)}
						<div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
							{field?.items?.length > 0 &&
								field?.items?.map((subFields) => {
									const { type, name, label } = subFields;
									return (
										<>
											<label
												className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer"
												htmlFor={name}
											>
												<input
													type={type}
													id={name}
													name={name}
													checked={formData?.perks.includes(name) || null}
													onChange={(e) => radioSelectHandler(e)}
												/>
												<Icon type={name} />
												<span>{label}</span>
											</label>
										</>
									);
								})}
						</div>
					</>
				);
			}
		});
	};

	return (
		<div>
			<form>
				{renderFormHandler()}
				<button
					className={`my-4 ${btnDisableHadndler() ? 'disable' : 'primary'}`}
					onClick={savePlaceHandler}
					disabled={btnDisableHadndler()}
				>
					Save
				</button>
			</form>
		</div>
	);
};

export default AccommodationForm;
