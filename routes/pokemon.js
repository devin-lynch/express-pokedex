const { default: axios } = require('axios');
const express = require('express');
const db = require('../models');
const router = express.Router();
let detailURL = 'http://pokeapi.co/api/v2/pokemon/'

// GET /pokemon - return a page with favorited Pokemon
router.get('/', async (req, res) => {
  try {
    const allFaves = await db.pokemon.findAll()
    res.render('faves.ejs', { allFaves })
  } catch(err) {
    console.warn(err)
    res.send(`server error`)
  }
  // TODO: Get all records from the DB and render to view
  res.render('faves.ejs');
});

// POST /pokemon - receive the name of a pokemon and add it to the database
router.post('/', async (req, res) => {
  try {
    // console.log(req.body)
    await db.pokemon.create(req.body)
    res.redirect("/pokemon")
  } catch(err) {
    console.warn(err)
    res.send(`server error`)
  }
  // TODO: Get form data and add a new record to DB
  // res.send(req.body);
});

router.get('/:name', (req, res) => {
  let detailURL = `http://pokeapi.co/api/v2/pokemon/${req.params.name}`
  axios.get(detailURL)
    .then(response => {
      res.render('show.ejs', {details : response.data, originalImg : response.data.sprites.other['official-artwork'].front_default})
      console.log(response.data)
    })
})

router.delete('/:name', async (req, res) => {
  try {
    console.log(req.body)
    await db.pokemon.destroy({
      where: {
        name : req.params.name
      }
    })
    res.redirect("/pokemon")
  } catch(err) {
    console.warn(err)
    res.send(`server error`)
  }
})

module.exports = router;
