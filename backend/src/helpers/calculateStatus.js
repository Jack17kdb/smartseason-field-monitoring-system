const calculateStatus = (field, lastObservation) => {
	if(field.currentStage === 'harvested') return 'completed';

	const sixtyDaysAgo = new Date();
	sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

	const warningKeywords = ['pest', 'wilt', 'disease', 'dry', 'dead'];
	const hasWarningNote = lastObservation && warningKeywords.some(word => lastObservation.note.toLowerCase().includes(word));

	if (field.updatedAt < sixtyDaysAgo || hasWarningNote) {
		return 'at risk';
	}

	return 'active';
};

export default calculateStatus;
