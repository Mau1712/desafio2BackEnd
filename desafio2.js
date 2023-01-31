/* DESAFIO II BACKEND*/



const fs = require('fs');


class ProductManager {
    constructor(path) {
        this.path = path;
        if (fs.existsSync(path) == false) {
            fs.writeFileSync(path, JSON.stringify([]));
        };
    }
    static getNewId(lastProduct) {
        if (!lastProduct) {
            return 1;
        } else {
            return lastProduct.id + 1;
        }
    }
    async getProducts() {
        let products = await fs.promises.readFile(this.path, 'utf-8');
        return JSON.parse(products);
    }
    async addProduct(title, description, price, thumbnail, code, stock) {
        let products = await this.getProducts();
        let codes = products.map(p => p.code)

        if (codes.includes(code)) {
            console.log('El producto existe');
            return;
        }
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error('Complete todos los campos');
            return
        }
        let lastProduct = products[products.length - 1]
        let newId = ProductManager.getNewId(lastProduct);
        products.push({ title: title, description: description, price: price, thumbnail: thumbnail, code: code, stock: stock, id: newId });
        fs.writeFileSync(this.path, JSON.stringify(products));
    }

    async getProductById(id) {
        let products = await this.getProducts();
        let product = products.find(p => p.id === id);
        if (product) {
            return product;
        }
        console.error('Producto inexistente');
    }
    async updateProduct(id, updatedProduct) {
        let products = await this.getProducts();
        let productIndex = products.findIndex(p => p.id == id);
        products[productIndex] = { ...products[productIndex], ...updatedProduct };
        await fs.promises.writeFile(this.path, JSON.stringify(products));
    }
    async deleteProduct(id) {
        let products = await this.getProducts();
        let productIndex = products.findIndex(p => p.id == id);
        products.splice(productIndex, 1);
        await fs.promises.writeFile(this.path, JSON.stringify(products));
    }
}
//testing 

(async function main() {
    try {
        const productManager = new ProductManager('./productos.txt');

        //productos para el testing del método addProduct
        await productManager.addProduct('Six pack Corona', '6 latas de 475ml', 2400, 'https://drive.google.com/file/d/1z5ZfIOau1uxfpyeYpasWUU0-vJzOdQwI/view?usp=share_link', "a1", 25);
        await productManager.addProduct("Six pack Heineken", "6 latas de 475ml", 2200, "https://drive.google.com/file/d/14iKznNuqAXQ1G30yWAgWXuC7C3LbHcvk/view?usp=share_link", "a2", 15);
        await productManager.addProduct("Six pack Brahma", "6 latas de 475ml", 1800, "https://drive.google.com/file/d/1KN612KXcg2DOobe539S13UmPL4v9zTg8/view?usp=share_link", "a3", 15);
        await productManager.addProduct("Six pack Stella", "6 latas de 475ml", 2150, "https://drive.google.com/file/d/13Zxzkm5aaNXZ3WcIWxc3goDuRC_OXKA_/view?usp=share_link", "a4", 15);

        //productos de prueba con un mismo código
        await productManager.addProduct('prueba cod igual', 'producto prueba', 5485, 'sin imagen', '5896', 16);
        await productManager.addProduct('prueba cod igual', 'producto prueba', 2658, 'sin imagen', '5896', 18);

        //getProducts
        let resultProducts = await productManager.getProducts();
        console.log(resultProducts);

        //getProductsById
        console.log(await productManager.getProductById(1));
        productManager.getProductById(5);

        //updateProduct
        await productManager.updateProduct(2, { price: 50 });
        console.log(await productManager.getProductById(2));

        //deleteProduct
        await productManager.deleteProduct(1)
        console.log(await productManager.getProducts());
    } catch (err) {
        console.error(err);
    }
})();
