var app = angular.module('app', ['ngRoute']);

var db = null;

//Database Connection 
var getData = (function () {
    products = [];
    const mongo = require('mongodb').MongoClient;
    const url = 'mongodb://127.0.0.1';
    return mongo.connect(url)
        .then((conn) => {
            db = conn.db('stockcontrol');    
        })
        .catch((err) => {
            throw err;
        });
    return db;
    /*mongo.connect('mongodb://127.0.0.1', (err, client) => {
        if (err) {
            throw err;
        }
        console.log("db Connected");
        db = client.db('stockcontrol');
        console.log(db.collection('stockcontrol').find());
        /*db.collection('stockcontrol').find().toArray(function (err, result) {
            if (err) {
                throw err;
            }
            else {
                console.log(result);
                for (const key in result) {
                    if (result.hasOwnProperty(key)) {
                        const element = { name: result[key] };
                        products.push(element.name);
                        console.log(element.name);
                    }
                }
            }
            //return products;
        //});
    });*/
})()

/*var fetchStockData = (function(){
    var stockResult;
    getData.then(function(){
        db.collection('chargerCollection').find().toArray(function(err,result){
            if(err){
                throw err;
            }
            else{
                console.log(result)
               stockResult = result;
            }
        })
    })
    return stockResult;
})();*/

//Routes and View Controller
app.config(['$routeProvider',function($routeProvider){
    console.log("Inside config")
    $routeProvider
    .when('/chargers',{
        templateUrl : 'views/chargers.html',
        controller: 'stockRecordController'
    })
    .when('/phones',{
        templateUrl : 'views/phones.html',
        controller: 'stockRecordController'
    })
    .when('/sim',{
        templateUrl : 'views/sim.html',
        controller: 'stockRecordController'
    })
    .when('/battery',{
        templateUrl : 'views/battery.html',
        controller: 'stockRecordController'
    })
}]);

//StockRecord Controller
    app.controller('stockRecordController',['$scope',function($scope){
        
        //Set all the input fields to ""
        //to avoid been set to undefined  
        $scope.name="";
        $scope.qty="";
        $scope.category="";
        $scope.type="";
        $scope.price="";
        $scope.brand="";
        $scope.model="";
        $scope.description="";

        //clear the input fields 
        var clearFields = function(){
            $scope.name="";
            $scope.qty="";
            $scope.category="";
            $scope.type="";
            $scope.price="";
            $scope.brand="";
            $scope.model="";
            $scope.description="";  
        }

    //GEt Charger Record and add it to scope for display
    getData.then(function(){
             db.collection('chargerCollection').find().toArray(function(err,result){
            if(err){
                throw err;
            }
            else{
                $scope.productChargers = result;
            }
        })  
    })

    $scope.addNewCharger = function(){  
        var name =  $scope.name.toLowerCase();
        var qty = $scope.qty.toLowerCase();
        var category = $scope.category.toLowerCase()
        var type =  $scope.type.toLowerCase();
        var price = $scope.price.toLowerCase();

        
        
        if(name != "" && category != "" && qty != "" && price != ""  && type != ""){
            getData.then(function(){
                db.collection('chargerCollection').insert({
                    name:name,
                    qty: parseInt(qty),
                    category: category,
                    type: type,
                    price: parseInt(price)
                })
            });
            
            //Add each to the table
            $scope.productChargers.push({
                name:  name,
                qty: qty,
                category: category,
                type:  type,
                price: price
            });

            //clear the input fields after insertion
            clearFields();
        }
    }

    //GEt Phone Record and add it to scope for display
    getData.then(function(){
        db.collection('phoneCollection').find().toArray(function(err,result){
            if(err){
                throw err;
            }
            else{
                $scope.productPhones = result;
            }
        })  
    })

    $scope.addNewPhone = function(){  
        var brand =  $scope.brand.toLowerCase();
        var model = $scope.model.toLowerCase();
        var qty = $scope.qty.toLowerCase();
        var price =  $scope.price.toLowerCase();

        if(brand !="" && model != "" && qty != "" && price != ""){
            getData.then(function(){
                db.collection('phoneCollection').insert({
                    brand:brand,
                    model: model,
                    qty: parseInt(qty),
                    price: parseInt(price)
                })
            });
            
            //Add each to the table
            $scope.productPhones.push({
                brand:  brand,
                model: model,
                qty: qty,
                price: price
            });
        //clear the input fields after insertion
        clearFields();    
        }
        
    }
    //end of addNewPhone

    //GEt Battery Record and add it to scope for display
    getData.then(function(){
        db.collection('batteryCollection').find().toArray(function(err,result){
            if(err){
                throw err;
            }
            else{
                $scope.productBattery = result;
            }
        })  
    })

    $scope.addNewBattery = function(){  
        var brand =  $scope.brand.toLowerCase();
        var model = $scope.model.toLowerCase();
        var qty = $scope.qty.toLowerCase();
        var price =  $scope.price.toLowerCase();
        
        if(brand != "" && model != "" && qty != "" && price != ""){
            getData.then(function(){
                db.collection('batteryCollection').insert({
                    brand:brand,
                    model: model,
                    qty: parseInt(qty),
                    price: parseInt(price)
                })
            });
            
            //Add each to the table
            $scope.productBattery.push({
                brand:  brand,
                model: model,
                qty: qty,
                price: price
            });
            //clear the input fields after insertion
            clearFields();
        }
    }
    //end of addNewBattery

    //GEt Sim Record and add it to scope for display
    getData.then(function(){
        db.collection('simCollection').find().toArray(function(err,result){
            if(err){
                throw err;
            }
            else{
                $scope.productSim = result;
            }
        })  
    })

    $scope.addNewSim = function(){  
        var brand =  $scope.brand.toLowerCase();
        var  description = $scope.description.toLowerCase();
        var qty = $scope.qty.toLowerCase();
        var price =  $scope.price.toLowerCase();
        
        if(brand != "" && description != "" && qty != "" && price != ""){
            getData.then(function(){
                db.collection('simCollection').insert({
                    brand:brand,
                    description:  description,
                    qty: parseInt(qty),
                    price: parseInt(price)
                })
            });
            
            //Add each to the table
            $scope.productSim.push({
                brand:  brand,
                description:  description,
                qty: qty,
                price: price
            });
            //clear the input fields after insertion
            clearFields();
        }
    }



    ////////////// DELETE DATA FUNCTION  ////////////////
    let theRecordTODelete = ""; //the row and the data that was clicked

    $scope.setDeleteRecord = function(){//when any row is clicked set theRecordToDelete variable
        theRecordTODelete = this.product;
    }

    $scope.deleteRecord = function(){    //deletes the selected record
        console.log(theRecordTODelete);
        /*let brand = this.product.brand;
        let description = this.product.description;
        let qty = parseInt(this.product.qty);
        let type = parseInt(this.product.type);

        /*db.collection('simCollection').remove(
            {
                $and:{
                      brand:brand,
                      description:description,
                      qty:qty,
                      type:type
                }
            }
        );*/

        $scope.productSim.pop(theRecordTODelete);
        console.log( $scope.productSim);
    }
    //end of addNewSim
}]);

