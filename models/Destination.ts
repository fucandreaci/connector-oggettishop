/*
 * File: Destination
 * Project: connector-node
 * File Created: 04/07/22 - 23:02
 * Author: Andrea Fucci (fucciandrea01@gmail.com)
 * Copyright © 2022-2022 Andrea Fucci
 */

export type Product = {
    id?: number,
    name: string;
    sku: string;
    description: string;
    short_description: string;
    regular_price: string
    stock_quantity: number;
    dimensions: Dimension;
    parent_id?: number;
    categories: Category[];
    tags?: Tag[];
    attributes?: Attribute[];
} & ({
    images: Image[];
} | {
    image: Image
})

export interface Dimension{
    length: string | ''; // lunghezza
    width: string | ''; // larghezza
    height: string | ''; // altezza
}

export interface Category {
    id?: number;
    name?: string;
    parent?: number;
}

export interface id {
    id: number;
}

export interface Tag {
    id?: number;
    name: string;
}

export type Attribute = {
    id?: number;
    name?: string;
    slug: string;
    type?: 'select';
} | {
    id?: number;
    name?: string;
    type?: 'select';
    option: string;
}

export interface AttributeTerm {
    id?: number;
    name: string;
}

export interface Image {
    id?: number;
    src: string;
}

export enum AttributeName {
    COLOR = 'Color',
    SIZE = 'Size',
    MATERIALE = 'Materiale',
}