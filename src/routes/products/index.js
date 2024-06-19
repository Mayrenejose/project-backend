import { Router } from 'express'
import ProductManager from '../../models/productManager/index.js'
import checkExistingParameter from '../../middleware/checkExistingParameter/index.js'

const router = Router()
const productManager = new ProductManager()
const validatorParams = checkExistingParameter('pid')

router.get('/', async(req, res) => {
    try{
        const allDataProducts = await productManager.getAllProducts()
        const queryLimit = req.query?.limit
        if ( !queryLimit ) return res.json({data: allDataProducts})

        if( isNaN(queryLimit) || queryLimit > allDataProducts.length ) {
            return res.status(400).json({error: 'error in requested limit'})
        } else {
            const dataSlice = allDataProducts.slice(0, queryLimit)
            return res.json({data: dataSlice})
        }

    } catch (error) {
        res.status(500).send('error getting products')
    }
})

router.get('/:pid', validatorParams, async(req, res) => {
    try{
        const data = await productManager.getAllProducts()
        const { pid } = req.params
        const searchId = data.some(product => product.id === Number(pid))

        if( !searchId ) {
            return res.status(400).json({error: `Not found the id: ${pid} not exist`})
        } else {
            const dataById = await productManager.getProductById(Number(pid))
            res.json({data: dataById})
        }
    } catch (error) {
        res.status(500).send('error getting product')
    }
})

router.post('/', async(req, res) => {
    try {
        const bodyGet = req.body
        const addNewProduct = await productManager.addProduct(bodyGet)

        if ( addNewProduct === undefined ) {
            return res.status(200).json({ message: 'product successfully added' })
        } else {
            return res.status(400).json({error: 'non added product'})
        }
    } catch(error) {
        res.status(500).send('error adding product')
    }
})

router.put('/:pid', validatorParams, async(req, res) => {
    try{
        const { pid } = req.params
        const bodyUpdate = req.body
        
        await productManager.updateProduct(Number(pid), bodyUpdate)
        res.status(200).json({ message: 'successfully updated product'})

    } catch (error) {
        res.status(400).json({error: 'product not updated'})
    }
})

router.delete('/:pid', validatorParams, async (req, res) => {
    try {
        const { pid } = req.params

        await productManager.deleteProduct(Number(pid))
        res.status(200).json({ message: 'Product successfully deleted' })

    } catch (error) {
        res.status(400).json({ error: 'Product not deleted' })
    }
})

export default router
