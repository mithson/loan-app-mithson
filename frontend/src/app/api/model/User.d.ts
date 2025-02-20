import mongoose from "mongoose";
declare const FormDatas: mongoose.Model<{
    personalDetails?: {
        name: string;
        email: string;
        phone: string;
    } | null | undefined;
    employmentDetails?: {
        employerName: string;
        income: number;
        position: string;
    } | null | undefined;
    otherDetails?: {
        pan: string;
        aadhaar: string;
        comments?: string | null | undefined;
    } | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    personalDetails?: {
        name: string;
        email: string;
        phone: string;
    } | null | undefined;
    employmentDetails?: {
        employerName: string;
        income: number;
        position: string;
    } | null | undefined;
    otherDetails?: {
        pan: string;
        aadhaar: string;
        comments?: string | null | undefined;
    } | null | undefined;
}> & {
    personalDetails?: {
        name: string;
        email: string;
        phone: string;
    } | null | undefined;
    employmentDetails?: {
        employerName: string;
        income: number;
        position: string;
    } | null | undefined;
    otherDetails?: {
        pan: string;
        aadhaar: string;
        comments?: string | null | undefined;
    } | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    personalDetails?: {
        name: string;
        email: string;
        phone: string;
    } | null | undefined;
    employmentDetails?: {
        employerName: string;
        income: number;
        position: string;
    } | null | undefined;
    otherDetails?: {
        pan: string;
        aadhaar: string;
        comments?: string | null | undefined;
    } | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    personalDetails?: {
        name: string;
        email: string;
        phone: string;
    } | null | undefined;
    employmentDetails?: {
        employerName: string;
        income: number;
        position: string;
    } | null | undefined;
    otherDetails?: {
        pan: string;
        aadhaar: string;
        comments?: string | null | undefined;
    } | null | undefined;
}>> & mongoose.FlatRecord<{
    personalDetails?: {
        name: string;
        email: string;
        phone: string;
    } | null | undefined;
    employmentDetails?: {
        employerName: string;
        income: number;
        position: string;
    } | null | undefined;
    otherDetails?: {
        pan: string;
        aadhaar: string;
        comments?: string | null | undefined;
    } | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default FormDatas;
//# sourceMappingURL=User.d.ts.map