import User from '../models/User.js';

//create
const createUser = async(req, res) => {
	try {
		let newUser = new User({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password
		});
		await User.create(newUser);
		res.status(201).json(newUser);
	}
	catch (err) {
		res.status(500).json({message: err.message});
	}
};

//read
const readUser = async(req, res) => {
	try {
		res.status(200).send(await User.find());
	}
	catch (err) {
		res.status(500).json({message: err.message});
	}
};

//get by id
const readUserById = async(req, res) => {
	try {
		res.status(200).send(await User.findById(req.query.id));
	}
	catch (err) {
		res.status(400).json({message: err.message});
	}
};

//get by name
const readUserByName = async(req, res) => {
	try {
		res.status(200).send(await User.find({ name: req.query.name }));
	}
	catch (err) {
		res.status(400).json({message: err.message});
	}
};

//update
const updateUser = async(req, res) => {
	try {
		let is = await User.exists({_id: req.query._id});
		if (!is) {
			throw new Error('Not found');
		}
		await User.findByIdAndUpdate(req.query.id, req.body);
		res.status(201).json({message: 'User updated'});
	}
	catch(err) {
		res.status(400).json({message: err.message});
	}
};

//delete
const deleteUser = async(req, res) => {
	try {
		let is = await User.exists({_id: req.query._id});
		if (!is) {
			throw new Error('Not found');
		}
		await User.findByIdAndDelete(req.query._id);
		res.status(200).json({message: 'User removed'});
	}
	catch(err) {
		res.status(400).json({message: err.message});
	}
};

//exports
module.exports = {
	createUser,
	readUser,
	readUserById,
	readUserByName,
	updateUser,
	deleteUser
};
