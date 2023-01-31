/* DESAFIO II BACKEND*/

const fs = require('fs').promises;
const ruta = "./productos.json";

class Producto {

    static codeId = 0;

    constructor(title, description, price, image, stock) {
        this.title = title
        this.description = description
        this.price = price
        this.image = image
        this.stock = stock

        this.code = ++Producto.codeId;
    }

    get codigoDeCreacion() {
        return this.code;
    }
}

class ProductManager {
    constructor(path) {
        this.path = path
    }


    addProduct = async (product) => {
        const read = await fs.readFile(this.path, 'utf-8');
        const data = JSON.parse(read)
        const codeProd = data.map((prod) => prod.code);
        const prodExist = codeProd.includes(product.code);

        if (prodExist) {
            return console.log("Producto Existente")
        } else if (Object.values(product).includes("") || Object.values(product).includes(null)) {
            return console.log("Llene todos los campos")
        } else {
            product = { ...product };
            data.push(product)
            await fs.writeFile(this.path, JSON.stringify(data), 'utf-8')
            return console.log(`El producto id: ${product.code} se agrego correctamente`)
        }
    }

    getProducts = async () => {
        const read = await fs.readFile(this.path, 'utf-8')
        const data = JSON.parse(read)
        if (data.length != 0) {
            console.log("Listado completo de productos:");
            console.log(data);
        } else {
            console.log("No se encuentran productos en el listado.")
        }
    }

    getProductById = async (code) => {
        const read = await fs.readFile(this.path, 'utf-8');
        const data = JSON.parse(read);
        const findProduct = data.find((prod) => prod.code === code);
        if (findProduct) {
            console.log("Se ha encontrado el siguiente producto:")
            return console.log(findProduct);
        } else {
            return console.log("Product Not found");
        }
    }

    deleteProduct = async (code) => {
        const read = await fs.readFile(this.path, "utf-8");
        const data = JSON.parse(read);
        const productoEliminado = JSON.stringify(
            data.find((product) => product.code === code)
        );
        const newData = data.filter((product) => product.code !== code);
        await fs.writeFile(this.path, JSON.stringify(newData), "utf-8");
        return console.log(
            `El producto ${productoEliminado} ha sido eliminado exitosamente`
        );
    }

    updateProduct = async (code, entry, value) => {
        const read = await fs.readFile(this.path, "utf-8");
        const data = JSON.parse(read);
        const index = data.findIndex((product) => product.code === code);
        if (!data[index][entry]) {
            return console.log("El producto no pudo ser actualizado.")
        } else {
            data[index][entry] = value;
            await fs.writeFile(this.path, JSON.stringify(data, null, 2));
            console.log("El producto se ha modificado de la siguiente manera:")
            return console.log(data[index]);
        }
    }
}

const productManager = new ProductManager(ruta); 

const sixPackCorona = new Producto("Six pack Corona", "6 latas de 475ml", 2400, "https://drive.google.com/file/d/1z5ZfIOau1uxfpyeYpasWUU0-vJzOdQwI/view?usp=share_link", 15)
const sixPackHeineken = new Producto("Six pack Heineken", "6 latas de 475ml", 2200, "https://drive.google.com/file/d/14iKznNuqAXQ1G30yWAgWXuC7C3LbHcvk/view?usp=share_link", 15)
const sixPackBrahma = new Producto("Six pack Brahma", "6 latas de 475ml", 1800, "https://drive.google.com/file/d/1KN612KXcg2DOobe539S13UmPL4v9zTg8/view?usp=share_link", 15)
const sixPackStella = new Producto("Six pack Stella", "6 latas de 475ml", 2150, "https://drive.google.com/file/d/13Zxzkm5aaNXZ3WcIWxc3goDuRC_OXKA_/view?usp=share_link", 15)

const test = async() => {
    await fs.writeFile(ruta, "[]");

    await productManager.getProducts();
    await productManager.addProduct(sixPackCorona);
    await productManager.addProduct(sixPackHeineken);
    await productManager.addProduct(sixPackBrahma);
    await productManager.addProduct(sixPackStella);
    await productManager.getProducts(); 
    await productManager.getProductById(2);
    await productManager.getProductById(7);
    await productManager.updateProduct(1, "stock", 10);
    await productManager.updateProduct(1, "price", 5500);
    await productManager.getProducts();
    await productManager.deleteProduct(3);
    await productManager.getProducts();

}

test();

