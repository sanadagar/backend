const mongoose=require("mongoose");

const ProductSchema=new mongoose.Schema({
     title:{
          type:String,
          minlength:[3,"Name must contain at least 3 characters"],
          required:[true,"Name is required"],
          maxlength:[400,"Name must not contain more than 30 characters!"],
    },
    price:{
        type:String,
        required:[true,"price is required"],
    },
    description:{
        type:String,
        minlength:[100,"description must contain at least 20 characters"],
        required:[true,"description is required"],
        maxlength:[5000,"description must not conation more then 1000 characters!"],
    },
    sizes:[String],
    images:{
        type:[String],
        required:[true,"Product must have at least one image!"]
    },
   
});


const Product=mongoose.model("Products",ProductSchema);

module.exports=Product;