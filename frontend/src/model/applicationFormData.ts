import mongoose, { Schema, Document } from 'mongoose';

interface ApplicationFormData extends Document {
  personalDetails: {
    name: string;
    email: string;
    phone: string;
  };
  employmentDetails: {
    employerName: string;
    income: number;
    position: string;
  };
  otherDetails: {
    pan: string;
    aadhaar: string;
    comments?: string;
  };
}

const FormDataSchema = new Schema<ApplicationFormData>({
  personalDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
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
    comments: { type: String, required: false },
  },
});

export default mongoose.models.FormData || mongoose.model<ApplicationFormData>('FormData', FormDataSchema);
