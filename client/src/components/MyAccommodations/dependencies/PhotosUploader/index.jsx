
import { _post } from '../../../../../service/apiService';
import Icon from '../../../Common/Icons';

const PhotosUploader = ({
  name,
	placeholder,
	addedPhotos,
	photoLink,
	inputChangeHandler,
	setAddedPhotos,
  setPhotoLink,
}) => {
  const addPhotoByLink = async (e) => {
		e.preventDefault();
    const response = await _post('/upload-by-link', { link: photoLink });
		if (response.data.status === '200') {
			let fileName = response.data.data;
      setAddedPhotos((prev) => [...prev, fileName]);
      setPhotoLink("")
		}
	};

	const uploadPhotoChange = async (e) => {
		e.preventDefault();
		try {
			const files = e.target.files;
			const data = new FormData();
			for (let i = 0; i < files.length; i++) {
				data.append('photos', files[i]);
			}

			const response = await _post('/upload', data, {
				headers: { 'Content-type': 'multipart/form-data' },
			});
			if (response.data.status === '200') {
				const filesNames = response.data.data;
				setAddedPhotos((prev) => [...prev, ...filesNames]);
			}
		} catch (err) {
			console.log('api issue', err);
		}
  };
  
  const removePhotoHandler = (filename) => {
    const filteredPhotos = addedPhotos.filter(photo=>photo!==filename)
    setAddedPhotos(filteredPhotos);
  }

  const selectMainPhotoHandler = (e,index) => {
    e.preventDefault();
    const addedPhotoCopy = [...addedPhotos ];
    let temp = addedPhotoCopy[0];
		addedPhotoCopy[0] = addedPhotoCopy[index];
    addedPhotoCopy[index] = temp;
    setAddedPhotos(addedPhotoCopy);
  };

	return (
		<>
			<div className="flex gap-2">
				<input
					type="text"
					placeholder={placeholder}
					onChange={(e) => inputChangeHandler(e, name)}
				/>
				<button className="bg-gray-200 grow px-4 rounded-2xl" onClick={addPhotoByLink}>
					Add&nbsp;Photo
				</button>
			</div>
			<div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
				{addedPhotos.length > 0 &&
					addedPhotos.map((link, index) => (
						<div className="h-32 flex relative" key={link}>
							<img
								className="rounded-2xl w-full object-cover"
								src={`http://localhost:4000/uploads/${link}`}
								alt="photos"
							/>
							<button
								className="cursor-pointer absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3"
								onClick={() => removePhotoHandler(link)}
							>
								<Icon type="trash" />
							</button>
							<button
								className="cursor-pointer absolute bottom-1 left-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3"
								onClick={(e) => selectMainPhotoHandler(e, index)}
							>
								<Icon type={link === addedPhotos[0] ? 'solid-star' : 'outline-star'} />
							</button>
						</div>
					))}
				<label className="h-32 cursor-pointer flex items-center justify-center gap-1 border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
					<input
						type="file"
						multiple
						accept=".jpg,.jpeg,.png"
						className="hidden"
						onChange={uploadPhotoChange}
					/>
					<Icon type="upload" />
					Upload
				</label>
			</div>
		</>
	);
};

export default PhotosUploader