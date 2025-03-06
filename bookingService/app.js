const express = require('express');
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

let bookings = [];

app.post('/bookings', async(req, res) => {
  
    const { bookingId, userId, carId, startDate, endDate } = req.body;

    const userResponse = await axios.get(`http://localhost:3001/users/${userId}`).catch(() => null);
    if (!userResponse) return res.status(404).json({ message: "User not found" });

    const carResponse = await axios.get(`http://localhost:3000/cars/${carId}`).catch(() => null);
    if (!carResponse) return res.status(404).json({ message: "Car not found" });

    const user = userResponse.data;
    const car = carResponse.data;

    if (user.activeBookings >= user.maxBookings) {
      return res.status(400).json({ message: "User has reached the booking limit." });
    }
  
    if (!car.isAvailable) {
      return res.status(400).json({ message: "Car is not available." });
    }

    const newBooking = { 
      bookingId,
      userId,
      carId,
      startDate,
      endDate,
      status: "active" 
    };

    bookings.push(newBooking);

    await axios.put(`http://localhost:3000/cars/${carId}`, { available: false });

   
    await axios.put(`http://localhost:3001/users/${userId}`, { activeBookings: user.activeBookings + 1 });
  
    res.json(newBooking);
  });

app.get('/bookings/:userId', (req, res) => {

  const userBookings = bookings.filter(b => b.userId === req.params.userId);

  if (!userBookings){
    return res.status(404).json({ message: "User has made no bookings." });
  }

  res.json(userBookings);
});

app.delete('/bookings/:bookingId', async(req, res) => {

  const booking = bookings.find(b => b.bookingId === req.params.bookingId);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found." });
  }

  if (booking.status === "canceled") {
    return res.status(400).json({ message: "Booking is already canceled." });
  }

  await axios.put(`http://localhost:3000/cars/${carId}`, { available: true });

  const userResponse = await axios.get(`http://localhost:3001/users/${userId}`).catch(() => null);
  if (userResponse) {
    const user = userResponse.data;
    await axios.put(`http://localhost:3001/users/${userId}`, { activeBookings: Math.max(0, user.activeBookings - 1) });
  }

  booking.status = "canceled";
  res.json({ message: "Booking canceled successfully.", booking });
});

app.listen(port, () => {

console.log(`Bookings microservice listening on port ${port}`);
});