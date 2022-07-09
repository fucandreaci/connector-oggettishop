/*
 * File: splitProducts.utils
 * Project: connector-node
 * File Created: 09/07/22 - 20:33
 * Author: Andrea Fucci (fucciandrea01@gmail.com)
 * Copyright © 2022-2022 Andrea Fucci
 */

import {SourceProduct} from '../models/Source';

const splitParentsChildren = (products: SourceProduct[]): { parents: SourceProduct[], children: SourceProduct[] } => {
    const parents = products.filter(product => product.articolo_padre === product.codice);
    const children = products.filter(product => product.articolo_padre !== product.codice);

    return {
        parents,
        children
    }
}

export const splitProducts = {
    splitParentsChildren
}