//Sales Record Controller
app.controller('viewSalesRecordController', ['$scope', function ($scope) {
    getData().then(function (conn) {
        products = [];
        db.collection('salesDataCollection').find().toArray(function (err, result) {
            if (err) {
                throw err;
            }
            else {
                var tableBody = document.getElementById('myTable');
                var numbers = 0;
                for (const key in result) {
                    numbers++;
                    //create a row and add the result from the database
                    var tableRow = document.createElement('tr');
                    //create six td's for displaying each item
                    for(let i =1;i <= 6; i++){
                        let tdata;
                        tdata = document.createElement('td'); 
                        if (result.hasOwnProperty(key)) {
                            const element = result[key];
                            console.log(element.gloQty);
                            switch (i) {
                                case 1:
                                    tdata.innerHTML = numbers; 
                                    break;
                                case 2:
                                    tdata.innerHTML = element.mtnQty;
                                    break;
                                case 3:
                                    tdata.innerHTML = element.gloQty;
                                    break;
                                case 4:
                                    tdata.innerHTML = element.airtelQty;
                                    break;
                                case 5:
                                    tdata.innerHTML = element.etisalatQty;
                                    break;
                                case 6:
                                    tdata.innerHTML = element.date;
                                    break;
                                default:
                                    break;
                            }
                            tableRow.appendChild(tdata);
                        }
                    }
                    tableBody.appendChild(tableRow)
                }   
            }
        });//end of toArray
    });
}]);

