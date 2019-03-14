const Product = require('../models/product');

exports.getAddProduct = (req, res, next)=>{
    res.render('admin/edit-product',{pageTitle:'Add Product',path:'/admin/add-product',editing:false})
}
exports.getEditProduct = (req, res, next)=>{
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    req.user.getProducts({where:{id:prodId}}) 
    .then(products=>{
        const product =products[0];
        if(!product){
            return redirect('/');
        }
        res.render('admin/edit-product',{pageTitle:'Edit Product',path:'/admin/edit-product',editing:editMode,product:product})
    })
    .catch(err=>console.log(err));
    
    
}

exports.postAddProduct = (req, res)=>{
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    req.user.createProduct({title,
        price,
        imageUrl,
        description,
        userId: req.user.id
    })
    .then(()=>{
         res.redirect('/admin/products');

    }).catch(err=>{
        console.log(err);
    })
    
}
exports.postEditProduct = (req, res)=>{
    const prodId = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    Product.findById(prodId)
    .then(product=>{
        product.title = title;
        product.imageUrl = imageUrl;
        product.price = price;
        product.description = description;
        return product.save();
    })
    .then(result=>res.redirect('/admin/products'))
    .catch(err=>console.log(err));
    
}


exports.getProducts =(req,res,next)=>{
    req.user.getProducts().then(products=>{
        res.render('admin/products',{prods:products,pageTitle:'Admin Products',path:'/admin/products'});
    }).catch(err=>console.log(err));
}

exports.postDeleteProduct=(req,res)=>{
    const prodId = req.body.productId;
    Product.findById(prodId)
    .then(product=> {
        return product.destroy();
    })
    .then(()=>res.redirect('/admin/products'))
    .catch(err=>console.log(err));
    
}
