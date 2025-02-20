"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
export var userSchema = new mongoose_1.default.Schema({
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
var FormDatas = mongoose_1.default.model("formdatas", userSchema);
exports.default = FormDatas;
