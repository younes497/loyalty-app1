const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  subscriptionActive: { type: Boolean, default: false },
  points: { type: Number, default: 0 }
});
const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => res.send('Loyalty Program API running'));

app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post('/api/users/:id/activate', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { subscriptionActive: true }, { new: true });
  res.json(user);
});

app.post('/api/users/:id/addpoints', async (req, res) => {
  const user = await User.findById(req.params.id);
  user.points += req.body.points || 0;
  await user.save();
  res.json(user);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
