var app = angular.module('app', ['ngRoute']);

var db = null;

// THIS SERVICE HOLDS COMMON FUNCTIONS USED BETWEEN CONTROLLERS
app.service('commonFunctions',[ function(){
    this.getDateAndTime = (function(){
        // get date object
        var date = new Date();
        var seconds = date.getSeconds();
        var minutes = date.getMinutes();
        var hours = date.getHours();

        //Format the time to look like a normal clock time
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

        return{
            submitTime: submitTime,
            submitDate: submitDate
        }
    })();
}])

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
    .when('/salebattery',{
        templateUrl : 'views/saleproductviews/addbatterysale.html',
        controller: 'addSalesController'
    })
    .when('/salecharger',{
        templateUrl : 'views/saleproductviews/addchargersale.html',
        controller: 'addSalesController'
    })
    .when('/salephone',{
        templateUrl : 'views/saleproductviews/addphonesale.html',
        controller: 'addSalesController'
    })
    .when('/salesim',{
        templateUrl : 'views/saleproductviews/addsimsale.html',
        controller: 'addSalesController'
    })
    .when('/daily',{
        templateUrl : 'views/salesreportviews/daily.html',
        controller: 'showDailySalesReportController'
    })
    .when('/simreport',{
        templateUrl : 'views/salesreportviews/simsalesreport.html',
        controller: 'showDailySalesReportController'
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
        var qty = $scope.qty;
        var category = $scope.category.toLowerCase()
        var model =  $scope.model.toLowerCase();
        var price = $scope.price;

         
        if(name != "" && category != "" && qty != "" && price != ""  && type != ""){
            getData.then(function(){
                db.collection('chargerCollection').insert({
                    name:name,
                    qty: parseInt(qty),
                    category: category,
                    model: model,
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
        var qty = $scope.qty;
        var price =  $scope.price;

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
        var qty = $scope.qty;
        var price =  $scope.price;
        
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
                console.log(result)
                $scope.productSim = result;
            }
        })  
    })


    ////////////// DELETE DATA FUNCTION  ////////////////

    //delete sim record
    $scope.simDeleteRecord = function(product){    //deletes the selected record
        let productIndex = $scope.productSim.indexOf(product);
        if(productIndex == -1){}//the first click produces index of -1 so ignore first attempt to delete
        else{
            $scope.productSim.splice(productIndex,1);
        
        
            let brand = product.brand;
            let description = product.description;
            let qty = parseInt(product.qty);
            let price = parseInt(product.price);

            db.collection('simCollection').remove(
                {
                    $and:[
                         { brand:brand },
                         { description:description },
                         { qty:qty },
                         { price:price }
                    ]
                },function(err,result){
                    if(err){
                        throw err;
                    }
                    else{
                        console.log(result)
                        console.log('Record Deleted successfully');
                    }
                }
            );
        }   
    }

    //delete charger record
    $scope.chargerDeleteRecord = function(product){    //deletes the selected record
        let productIndex = $scope.productChargers.indexOf(product);
        if(productIndex == -1){}//the first click produces index of -1 so ignore first attempt to delete
        else{
            $scope.productChargers.splice(productIndex,1);
        
        
            let name = product.name;
            let category = product.category;
            let type = product.type;
            let qty = parseInt(product.qty);
            let price = parseInt(product.price);

            db.collection('chargerCollection').remove(
                {
                    $and:[
                         { name:name },
                         { category:category },
                         { type:type },
                         { qty:qty },
                         { price:price }
                    ]
                },function(err,result){
                    if(err){
                        throw err;
                    }
                    else{
                        console.log(result)
                        console.log('Record Deleted successfully');
                    }
                }
            );
        }   
    }

    //delete phone record
    $scope.phoneDeleteRecord = function(product){    //deletes the selected record
        let productIndex = $scope.productPhones.indexOf(product);
        if(productIndex == -1){}//the first click produces index of -1 so ignore first attempt to delete
        else{
            $scope.productPhones.splice(productIndex,1);

            let brand = product.brand;
            let model = product.model;
            let qty = parseInt(product.qty);
            let price = parseInt(product.price);

            db.collection('phoneCollection').remove(
                {
                    $and:[
                         { brand:brand },
                         { model:model },
                         { qty:qty },
                         { price:price }
                    ]
                },function(err,result){
                    if(err){
                        throw err;
                    }
                    else{
                        console.log(result)
                        console.log('Record Deleted successfully');
                    }
                }
            );
        }   
    }

    //delete battery record
    $scope.batteryDeleteRecord = function(product){    //deletes the selected record
        let productIndex = $scope.productBattery.indexOf(product);
        if(productIndex == -1){}//the first click produces index of -1 so ignore first attempt to delete
        else{
            $scope.productBattery.splice(productIndex,1);

            let brand = product.brand;
            let model = product.model;
            let qty = parseInt(product.qty);
            let price = parseInt(product.price);

            db.collection('batteryCollection').remove(
                {
                    $and:[
                         { brand:brand },
                         { model:model },
                         { qty:qty },
                         { price:price }
                    ]
                },function(err,result){
                    if(err){
                        throw err;
                    }
                    else{
                        console.log(result)
                        console.log('Record Deleted successfully');
                    }
                }
            );
        }   
    }

    ///////////////////////////////////////////////////////////
    /////////////////    UPDATE FUNCTIONS    //////////////////////
    $scope.simUpdateRecord = function(product){      //    SIM
        $scope.brand = product.brand;
        $scope.description = product.description;
        $scope.qty = product.qty;
        $scope.price = product.price;

        //delete the record so the new record will take its place
        $scope.simDeleteRecord(product);
    }

    $scope.chargerUpdateRecord = function(product){  //  CHARGER
        $scope.name = product.name;
        $scope.category = product.category;
        $scope.type = product.type;
        $scope.qty = product.qty;
        $scope.price = product.price;

        //delete the record so the new record will take its place
        $scope.chargerDeleteRecord(product);
    }

    $scope.phoneUpdateRecord = function(product){    //PHONE
        $scope.brand = product.brand;
        $scope.model = product.model;
        $scope.qty = product.qty;
        $scope.price = product.price;

        //delete the record so the new record will take its place
        $scope.phoneDeleteRecord(product);
    }

    $scope.batteryUpdateRecord = function(product){   //BATTERY
        $scope.brand = product.brand;
        $scope.model = product.model;
        $scope.qty = product.qty;
        $scope.price = product.price;

        //delete the record so the new record will take its place
        $scope.batteryDeleteRecord(product);
    }
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
app.controller('addSalesController', ['$scope','commonFunctions','$route', function ($scope,commonFunctions,$route) {
    var vm = this;
    
    // reload data from database
    $scope.reloadData = function(){
        console.log('keeeekekekeke');
        $route.reload();
    }

    //get date for usage
    var getDateAndTime = (function(){
        // get date object
        var date = new Date();
        var seconds = date.getSeconds();
        var minutes = date.getMinutes();
        var hours = date.getHours();

        //Format the time to look like a normal clock time
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

        return{
            submitTime: submitTime,
            submitDate: submitDate
        }
    })();

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
    
    // add each sim record to the database
    $scope.addSalesRecord = function () {
        getData.then((conn)=>{
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

    
            // INSERT SIMCARD DATA INTO THE DATABASE
            db.collection('salesDataCollection').insert({
                time: getDateAndTime.submitTime,
                date: getDateAndTime.submitDate,
                mtnQty: mQty,
                airtelQty: aQty,
                gloQty: gQty,
                etisalatQty: eQty
            }, function (err, result) {
                if (err) {
                    throw err;
                    return;
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
        let productPrice = null; // keeps record of the price of product sold
        if( simcard.unitPrice == ""){
            simcard.totalPrice += 300;
            productPrice = 300;
        }
        else{
            simcard.totalPrice += parseInt(simcard.unitPrice);
            productPrice += parseInt(simcard.unitPrice);
        } 
        getData.then(function(){
            // Subtracts the qty of product sold from the total available
            db.collection('simCollection').update(
                {$and:[
                    { brand:simcard.name.toLowerCase() },
                    { description:'normal' }
                ]},
                { $inc :{"qty":-1} }
            ,
            function(err,result){
                if(err){
                    throw err;
                }
                else{
                    console.log("Document Updated");
                }
            })

            // add together the qty sold for daily report
            db.collection('dailySimSalesReport').update(
                { $and:[
                    { date: commonFunctions.getDateAndTime.submitDate },
                    { brand:simcard.name.toLowerCase() },
                    { description:'normal' }
                ]},
                { $inc :{ qty: 1, price: productPrice } },
                { upsert: true }
            ,
            function(err,result){
                if(err){
                    throw err;
                }
                else{
                    console.log(result);
                    console.log(" Document i Updated");
                }
            })   
        })
    }

    $scope.getSubBtn = function (simcard) {
        let productPrice = null; // keeps record of the price of product sold
        if (simcard.qty != 0)
            simcard.qty--;
            if( simcard.unitPrice == ""){
                simcard.totalPrice -= 300;
                productPrice = 300;
            }
            else{
                simcard.totalPrice -= parseInt(simcard.unitPrice);
                productPrice = parseInt(simcard.unitPrice);
            } 
            
            db.collection('simCollection').update(
                {$and:[{brand:simcard.name},{description:"normal"}]},
                { $inc:{qty: 1}}
            ,function(err,result){
                if(err){
                    throw err;
                }
                else{
                    console.log("Document Updated");
                }
            })

            // this record shows up in daily report 
            db.collection('dailySimSalesReport').update(
                { $and:[
                    { date: commonFunctions.getDateAndTime.submitDate },
                    { brand:simcard.name.toLowerCase() },
                    { description:'normal' }
                ]},
                { $inc :{ qty: -1, price: -productPrice }}
            ,
            function(err,result){
                if(err){
                    throw err;
                }
                else{
                    console.log(result);
                    console.log(" Document i Updated");
                }
            })
    }

    // Add and Subtract functions for sim swap buttons
    $scope.getSwapAddBtn = function (simswap) {
        simswap.qty++;
        let productPrice = null; // keeps record of the price of product sold
        if( simswap.unitPrice == ""){
            simswap.totalPrice += 1200;
            productPrice = 1200;
        }
        else{
            simswap.totalPrice += parseInt(simswap.unitPrice);
            productPrice += parseInt(simswap.unitPrice);
        }
        
        // Subtracts the qty of product sold from the total available
        getData.then(function(){
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
    
            // add together the qty sold for daily report //swap report
            db.collection('dailySimSalesReport').update(
                { $and:[
                    { date: commonFunctions.getDateAndTime.submitDate },
                    { brand:simswap.name.toLowerCase() },
                    { description:'swap' }
                ]},
                { $inc :{ qty: 1, price: productPrice } },
                { upsert: true }
            ,
            function(err,result){
                if(err){
                    throw err;
                }
                else{
                    console.log(result);
                    console.log(" Document i Updated");
                }
            })
        })   
    }

    $scope.getSwapSubBtn = function (simswap) {
        let productPrice = null;
        if (simswap.qty != 0)
            simswap.qty--;
            if( simswap.unitPrice == ""){
                simswap.totalPrice -= 1200;
                productPrice = 1200;
            }
            else{
                simswap.totalPrice -= parseInt(simswap.unitPrice);
                productPrice = parseInt(simswap.unitPrice);
            }  
            
            getData.then(function(){
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

            // add together the qty sold for daily report //swap report
            db.collection('dailySimSalesReport').update(
                { $and:[
                    { date: commonFunctions.getDateAndTime.submitDate },
                    { brand:simswap.name.toLowerCase() },
                    { description:'swap' }
                ]},
                { $inc :{ qty: -1, price: -productPrice } },
                { upsert: true }
            ,
            function(err,result){
                if(err){
                    throw err;
                }
                else{
                    
                    console.log(result);
                    console.log(" Document i Updated");
                }
            })
            })
    }
    
    // update sales record for battery and phone
    // for daily report each item sold is incremented in the db and the price is also 
    // incremented as well
    var updateSalesRecordForProducts = function(stockCollection){

        let brand = $scope.soldBrand;
        let model = $scope.soldModel;
        let qty   = parseInt($scope.soldQty);
        let price = parseInt($scope.soldPrice);
        let type  = $scope.soldType;
        let category = $scope.soldCategory;

        let otherStockSalesRecordColObj= db.collection('dailySalesReportCollection');
        otherStockSalesRecordColObj.update(
            { $and:[
                    { date: getDateAndTime.submitDate },
                    { brand: brand },
                    { model: model }
            ]},
            {$inc: { "qty": qty, "price": price }},
            { upsert: true }, 
             function(err,result){
                    if(err){
                        throw err;
                    }  
                    else{
                        console.log("update successfull");
                        console.log("this isresult" + result);
                    }
                } 
        )
    }

    var addSalesDataToDb = function(productCollection,id){
        let brand = $scope.soldBrand;
        let model = $scope.soldModel;
        let qty   = parseInt($scope.soldQty);
        let price = parseInt($scope.soldPrice);
        //let type  = $scope.soldType;
        let category = $scope.soldCategory;

        getData.then(function(){
            let productCollectionObj = db.collection(productCollection)
            if( category === undefined){
                productCollectionObj.insertOne({
                    pid   : id,
                    date  : getDateAndTime.submitDate,
                    time  : getDateAndTime.submitTime,
                    brand : brand,
                    model : model,
                    qty   : qty,
                    price : price
                },function(err,res){
                    if(err){
                        throw err;
                    }
                    else{
                        console.log('The result for insertion: '+ res);
                    }
                });       
            }else{
                productCollectionObj.insertOne({
                    pid    : id,
                    date  : getDateAndTime.submitDate,
                    time  : getDateAndTime.submitTime,
                    brand : brand,
                    qty   : qty,
                    price : price,
                    model  : model,
                    category  : category
                },function(err,res){
                    if(err){
                        throw err;
                    }
                    else{
                        $route.reload();
                        console.log('The result for insertion: '+ res);
                    }
                });
            } 
        })
    } 
   
    // get daily sales and add it to table
    getData.then(function(){
        console.log('meemeemee');
        //for getting battery sales report
        db.collection('dailyBatteryRecordCollectionOne').find(
            { date : getDateAndTime.submitDate }
        ).toArray(function(err,result){
            console.log(result)
            $scope.batteryReportScope = result;
        })

        //for getting phone sales report
        db.collection('dailyPhoneRecordCollectionOne').find(
            { date : getDateAndTime.submitDate }
        ).toArray(function(err,result){
            console.log(result)
            $scope.phoneReportScope = result;
        })

        //for getting phone sales report
        db.collection('dailyChargerRecordCollectionOne').find(
            { date : getDateAndTime.submitDate }
        ).toArray(function(err,result){
            console.log(result)
            $scope.chargerReportScope = result;
        })
    })


    $scope.addDailySalesRecordForBattery = function(){

        var brand = $scope.soldBrand;
        var model = $scope.soldModel;
        var qty   = parseInt($scope.soldQty);
        var price = parseInt($scope.soldPrice);
        var type  = $scope.soldType;
        var category = $scope.soldCategory;

        $scope.batteryReportScope.push({
            brand: brand,
            model: model,
            price: price,
            qty:   qty
        });

        addSalesDataToDb('dailyBatteryRecordCollectionOne','bat');
        updateSalesRecordForProducts();

        //add each product to the table after insertion
        
    }

    $scope.addDailySalesRecordForPhone = function(){

        let brand = $scope.soldBrand;
        let model = $scope.soldModel;
        let qty   = parseInt($scope.soldQty);
        let price = parseInt($scope.soldPrice);
       
        addSalesDataToDb('dailyPhoneRecordCollectionOne','pho');
        updateSalesRecordForProducts();
        //add each product to the table after insertion
        /*$scope.phoneReportScope.push({
            brand: brand,
            model: model,
            price: price,
            qty:   qty
        });*/
    }

    $scope.addDailySalesRecordForCharger = function(){

        let brand = $scope.soldBrand;
        let model = $scope.soldModel;
        let qty   = parseInt($scope.soldQty);
        let price = parseInt($scope.soldPrice);
        //let type  = $scope.soldType;
        let category = $scope.soldCategory;

        addSalesDataToDb('dailyChargerRecordCollectionOne','char');
        updateSalesRecordForProducts();
        //add each product to the table after insertion
        $scope.chargerReportScope.push({
            brand: brand,
            category: category,
            price: price,
            qty: qty,
            model: model
        });
    }
}]);

app.controller('showDailySalesReportController',['$scope','commonFunctions','$filter',function($scope,commonFunctions,$filter){
        let todaysDate = commonFunctions.getDateAndTime.submitDate;
        $scope.showDate = todaysDate;
        // fetch the sales report for the selected date
        $scope.fetchThisDateSalesReport = function(elem){
            //fetch data when the enter key is pressed
            if(event.keyCode == 13){
                var myDatee = new Date($scope.datePicker);
                console.log(myDatee.getMonth() + 1);
                console.log(myDatee.getDay());
                
                console.log($scope.datePicker);
                var dateAsString = $filter('date')($scope.datePicker,'dd-m-yyyy');
                console.log(dateAsString.subString())
                console.log(dateAsString + 'innnnnput');
                //getDailySalesReport()
            }
        }
        // Get sales report from db for display
        var getDailySalesReport = function(todaysDate){
            getData.then(function(){
                db.collection('dailySalesReportCollection').find(
                    { date: todaysDate }
                ).toArray(function(err,result){
                    if(err){
                        throw err;
                    }
                    else{
                        $scope.dailySalesReport = result;
                    }
                })
    
                db.collection('dailySimSalesReport').find(
                    { date: todaysDate }
                ).toArray(function(err,result){
                    if(err){
                        throw err;
                    }
                    else{
                        $scope.dailySimSalesReportScope = result;
                    }
                })
    
                
            })
        } 
        // get sales report for the current when the pages loads
        getDailySalesReport(todaysDate);
}]);
