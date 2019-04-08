const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');
app.set('view engine','ejs');
app.set('views','views');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const rootDir = require('./util/path');

app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(rootDir,'public'))); 
app.use((req,res,next)=>{
    User.findById('5caaf9bc5aa44018bc3a4224')
    .then(user=>{
        req.user= new User(user.name,user.email,user.cart,user._id);
        next();
    })
})
app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404)

mongoConnect(()=>{
    app.listen(3000);
})

