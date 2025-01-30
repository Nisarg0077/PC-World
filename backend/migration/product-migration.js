const mongoose = require('mongoose');
const Product = require('../models/Product');
const fs = require('fs').promises;

const productMigration = async () => {
    try {
       
        const products = await Product.find();

        if (products.length === 0) {
            console.log('No products found in the database. Starting migration...');

            const data = await fs.readFile('D:\\PC-World\\backend\\migration\\Files\\productDummy.json', 'utf8');
            const prodData = JSON.parse(data);

            const result = await Product.insertMany(prodData);
            console.log(`Successfully migrated ${result.length} products.`);
        } else {
            console.log('Products already exist in the database. No migration needed.');
        }
    } catch (error) {
        console.error('Error during product migration:', error);
    }
};

module.exports = productMigration;
