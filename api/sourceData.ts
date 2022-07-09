/*
 * File: sourceData
 * Project: connector-node
 * File Created: 04/07/22 - 23:36
 * Author: Andrea Fucci (fucciandrea01@gmail.com)
 * Copyright © 2022-2022 Andrea Fucci
 */

import allProd from '../allProd.json';
import {SourceProduct} from '../models/Source';

const fetchData = (): Promise<SourceProduct[]> => {
    return Promise.resolve(allProd);
}

export const sourceData = {
    fetchData
}