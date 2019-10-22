var mysql = require('mysql');
var prompt = require('prompt');

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

          // prompter = true;
        });

          prompt.start();
          prompt.get(['id_to_buy', 'quantity'], function(err, res) {
              if (err) throw err;

              var user_wants = res.id_to_buy;
              var user_quantity = res.quantity;

              userCheckPurchase(user_wants, user_quantity);
              printProducts();
          });
      });
}
var userCheckPurchase = function(id, qt) {
    connection.query('select * from products where item_id = ' + id, function(err, res) {
        if (err) throw err;

        var check_product = res[0].stock_quantitiy - qt;

        if (check_product < 0) {
            console.log('insufficent stock!');
        } else {
            console.log('user may buy ' + res[0].product_name + "!")
            updateDb(id, res[0].stock_quantitiy, qt);
        }
    });
}
var updateDb = function(id,stock_quantitiy, qt) {
    stock_quantitiy = stock_quantitiy - qt;
    console.log(stock_quantitiy);
    connection.query('update products set stock_quantity = ' + stock_quantitiy + ' where item_id = ' + id, function(err, res) {
        if (err) throw err;
        // console.log(res);
    });
}


connection.connect(function(err) {
    if (err) throw err;
    // printProducts();
});

printProducts();