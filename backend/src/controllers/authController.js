import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

const register = async(req, res) => {
	try{
		const { username, email, password } = req.body;

		if(!username || !email || !password) return res.status(400).json({ message: "Please fill in all fields." });
		if(password.length < 6) return res.status(400).json({ message: "Password cannot be less than 6 characters." });

		const exists = await User.findOne({
			$or: [{ username }, { email }]
		});

		if(exists) return res.status(400).json({ message: "username or email already exists." });

		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password);

		const newUser = new User({
			username,
			email,
			password: hash,
			role: 'agent'
		});

		await newUser.save();
		generateToken(newUser._id, res);

		res.status(201).json({
			_id: newUser._id,
			username: newUser.username,
			email: newUser.email
		});
	} catch(error) {
		console.log("Error registering user: ", error);
		res.status(500).json({ message: "Error registering user" });
	}
};

const login = async(req, res) => {
	try{
		const { email, password } = req.body;
		
		if(!email || !password) return res.status(400).json({ message: "Please fill in all fields." });

		const user = await User.findOne({ email });
		if(!user) return res.status(400).json({ message: "Invalid credentials." });

		const isMatch = await bcrypt.compare(password, user.password);
		if(isMatch) return res.status(400).json({ message: "Invalid credentials." });

		generateToken(user._id, res);

		res.status(200).json({
			_id: user._id,
			username: user.username,
			email: user.email
		});
	} catch(error) {
		console.log("Error logging in user: ", error);
		res.status(500).json({ message: "Error logging in user." });
	}
};

const logout = async(req, res) => {
	try{
		res.cookie('token', "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });	
	} catch(error) {
		console.log("Error logging out user: ", error);
		res.status(500).json({ message: "Error logging out user." });
	}
};

const authcheck = async(req, res) => {
	try{
		res.status(200).json(req.user);
	} catch(error) {
		console.log("Error checking auth: ", error);
		res.status(500).json({ message: "Error checking auth." });
	}
};

export default { register, login, logout, authcheck }

