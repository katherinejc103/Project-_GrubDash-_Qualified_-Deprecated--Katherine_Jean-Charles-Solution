
const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
let lastDishId = dishes.reduce((maxId, dish) => Math.max(maxId, dish.id), 0);

function create(req, res) {
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

function bodyDataHas(propertyName) {
    return function (req, res, next) {
      const { data = {} } = req.body;
      if (data[propertyName]) {
        return next();
      }
      next({
          status: 400,
          message: `Must include a ${propertyName}`
      });
    };
  }

  function descriptionPropertyValid(req, res, next){
    const { data: { description } = {} } = req.body;
    const validDescription = [""]
    if (validDescription.includes(description)){
        return next()
    }
    next({
        status: 400,
        message: `Value of the 'description' property must be one of ${validDescription}. Received: ${description}`,
      });



    function imagePropertyValid(req, res, next){
        const { data: { image_url } = {} } = req.body;
        const validImage = [""]
        if (validImage.includes(image_url)){
            return next()
        }
        next({
            status: 400,
            message: `Value of the 'image_url' property must be one of ${validImage}. Received: ${image_url}`,
          });
    
      }

function list(req, res){
 const {dishId} = req.params
 res.json({ data: dishes.filter(dishId ? dish => dish.id == dishId : () => true) });

}

module.exports = {
    create: [     
        bodyDataHas("name"),
        descriptionPropertyValid,
        imageValid],
    create,
    list
}