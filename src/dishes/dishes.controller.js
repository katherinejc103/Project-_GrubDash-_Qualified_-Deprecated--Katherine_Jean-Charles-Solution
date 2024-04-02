const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

app.get('/dishes', (req, res) => {
    res.json({ data: dishes });
  });

  let lastDishId = dishes.reduce((maxId, dish) => Math.max(maxId, dish.id), 0);

  app.post("/dishes", (req, res, next) => {
    const {data: { name, description, price, image_url } = {} } = req.body;
  
    const newDish = {
        id: ++lastDishId,
        name,
        description,
        price,
        image_url
    }
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
  });