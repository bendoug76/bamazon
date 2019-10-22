var mysql = require('mysql');
var prompt = require('prompt');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'bamazon_db'
});

connection.connect(function(err){
  if (err) throw err;
});

console.log('1. View Products For Sale');
console.log('2. View Low Inventory');
console.log('3. Add To Inventory');
console.log('4. Add New Product \n');

var prompter = true;

main();

function main(){
    prompt.start();
    prompt.get(['command'], function(err, result){

      if (err) throw err;

          switch (parseInt(result.command)) {
            case 1:
              viewProducts();
              break;
            case 2:
              viewLowInventory();
              prompter = false;
              break;
            case 3:
              addInventory();
              prompter = false;
              break;
            case 4:
              addProduct();
              prompter = false;
              break;
            default:
              console.log('bad input!');

          }
    });
}
function viewProducts(){
  connection.query('select * from products', function(err, res) {
    if (err) throw err;
    res.forEach(function(row){
      console.log(JSON.stringify(row, null, 2));
    });
    main();
  });
}
function viewLowInventory(){
  connection.query('select * from products where stock_quantity < 5', function(err, res){
    if(err) throw err;

    res.forEach(function(row){
      console.log(JSON.stringify(row, null, 2));
    });
    main();
  });
}
function addInventory(){
    inquirer.prompt([
		{
			type: 'input',
			name: 'item_id',
			message: 'Please enter the Item ID for stock_count update.',
		
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many would you like to add?',
			
		}
	]).then(function(input) {
		

		var item = input.item_id;
		var addQuantity = input.quantity;

		
		var queryStr = 'SELECT * FROM products WHERE ?';

		connection.query(queryStr, {item_id: item}, function(err, data) {
			if (err) throw err;

			

			if (data.length === 0) {
				console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
				addInventory();

			} else {
				var productData = data[0];

				
				console.log('Updating Inventory...');

				
				var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity + addQuantity) + ' WHERE item_id = ' + item;
				
				connection.query(updateQueryStr, function(err, data) {
					if (err) throw err;

					console.log('Stock count for Item ID ' + item + ' has been updated to ' + (productData.stock_quantity + addQuantity) + '.');
					console.log("\n---------------------------------------------------------------------\n");

					
					connection.end();
				})
			}
		})
	})
}

function addProduct(){

}