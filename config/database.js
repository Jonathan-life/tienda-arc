const mysql = require('mysql2/promise')

//Crear pool de acceso
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tallerchincha'
})

//Verificar la conexión
async function testConnection(){
  try{
    const connection = await pool.getConnection()
    console.log("Conexión MySQL exitosa")
    connection.release() //liberar
  }catch(error){
    console.error("Error: ", error)
  }
}

testConnection();
module.exports = pool;