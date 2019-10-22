var mysql = require('mysql');
var prompt = require('prompt');
var inquirer = require('inquirer');


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'bamazon_db'
});

var printProducts = function() {

    connection.query('select * from products', function(err, res) {
        if (err) throw err;


        res.forEach(function(row) {
          console.log(JSON.stringify(row, null, 2));

          
        });

          prompt.start();
          prompt.get(['id_to_buy', 'quantity'], function(err, res) {
              if (err) throw err;

              var user_wants = res.id_to_buy;
              var user_quantity = res.quantity;

              promptUserPurchase(user_wants, user_quantity);
              printProducts();
          });
      });
}
// var userCheckPurchase = function(id, qt) {
//     connection.query('select * from products where item_id = ' + id, function(err, res) {
//         if (err) throw err;

//         var checkProduct = res[0].stock_quantitiy - qt;
        

//         if (checkProduct < 0) {
//             console.log('insufficent Quantity!');
//         } else {
//             console.log('user may buy ' + res[0].product_name + "!")
//             updateDb(id, res[0].stock_quantitiy, qt);
//         }
//     });
// }

function promptUserPurchase() {
	
	inquirer.prompt([
		{
			type: 'input',
			name: 'item_id',
			message: 'Enter item ID.',
			
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many?',
			
		}
	]).then(function(input) {
		

		var item = input.item_id;
		var quantity = input.quantity;

		
		var queryStr = 'SELECT * FROM products WHERE ?';

		connection.query(queryStr, {item_id: item}, function(err, data) {
			if (err) throw err;

			

			if (data.length === 0) {
				console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
				displayInventory();

			} else {
				var productData = data[0];

				
				if (quantity <= productData.stock_quantity) {
					console.log('Cool! It is in stock!');

					
					var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;
					
					connection.query(updateQueryStr, function(err, data) {
						if (err) throw err;

						console.log('Your total is $' + productData.price * quantity);
						console.log('We hope you enjoied shopping with Bamazon!');
						console.log("\n---------------------:)------------------------------------------------\n");

						
						connection.end();
					})
				} else {
					console.log('We dont have that many! Try a smaller number, like 1 or maybe 2');
					console.log('Try again.');
					console.log("\n-----------------:(----------------------------------------------------\n");

					displayInventory();
				};
			};
		});
	});
};


var updateDb = function(id,stock_quantitiy, qt) {
    stock_quantitiy = stock_quantitiy - qt;
    console.log(stock_quantitiy);
    connection.query('update products set stock_quantity = ' + stock_quantitiy + ' where item_id = ' + id, function(err, res) {
        if (err) throw err;
        
    });
}


connection.connect(function(err) {
    if (err) throw err;
    
});

printProducts();