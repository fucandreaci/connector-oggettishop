/*
 * File: source.controller
 * Project: connector-node
 * File Created: 09/07/22 - 20:19
 * Author: Andrea Fucci (fucciandrea01@gmail.com)
 * Copyright © 2022-2022 Andrea Fucci
 */

import {sourceData} from '../api/sourceData';

const getProducts = async () => {
    const data = await sourceData.fetchProducts()
    return data
}

const getAvailability = async () => {
    const data = await sourceData.fetchAvailability()
    return data
}

export const sourceController = {
    getProducts,
    getAvailability
}