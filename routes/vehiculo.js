const express = require('express') //Framework
const router = express.Router() //Rutas
const db = require('../config/database') //Acceso BD

router.get('/', async (req, res) => {
  try{
    const query = `
    SELECT
      V.idvehiculo,
        M.marca,
        V.modelo,
        V.color,
        V.combustible,
        V.afabricacion,
        V.condicion
      FROM vehiculos V
        INNER JOIN marcas M ON V.idmarca = M.idmarca
    `
    const [vehiculos] = await db.query(query)
    res.render('index', {vehiculos})
  }catch(error){
    console.error(error)
  }
});

router.get('/create', async(req, res) => {
  try{
    const [datos] = await db.query("SELECT * FROM marcas")
    res.render('create', { marcas: datos })
  }
  catch(error){
    console.error(error)
  }
})

router.post('/create', async(req, res) => {
  try{
    //Obtener los datos
    const {marcas, modelo, color, combustible, afabricacion, condicion} = req.body
    //Guardar registro
    await db.query(`INSERT INTO vehiculos (idmarca, modelo, color, combustible, afabricacion, condicion) VALUES (?,?,?,?,?,?)`, 
      [marcas, modelo, color, combustible, afabricacion, condicion])
    res.redirect('/')
  }catch(error){
    console.error(error)
  }
})

module.exports = router