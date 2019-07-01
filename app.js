const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const crsf = require('csurf');
const errorController = require('./controllers/error');
const User = require('./models/user');
const flash =require('connect-flash');
const MONGODB_URI =
  'mongodb+srv://admin:Humidity123@cluster0-lcmm1.mongodb.net/shop';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const csrfProtection =crsf();
const fileStorage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'images',)
  },
  filename:(req,file,cb)=>{
    cb(null, Date.now() +'-'+ file.originalname);
  }
});
const fileFilter=(req,file,cb)=>{
  if(
    file.mimetype ==='image/png' || file.mimetype ==='image/jpeg'|| file.mimetype ==='image/jpg'){
      cb(null, true)
  }else{
      cb(null,false);
  }
}
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(multer({storage:fileStorage,fileFilter: fileFilter}).single('image'));

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(csrfProtection);
app.use(flash());
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if(!user){
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
        next(new Error(err)); 
    });
});

app.use((req,res,next)=>{
  res.locals.isAuthenticated = req.session.isLoggedIn,
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.get('/500',errorController.get500);
app.use(errorController.get404);
app.use((error,req,res,next)=>{
   res.redirect('/500');
});

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
