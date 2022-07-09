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

const fetchCategories = async (): Promise<AxiosResponse<Category[]>> => {
    return api.get("products/categories");
}

const fetchProducts = async (): Promise<AxiosResponse<Product[]>> => {
    return api.get("products");
}

const fetchVariations = async (productId: number): Promise<any> => { // TODO: check the type
    return api.get(`products/${productId}/variations`);
}

const fetchAttributes = async (): Promise<AxiosResponse<Attribute[]>> => {
    return api.get("products/attributes");
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

export const destinationData = {
    fetchCategories,
    fetchProducts,
    fetchVariations,
    fetchAttributes,
    fetchAttributeTerms,
    createCategory,
    createProduct
}