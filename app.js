import express from 'express';
import { ProductManager } from "./models/Products.js"

// crear la app
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Instancia de Producto
const productManager = new ProductManager('Output')

// Endpoints
app.get('/', (req, resp) => {
    resp.send('<h1 style="color: red">Servidor Express</h1>')
})

app.get('/products', async (req, res) => {
    try {
        const products = await productManager.getProducts(req.query.limit)
        res.json(products)
    } catch (error) {
        res.status(404).send({ error: 'No existe el archivo' });
    }
});

app.get('/products/:pId', async (req, res) => {

    try {
        console.log(req.params.pId)
        const product = await productManager.getProductsById(req.params.pId)
        res.send(product)
    } catch (error) {
        res.status(404).send({ error: `No existe el id ${req.params.pId}` });
    }
})

// Definicion de PORT y arrancar el proyecto
const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`Listening app port ${server.address().port}`)
})

server.on('error', error => console.log(`Error en servidor ${error}`))