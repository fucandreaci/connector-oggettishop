/*
 * File: category
 * Project: connector-node
 * File Created: 05/07/22 - 16:20
 * Author: Andrea Fucci (fucciandrea01@gmail.com)
 * Copyright © 2022-2022 Andrea Fucci
 */

import {Category} from '../models/Destination';
import {destinationData} from '../api/destinationData';

const exist = (name: string, categories: Category[]): Category | undefined => {
    return categories.find(category => category.name === name);
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
        const categories = create(category);
        await fetchCategories()
        return categories;
    }
    return existentCategory;
}

export const category = {
    exist,
    create,
    insertCategoryIfNotExist
}