CREATE DATABASE tienda_ropa;
USE tienda_ropa;


CREATE TABLE marcas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);


INSERT INTO marcas (nombre) VALUES ('Nike'), ('Adidas'), ('Puma');


CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

INSERT INTO categorias (nombre) VALUES ('Camiseta'), ('Pantalón'), ('Chaqueta');


CREATE TABLE tallas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    talla VARCHAR(10) NOT NULL
);

INSERT INTO tallas (talla) VALUES ('S'), ('M'), ('L'), ('XL');


CREATE TABLE colores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

INSERT INTO colores (nombre) VALUES ('Negro'), ('Blanco'), ('Rojo'), ('Azul');

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    marca_id INT,
    categoria_id INT,
    talla_id INT,
    color_id INT,
    precio DECIMAL(10, 2),
    stock INT,
    FOREIGN KEY (marca_id) REFERENCES marcas(id),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    FOREIGN KEY (talla_id) REFERENCES tallas(id),
    FOREIGN KEY (color_id) REFERENCES colores(id)
);


INSERT INTO productos (nombre, marca_id, categoria_id, talla_id, color_id, precio, stock) VALUES
('Camiseta Deportiva', 1, 1, 2, 1, 59.99, 10),
('Chaqueta Running', 2, 3, 3, 2, 99.99, 5),
('Pantalón Training', 3, 2, 4, 3, 79.50, 8),
('Camiseta Casual', 2, 1, 1, 4, 39.90, 12);

SELECT 
    p.nombre AS producto,
    m.nombre AS marca,
    c.nombre AS categoria,
    t.talla,
    co.nombre AS color,
    p.precio,
    p.stock
FROM productos p
JOIN marcas m ON p.marca_id = m.id
JOIN categorias c ON p.categoria_id = c.id
JOIN tallas t ON p.talla_id = t.id
JOIN colores co ON p.color_id = co.id
WHERE m.nombre = 'Adidas' 
  AND c.nombre = 'Camiseta'
  AND t.talla = 'M'
  AND co.nombre = 'Blanco';
select * from marca;