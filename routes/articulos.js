const express = require('express');
const router = express.Router();
const db = require('../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Página de inicio
router.get('/', async (req, res) => {
  try {
    const [productos] = await db.query('SELECT * FROM productos LIMIT 10');
    res.render('index', { productos });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar la página principal');
  }
});

// Catálogo con filtros
router.get('/catalogo', async (req, res) => {
  try {
    const { marca, categoria, talla, color, precioMin, precioMax } = req.query;

    let query = `
      SELECT P.id, P.nombre, M.nombre AS marca, C.nombre AS categoria, 
             T.talla, CO.nombre AS color, P.precio, P.stock, P.imagen
      FROM productos P
      INNER JOIN marcas M ON P.marca_id = M.id
      INNER JOIN categorias C ON P.categoria_id = C.id
      INNER JOIN tallas T ON P.talla_id = T.id
      INNER JOIN colores CO ON P.color_id = CO.id
      WHERE 1=1
    `;
    let params = [];

    if (marca) query += ' AND M.nombre = ?', params.push(marca);
    if (categoria) query += ' AND C.nombre = ?', params.push(categoria);
    if (talla) query += ' AND T.talla = ?', params.push(talla);
    if (color) query += ' AND CO.nombre = ?', params.push(color);
    if (precioMin) query += ' AND P.precio >= ?', params.push(precioMin);
    if (precioMax) query += ' AND P.precio <= ?', params.push(precioMax);

    const [productos] = await db.query(query, params);
    const [marcas] = await db.query("SELECT * FROM marcas");
    const [categorias] = await db.query("SELECT * FROM categorias");
    const [tallas] = await db.query("SELECT * FROM tallas");
    const [colores] = await db.query("SELECT * FROM colores");

    res.render('catalogo', {
      productos,
      marcas,
      categorias,
      tallas,
      colores
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el catálogo');
  }
});

// Mostrar formulario de creación
router.get('/create', async (req, res) => {
  try {
    const [marcas] = await db.query("SELECT * FROM marcas");
    const [categorias] = await db.query("SELECT * FROM categorias");
    const [tallas] = await db.query("SELECT * FROM tallas");
    const [colores] = await db.query("SELECT * FROM colores");

    res.render('create', { marcas, categorias, tallas, colores });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el formulario');
  }
});

// Crear nuevo producto con imagen
router.post('/create', upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, marca_id, categoria_id, talla_id, color_id, precio, stock } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await db.query(`
      INSERT INTO productos (nombre, marca_id, categoria_id, talla_id, color_id, precio, stock, imagen)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [nombre, marca_id, categoria_id, talla_id, color_id, precio, stock, imagen]);

    const productoId = result.insertId;  // Obtén el ID del producto insertado
    res.redirect(`/edit/${productoId}`);  // Redirige a la página de edición del producto
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al registrar el producto');
  }
});

// Mostrar formulario de edición
router.get('/edit/:id', async (req, res) => {
  try {
    const [producto] = await db.query("SELECT * FROM productos WHERE id = ?", [req.params.id]);
    const [marcas] = await db.query("SELECT * FROM marcas");
    const [categorias] = await db.query("SELECT * FROM categorias");
    const [tallas] = await db.query("SELECT * FROM tallas");
    const [colores] = await db.query("SELECT * FROM colores");

    if (producto.length > 0) {
      res.render('edit', {
        producto: producto[0],
        marcas,
        categorias,
        tallas,
        colores
      });
    } else {
      res.redirect('/');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar la edición');
  }
});

router.get('/edit/:id', async (req, res) => {
  try {
    const productoId = req.params.id;

    // Obtener el producto con su información actual
    const [producto] = await db.query('SELECT * FROM productos WHERE id = ?', [productoId]);

    if (producto.length === 0) {
      return res.status(404).send('Producto no encontrado');
    }

    // Obtener listas necesarias para los selects (marcas, categorías, etc.)
    const [marcas] = await db.query('SELECT * FROM marcas');
    const [categorias] = await db.query('SELECT * FROM categorias');
    const [tallas] = await db.query('SELECT * FROM tallas');
    const [colores] = await db.query('SELECT * FROM colores');

    res.render('editar_producto', {
      producto: producto[0],
      marcas,
      categorias,
      tallas,
      colores
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el formulario de edición');
  }
});

// Eliminar producto
router.get('/delete/:id', async (req, res) => {
  try {
    const [producto] = await db.query("SELECT imagen FROM productos WHERE id = ?", [req.params.id]);

    // Eliminar imagen del servidor
    if (producto.length > 0 && producto[0].imagen) {
      const rutaImagen = path.join(__dirname, '../public', producto[0].imagen);
      fs.unlink(rutaImagen, (err) => {
        if (err) console.warn('No se pudo eliminar la imagen del producto:', err.message);
      });
    }

    await db.query("DELETE FROM productos WHERE id = ?", [req.params.id]);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar el producto');
  }
});

// Mostrar todos los productos
router.get('/productos', async (req, res) => {
  try {
    const [productos] = await db.query("SELECT * FROM productos");
    res.render('productos', { productos });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar los productos');
  }
});

module.exports = router;
