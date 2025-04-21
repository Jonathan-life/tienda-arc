CREATE DATABASE tallerchincha;
USE tallerchincha;

CREATE TABLE IF NOT EXISTS marcas
(
	idmarca 	INT AUTO_INCREMENT PRIMARY KEY,
    marca 		VARCHAR(40) 	NOT NULL,
    CONSTRAINT uk_marca_ma UNIQUE (marca)
)ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS vehiculos
(
	idvehiculo		INT AUTO_INCREMENT PRIMARY KEY,
    idmarca 		INT 			NOT NULL,
    modelo 			VARCHAR(40)		NOT NULL,
    color 			VARCHAR(40) 	NOT NULL,
    combustible 	ENUM('Diesel', 'Gasolina', 'GLP', 'GNV', 'Híbrido'),
    afabricacion	CHAR(4)			NOT NULL,
    condicion		ENUM('Nuevo', 'Seminuevo'),
    CONSTRAINT fk_idmarca_veh FOREIGN KEY (idmarca) REFERENCES marcas (idmarca)
)ENGINE = INNODB;

INSERT INTO marcas (marca) VALUES 
	('KIA'),		-- 1
    ('Toyota'); 	-- 2

INSERT INTO vehiculos (idmarca, modelo, color, combustible, afabricacion, condicion) VALUES
	(1, 'Sorento', 'negro', 'Gasolina', '2023', 'Seminuevo'),
    (2, 'Hilux', 'blanco', 'Diesel', '2025', 'Nuevo');
    


