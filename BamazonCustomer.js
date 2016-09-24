const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", 
    password: "",
    database: "bamazon"
})
	connection.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}
	 
	console.log('connected as id ' + connection.threadId);
	Purchase();
	});
var Purchase = function(){



	console.log("Welcome to Bamazon! If you would like to place an order, pleasse find the id of the item you wish to purchase from the table below.")
	console.log("Here's our current inventory.");
	connection.query("SELECT * from bamazon.products", function(err, res){
			  if (err) {
	    console.log("Error!" + err);
	    return;
	  }
		for (var i=0; i < res.length; i++){
			console.log(res[i].id + " | " + res[i].productname + " | " + res[i].departmentname + " | " + res[i].price +" | "+ res[i].stockquantity)
		}
	buySomething();
	});

}
var buySomething = function(){
	console.log(" If you would like to close the program, please type 'END' for either prompt during the purchase.")
	inquirer.prompt([
		{
			type:"input",
			message:"What item would you like to purchase?",
			name:"itemID"
		},
		{
			type:"input",
			message:"How many would you like to purchase today?",
			name:"itemAmount"
		}
	]).then(function(purchase){
		var item = purchase.itemID
		var number = purchase.itemAmount
		if(item.toLowerCase() == 'end' || number.toLowerCase() == 'end'){
			endProgram();

		}
		else{
			console.log(item)
			connection.query("SELECT `stockquantity` FROM `products` WHERE ?",{
				id: item
			}, function(err, res){
				var stock = res;
				if(number > stock){
					console.log("We're sorry, we don't have enough of that item in stock.")
					buySomething();
				} else{
					console.log(stock);
					connection.query("UPDATE `products` SET `stockquantity` = (`stockquantity` - ?) WHERE `id` = ?",[{
						number
					},{
						item
					}], function(err, res) {});
					console.log(res);
					console.log("Thank you for your purchase!");
					buySomething();
				};
			});
		};
	});
};

var endProgram = function(){
	console.log("Thank you for visiting, hope to see you again soon!")
		connection.end();
		process.exit();
}

