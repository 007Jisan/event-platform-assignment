const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// --- আপনার পাসওয়ার্ড সহ ডাটাবেস লিংক ---
const MONGO_URI = "mongodb+srv://jis:jis1333@cluster0.0p6wnnf.mongodb.net/eventdb?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
.then(() => console.log("✅ Database Connected Successfully"))
.catch(err => console.log("❌ DB Connection Error:", err));

// --- ইভেন্ট মডেল ---
const EventSchema = new mongoose.Schema({
    title: String,
    date: String,
    location: String,
    description: String,
    category: String
});
const Event = mongoose.model('Event', EventSchema);

// --- API রাউটস ---
app.get('/', (req, res) => {
    res.send('Server is Running!');
});

// সব ইভেন্ট দেখার জন্য
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// নতুন ইভেন্ট তৈরি করার জন্য
app.post('/api/events', async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        await newEvent.save();
        res.json(newEvent);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// ইভেন্ট ডিলেট করার জন্য
app.delete('/api/events/:id', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: "Event Deleted" });
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// --- সার্ভার স্টার্ট ---
app.listen(5000, () => console.log("✅ Server Running on Port 5000"));