const express = require('express');
const { resolve } = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const app = express();
app.use(cors());
const port = 3000;

app.use(express.json());

let db;

(async () => {
  try {
    db = await open({
      filename: './BD4_Assignment1/database.sqlite',
      driver: sqlite3.Database,
    });

    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
    console.log('Connected to the SQLite database.');

  } catch (error) {
    console.error('Error opening database:', error.message);
  }
})();

// Exercise 1: Get All Restaurants
async function getAllRestaurants() {
  let query = `SELECT * FROM restaurants`;
  let response = await db.all(query, []);
  // console.log(response);
  return response;
}
app.get('/restaurants', async (req, res) => {
  try {
    let result = await getAllRestaurants();
    if (result.length === 0) {
      return res.status(404).json({
        error: false,
        message: `No restaurants found`,
        data: [],
      });
    }
    res.status(200).json({ error: false, data: result });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// Exercise 2: Get Restaurant by ID
async function getRestaurantById(id) {
  let query = 'SELECT * from restaurants WHERE id = ?';
  let response = db.get(query, [id]);
  return response;
}
app.get('/restaurants/details/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let result = await getRestaurantById(id);
    if (!result) {
      return res.status(404).json({
        error: false,
        message: `No restaurants found for id ${id}`,
        data: [],
      });
    }
    res.status(200).json({ error: false, data: result });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// Exercise 3: Get Restaurants by Cuisine
async function getRestaurantsByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE LOWER(cuisine) = ?';
  let response = await db.all(query, [cuisine]);
  // console.log(response);
  return response;
}
app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  try {
    let cuisine = req.params.cuisine.toLowerCase();
    let result = await getRestaurantsByCuisine(cuisine);
    if (result.length === 0) {
      return res.status(404).json({
        error: false,
        message: `No restaurants found for ${cuisine} cuisine`,
        data: [],
      });
    }
    res.status(200).json({ error: false, data: result });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// Exercise 4: Get Restaurants by Filter
async function filterRestaurants(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'SELECT *  FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  // console.log(response);
  return response;
}
app.get('/restaurants/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let hasOutdoorSeating = req.query.hasOutdoorSeating;
    let isLuxury = req.query.isLuxury;
    let result = await filterRestaurants(isVeg, hasOutdoorSeating, isLuxury);
    if (result.length === 0) {
      return res.status(404).json({
        error: false,
        message: `No restaurants found`,
        data: [],
      });
    }
    res.status(200).json({ error: false, data: result });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// Exercise 5: Get Restaurants Sorted by Rating
async function getRestaurantsSortedByRating() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query);
  // console.log(response);
  return response;
}
app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let result = await getRestaurantsSortedByRating();
    if (result.length === 0) {
      return res.status(404).json({
        error: false,
        message: 'No restaurants found',
        data: [],
      });
    }
    res.status(200).json({ error: false, data: result });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// Exercise 6: Get All Dishes
async function getAllDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query);
  // console.log(response);
  return response;
}

app.get('/dishes', async (req, res) => {
  try {
    let result = await getAllDishes();
    if (result.length === 0) {
      return res.status(404).json({
        error: false,
        message: 'No dishes found',
        data: [],
      });
    }
    res.status(200).json({ error: false, data: result });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// Exercise 7: Get Dish by ID
async function getDishById(id) {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let response = await db.get(query, [id]);
  // console.log(response);
  return response;
}

app.get('/dishes/details/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let result = await getDishById(id);
    if (!result) {
      return res.status(404).json({
        error: false,
        message: 'No dish found',
        data: [],
      });
    }
    res.status(200).json({ error: false, data: result });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// Exercise 8: Get Dishes by Filter
async function getDishesByFilter(isVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg = ?';
  let response = await db.all(query, [isVeg]);
  // console.log(response);
  return response;
}

app.get('/dishes/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg === 'true' ? 1 : 0;
    let result = await getDishesByFilter(isVeg);
    if (result.length === 0) {
      return res.status(404).json({
        error: false,
        message: 'No dishes found',
        data: [],
      });
    }
    res.status(200).json({ error: false, data: result });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// Exercise 9: Get Dishes Sorted by Price
async function getDishesSortedByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price ASC';
  let response = await db.all(query);
  // console.log(response);
  return response;
}
app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let result = await getDishesSortedByPrice();
    if (result.length === 0) {
      return res.status(404).json({
        error: false,
        message: 'No dishes found',
        data: [],
      });
    }
    res.status(200).json({ error: false, data: result });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});


module.exports = app;