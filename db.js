const mongoose = require('mongoose');

const connectToDb = async()=>{
    try{
        await mongoose.connect(process.env.MongoDB_URI);
        console.log(`Connected to MongoDB`)
    }catch(error){
        console.log(error.message);
        process.exit(1);
    }
}

module.exports = connectToDb;