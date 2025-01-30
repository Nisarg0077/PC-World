const mongoose = require('mongoose');
const User = require('../models/User');
const fs = require('fs').promises;


const userMaigration = async() => {
    try{
        const user = await User.find();

        if(user.length === 0){
            console.log('No Users found in the database. Starting migration...');
       
            const data = await fs.readFile('D:\\PC-World\\backend\\migration\\Files\\pc-world-users.json', 'utf8');
            const userData = JSON.parse(data);

            const result = await User.insertMany(userData);
            console.log(`Successfully migrated ${result.length} Users.`);
        } else {
            console.log('Users already exist in the database. No migration needed.');
        }
    } catch (error) {
        console.error('Error during User migration:', error);
    }
    
}


module.exports = userMaigration;