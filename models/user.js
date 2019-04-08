const mongoDb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
    constructor(username,email,cart,id){
        this.name =username,
        this.email=email,
        this.cart = cart,
        this._id = id
    }

    save(){
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    static findById(userId){
        const db = getDb();
        return db.collection('users').findOne({_id:new mongoDb.ObjectId(userId)});
    }

    addToCart(product){
        const cartProductIndex = this.cart.items.findIndex(cp=>{
            return cp.productId.toString() === product._id.toString();
        });
        let newQuantity =1;
        const updatedCartItem = [...this.cart.items];
        if(cartProductIndex>=0){
            newQuantity = this.cart.items[cartProductIndex].quantity +1;
            updatedCartItem[cartProductIndex].quantity =  newQuantity;
        }else{
            updatedCartItem.push({productId:new mongoDb.ObjectId(product._id),quantity:newQuantity}); 
        }
        const updatedProducts = {items:updatedCartItem};
        const db = getDb();
        return db.collection('users').updateOne({_id: new mongoDb.ObjectId(this._id)},{$set:{
            cart:updatedProducts
        }});
    }

    getCart(){
        const db = getDb();
        const productIds = this.cart.items.map((item)=>{
            return item.productId;
        })
        return db.collection('products').find({_id:{
            $in:productIds
        }}).toArray()
        .then(products=>{
            return products.map(p=>{
                return{...p,quantity:this.cart.items.find(i=>{
                    return i.productId.toString() === p._id.toString();
                }).quantity}
            })
        });
    }

    deleteItemFromCart(productId){
        const db = getDb();
        const updatedCartItems = this.cart.items.filter(item=>{
            return item.productId.toString() !== productId.toString();
        })
        return db.collection('users').updateOne({_id: new mongoDb.ObjectId(this._id)},{$set:{
            cart:{items:updatedCartItems}
        }});

    }

    addOrder(){
        const db = getDb();
        return this.getCart().then(cartProducts=>{
            const order = {
                items:cartProducts,
                user:{
                    _id : new mongoDb.ObjectId(this._id),
                    name: this.name,
                    email: this.email
                }
            }
            return db.collection('orders').insertOne(order);
        })
        .then(result=>{
            this.cart ={items:[]};
            db.collection('users').updateOne({_id: new mongoDb.ObjectId(this._id)},{$set:{
                cart:{items:[]}
            }});    
        });
    }

    getOrders(){
        const db = getDb();
        return db.collection('orders').find({'user._id':new mongoDb.ObjectId(this._id) }).toArray();
    }

}

module.exports = User;