const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars')

const app = express();

app.engine('hbs',expressHbs({layoutsDir:'views/layouts/',defaultLayout:'main-layout',extname:'hbs'}))
app.set('view engine','hbs');
app.set('views','views');


const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const rootDir = require('./util/path');

app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(rootDir,'public'))); 
app.use('/admin',adminData.routes);
app.use(shopRoutes);
app.use((req,res,next)=>{
    res.status(404).render('404',{pageTitle:'404-Not Found'})
})


app.listen(3000);