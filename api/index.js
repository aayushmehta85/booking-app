const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const imagedDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');


const User = require('./models/User');
const Place = require('./models/Place')
const Booking =  require('./models/Booking')

require('dotenv').config();

const app = express();
const PORT = process.env.PORT;
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET;

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		credentials: true,
		origin: process.env.FE_BASE_URL,
	})
);
app.use('/uploads',express.static(`${__dirname}/uploads`))

mongoose.connect(process.env.MONGO_URL);

const getUserDataFromReq = (req)=> {
	return new Promise((resolve, reject) => {
		jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
			if (err) {
    console.log(err);
    return res.sendStatus(500);
}
			resolve(userData);
		});
	});
}

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
			name,
			email,
			password: bcrypt.hashSync(password, bcryptSalt),
		});

		return res.json(userDoc);
  } catch (e) {
    return res.status(422).json(e);
  }
	
});

app.get('/profile', async (req, res) => {
	const { token } = req.cookies;
	if (token) {
		jwt.verify(token, jwtSecret, {}, async (err, userData) => {
			if (err) {
    console.log(err);
    return res.sendStatus(500);
}
			const userDoc = await User.findById(userData.id);
			return res.json({ status: '200', description: '', data: userDoc });
		});
	} else {
		return res.json({ status: '200', description: '', data: null });
	}
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDoc = await User.findOne({ email })
    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password)
      if (passOk) {
        jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtSecret, {}, (err,token) => {
          if (err) {
    console.log(err);
    return res.sendStatus(500);
}
          res
						.cookie('token', token)
						.json({
							status: '200',
							data: { email: userDoc.email, id: userDoc._id, name: userDoc.name },
							description: 'User Found',
						});
        });
      } else {
        return res.status(200).json({ status: '422', description: "Incorrect password. Please enter the correct password." });
      }
    } else {
      return res.json({ status: '404', description: 'User Not Found' });
    }
  } catch (e) {
    return res.status(422).json(e);
  }
})

app.post('/logout', async (req, res) => {
  return res.cookie('token',"").json(true)
});


app.post('/upload-by-link',async (req, res)=> {
	const { link } = req.body;
	const newName = `photo${Date.now()}.jpg`
	try {
	await imagedDownloader.image({
		url: link,
		dest: `${__dirname}/uploads/${newName}`,
	});

	return res.json({ status: '200', description: 'File Uploaded Successfully', data: newName });
	} catch (e) {
		return res.json({ status: '500', description: 'File upload fail', data: null });
	}

})

const photosMiddleware = multer({ dest: 'uploads' });

app.post('/upload', photosMiddleware.array('photos',100), async (req, res) => {
	try { 
		const uploadedFiles = [];
		for (let i = 0; i < req.files.length; i++) {
			const { path, originalname } = req.files[i];
			const parts = originalname.split('.');
			const ext = parts[parts.length-1]
			const newPath = `${path}.${ext}`;
			fs.renameSync(path, newPath);
			uploadedFiles.push(newPath.replace('uploads/',''))
		}
		return res.json({ status: '200', description: 'File Uploaded Successfully', data: uploadedFiles });
	} catch (e) {
		return res.json({ status: '500', description: 'File upload fail', data: null });
	}
});

app.post('/save-places', async (req, res) => {
	try {
		const { token } = req.cookies;
	const {title,address,description,addedPhotos,perks,extraInfo,checkIn,checkout,maxGuest,price} = req.body;
	jwt.verify(token, jwtSecret, {}, async (err, userData) => {
		if (err) {
    console.log(err);
    return res.sendStatus(500);
}
		await Place.create({owner: userData.id,title,address,description,photos: addedPhotos,perks,extraInfo,checkIn,checkout,maxGuest,price,});
	});
		return res.json({ status: '200', description: 'Request successfully submitted.' });
	} catch (err) {
		return res.json({
			status: '500',
			description: 'Request fail.',
		});
	}
	
});

