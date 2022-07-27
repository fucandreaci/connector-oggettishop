/*
 * File: category.controller
 * Project: connector-node
 * File Created: 05/07/22 - 16:20
 * Author: Andrea Fucci (fucciandrea01@gmail.com)
 * Copyright © 2022-2022 Andrea Fucci
 */

import {Category, Product} from '../models/Destination';
import {destinationData} from '../api/destinationData';

const fetchCategories = async () : Promise<Category[]>=> {
    const data = await destinationData.fetchCategories()
    return data
}

const exist = (name: string, categories: Category[]): Category | undefined => {
    const cat = categories.find(category => category.name?.toLowerCase().replace("&amp;", "&") === name.toLowerCase());
    return cat
}

const create = async (category: Category): Promise<Category | undefined>=> {
    try {
        return (await destinationData.createCategory(category)).data;
    } catch (e) {
        console.error(e)
    }
}

const insertCategoryIfNotExist = async (category: Category, categories: Category[], fetchCategories: () => void): Promise<Category | undefined> => {
    if (!category.name) {
        return undefined;
    }

    const existentCategory = exist(category.name, categories);
    if (!existentCategory) {
        const newCategory = await create(category);

        if (newCategory) categories.push(newCategory);
        return newCategory;
    }
    return existentCategory;
}

export const categoryController = {
    fetchCategories,
    exist,
    create,
    insertCategoryIfNotExist
}