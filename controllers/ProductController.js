import Product from '../models/Product.js';

//create
const createProduct = async(req, res) => {
	try {
		let newProduct = new Product({
			user: req.body.user,
			name: req.body.name,
			stock: req.body.stock,
			production: req.body.production,
			labour_cost: req.body.labour_cost,
			other_cost: req.body.other_cost,
			selling_price: req.body.selling_price,
			recipe: req.body.recipe
		});
		await Product.create(newProduct);
		res.status(201).json(newProduct);
	}
	catch (err) {
		res.status(500).json({message: err.message});
	}
};

//read
const readProduct = async(req, res) => {
	try {
		res.status(200).send(await Product.find());
	}
	catch (err) {
		res.status(500).json({message: err.message});
	}
};

//get by id
const readProductById = async(req, res) => {
	try {
		res.status(200).send(await Product.findById(req.query.id));
	}
	catch (err) {
		res.status(400).json({message: err.message});
	}
};

//get by name
const readProductByName = async(req, res) => {
	try {
		res.status(200).send(await Product.find({ name: req.query.name }));
	}
	catch (err) {
		res.status(400).json({message: err.message});
	}
};

//update
const updateProduct = async(req, res) => {
	try {
		let is = await Product.exists({_id: req.query._id});
		if (!is) {
			throw new Error('Not found');
		}
		await Product.findByIdAndUpdate(req.query.id, req.body);
		res.status(201).json({message: 'Product updated'});
	}
	catch(err) {
		res.status(400).json({message: err.message});
	}
};

//delete
const deleteProduct = async(req, res) => {
	try {
		let is = await Product.exists({_id: req.query._id});
		if (!is) {
			throw new Error('Not found');
		}
		await Product.findByIdAndDelete(req.query._id);
		res.status(200).json({message: 'Product removed'});
	}
	catch(err) {
		res.status(400).json({message: err.message});
	}
};

//exports
module.exports = {
	createProduct,
	readProduct,
	updateProduct,
	deleteProduct
};