//Add Sales Record Controller
app.controller('addSalesController', ['$scope', function ($scope) {

    $scope.simcards = [
        { name: "Mtn", qty: "0", totalPrice:0, unitPrice:"",gain:""},
        { name: "Glo", qty: "0", totalPrice:0, unitPrice:"",gain:""},
        { name: "Airtel", qty: "0", totalPrice:0, unitPrice:"",gain:""},
        { name: "Etisalat", qty: "0", totalPrice:0, unitPrice:"",gain:""}
    ];
    //  
    $scope.simswaps = [
        { name: "Mtn", qty: "0" , totalPrice:0, unitPrice:"",gain:""},
        { name: "Glo", qty: "0" , totalPrice:0, unitPrice:"",gain:"" },
        { name: "Airtel", qty: "0", totalPrice:0, unitPrice:"",gain:"" },
        { name: "Etisalat", qty: "0" ,totalPrice:0, unitPrice:"",gain:""}
    ];
    

    $scope.addSalesRecord = function () {
        getData().then((conn)=>{
            let simcards = $scope.simcards;
            let simswaps = $scope.simswaps;

            let simQty = [];
            let simswapQty = [];

            //GET THE OBJECTS LOOP THROUGH IT AND GET THE QUANTITIES
            //for simcards
            for (const key in simcards) {
                if (simcards.hasOwnProperty(key)) {
                    let element = simcards[key];
                    simQty.push(element.qty);
                }
            }
            //for simswaps
            for (const key in simswaps) {
                if (simswaps.hasOwnProperty(key)) {
                    let element = simswaps[key];
                    simswapQty.push(element.qty);
                }
            }

            //get the number of sims sold from simcards array
            let mQty = simQty[0];
            let gQty = simQty[1];
            let aQty = simQty[2];
            let eQty = simQty[3];

            //get the number of simswaps from the simswaps array
            let mSwapQty = simswapQty[0];
            let gSwapQty = simswapQty[1];
            let aSwapQty = simswapQty[2];
            let eSwapQty = simswapQty[3];
    
            console.log('Mtn Sim Sold ' + mQty);//07031642660
            console.log('glo Sim Sold ' + gQty);
            console.log('air Sim Sold ' + aQty);
            console.log('eti Sim Sold ' + eQty);
    
            // get date object
            var date = new Date();
            var seconds = date.getSeconds();
            var minutes = date.getMinutes();
            var hours = date.getHours();
            //Format the time to look like a normal clock
            var amPm;
            if (hours > 12) {
                amPm = "PM";
            }
            else {
                amPm = "AM";
            }
            if (hours >= 13) {
                hours = hours - 12;
            }
            if (hours < 0) {
                hours = 12;
            }
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            var submitTime = hours + ' : ' + minutes + ' : ' + seconds + ' ' + amPm;
            var day = date.getDate();
            var month = date.getMonth();
            month++;
            var year = date.getFullYear();
            var submitDate = (day + " - " + month + " - " + year);
            console.log('Todays date is: ' + submitDate + ' And the time is ' + submitTime);
    
    
            // INSERT SIMCARD DATA INTO THE DATABASE
            db.collection('salesDataCollection').insert({
                time: submitTime,
                date: submitDate,
                mtnQty: mQty,
                airtelQty: aQty,
                gloQty: gQty,
                etisalatQty: eQty
            }, function (err, result) {
                if (err) {
                    throw err;
                    return
                }
                console.log("Record Inserted");
            });
            
            //Insert the swap data into the database
            db.collection('swapSalesDataCollection').insert({
                time: submitTime,
                date: submitDate,
                mtnSwapQty: mSwapQty,
                airtelSwapQty: aSwapQty,
                gloSwapQty: gSwapQty,
                etisalatSwapQty: eSwapQty
            },function(err, result){
                if(err){
                    throw err;
                    return;
                }
                console.log("Simswap record Inserted");
            });
        });   
    }

    //ADD AND SUBTRACT FUNCTION
    $scope.getAddBtn = function (simcard) {
        simcard.qty++;
        console.log(simcard.name);
        if( simcard.unitPrice == ""){
            simcard.totalPrice += 300;
        }
        else{
            simcard.totalPrice += parseInt(simcard.unitPrice);
        } 
        
        db.collection('simCollection').update(
            {$and:[{brand:simcard.name.toLowerCase()},{description:'normal'}]},
            {$inc :{"qty":-1}}
        ,
        function(err,result){
            if(err){
                throw err;
            }
            else{
                console.log("Document Updated");
            }
        })
    }

    $scope.getSubBtn = function (simcard) {
        if (simcard.qty != 0)
            simcard.qty--;
            if( simcard.unitPrice == ""){
                simcard.totalPrice -= 300;
            }
            else{
                simcard.totalPrice -= parseInt(simcard.unitPrice);
            } 
            
            db.collection('simCollection').update({
                $and:[{brand:simcard.name},{description:"normal"}],
                $inc:{qty: 1}
            })
    }

    // Add and Subtract functions for sim swap buttons
    $scope.getSwapAddBtn = function (simswap) {
        simswap.qty++;
        if( simswap.unitPrice == ""){
            simswap.totalPrice += 1200;
        }
        else{
            simswap.totalPrice += parseInt(simswap.unitPrice);
        }
        
        db.collection('simCollection').update(
            {$and:[{brand:simswap.name.toLowerCase()},{description:'swap'}]},
            {$inc :{"qty":1}}
        ,
        function(err,result){
            if(err){
                throw err;
            }
            else{
                console.log("Swap Document Updated");
            }
        })
    }

    $scope.getSwapSubBtn = function (simswap) {
        if (simswap.qty != 0)
            simswap.qty--;
            if( simswap.unitPrice == ""){
                simswap.totalPrice -= 1200;
            }
            else{
                simswap.totalPrice -= parseInt(simswap.unitPrice);
            }   
            //Increase the swap sim by one
            db.collection('simCollection').update(
                {$and:[{brand:simswap.name.toLowerCase()},{description:'normal'}]},
                {$inc :{"qty":1}}
            ,
            function(err,result){
                if(err){
                    throw err;
                }
                else{
                    console.log("Swap Document Updated");
                }
            })
    }
}]);
