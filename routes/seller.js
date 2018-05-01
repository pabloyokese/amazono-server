const router = require('express').Router();
const Product = require('../models/product');

const aws = require('aws-sdk');
const multer = require('multer');

// manual upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname);
    }
});
const upload = multer({ storage });
// manual upload


const multerS3 = require('multer-s3');
const s3 = new aws.S3({ accessKeyId: 'AKIAJZ5YUVKTMPGSL7JQ', secretAccessKey: 'UwZ/DUb1PNMRnrys8B95ng1210eo+UpM13CiG9Jy' });

const checkJWT = require('../middlewares/check-jwt');

const faker = require('faker');

// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: 'amazonowebapplication',
//         metada: function (req, file, cb) {
//             cb(null, { fieldName: file.fieldName });
//         },
//         key: function (req, file, cb) {
//             cb(null, Date.now().toString())
//         },
//     })
// });

router.route('/products')
    .get(checkJWT, (req, res, next) => {
        Product.find({ owner: req.decoded.user._id })
            .populate('owner')
            .populate('category')
            .exec((err, products) => {
                if (products) {
                    res.json({
                        success: true,
                        message: 'Products',
                        products: products
                    });
                }
            });
    })
    .post([checkJWT, upload.single('product_picture')], (req, res, next) => {
        let product = new Product();
        console.log(req.file);
        product.owner = req.decoded.user._id;
        product.category = req.body.categoryId;
        product.title = req.body.title;
        product.price = req.body.price;
        product.description = req.body.description;
        // if u wanna use the S3 then uncomment this line
        //product.image = req.file.location;
        product.image = 'http://localhost:3030/'+req.file.path;
        product.save();
        res.json({
            success: true,
            message: 'Successfully added the product'
        });
    });

// just for testing
router.get('/faker/test',(req,res,next)=>{
    for(i=0;i<20;i++){
        let product = new Product();
        product.category ='5ae56855feef3818fbf0d41e';
        product.owner = '5ae53ea5270ab60db2b3e554';
        product.image = faker.image.cats();
        product.title = faker.commerce.productName();
        product.description = faker.lorem.words();
        product.price = faker.commerce.price();
        product.save();
    }

    res.json({
        message:'succesfully added 20 pictures'
    });
});

module.exports = router;