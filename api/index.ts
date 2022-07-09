/*
 * File: index
 * Project: connector-node
 * File Created: 04/07/22 - 23:35
 * Author: Andrea Fucci (fucciandrea01@gmail.com)
 * Copyright © 2022-2022 Andrea Fucci
 */

import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';

const api = new WooCommerceRestApi({
    url: "https://www.oggettishop.it/",
    consumerKey: "ck_adc5cefa0629c66e090c147269ea798c9bc3ab5d",
    consumerSecret: "cs_06bd3c0b7748e99b48c93a00e0d6295f4d02c48b",
});

export const getApi = () => api;