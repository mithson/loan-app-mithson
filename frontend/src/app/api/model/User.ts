import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
  personalDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
  },
  employmentDetails: {
    employerName: { type: String, required: true },
    income: { type: Number, required: true },
    position: { type: String, required: true },
  },
  otherDetails: {
    pan: { type: String, required: true },
    aadhaar: { type: String, required: true },
    comments: { type: String },
  },
});

export const FormDatas = mongoose.model("formdatas", userSchema);

export default FormDatas;
