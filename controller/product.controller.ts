/*
 * File: product
 * Project: connector-node
 * File Created: 05/07/22 - 22:34
 * Author: Andrea Fucci (fucciandrea01@gmail.com)
 * Copyright © 2022-2022 Andrea Fucci
 */

import {Attribute, Category, Product} from '../models/Destination';
import {destinationData} from '../api/destinationData';
import {Availability, SourceProduct} from '../models/Source';
import {categoryController} from './category.controller';
import {utils} from '../utils/utils';

const fetchProducts = async () : Promise<Product[]>=> {
    const data = await destinationData.fetchProducts()
    return data
}

const exist = (sku: string, products: Product[]): Product | undefined => {
    return products.find(product => product.sku === sku);
}

const create = async (product: Product): Promise<Product | undefined>=> {
    try {
        return (await destinationData.createProduct(product)).data;
    } catch (e) {
        console.error(e)
    }
}

const fetchAttributes = async () : Promise<Attribute[]>=> {
    const data = await destinationData.fetchAttributes()
    return data
}

const fetchProductVariations = async (productId: number): Promise<Product[]> => {
    const data = await destinationData.fetchProductVariations(productId)
    return data
}

const getParentId = (product: SourceProduct, sourceProducts: SourceProduct[], products: Product[]): number => {
    const parentId = product.articolo_padre;
    if (parentId === product.codice) return -1;

    const parentProduct = products.find(product => product.sku === parentId);
    if (!parentProduct) return -1;
    return parentProduct.id || -1;
}

const createVariation = async (productId: number, variationProduct: Product) => {
    const res = await destinationData.createVariation(productId, variationProduct)
    return res.data
}

const insertProductVariation = async (products: Product[], product: SourceProduct, categories: Category[], availableProducts: Availability[], sourceProducts: SourceProduct[], attributes: Attribute[], fetchCategories: () => void, fetchProducts: () => void) => {
    // If exist a product with the same name, we don't create a new one but we return the existent one
    const findedProduct = exist(product.codice, products);
    if (findedProduct != null) {
        return findedProduct;
    }

    // If not exist a product with the same name, we create a new one

    // Fetch or create the category
    const category = await categoryController.insertCategoryIfNotExist({name: product.categoria}, categories, fetchCategories)
    if (!category) {
        throw new Error("Errore nella creazione della categoria")
    }

    const parentProd: SourceProduct = {
        ...product,
        codice: product.articolo_padre,
        descrizione_articolo: '',
    }

    const parent = await insertNewProduct(products, parentProd, categories, availableProducts, sourceProducts, fetchCategories, fetchProducts);
    if (!parent || !parent.id) {
        throw new Error("Errore nella creazione del prodotto genitore")
    }

    const parentId = parent.id;

    // Obtain the sizes
    const sizes = utils.getDimension(product)

    // Obtain the images
    const images = utils.getImages(product)

    // Obtain the availability
    const availability = utils.getAvailability(product, availableProducts)
    const qtaAvailable = utils.getQtaAvailable(availability)

    // Create the product
    const newProduct: Product = {
        name: product.nome_articolo,
        categories: category.id ? [category] : [],
        sku: product.codice,
        description: product.descrizione_articolo,
        image: {src: "https://catalogs-online.com/images/500x500/NK100AR.jpg"},
        dimensions: sizes,
        stock_quantity: qtaAvailable,
        regular_price: product.Listino_pubblico.toString(),
        short_description: product.descrizione_articolo,
        attributes: utils.getAttributes(product, attributes)
    }

    const createdProduct = await createVariation(parentId, newProduct);
    await fetchProducts()
    return createdProduct;
}

const insertProductIfNotExist = async (product: Product, products: Product[], fetchProducts: () => void): Promise<Product | undefined> => {
    if (!product.name) {
        return undefined;
    }

    const existentProduct = exist(product.sku, products);
    if (!existentProduct) {
        const products = create(product);
        await fetchProducts()
        return products;
    }
    return existentProduct;
}

const insertNewProduct = async (products: Product[], product: SourceProduct, categories: Category[], availableProducts: Availability[], sourceProducts: SourceProduct[], fetchCategories: () => void, fetchProducts: () => void) => {
    // If exist a product with the same name, we don't create a new one but we return the existent one
    const findedProduct = exist(product.codice, products);
    if (findedProduct != null) {
        return findedProduct;
    }

    // If not exist a product with the same name, we create a new one

    // Fetch or create the category
    const parentCategory = await categoryController.insertCategoryIfNotExist({name: product.catalogo}, categories, fetchCategories)
    const category = await categoryController.insertCategoryIfNotExist({name: product.categoria, parent: parentCategory?.id}, categories, fetchCategories)
    if (!category) {
        throw new Error("Errore nella creazione della categoria")
    }

    // Obtain the sizes
    const sizes = utils.getDimension(product)

    // Obtain the images
    const images = utils.getImages(product)

    // Obtain the availability
    const availability = utils.getAvailability(product, availableProducts)
    const qtaAvailable = utils.getQtaAvailable(availability)

    // Create the product
    const newProduct: Product = {
        name: product.nome_articolo,
        categories: category.id ? [category] : [],
        sku: product.codice,
        description: product.descrizione_articolo,
        images,
        dimensions: sizes,
        stock_quantity: qtaAvailable,
        regular_price: product.Listino_pubblico.toString(),
        short_description: product.descrizione_articolo,
        parent_id: getParentId(product, sourceProducts, products)
    }

    const createdProduct = await create(newProduct);
    await fetchProducts()
    return createdProduct;
}


export const productController = {
    exist,
    create,
    insertProductIfNotExist,
    fetchProducts,
    insertNewProduct,
    fetchAttributes,
    insertProductVariation
}