
const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function create(req, res) {
  
  let lastDishId = dishes.reduce((maxId, dish) => Math.max(maxId, dish.id), 0);

//   app.post("/dishes", (req, res, next) => {
//     const {data: { name, description, price, image_url } = {} } = req.body;
  
    const newDish = {
        id: ++lastDishId,
        name: name,
        description: description,
        price: price,
        image_url : image_url,
    }
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
 
}

function list(req, res){
 const {dishId} = req.params
 res.json({ data: dishes.filter(dishId ? dish => dish.id == dishId : () => true) });

}

module.exports = {
    create: [
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("price"),
        bodyDataHas("image_url"),
        create
    ],
    list
}