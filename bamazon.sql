DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

create table products(
  item_id int auto_increment primary key,
  product_name varchar(30) not null,
  dept_name varchar(30) not null,
  price decimal(9,2) not null,
  stock_quantity int not null
);

insert into products (product_name, dept_name, price, stock_quantity) values
  ('gibson_firebird', 'guitars', 1699.00, 5),
  ('crocs', 'shoes', 34.00, 28),
  ('vans', 'shoes', 50.00, 200),
  ('red_wings', 'shoes', 324.00, 50),
  ('alpo', 'dog_food', 9.99, 1000),
  ('purina', 'dog_food', 34.00, 120),
  ('steven_tyler_pjs', 'clothes', 5000.00, 1),
  ('sweatpants', 'clothes', 63.99, 12),
  ('zubaz', 'clothes', 75.99, 7),
  ('sweater_vest', 'clothes', 23.07, 9);