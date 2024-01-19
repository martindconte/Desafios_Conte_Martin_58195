import fs from 'fs'
import path from 'path';

class ProductManager {

    static id = 1;

    constructor(folderPath) {
        this.products = [];
        this.folderPath = path.resolve(folderPath);
        this.filePath = path.join(folderPath, 'products.json');
    }

    addProduct = async ({ title, description, code, price, stock, thumbnail }) => {

        try {
            this._validateData(title, description, code, price, stock, thumbnail)
            await this._createFolderAndFile()
            const data = await this._readFile()
            if (data.some(product => product.code === code)) throw new Error(`El Code ${code} ya existe para el ${title} ${description}`)
            const newProduct = {
                id: ProductManager.id++,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            };
            this.products = [...data, newProduct];
            await this._writeFile(this.products)
        } catch (err) {
            console.log(err)
        }
    }

    getProducts = async (quantity) => {
        const productsAll = await this._readFile() || [];
        const limit = Number(quantity);
        const products = limit > 0 ? productsAll.slice(0, limit) : productsAll;
        return products
    }

    getProductsById = async (id) => {
        const data = await this._readFile();
        const product = data.find(prod => prod.id == id);
        return product || `Product with id: ${id} not found`;
    }

    updateProduct = async (id, updatedProduct) => {

        try {
            const data = await this._readFile();
            const productId = data.find(product => product.id === id);
            if (productId === undefined) throw new Error('Product is not found');
            if (productId.id !== updatedProduct.id) throw new Error('No se puede modificar el ID');
            this.products = data.map(prod => (prod.id === id ? updatedProduct : prod));
            await this._writeFile(this.products);
        } catch (error) {
            console.log(error)
        }
    }

    deleteProduct = async (id) => {
        const data = await this._readFile();
        const productId = data.find(product => product.id === id);
        if (productId === undefined) throw new Error('Product is not found');
        this.products = data.filter(prod => prod.id !== id);
        await this._writeFile(this.products);
    }

    _createFolderAndFile = async () => {
        try {
            await fs.promises.access(this.folderPath, fs.constants.F_OK,)
            await fs.promises.access(this.filePath, fs.constants.F_OK)
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.log('La carpeta o el archivo no existen. Creando...');
                await fs.promises.mkdir(this.folderPath, { recursive: true });
                await fs.promises.writeFile(this.filePath, JSON.stringify([]));
            }
        }
    };

    /**
     * 
     * @returns {Array[Object]}
     */
    _readFile = async () => {
        try {
            const fileContent = await fs.promises.readFile(this.filePath, 'utf-8');
            const data = JSON.parse(fileContent);
            return data
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log("No existe el archivo... O aun no fue creado");
                return null;
            } else {
                throw error;
            }
        }
    }

    _writeFile = async (data) => {
        try {
            await fs.promises.writeFile(this.filePath, JSON.stringify(data));
        } catch (error) {
            throw error;
        }
    }

    _validateData = ( title, description, code, price, stock, thumbnail ) => {
        if (!title || !description || !price || !thumbnail || !code || !stock) throw new Error('las propíedades title, description, price, thumbnail, code, stock son obligatorias')
    } 
}

export {
    ProductManager
}