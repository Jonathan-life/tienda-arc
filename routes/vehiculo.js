const express = require('express')
const router = express.Router()
const db = require('../config/database')

router.get('/', async (req, res) => {
  //deserialización
  const [vehiculos] = await db.query(`SELECT * FROM vehiculos`)
  res.send(vehiculos)
});

module.exports = router