const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

const { check,body } = require('express-validator/check');
const User = require('../models/user');
router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/reset', authController.getReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

router.post('/reset', authController.postReset);

router.post('/login', authController.postLogin);

router.post('/signup', 
    [
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value,{req})=>{
        return User.findOne({email:value}).then(userDoc=>{
            if(userDoc){
              return Promise.reject('E-mail exists already, please pick a different one.');
            }
    })})
    .normalizeEmail(),
    body('password','Please enter a password with only numbers and text and atleast 5 characters')
    .isLength({min:5})
    .isAlphanumeric()
    .trim(),
    body('confirmPassword').custom((value,{req})=>{
        if(value !== req.body.password){
            throw new Error('Passwords have to match!');
        }
        return true;
    })
    .trim()
    // .custom((value,{req})=>{
    //     if(value === 'test@test.com'){
    //         throw new Error('This email address is forbidden');
    //     }
    // return true
    ]
,authController.postSignup);        

router.post('/logout', authController.postLogout);

module.exports = router;