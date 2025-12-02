
const User = require("./../modals/UserModel");
const Product = require("./../modals/productmodel");

exports.addItemToCart = async (req, res) => {
    try {  
        const {productId, size, quantity} = req.body;
        const user = req.user;
       

        if (!productId || !size || !quantity) {
            return res.status(400).json({ error: "Insufficient Data" });
        }
       
        const product = await Product.findOne({ _id: productId, sizes: size }).lean();

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }


        const cartItemIndex = user.cart.findIndex(cartItem=>cartItem.productId==productId && cartItem.size==size);
        
       
       if(cartItemIndex!=-1){
            if(quantity<=0){
                user.cart.splice(cartItemIndex, 1);
            }else{
                user.cart[cartItemIndex].quantity++;
            }
            
            await user.save();
        
        }else{
            user.cart.push({title: product.title, price: product.price, quantity, image: product.images[0], size, productId});
            await user.save();
        }
        

        res.status(200).json({message: user.cart})
       

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server error" });
    }

 }

