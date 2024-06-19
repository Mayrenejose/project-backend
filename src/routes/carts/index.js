import { Router } from 'express'
import CartManager from '../../models/cartManager/index.js'
import checkExistingParameter from '../../middleware/checkExistingParameter/index.js'

const router = Router()
const cartManager = new CartManager()
const validatorParams = checkExistingParameter('cid')

router.get('/', async(req, res) => {
    try{
        const allDataCarts = await cartManager.getAllCarts()
        res.status(200).json({data: allDataCarts})
    } catch (error) {
        res.status(400).send({message: 'error getting carts'})
    }
})

router.get('/:cid', validatorParams, async(req, res) => {
    try{
        const { cid } = req.params
        const data = await cartManager.getAllCarts()
        const dataArray = Array.isArray(data) ? data : [data]
        const searchIdCart = dataArray.some(cart => cart.id === Number(cid))
        
        if( !searchIdCart ) {
            return res.status(400).json({error: `Not found the id: ${cid} not exist`})
        } else {
            const cartById = await cartManager.getCartById(Number(cid))
            res.json({data: cartById})
        }

    } catch (error) {
        res.status(400).send({message: 'error getting carts'})
    }
})

router.post('/', async(req, res) => {
    try {
        const bodyGet = req.body
        await cartManager.addCart(bodyGet)
        return res.status(200).json({ message: 'cart successfully added' })

    } catch(error) {
        res.status(400).send({error: 'error adding cart'})
    }
})

router.post('/:cid/product/:pid', validatorParams, async(req, res) => {
    try {
        const idCart = req.params.cid
        const idProduct = req.params.pid

        await cartManager.addProductToCart(idCart, idProduct)
        return res.status(200).json({ message: 'product successfully added' })

    } catch(error) {
        res.status(400).send({error: 'error adding product'})
    }
})


export default router