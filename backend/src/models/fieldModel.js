import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true
	},
	cropType: {
		type: String,
		trim: true,
		required: true
	},
	plantingDate: {
		type: Date,
		required: true
	},
	currentStage: {
		type: String,
		enum: ['planted', 'growing', 'ready', 'harvested'],
		default: 'planted',
		required: true
	},
	status: {
		type: String,
		enum: ['active', 'at risk', 'completed'],
		default: 'active',
		required: true
	},
	assignedTo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
}, { timestamps: true });

const Field = mongoose.model('Field', fieldSchema);

export default Field;
