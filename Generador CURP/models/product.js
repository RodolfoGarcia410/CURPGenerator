'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = Schema ({
    nombre: String,
    apellidoP: String,
    apellidoM: String,
    dia: String,
    mes: String,
    a: String,
    genero: String,
    estado: String,
    CURP: String

})

module.exports = mongoose.model('Product', ProductSchema)