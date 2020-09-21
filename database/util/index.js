const mongoose = require('mongoose');

module.exports.connection = async() => {
   try {
        mongoose.set('useFindAndModify', false);
        await mongoose.connect(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true});
        console.log('OK');
   } catch (error) {
       console.log(error);
   }
}

module.exports.isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
}