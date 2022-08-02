/*
 * File: destinationData
 * Project: connector-node
 * File Created: 04/07/22 - 23:54
 * Author: Andrea Fucci (fucciandrea01@gmail.com)
 * Copyright © 2022-2022 Andrea Fucci
 */

import {getApi} from './index';
import {Attribute, AttributeTerm, Category, Product} from '../models/Destination';
import {AxiosResponse} from 'axios';

const api = getApi();

const fetchCategories = async (): Promise<Category[]> => {
    const categories: Category[] = []
    const res = await api.get("products/categories");
    categories.push(...res.data)

    for (let i = 2; i <= res.headers['x-wp-totalpages']; i++) {
        const result = await api.get("products/categories?page=" + i);
        categories.push(...result.data)
    }

    return categories
}

const fetchProducts = async (): Promise<Product[]> => {
    const products: Product[] = []
    const res = await api.get("products");
    products.push(...res.data)

    for (let i = 2; i <= res.headers['x-wp-totalpages']; i++) {
        const result = await api.get("products?page=" + i);
        products.push(...result.data)
    }

    return products
}

const fetchProductVariations = async (productId: number): Promise<Product[]> => {
    const variations: Product[] = []
    const res = await api.get(`products/${productId}/variations`);
    variations.push(...res.data)

    for (let i = 2; i <= res.headers['x-wp-totalpages']; i++) {
        const result = await api.get(`products/${productId}/variations?page=` + i);
        variations.push(...result.data)
    }

    return variations

}

const fetchById = async (productId: number): Promise<any> => { // TODO: check the type
    return api.get(`products/${productId}`);
}

const fetchAttributes = async (): Promise<Attribute[]> => {
    const attributes: Attribute[] = []
    const res = await api.get("products/attributes");
    attributes.push(...res.data)

    return attributes;
}

const fetchAttributeTerms = async (attributeId: number): Promise<AxiosResponse<AttributeTerm[]>> => {
    return api.get(`products/attributes/${attributeId}/terms`);
}

const createCategory = async (category: Category): Promise<AxiosResponse<Category>> => {
    return api.post("products/categories", category);
}

const createProduct = async (product: Product): Promise<AxiosResponse<Product>> => {
    return api.post("products", product);
}

const updateProduct = async (product: Product): Promise<AxiosResponse<Product>> => {
  return await api.put(`products/${product.id}`, product);
}

const createVariation = async (productId: number, variationProduct: Product): Promise<AxiosResponse<Product>> => {
    const newProd = {
        regular_price: variationProduct.regular_price,
        attributes: variationProduct.attributes,
        manage_stock: true,
        stock_quantity: variationProduct.stock_quantity,
        image: 'image' in variationProduct ? variationProduct.image : null,
        sku: variationProduct.sku,
    }

    return await api.post(`products/${productId}/variations`, newProd);
}

const execVariation = async (product: Product) => {
    return await api.post(`products/${product.id}/variations`, product.attributes);
}

const updateVariation = async (product: Partial<Product>, idProduct: number, idVariation: number) => {
    return await api.put(`products/${idProduct}/variations/${idVariation}`, product);
}

export const destinationData = {
    fetchCategories,
    fetchProducts,
    fetchProductVariations,
    fetchAttributes,
    fetchAttributeTerms,
    createCategory,
    createProduct,
    fetchById,
    createVariation,
    updateProduct,
    execVariation,
    updateVariation
}