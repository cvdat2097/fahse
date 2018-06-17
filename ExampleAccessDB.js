// 1. require mongoose 
const mongoose = require('mongoose')
// 2. connect 
mongoose.connect('mongodb://localhost/myDatabase');
// 3. tao schema
const userSchema =  new mongoose.Schema({
    name: String,
    ge: Number
})
// 4. tao Model
const user = mongoose.model('user',userSchema)
// 5. CRUD

user.create([
    {name: "chung", age: 20},
    {name: "trieu", age:25}
])

user.find().exec((err,users)=>{
    console.log(users);
})

user.update({name:"chung"},{name:"lam"}).exec((err,result)=>{
    console.log(result);
})

user.remove({name: "lam"}).exec((err,result)=>{
    console.log(result);
})