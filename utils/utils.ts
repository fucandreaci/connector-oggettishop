/*
 * File: utils
 * Project: connector-node
 * File Created: 09/07/22 - 22:13
 * Author: Andrea Fucci (fucciandrea01@gmail.com)
 * Copyright © 2022-2022 Andrea Fucci
 */

import {Availability, SourceProduct} from '../models/Source';
import {Attribute, AttributeName, Dimension, Image} from '../models/Destination';
import axios from 'axios';

const getDimensionArticolo = (product: SourceProduct): Dimension => {
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

const getDimension = (product: SourceProduct): Dimension => {
    return {
        length: product.dimensione_1_carton._.toString(),
        width: product.dimensione_2_carton._.toString(),
        height: product.dimensione_3_carton._.toString()
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

const getImageDimension = (image: Image): number => {
    // https://catalogs-online.com/images/700x700/CA600NE.jpg

    const url = image.src;

    if (!url) return -1;
    const parts = url.replace('https://', '').split('/');

    if (parts.length < 4) return -1;
    const dimension = parts[2];
    if (!dimension) return -1;

    const dimensionParts = dimension.split('x');
    if (dimensionParts.length < 2) return -1;
    const width = dimensionParts[0];
    const height = dimensionParts[1];
    if (!width || !height) return -1;
    return parseInt(width);
}

const getBetterImage = async (images: Image[]): Promise<Image | undefined> => {
    const imagesWithDimension: {
        image: Image,
        dimension: number
    }[] = []

    images.forEach(image => {
        const dimension = getImageDimension(image);
        imagesWithDimension.push({
            image,
            dimension
        })
    })

    const sortedImages = imagesWithDimension.sort((a, b) => a.dimension - b.dimension);

    const image500 = sortedImages.filter(i => i.dimension == 500);
    //if (image500) return image500.image;

    const bestImages = image500 ? image500 : sortedImages.filter(i => i.dimension > 250);

    // get random image
    while (bestImages.length) {
        const randomIndex = Math.floor(Math.random() * bestImages.length);
        const image = bestImages[randomIndex];
        if (image && image.image && image.image.src) {
            try {
                const imgFetch = await imageExists(image.image.src)
                if (imgFetch.status==200)
                    return image.image;
            } catch (e) {
                console.log('404 immagine', image.image.src)
            }
        }
        bestImages.splice(randomIndex, 1);
    }

    return undefined;
}

const imageExists = async (url: string) => {
    return await axios.get(url)

}

const getAvailability = (product: SourceProduct, availableProducts: Availability[]): Availability | undefined => {
    return availableProducts.find(p => p.codice === product.codice);
}

const getQtaAvailable = (availableProduct: Availability | undefined): number => {
    if (!availableProduct) return 0;
    return availableProduct.arrivi.arrivo.reduce((acc, curr) => acc + curr.qta, 0)
}

const getAttributeIdByName = (name: AttributeName, attributes: Attribute[]): number => {
    const obj = attributes.find(a => a.name === name);
    if (!obj) return -1;
    return obj.id || -1;
}

const getAttributes = (product: SourceProduct, attributes: Attribute[]): Attribute[] => {
    const attributesObj: Attribute[] = [];

    attributesObj.push({
        id: getAttributeIdByName(AttributeName.COLOR, attributes),
        option: product.colore_articolo
    })

    attributesObj.push({
        id: getAttributeIdByName(AttributeName.SIZE, attributes),
        option: product.taglia_articolo
    })

    /*attributesObj.push({
        id: getAttributeIdByName(AttributeName.MATERIALE, attributes),
        option: product.materiale_articolo
    })*/

    return attributesObj;
}

const getAttributesOptions = (product: SourceProduct, attributes: Attribute[]): Attribute[] => {
    const attributesObj: Attribute[] = [];

    attributesObj.push({
        id: getAttributeIdByName(AttributeName.COLOR, attributes),
        options: [product.colore_articolo],
        variation: true
    })

    attributesObj.push({
        id: getAttributeIdByName(AttributeName.SIZE, attributes),
        options: [product.taglia_articolo],
        variation: true
    })

    /*attributesObj.push({
        id: getAttributeIdByName(AttributeName.MATERIALE, attributes),
        options: [product.materiale_articolo],
        variation: true
    })*/

    return attributesObj;
}

const mergeAttributes = (attributes: Attribute[], attributesToMerge: Attribute[]): Attribute[] => {
    attributesToMerge.forEach(attribute => {
        const obj = attributes.find(a => a.id === attribute.id);
        if (obj) {
            attribute.options?.forEach(option => {
                if (!obj.options) obj.options = [];
                const finded = obj.options.find(o => o.toLowerCase() === option.toLowerCase());
                if (!finded) obj.options.push(option);
            })
        } else {
            attributes.push(attribute);
        }
    }
    )

    attributes.forEach(attribute => {
        if (attribute.options) {
            attribute.options = attribute.options.filter((option, index, self) => option != '');
            if (attribute.options.length == 0) {
                delete attribute.options;
            }
        }
    })
    return attributes;
}

export const utils = {
    getDimension,
    getImages,
    getAvailability,
    getQtaAvailable,
    getAttributeIdByName,
    getAttributes,
    getAttributesOptions,
    mergeAttributes,
    getBetterImage
}