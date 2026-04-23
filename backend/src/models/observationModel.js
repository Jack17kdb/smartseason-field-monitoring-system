import mongoose from 'mongoose';

const observationSchema = new mongoose.Schema({
	field_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Field',
		required: true
	},
	agent_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	note: {
		type: String,
		trim: true,
		required: true
	}
}, { timestamps: true });

const Observation = mongoose.model('Observation', observationSchema);

export default Observation;
