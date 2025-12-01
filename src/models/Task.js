import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    title: String,
    completed: Boolean
});

export default mongoose.model("Task", taskSchema);