const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const QuerySchema = new mongoose.Schema({
    queryId: { type: Number, unique: true },
    email: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, default: null },
    answerDate: { type: Date, default: null },
    userId: { type: Number, default: null },
    createdAt: { type: Date, default: Date.now }
});

QuerySchema.plugin(AutoIncrement, { inc_field: "queryId" });

const Query = mongoose.model("Query", QuerySchema);
module.exports = Query;
