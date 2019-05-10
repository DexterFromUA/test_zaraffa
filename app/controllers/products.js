const Products = require('../models/products');

const productsController = {};

productsController.findAll = (req, res) => {
    Products.findAll()
        .then(products => {
            res.json({
                message: 'success',
                data: products.rows
            })
        })
        .catch(e => {
            res.json({
                error: e
            })
        })
};

productsController.addProduct = (req, res) => {
    Products.Add(req.body.title, req.body.author, req.body.year)
        .then(response => res.json({
            message: 'done',
            data: response
        }))
        .catch(e => {
            console.log(e);
            res.json({
                message: 'error',
                data: e
            })
        })
};

productsController.deleteProduct = (req, res) => {
    console.log('deleteProduct');
};

productsController.editProduct = (req, res) => {
    console.log('editProduct');
};

module.exports = productsController;
