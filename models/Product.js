import mongoose from 'mongoose';

//item in recipe
class item {
	constructor(ObjectId, quantity, unit) {
		this.ObjectId = ObjectId;
		this.quantity = quantity;
		this.unit = unit;
	}
}

//schema
const product = new mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	name: {type: String, required: true},
	stock: {type: Number, min: 0},
	production: {type: Number, min: 0},
	labour_cost: {type: Number, min: 0},
	other_cost: {type: Number, min: 0},
	selling_price: {type: Number, min: 0},
	recipe: {type: [item]}
}, { timestamps: true });

const Product = mongoose.model('Product', product);
export default Product;
