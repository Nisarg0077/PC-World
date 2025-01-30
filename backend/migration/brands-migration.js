const mongoose = require('mongoose');
const Brand = require('../models/Brands');
const fs = require('fs').promises;

const brandMigration = async () => {
    try{
            const brands = await Brand.find();
    
            if(brands.length === 0){
                console.log('No Brands found in the database. Starting migration...');
           
                const data = await fs.readFile('D:\\PC-World\\backend\\migration\\Files\\pc-world-brands.json', 'utf8');
                const brandsData = JSON.parse(data);
    
                const result = await Brand.insertMany(brandsData);
                console.log(`Successfully migrated ${result.length} Users.`);
            } else {
                console.log('Brands already exist in the database. No migration needed.');
            }
        } catch (error) {
            console.error('Error during Brands migration:', error);
        }
}

module.exports = brandMigration;