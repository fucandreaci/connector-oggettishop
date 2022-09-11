/*
 * File: index
 * Project: connector-node
 * File Created: 04/07/22 - 17:57
 * Author: Andrea Fucci (fucciandrea01@gmail.com)
 * Copyright © 2022-2022 Andrea Fucci
 */

import {productController as productController} from './controller/product.controller';
import {sourceController} from './controller/source.controller';
import {splitProducts} from './utils/splitProducts.utils';
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

const execute = async () => {
  console.log('Start', new Date())

  // Source products initialization
  const sourceProducts = await sourceController.getProducts()
  const sourceAvailability = await sourceController.getAvailability()

  const { parents, children } = splitProducts.splitParentsChildren(sourceProducts)

  // Destination products initialization
  let destinationProducts = await productController.fetchProducts()
  let categories = await categoryController.fetchCategories()
  const attributes = await productController.fetchAttributes()

  // Insert new products
  for (const parentProd of parents) {
    parentProd.categoria = 'Non-categorizzati'
    parentProd.settore = ''
    parentProd.catalogo = ''
    try {
      const product = await productController.insertNewProduct(destinationProducts, parentProd, categories, sourceAvailability, parents, attributes,async () => {
        categories = await categoryController.fetchCategories()
      }, () => {})
    } catch (e) {
      console.log('Si è verificato un errore')
    }
  }


  // Insert new products child
  for (const childProd of children) {
    childProd.categoria = 'Non-categorizzati'
    childProd.settore = ''
    childProd.catalogo = ''
    try {
      const product = await productController.insertProductVariation(destinationProducts, childProd, categories, sourceAvailability, children, attributes, async () => {
        categories = await categoryController.fetchCategories()
      }, () => {})

      // if (product) destinationProducts.push(product)
    } catch (e) {
        // console.log('Si è verificato un errore', (e as any).response)
    }
  }

  console.log('End', new Date())
}

execute()
