const mongoose = require('mongoose');
const ProductType = require('../models/ProductType');
const fs = require('fs').promises;

const prodTypMigration = async () => {
    try{
            const productType = await ProductType.find();
    
            if(productType.length === 0){
                console.log('No Product Type found in the database. Starting migration...');
           
                const data = await fs.readFile('D:/PC-World/backend/migration/Files/pc-world-producttypes.json', 'utf8');
                const productType = JSON.parse(data);
    
                const result = await ProductType.insertMany(productType);
                console.log(`Successfully migrated ${result.length} Users.`);
            } else {
                console.log('Product Type already exist in the database. No migration needed.');
            }
        } catch (error) {
            console.error('Error during Product Type migration:', error);
        }
}

module.exports = prodTypMigration;