app.post('/save-places/:id', async (req, res) => {
	try {
		const { token } = req.cookies;
		const {id,title,address,description,addedPhotos,perks,extraInfo,checkIn,checkout,maxGuest,price} = req.body;
		jwt.verify(token, jwtSecret, {}, async (err, userData) => {
			if (err) {
    console.log(err);
    return res.sendStatus(500);
}
			const placeDoc = await Place.findById(id);
			if (userData.id === placeDoc.owner.toString()) {
				placeDoc.set({ title, address, description, photos: addedPhotos, perks, extraInfo, checkIn, checkout, maxGuest,price });
				await placeDoc.save();
				return res.json({ status: '200', description: 'Request successfully submitted.' });
			} else {
				return res.json({ status: '404', description: 'Data Not found' });
			}
		});
		
	} catch (err) {
		return res.json({
			status: '500',
			description: 'Request fail.',
		});
	}
});

app.get('/user-places', async (req, res) => {
	try {
		const { token } = req.cookies;
		jwt.verify(token, jwtSecret, {}, async (err, userData) => {
			if (err) {
    console.log(err);
    return res.sendStatus(500);
}
			const { id } = userData;
			const placesData = await Place.find({ owner: id });
			return res.json({ status: '200', description: 'Request successfully processed.', data: placesData });
		});
	} catch (e) {
		return res.json({
			status: '500',
			description: 'Request fail.',
		});
	}
})

app.post('/delete-user-place/:id', async (req, res) => {
	const { id } = req.params;
	try {
		await Place.deleteOne({_id:id});
		return res.json({ status: '200', description: 'Request successfully processed.' });
	}catch (e) {
		return res.json({
			status: '500',
			description: 'Request fail.',
		});
	}
});

app.get('/user-places/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const placesData = await Place.findById(id);
		return res.json({ status: '200', description: 'Request successfully processed.', data: placesData });
	} catch (e) {
		return res.json({
			status: '500',
			description: 'Request fail.',
		});
	}
});


// this places refer to the list on the home page
app.get('/places', async (req, res) => {
	try {
		const placesData = await Place.find();
		return res.json({ status: '200', description: 'Request successfully processed.', data: placesData });
	} catch (e) {
		return res.json({
			status: '500',
			description: 'Request fail.',
		});
	}
});

app.get('/place/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const placesData = await Place.findById(id);
		return res.json({ status: '200', description: 'Request successfully processed.', data: placesData });
	} catch (e) {
		return res.json({
			status: '500',
			description: 'Request fail.',
		});
	}
});

app.post('/bookings', async (req, res) => {
	try {
		const userData = await getUserDataFromReq(req);
		const { place, checkIn, checkOut, numberOfGuests, name, phone, status, price } = req.body;
		const bookingDoc = await Booking.create({
			place,
			checkIn,
			checkOut,
			numberOfGuests,
			name,
			phone,
			user: userData.id,
			status,
			price,
		});
		return res.json({ status: '200', description: 'Request successfully submitted.', data: bookingDoc });
	} catch (e) {
		console.log(e)
		return res.json({
			status: '500',
			description: 'Request fail.',
		});
	}
})

app.get('/bookings', async (req, res) => {
	try {
		const userData = await getUserDataFromReq(req);
		const bookingDoc = await Booking.find({ user: userData.id }).populate('place');
		return res.json({ status: '200', description: 'Request successfully processed.', data: bookingDoc });
	} catch (e) {
		return res.json({
			status: '500',
			description: 'Request fail.',
		});
	}
});

app.get('/bookings/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const userData = await getUserDataFromReq(req);
		const bookingDoc = await Booking.find({ user: userData.id }).populate('place');
		const newUpdatedData = bookingDoc.filter(item=>item._id.toString()===id)
		return res.json({
			status: '200',
			description: 'Request successfully processed.',
			data: newUpdatedData[0],
		});
	} catch (e) {
		return res.json({
			status: '500',
			description: 'Request fail.',
		});
	}
});

app.get('/booked-users/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const bookingDoc = await Booking.find().populate('place');
		const updatedDocData = bookingDoc.filter(item => item.place._id.toString() === id) || []; 
		return res.json({ status: '200', description: 'Request successfully processed.', data: updatedDocData });
	} catch (e) {
		return res.json({
			status: '500',
			description: 'Request fail.',
		});
	}
});

app.post('/cancel-booked-users/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const placeDoc = await Booking.updateOne({ _id: id }, { $set: { status: 'rejected' } });
		
		return res.json({ status: '200', description: 'Request successfully submitted.' });
	} catch (err) {
		return res.json({
			status: '500',
			description: 'Request fail.',
		});
	}
});


app.listen(PORT, () => {
	console.log(`Server Listening at port ${PORT}`);
});
