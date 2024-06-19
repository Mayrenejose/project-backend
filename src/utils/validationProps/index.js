import fs from 'fs'
import { isType } from '../validationTypes/index.js'

const propsValidation = async(
    data, 
    path,
    props 
) => {
    let isValid = true
    
    //valid that all mandatory props exist
    for (const propName in props) {
        if (!props[propName]) {
            console.log(`The property ${propName} it's empty`)
            isValid = false
        }
    }

    //validate that the props have the correct type
    if (
        !isType(props?.code, 'string') ||
        !isType(props?.description, 'string') ||
        !isType(props?.category, 'string') ||
        !isType(props?.title, 'string') ||
        !isType(props?.price, 'number') ||
        !isType(props?.stock, 'number') ||
        !isType(props?.status, 'boolean') ||
        !isType(props?.thumbnails, 'array')
    ){
        console.log('wrong type')
        isValid = false
    }

    //It is valid that there are no products with the same code
    if ( fs.existsSync(path) && data.some(product => product.code === props.code ) ) {
        console.log('duplicate code field')
        isValid = false
    }

    return isValid
}

export default propsValidation
