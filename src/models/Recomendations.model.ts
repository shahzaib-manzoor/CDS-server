import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
    criteria: {
        type: Map,
        of: String,  
        required: true
    },
    recommendations: [{
        type: String
    }],
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

export default Recommendation;
