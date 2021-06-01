module.exports = { //exportar variables para poder usarlo een el index.js

     port: process.env.PORT || 3000,

    db: process.env.MONGODB || 'mongodb;//localhost:27017/shop',
    
    urlParser: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
}