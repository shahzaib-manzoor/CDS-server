import mongoose from 'mongoose';

 
const patientDetailsSchema = new mongoose.Schema({
    familyHistory: {
        type: String,   
        required: true, 
        trim: true
    },
    age: {
        type: Number,
        required: true, 
        min: 0  
    },
    cholesterolHistory: {
        type: String, 
        required: false, 
        trim: true
    },
    dietHistory: {
        type: String, 
        required: false,  
        trim: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Non-Binary', 'Other'],  
        required: true  
    }
}, {
    timestamps: true 
});
 
const PatientDetails = mongoose.model('PatientDetails', patientDetailsSchema);

export default PatientDetails;
