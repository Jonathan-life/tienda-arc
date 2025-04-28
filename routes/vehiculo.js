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

//Ruta para acceder a la vista (CREACIÓN DE VEHICULOS)
router.get('/create', async(req, res) => {
  try{
    const [datos] = await db.query("SELECT * FROM marcas")
    res.render('create', { marcas: datos })
  }
  catch(error){
    console.error(error)
  }
})

//Esta ruta renderiza el formulario de edición, para ello se debe identificar el vehículo
router.get('/edit/:id', async(req, res) => {
  try{
    const [datos] = await db.query("SELECT * FROM marcas")
    const [registro] = await db.query("SELECT * FROM vehiculos WHERE idvehiculo = ?", [req.params.id])

    if (registro.length > 0)
      res.render('edit', { marcas: datos, vehiculo: registro[0] })
    else
      res.redirect('/')
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

//Proceso e actualización de datos
router.post('/edit/:id', async(req, res) => {
  try{
    //Obtener los datos
    const {marcas, modelo, color, combustible, afabricacion, condicion} = req.body //<form></form>
    
    //Actualizar registro
    await db.query("UPDATE vehiculos SET idmarca=?, modelo=?, color=?, combustible=?, afabricacion=?, condicion=? WHERE idvehiculo=?", 
      [marcas, modelo, color, combustible, afabricacion, condicion, req.params.id])

    res.redirect('/')
  }catch(error){
    console.error(error)
  }
})

//Eliminación
router.get('/delete/:id', async(req, res) => {
  try{
    //Datos que ingresan por el <form></form> req.body.objeto
    //Datos que ingresan por GET/URL req.params.atributo
    const [resultado] = await db.query("DELETE FROM vehiculos WHERE idvehiculo = ?", [req.params.id])
    //res.send(resultado)
    res.redirect('/')
  }catch(error){
    console.error(error);
  }
})

module.exports = router