import {
    DataProvider,
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    UPDATE_MANY,
    DELETE,
    DELETE_MANY,
} from 'react-admin';
import { HttpLink, ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';

import { CATEGORIES, CategoriesGraphQl } from './categories';
import { PAGES, PagesGraphQl } from './pages';
import { PLANS, PlansGraphQl } from './plans';
import { PRODUCTS, ProductsGraphQl } from './products';
import { REVIEWS, ReviewsGraphQl } from './reviews';
import { STORES, StoresGraphQl } from './stores';
import { transformParams } from './mappers';


const categoriesGraphQl = new CategoriesGraphQl();
const pagesGraphQl = new PagesGraphQl();
const plansGraphQl = new PlansGraphQl();
const productsGraphQl = new ProductsGraphQl();
const reviewsGraphQl = new ReviewsGraphQl();
const storesGraphQl = new StoresGraphQl();

export default async () => {
    const client = new ApolloClient({
        link: new HttpLink({
            uri: 'http://localhost:8000',
            headers: {
                'Access-Control-Request-Method': 'POST',
            }
        }),
        cache: new InMemoryCache(),
        defaultOptions: {
            watchQuery: {
                fetchPolicy: 'no-cache',
                errorPolicy: 'ignore',
            },
            query: {
                fetchPolicy: 'no-cache',
                errorPolicy: 'all',
            },
        },
        connectToDevTools: true
    });

    const dataProvider = dataProviderFactory(client);

    categoriesGraphQl.setClient(client);
    pagesGraphQl.setClient(client);
    plansGraphQl.setClient(client);
    productsGraphQl.setClient(client);
    reviewsGraphQl.setClient(client);
    storesGraphQl.setClient(client);

    return new Proxy<DataProvider>(dataProvider, {
        get: (target, name) => {
            if (typeof name === 'symbol' || name === 'then') {
                return;
            }
            return async (resource: string, params: any) => {
                console.log(`GraphQL ${resource}`, name, params);
                return dataProvider[name](resource, transformParams(name, params));
            };
        },
    });
};

const getFunc = (source: string, resource: string, params: any): Promise<any> => {
    if (resource === CATEGORIES) {
        return categoriesGraphQl.getList(params);
    } else if (resource === PLANS) {
        return plansGraphQl.getList(params);
    } else if (resource === PRODUCTS) {
        return productsGraphQl.getList(params);
    } else if (resource === REVIEWS) {
        return reviewsGraphQl.getList(params);
    } else if (resource === STORES) {
        return storesGraphQl.getList(params);
    }
    // console.log("--------", source, resource, resource, params);
    return Promise.reject({ data: [], total: 0, resource, source })
}

const dataProviderFactory = (client: ApolloClient<NormalizedCacheObject>): DataProvider => ({
    create: (resource, params) => Promise.reject({ data: null, source: CREATE, resource, params }),
    delete: (resource, params) => Promise.reject({ data: null, source: DELETE, resource, params }),
    deleteMany: (resource, params) => Promise.reject({ data: [], source: DELETE_MANY, resource, params }),
    getList: (resource, params: any) => {
        return getFunc(GET_LIST, resource, params);
    },
    getMany: (resource, params: any) => {
        return getFunc(GET_MANY, resource, params);
    },
    getManyReference: (resource, params: any) => {
        return getFunc(GET_MANY_REFERENCE, resource, params);
    },
    getOne: (resource, params: any) => {
        // console.log("--------", GET_ONE, resource, params);
        if (resource === CATEGORIES) {
            return categoriesGraphQl.getOne(params);
        } else if (resource === PRODUCTS) {
            return productsGraphQl.getOne(params);
        }
        return Promise.reject({ data: null, source: GET_ONE, resource, params })
    },
    update: (resource, params) => {
        if (resource === PRODUCTS) {
            return productsGraphQl.updateOne(params);
        }
        return Promise.reject({ data: null, source: UPDATE, resource, params })
    },
    updateMany: (resource, params) => Promise.reject({ data: [], source: UPDATE_MANY, resource, params }),
});
