const express = require('express');
const express_app = express();

express_app.get('/',(req,res)=>{
    res.send("You are the el of wonders");
});

express_app.listen(3000,()=>{
    console.log("Connected, Goodbye to mediocrity");
});
