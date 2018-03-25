var app = angular.module('app', []);
var db;

var getData = function () {
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
}
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

app.controller('addSalesController', ['$scope', function ($scope) {

    $scope.simcards = [
        { name: "Mtn", qty: "0" },
        { name: "Glo", qty: "0" },
        { name: "Airtel", qty: "0" },
        { name: "Etisalat", qty: "0" }
    ];

    $scope.simswaps = [
        { name: "Mtn", qty: "0" },
        { name: "Glo", qty: "0" },
        { name: "Airtel", qty: "0" },
        { name: "Etisalat", qty: "0" }
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
    }

    $scope.getSubBtn = function (simcard) {
        if (simcard.qty != 0)
            simcard.qty--;
    }
}]);



