import Task from "../models/Task.js";

export const getTasks = async (req, res) => {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
};

export const createTask = async (req, res) => {
    const task = await Task.create({
        userId: req.user.id,
        title: req.body.title,
        completed: false
    });
    res.json(task);
};

export const updateTask = async (req, res) => {
    const task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        req.body,
        { new: true }
    );
    res.json(task);
};

export const deleteTask = async (req, res) => {
    await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Deletado" });
};