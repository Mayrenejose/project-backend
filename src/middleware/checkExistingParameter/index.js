const checkExistingParameter = (paramName) => {
    return (req, res, next) => {
        const id = Number(req.params[paramName])
        
        if ( !isNaN(id) ) {
            next()
        } else {
            res.status(400).json({ error: 'invalid parameter' })
        }
    }
}

export default checkExistingParameter