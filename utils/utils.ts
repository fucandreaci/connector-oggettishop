/*
 * File: utils
 * Project: connector-node
 * File Created: 09/07/22 - 22:13
 * Author: Andrea Fucci (fucciandrea01@gmail.com)
 * Copyright © 2022-2022 Andrea Fucci
 */

import {Availability, SourceProduct} from '../models/Source';
import {Dimension, Image} from '../models/Destination';

const getDimension = (product: SourceProduct): Dimension => {
    const originalDimension = product.dimensione_articolo;
    if (!originalDimension) {
        return {
            length: '',
            width: '',
            height: ''
        }
    }

    const parts = originalDimension.split('x');
    const validParts: string[] = [];

    parts.forEach((part, index) => {
        const spaceSplitted = part.split(' ');
        if (spaceSplitted.length > 1) {
            if (index == 0) {
                const el = isNaN(parseFloat(spaceSplitted[spaceSplitted.length - 1])) ? '' : spaceSplitted[spaceSplitted.length - 1];
                validParts.push(el);
            } else {
                const el = isNaN(parseFloat(spaceSplitted[0])) ? '' : spaceSplitted[0];
                validParts.push(el);
            }
        } else {
            validParts.push(part);
        }
    })

    return {
        length: validParts.length >= 1 ? parseFloat(validParts[0]).toString() : '',
        width: validParts.length >= 2 ? parseFloat(validParts[1]).toString() : '',
        height: validParts.length >= 3 ? parseFloat(validParts[2]).toString() : ''
    }
}

const getImages = (product: SourceProduct): Image[] => {
    const images: Image[] = [];

    if (typeof product.Link_Foto !== 'string') {
        if (typeof product.Link_Foto.Foto !== 'string') {
            const photos: string[] = product.Link_Foto.Foto;
            photos.forEach(photo => {
                images.push({
                    src: photo
                })
            })
        }
    }

    return images;
}

const getAvailability = (product: SourceProduct, availableProducts: Availability[]): Availability | undefined => {
    return availableProducts.find(p => p.codice === product.codice);
}

const getQtaAvailable = (availableProduct: Availability | undefined): number => {
    if (!availableProduct) return 0;
    return availableProduct.arrivi.arrivo.reduce((acc, curr) => acc + curr.qta, 0)
}

export const utils = {
    getDimension,
    getImages,
    getAvailability,
    getQtaAvailable
}