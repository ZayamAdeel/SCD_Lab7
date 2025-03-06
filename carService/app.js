const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let cars = [];

app.post('cars', (req, res) => {
  
    const { carId, model, location } = req.body;
  
    if (cars.find(c => c.carId === carId)) {

        return res.status(400).json({ error: 'Car already exists' });
    }
  
    const newCar = {

        carId,
        model,
        location,
        isAvailable: true 
    };

    cars.push(newCar);

    res.json(newCar);
  });

app.get('/cars/:carId', (req, res) => {

    const car = cars.find(c => c.carId === req.params.carId);

    if (car) {
        res.json(car);
    } else {
        res.status(404).json({ message: 'Car not found' });
    }
});

app.put('/cars/:carId', (req, res) => {

    const car = cars.find(c => c.carId === req.params.carId);

    if (car) {
        car.isAvailable = req.body.isAvailable;
        res.json(car);
    } else {
        res.status(404).json({ message: 'Car not found' });
    }
});

app.listen(port, () => {

console.log(`Cars microservice listening on port ${port}`);
});