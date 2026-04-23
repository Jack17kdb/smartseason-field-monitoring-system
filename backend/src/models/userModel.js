import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		trim: true,
		unique: true,
		required: true
	},
	email: {
		type: String,
		trim: true,
		unique: true,
		required: true
	},
	password: {
		type: String,
		minlength: 6,
		required: true
	},
	role: {
		type: String,
		enum: ['admin', 'agent'],
		default: 'agent'
	}
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
