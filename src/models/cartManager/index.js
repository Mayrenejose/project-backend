import fs from 'fs'
import ProductManager from '../productManager/index.js'

const productManager = new ProductManager()

class CartManager {

    constructor() {
        this.cart = []
        this.nextId = 1
        this.path = './src/data/dataCart.json'
    }

    getAllCarts = async() => {
        try{
            if( !fs.existsSync(this.path) ) return []
            const db = await fs.promises.readFile(this.path, 'utf-8')
            return JSON.parse(db)
        } catch (error) {
            return console.log(error)
        }
    }

    getCartById = async(cid) => {
        try{
            const allData = await this.getAllCarts()
            const cartArray = Array.isArray(allData) ? allData : [allData]
            return cartArray.find(cart => cart.id === cid)

        } catch (error) {
            return console.log(error)
        }
    }

    addCart = async(products = []) => {
        try{
            if (!Array.isArray(products)) throw new Error('error in type')

            const newCart = {
                id: this.nextId,
                products
            }

            this.cart.push(newCart)
            this.nextId++

            await fs.promises.writeFile(this.path, JSON.stringify(this.cart, null, '\t'))

        } catch {
            console.log(error, 'cart creation failed')
            throw new Error('error')
        }
    }

    addProductToCart = async(idCart, idProduct) => {
        try {
            const cartId = Number(idCart)
            const productId = Number(idProduct)
            const cart = await this.getCartById(cartId)
            const product = await productManager.getProductById(productId)
            let productsArray = cart.products

            if ( product.length === 0 ) throw new Error('the product does not exist')

            if (!Array.isArray(productsArray)) {
                productsArray = [productsArray]
            }

            const searchIdProduct = productsArray.find((product) => product.id === productId)
            const searchIdCart = cart.id === cartId ? true : false

            if ( !searchIdCart ) throw new Error('the car does not exist')
            
            if ( searchIdProduct === undefined ) {
                const newProductToCart = {
                    id: productId,
                    quantity: 1
                }
                cart.products.push(newProductToCart)
            } else {
                searchIdProduct.quantity++
            }

            await fs.promises.writeFile(this.path, JSON.stringify(cart, null, '\t'))

        } catch (error) {
            console.log(error, 'The product was not added to the cart')
            throw new Error('error')
        }
    }
}

export default CartManager