const express = require('express');
const apiRouter = express.Router();

const productController = require('../db/controllers/products');

apiRouter.get('/', productController.findAll);

module.exports = apiRouter;
