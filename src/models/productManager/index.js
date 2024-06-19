import fs from 'fs'
import  propsValidation  from '../../utils/validationProps/index.js'

class ProductManager {

    constructor() {
        this.products = []
        this.nextId = 1
        this.path = './src/data/dataProduct.json'
    }
    
    getAllProducts = async() => {
        try{
            if( !fs.existsSync(this.path) ) return []
            const db = await fs.promises.readFile(this.path, 'utf-8')
            return JSON.parse(db)
        } catch (error) {
            return console.log(error)
        }
    }

    addProduct = async(
        {
            category,
            code,
            description,
            price,
            status = true,
            stock,
            thumbnails = [],
            title
        }
    ) => {
        if ( typeof thumbnails === 'string') {
            thumbnails = [thumbnails]
        } else if ( Array.isArray(thumbnails) ) {
            thumbnails = [...thumbnails]
        }

        const props = {
            category,
            code, 
            description, 
            price, 
            status: true,
            stock,
            thumbnails,
            title,
        }

        const data = await this.getAllProducts()

        try {
            if (!await propsValidation(
                data, 
                this.path, 
                props
            )) return []

            const newProduct = {
                category,
                code, 
                description, 
                id: this.nextId,
                price, 
                status,
                stock, 
                thumbnails, 
                title
            } 

            this.products.push(newProduct)
            this.nextId++

            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, '\t'))

        } catch(error) {
            return console.log(error, 'product creation failed')
        }
    }

    getProductById = async(pid) => {
        const data = await this.getAllProducts()

        return data.filter(product => product.id === pid)
    }

    updateProduct = async (id, fieldUpdate) => {
        if (!fieldUpdate || !id) return console.log('empty field')
      
        try {
            const data = await this.getProductById(id)
            const product = data[0]
        
            const validationTypes = {
                code: 'string',
                description: 'string',
                category: 'string',
                title: 'string',
                price: 'number',
                stock: 'number',
                status: 'boolean',
                thumbnails: 'array',
            }
         
            for (let key in validationTypes) {
                if (fieldUpdate.hasOwnProperty(key)) {
                if (typeof fieldUpdate[key] !== validationTypes[key]) {
                    console.log(`Wrong type for ${key}`)
                    throw new Error('Error updating product')
                }
                product[key] = fieldUpdate[key]
                }
            }
      
            fs.writeFile(this.path, JSON.stringify(product, null, '\t'), (error) => {
                if (error) throw new Error('Error updating product')
                console.log('product updated successfully')
            })
            } catch (error) {
                console.log('product update failed')
                throw new Error('Error updating product')
            }
    }

    deleteProduct = async (id) => {
        try {
            const data = await this.getAllProducts()
            const searchId = data.some((product) => product.id === id)
            if (searchId) {
                const deleteProduct = data.filter((product) => product.id != id)
        
                await fs.promises.writeFile(this.path, JSON.stringify(deleteProduct, null, 2))
                console.log('Product deleted successfully')
            } else {
                console.log('The ID does not exist')
                throw new Error('Product not found')
            }
        } catch (error) {
            console.log('Product delete failed')
            throw new Error('Error deleting product')
        }
    }
}

export default ProductManager