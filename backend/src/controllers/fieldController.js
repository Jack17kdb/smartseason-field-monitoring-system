import User from '../models/userModel.js';
import Field from '../models/fieldModel.js';
import Observation from '../models/observationModel.js';
import calculateStatus from '../helpers/calculateStatus.js';

const getAssignedFields = async(req, res) => {
	try{
		const userId = req.user._id;
		const fields = await Field.find({ assignedTo: userId }).sort({ createdAt: -1 });
		res.status(200).json(fields);
	} catch(error) {
		console.log("Error fetching fields: ", error);
		res.status(500).json({ message: "Error fetching fields" });
	}
};

const updateFieldStage = async(req, res) => {
        try{
		const { id } = req.params;
		const { stage } = req.body;

		if(!id) return res.status(400).json({ message: "No field selected" });
		if(!stage) return res.status(400).json({ message: "Please provide stage" });

		const field = await Field.findById(id);

		field.currentStage = stage;

		const lastObservation = await Observation.findOne({ field_id: id }).sort({ createdAt: -1 });

		field.status = calculateStatus(field, lastObservation);

		await field.save();

		res.status(201).json(field);
	} catch(error) {
		console.log("Error updating field: ", error);
		res.status(500).json({ message: "Error updating field" });
	}
};

const addObservation = async(req, res) => {
        try{
		const { id } = req.params;
		const { note } = req.body;
		const userId = req.user._id;

		if(!id) return res.status(400).json({ message: "No field selected" });
		if(!note) return res.status(400).json({ message: "Please provide note" });

		const newObservation = new Observation({
			field_id: id,
			agent_id: userId,
			note
		});

		await newObservation.save();

		const field = await Field.findById(id);

		const updatedStatus = calculateStatus(field, newObservation);
		field.status = updatedStatus;

		await field.save();

		res.status(201).json(newObservation);
	} catch(error) {
		console.log("Error adding observation: ", error);
		res.status(500).json({ message: "Error adding observation" });
	}
};

const getFieldDetails = async(req, res) => {
        try{
		const { id } = req.params;
		if(!id) return res.status(400).json({ message: "No field selected" });

		const field = await Field.findById(id);
		if(!field) return res.status(400).json({ message: "No field found" });

		const observations = await Observation.find({ field_id: id }).populate('agent_id', 'username').sort({ createdAt: -1 });

		res.status(200).json({
			field,
			observations
		});
	} catch(error) {
		console.log("Error fetching field details: ", error);
		res.status(500).json({ message: "Error fetching field details" });
	}
};

export default { getAssignedFields, updateFieldStage, addObservation, getFieldDetails }
