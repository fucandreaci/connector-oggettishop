/*
 * File: Destination
 * Project: connector-node
 * File Created: 04/07/22 - 23:02
 * Author: Andrea Fucci (fucciandrea01@gmail.com)
 * Copyright © 2022-2022 Andrea Fucci
 */

export interface Product {
    id?: number,
    name: string;
    description: string;
    short_description: string;
    regular_price: number
    stock_quantity: number;
    dimensions: Dimension;
    parent_id?: number;
    categories: Category[];
    tags?: Tag[];
    images: Image[];
}

export interface Dimension{
    length: number | ''; // lunghezza
    width: number | ''; // larghezza
    height: number | ''; // altezza
}

export type Category = {
    id?: number;
    name?: string;
}

export interface Tag {
    id?: number;
    name: string;
}

export type Attribute = {
    id?: number;
    name: string;
    slug: string;
} | {
    id?: number;
    name: string;
    options: string[];
}

export interface AttributeTerm {
    id?: number;
    name: string;
}

export interface Image {
    id?: number;
    src: string;
}