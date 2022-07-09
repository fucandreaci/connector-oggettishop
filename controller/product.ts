/*
 * File: product
 * Project: connector-node
 * File Created: 05/07/22 - 22:34
 * Author: Andrea Fucci (fucciandrea01@gmail.com)
 * Copyright © 2022-2022 Andrea Fucci
 */

import {Category, Product} from '../models/Destination';
import {destinationData} from '../api/destinationData';

const exist = (name: string, products: Product[]): Product | undefined => {
    return products.find(product => product.name === name);
}

const create = async (product: Product): Promise<Product | undefined>=> {
    try {
        return (await destinationData.createProduct(product)).data;
    } catch (e) {
        console.error(e)
    }
}

const insertProductIfNotExist = async (product: Product, products: Product[], fetchProducts: () => void): Promise<Product | undefined> => {
    if (!product.name) {
        return undefined;
    }

    const existentProduct = exist(product.name, products);
    if (!existentProduct) {
        const products = create(product);
        await fetchProducts()
        return products;
    }
    return existentProduct;
}


export const product = {
    exist,
    create,
    insertProductIfNotExist,
}