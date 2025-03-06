const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

let users = [];

app.post('/users', (req, res) => {
  
    const { userId, name, email } = req.body;
  
    if (users.find(u => u.userId === userId)) {

        return res.status(400).json({ error: 'User already exists' });
    }
  
    const newUser = {

        userId,
        name,
        email,
        maxBookings: 3,
        activeBookings: 0 
    };

    users.push(newUser);

    res.json(newUser);
  });

app.get('/users/:userId', (req, res) => {

    const user = users.find(u => u.userId === req.params.userId);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.put('/users/:userId', (req, res) => {

    const user = users.find(u => u.userId === req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    const { customerActiveBooking } = req.body;

    user.activeBooking = req.body.activeBookings;
  
    res.json({ message: 'User updated', user });
});

app.listen(port, () => {

console.log(`Users microservice listening on port ${port}`);
});