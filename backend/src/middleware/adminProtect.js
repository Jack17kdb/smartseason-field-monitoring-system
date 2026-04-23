const adminProtect = (req, res, next) => {
	try{
		const user = req.user;
		if(user.role !== 'admin') return res.status(403).json({ message: "Unauthorized access" });
		next();
	} catch(error) {
		console.log("Error verifying role: ", error);
	}
};

export default adminProtect;
