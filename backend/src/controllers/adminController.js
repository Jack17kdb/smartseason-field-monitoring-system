import User from '../models/userModel.js';
import Field from '../models/fieldModel.js';

const createField = async(req, res) => {
	try{
		const { name, cropType, plantingDate, currentStage, assigned } = req.body;

		if(!name || !cropType || !plantingDate || !currentStage || !assigned) {
			return res.status(400).json({ message: "Please fill all fields" });
		}

		const assignedTo = await User.findOne({ username: assigned });
		if(!assignedTo) return res.status(400).json({ message: "No user found" });

		const newField = await Field.create({
			name,
			cropType,
			plantingDate,
			currentStage,
			assignedTo: assignedTo._id
		});

		res.status(201).json(newField);
	} catch(error) {
		console.log("Error creating field: ", error);
		res.status(500).json({ message: "Error creating field" });
	}
};

const assignField = async(req, res) => {
        try{
		const { id } = req.params;
		const { username } = req.body;

		const user = await User.findOne({ username });
		if(!user) return res.status(400).json({ message: "No user found" });

		const field = await Field.findById(id);
		if(!field) return res.status(400).json({ message: "No field found" });

		field.assignedTo = user._id;
		await field.save();

		res.status(200).json(field);
	} catch(error) {
		console.log("Error updating field: ", error);
		res.status(500).json({ message: "Error updating field" });
	}
};

const getAllFields = async(req, res) => {
        try{
		const fields = await Field.find({}).populate('assignedTo', 'username email').sort({ createdAt: -1 });
		res.status(200).json(fields);
	} catch(error) {
		console.log("Error fetching fields: ", error);
		res.status(500).json({ message: "Error fetching fields" });
	}
};

const getDashboardStats = async(req, res) => {
        try{
		const stats = await Field.aggregate([
			{
				$group: {
					_id: "$status",
					count: { $sum: 1 }
				}
			}
		]);

		const totalFields = await Field.countDocuments();

		const breakdown = {
			active: stats.find(s => s._id === 'active')?.count || 0,
			atRisk: stats.find(s => s._id === 'at risk')?.count || 0,
			completed: stats.find(s => s._id === 'completed')?.count || 0,
		};

		res.status(200).json({
			totalFields,
			breakdown,
			cropDistribution: await Field.distinct('cropType')
		});
	} catch(error) {
		console.log("Error fetching stats: ", error);
		res.status(500).json({ message: "Error fetching dashboard statistics" });
	}
};


export default { createField, assignField, getAllFields, getDashboardStats }
