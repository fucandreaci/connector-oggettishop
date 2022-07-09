/*
 * File: models.mapper
 * Project: connector-node
 * File Created: 05/07/22 - 22:41
 * Author: Andrea Fucci (fucciandrea01@gmail.com)
 * Copyright © 2022-2022 Andrea Fucci
 */

import {SourceProduct} from './Source';
import {Category, Dimension, Image, Product} from './Destination';
import {product} from '../controller/product';

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
        length: validParts.length >= 1 ? parseFloat(validParts[0]) : '',
        width: validParts.length >= 2 ? parseFloat(validParts[1]) : '',
        height: validParts.length >= 3 ? parseFloat(validParts[2]) : ''
    }
}

export const getCategoryId = (categories: Category[], category: string): Category => {
    const categoryId = categories.find(c => c.name === category)?.id;
    return {
        id: categoryId,
        name: category
    };
}

export const sourceToDestinationMapper = (sourceProduct: SourceProduct, categories: Category[]): Product => {
    return {
        name: sourceProduct.nome_articolo,
        categories: [getCategoryId(categories, sourceProduct.categoria)],
        description: sourceProduct.descrizione_articolo,
        short_description: sourceProduct.descrizione_articolo,
        images: getImages(sourceProduct),
        regular_price: sourceProduct.Listino_pubblico,
        stock_quantity: 0,
        dimensions: getDimension(sourceProduct)
    }
}

/*
export const sourceToDestinationWithParentMapper = (sourceProduct: SourceProduct, sourceProducts: SourceProduct[], products: Product[]): Product => {
    const result = {
        ... sourceToDestinationMapper(sourceProduct),
    }

    const {articolo_padre, codice} = sourceProduct;

    // Il prodotto è un articolo padre, cerco il prodotto nei prodotti di destinazione ed ottengo l'id
    if (articolo_padre == codice) {
        return {
            ...result,
            parent_id: product.exist(sourceProduct.nome_articolo, products)?.id
        }
    }

    // Il prodotto non è un articolo padre, cerco il prodotto padre nei prodotti di destinazione ed ottengo l'id
    const sourcePadre = sourceProducts.find(sp => sp.codice === articolo_padre);
    if (sourcePadre) {
        const destProduct = product.exist(sourcePadre.nome_articolo, products);

        return {
            ...result,
            parent_id: destProduct?.id
        }
    }

    return result;
}*/
