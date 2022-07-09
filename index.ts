/*
 * File: index
 * Project: connector-node
 * File Created: 04/07/22 - 17:57
 * Author: Andrea Fucci (fucciandrea01@gmail.com)
 * Copyright © 2022-2022 Andrea Fucci
 */

import {sourceData} from './api/sourceData';
import {destinationData} from './api/destinationData';
import {productController as productController} from './controller/product.controller';
import {sourceController} from './controller/source.controller';
import {splitProducts} from './utils/splitProducts.utils';
import {utils} from './utils/utils';
import {categoryController} from './controller/category.controller';

/*
sourceData.fetchData().then(async products => {
    // Fetch delle categorie presenti nel sistema di destinazione (WooCommerce)
    let categories = await destinationData.fetchCategories()

    products.forEach(product => {

        // Per ogni prodotto, verifico se esiste una categoria con quel nome, altrimenti la creo e la restituisco
        const newCategory = category.insertCategoryIfNotExist({name: product.categoria}, categories.data, async () => {
            categories = await destinationData.fetchCategories()
        });

        // Si è verificato un errore nella creazione della categoria
        if (!newCategory) {
            console.error("Errore nella creazione della categoria")
            return;
        }

        // Per ogni nuovo prodotto, verifico se esiste già un prodotto con quel nome in WooCommerce, altrimenti lo creo e lo restituisco
        const newProduct = productController.insertProductIfNotExist({name: product.nome_articolo}, categories.data, async () => {

        }
    })
})*/

const init = async () => {
  // Source products initalization
  const sourceProducts = await sourceController.getProducts()
  const sourceAvailability = await sourceController.getAvailability()

  const { parents, children } = splitProducts.splitParentsChildren(sourceProducts)

  const destinationProducts = await productController.fetchProducts()
  const categories = await categoryController.fetchCategories()

  // Insert new products
  for (const parentProd of parents) {
    // TODO: implement the fetch category callback
    // TODO: add the insert product callback
    const product = await productController.insertNewProduct(destinationProducts, parentProd, categories, () => {}, sourceAvailability, parents)
  }
}

init()