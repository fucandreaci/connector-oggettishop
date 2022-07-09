/*
 * File: Source
 * Project: connector-node
 * File Created: 04/07/22 - 22:46
 * Author: Andrea Fucci (fucciandrea01@gmail.com)
 * Copyright © 2022-2022 Andrea Fucci
 */

export interface SourceProduct {
    codice: string,
    articolo_padre: string,
    nome_articolo: string,
    descrizione_articolo: string,
    dimensione_articolo: string,
    materiale_articolo: string,
    colore_articolo: string,
    deco_colore_articolo: string,
    taglia_articolo: string,
    peso_articolo: Misura,
    dimensione_1_carton: Misura,
    dimensione_2_carton: Misura,
    dimensione_3_carton: Misura,
    volume_carton: Misura,
    inner_carton: number,
    box_carton: number,
    export_carton: number,
    settore: string,
    categoria: string,
    Listino_rivenditori: number,
    Listino_pubblico: number,
    Link_Foto: {
        Foto: string[] | string
    } | string,
    Foto: string,
    catalogo: string,
    update: number
}

export interface Misura {
    _: number,
    unit_of_measure: string
}