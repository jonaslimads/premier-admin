import { ApolloQueryResult } from '@apollo/client';
import buildApolloClient, {
    buildQuery as buildQueryFactory,
} from './graphql-custom';
import { GetListResult, GetOneResult } from 'ra-core';
import { BuildQueryFactory } from 'ra-data-graphql';
import { CREATE, DataProvider, DELETE, GET_LIST } from 'react-admin';
import gql from 'graphql-tag';
import { IntrospectionType } from 'graphql';
import { HttpLink, DefaultOptions, ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';

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

    return new Proxy<DataProvider>(dataProvider, {
        get: (target, name) => {
            if (typeof name === 'symbol' || name === 'then') {
                return;
            }
            return async (resource: string, params: any) => {
                console.log(`GraphQL ${resource}`, params);
                return dataProvider[name](resource, transformParams(params));
            };
        },
    });
};

const transformParams = (params: any): any => {
    const newParams: { [key: string]: string | number | any } = { filter: {} };

    // temp
    newParams.filter['vendor_id'] = '332807312191';

    const pagination = params.pagination;
    if (pagination && pagination.page && pagination.perPage && pagination.page > 0 && pagination.perPage > 0) {
        newParams.first = pagination.perPage;
    }
    if (params.sort) {
        newParams.sort = params.sort;
    }
    if (params.id) {
        newParams.id = params.id;
    }
    if (params.meta) {
        newParams.meta = params.meta;
    }
    if (params.target && params.id) {
        newParams.filter[params.target] = params.id;
    }
    return newParams;
}

const mapGetListResult = (response: any): GetListResult<any> => {
    const data = response.data.data;
    const result = {
        data: data.edges.map((edge: any) => edge.node),
        total: data.total,
        pageInfo: data.pageInfo
    }
    return result;
};

const mapGetManyReferenceResult = (response: any): GetListResult<any> => {
    const data = response.data.data;
    const result = {
        data: data.edges.map((edge: any) => {
            let node = edge.node;
            let result = { ...node };
            if (edge.categoryId) {
                result['category_id'] = edge.categoryId;
            }
            return result;
        }),
        total: data.total,
        pageInfo: data.pageInfo
    }
    return result;
};

const mapGetOneResult = (response: any): GetOneResult<any> => {
    return { data: response.data.data };
}

const dataProviderFactory = (client: ApolloClient<NormalizedCacheObject>): DataProvider => ({
    create: () => Promise.reject({ data: null }), // avoids adding a context in tests
    delete: () => Promise.reject({ data: null }), // avoids adding a context in tests
    deleteMany: () => Promise.reject({ data: [] }), // avoids adding a context in tests
    getList: (resource, params: any) => {
        if (resource === 'categories') {
            return client.query({
                query: gql`
                    fragment CategoryFields on VendorProductsViewCategory {
                        id
                        name
                        slug
                    }
                    query GetCategories($filter: JSONObject, $sort: [OrderBy], $after: String, $before: String, $first: Int, $last: Int) {
                        data: categories(filter: $filter, sort: $sort, after: $after, before: $before, first: $first, last: $last) {
                            edges {
                                node {
                                    ...CategoryFields
                                    children {
                                        ...CategoryFields
                                    }
                                }
                            }
                            pageInfo {
                                hasNextPage
                                hasPreviousPage
                            }
                            total
                        }
                    }
                `,
                variables: params
            })
                .then(response => Promise.resolve(mapGetListResult(response)))
                .catch(error => Promise.reject(error));
        }
        return Promise.reject({ data: [], total: 0 });
    },
    getMany: () => Promise.reject({ data: [] }), // avoids adding a context in tests
    getManyReference: (resource, params: any) => {
        if (resource === 'products') {
            return client.query({
                query: gql`
                    fragment ProductFields on VendorProductsViewProduct {
                        id
                        name
                        slug
                        currency
                        price
                    }
                    query GetProducts($filter: JSONObject, $sort: [OrderBy], $after: String, $before: String, $first: Int, $last: Int) {
                        data: products(filter: $filter, sort: $sort, after: $after, before: $before, first: $first, last: $last) {
                            edges {
                                node {
                                    ...ProductFields
                                }
                                categoryId
                            }
                            pageInfo {
                                hasNextPage
                                hasPreviousPage
                            }
                            total
                        }
                    }
                `,
                variables: params
            })
                .then(response => Promise.resolve(mapGetManyReferenceResult(response)))
                .catch(error => {
                    return Promise.reject(error)
                });
        }
        return Promise.reject({ data: [], total: 0 })
    }, // avoids adding a context in tests
    getOne: (resource, params: any) => {
        if (resource === 'categories') {
            return client.query({
                query: gql`
                    fragment CategoryFields on VendorProductsViewCategory {
                        id
                        name
                        slug
                        products {
                            ...ProductFields
                        }
                    }
                    fragment ProductFields on VendorProductsViewProduct {
                        id
                        name
                        slug
                        currency
                        price
                    }
                    query GetCategory($id: String!, $filter: JSONObject) {
                        data: category(id: $id, filter: $filter) {
                            ...CategoryFields
                            children {
                                ...CategoryFields
                            }
                        }
                    }
                `,
                variables: params
            })
                .then(response => Promise.resolve(mapGetOneResult(response)))
                .catch(error => Promise.reject(error));
        }
        return Promise.reject({ data: null })
    }, // avoids adding a context in tests
    update: () => Promise.reject({ data: null }), // avoids adding a context in tests
    updateMany: () => Promise.reject({ data: [] }), // avoids adding a context in tests
});
