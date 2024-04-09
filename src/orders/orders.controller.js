const path = require("path")

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"))

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId")


// middleware for checking if body had deliverTo
function bodyHasDeliverProp(req, res, next) {
  const { data: { deliverTo } = {} } = req.body
  if (deliverTo) {
    res.locals.deliverTo = deliverTo
    return next()
  }
  next({
    status: 400,
    message: `A 'deliverTo' property is required.`,
  })
}

// middleware for checking if body has mobileNumber
function bodyHasMobileNumber(req, res, next) {
  const { data: { mobileNumber } = {} } = req.body
  if (mobileNumber) {
    res.locals.mobileNumber = mobileNumber
    return next()
  }
  next({
    status: 400,
    message: `A 'mobileNumber' property is required.`,
  })
}

// middleware for checking if the body has a status
function bodyHasStatus(req, res, next) {
  const { data: { status } = {} } = req.body
  if (status) {
    res.locals.status = status
    return next()
  }
  next({
    status: 400,
    message: `A 'status' property is required.`,
  })
}

// middleware for checking if the status is in the correct format
function statusIsValid(req, res, next) {
    const { data: { status } = {} } = req.body;
    const validStatus = ["pending", "preparing", "out-for-delivery", "delivered"];
    if(validStatus.includes(status)) {
        res.locals.status = status
        return next()
    }
    next({
        status: 400,
        message: `Order must have a status of ${validStatus}`,
    })
}


// middleware for checking if body has dishes
function bodyHasDishes(req, res, next) {
  const { data: { dishes } = {} } = req.body
  if (dishes) {
    res.locals.dishes = dishes
    return next()
  }
  next({
    status: 400,
    message: `A 'dishes' property is required.`,
  })
}

// middleware for checking if there is a valid number of dishes
function validateDish(req, res, next) {
    const {data: {dishes} = {} } = req.body;
    if(!Array.isArray(res.locals.dishes) || res.locals.dishes.length == 0) {
        return next({
            status: 400,
            message: `Order must include at least one dish`
        });
    }
    next();
}

// middleware for checking if there is a valid quantity of a given dish
function validateDishQty(req, res, next) {
    const { data: { dishes } = {} } = req.body;
    dishes.forEach((dish) => {
        const quantity = dish.quantity;
        if(!quantity || quantity <=0 || typeof quantity !=="number") {
            return next({
                status: 400,
                message: `Dish ${dish.id} must have a quantity that is an integer greater than 0`
            })
        }
    })
     next()
}

// middleware for checking if the order and data for the order match
function matchingIds(req, res, next) {
    const { data: { id } = {} } = req.body;
    const orderId = req.params.orderId;
    if (id !== "" && id !== orderId && id !==null && id !== undefined) {
        next({
            status: 400,
            message: `Order id does not match route id. Order: ${id}, Route: ${orderId}`,
        })
    }
    return next()
}

// middleware for checking if the order exists
function orderExists(req, res, next) {
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id === orderId);
    if(foundOrder) {
        res.locals.order = foundOrder;
        return next();
    }
    next({
        status: 404,
        message: `Order id not found: ${orderId}`
    })
}


// ROUTE HANDLERS

// handler for listing the all of the orders
function list(req, res) {
  res.json({ data: orders })
}

// handler for updating an order
function update(req, res) {
  const orderId = req.params.orderId
  const matchingOrder = orders.find((order) => order.id === orderId)
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body
  matchingOrder.deliverTo = deliverTo
  matchingOrder.mobileNumber = mobileNumber
  matchingOrder.status = status
  matchingOrder.dishes = dishes
  res.json({ data: matchingOrder })
}

// handler for reading the orders
function read(req, res) {
  const orderId = req.params.orderId
  const matchingOrder = orders.find((order) => order.id === orderId)
  res.json({ data: matchingOrder })
}

// handler for making a new order
function create(req, res) {
  const { data: { deliverTo, mobileNumber, dishes } = {} } = req.body
  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    status: "out-for-delivery",
    dishes,
  }
  orders.push(newOrder)
  res.status(201).json({ data: newOrder })
}

// handler for deleting an order
function destroy(req, res, next) {
  const { orderId } = req.params
  const matchingOrder = orders.find((order) => order.id === orderId)
  const { data: { id, deliverTo, mobileNumber, status, dishes } = {} } =
    req.body
  if (matchingOrder.status === "pending") {
    const index = orders.findIndex((order) => order.id === Number(orderId))
    orders.splice(index, 1)
    res.sendStatus(204)
  }
  return next({
    status: 400,
    message: `order cannot be deleted unless order status = 'pending'`,
  })
}

module.exports = {
  list,
  read: [orderExists, read],
  create: [
    bodyHasDeliverProp,
    bodyHasMobileNumber,
    bodyHasDishes,
    validateDish,
    validateDishQty,
    create,
  ],
  update: [
    orderExists,
    matchingIds,
    bodyHasDeliverProp,
    bodyHasMobileNumber,
    bodyHasDishes,
    bodyHasStatus,
    statusIsValid,
    validateDish,
    validateDishQty,
    update,
  ],
  delete: [orderExists, destroy],
}