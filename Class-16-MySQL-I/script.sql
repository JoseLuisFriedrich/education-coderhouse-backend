DROP DATABASE IF EXISTS `jlf-coder-backend`;
CREATE DATABASE `jlf-coder-backend`;
USE `jlf-coder-backend`;

CREATE TABLE IF NOT EXISTS items (
    id 			  INT 			    AUTO_INCREMENT PRIMARY KEY,
    itemName 	VARCHAR(100) 	NOT NULL,
    category 	VARCHAR(50) 	NOT NULL,
    stock 		TINYINT 		  NOT NULL
);

INSERT INTO items (itemName, category, stock)
VALUES
	('Fideos', 'Harina' , 20),
  ('Leche' , 'Lácteos', 30),
	('Crema' , 'Lácteos', 15);

SELECT * FROM items;

DELETE FROM items WHERE id = 1;
SELECT * FROM items;

UPDATE items
SET stock = 45
WHERE id = 2;
SELECT * FROM items;
