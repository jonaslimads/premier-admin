import { ApolloQueryResult } from '@apollo/client';
import buildApolloClient, {
    buildQuery as buildQueryFactory,
} from './graphql-custom';
import { GetListResult } from 'ra-core';
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
                return dataProvider[name](resource, transformParams(params));
            };
        },
    });
};

const transformParams = (params: any): any => {
    const newParams: { [key: string]: string | number } = {};
    const pagination = params['pagination'];
    if (pagination && pagination['page'] && pagination['perPage'] && pagination['page'] > 0 && pagination['perPage'] > 0) {
        newParams['first'] = pagination['perPage'];
    }
    return newParams;
}

const mapGetListResult = (response: any): GetListResult<any> => {
    const list = response.data.list;
    const result = {
        data: list.edges.map((edge: any) => edge.node),
        total: list.total,
        pageInfo: list.pageInfo
    }
    console.log(result);
    console.log('Old response', response.data);
    console.log('New response', result);
    return result;
};

const dataProviderFactory = (client: ApolloClient<NormalizedCacheObject>): DataProvider => ({
    create: () => Promise.reject({ data: null }), // avoids adding a context in tests
    delete: () => Promise.reject({ data: null }), // avoids adding a context in tests
    deleteMany: () => Promise.reject({ data: [] }), // avoids adding a context in tests
    getList: (resource, params) => {
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

                    query GetCategories($after: String, $before: String, $first: Int, $last: Int) {
                        list: categories(id: "332807312191", after: $after, before: $before, first: $first, last: $last) {
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
                .catch(error => Promise.reject(error))
        }
        return Promise.reject({ data: [], total: 0 });
        // return Promise.resolve({ data: [], total: 0 })
    },
    getMany: () => Promise.reject({ data: [] }), // avoids adding a context in tests
    getManyReference: () => Promise.reject({ data: [], total: 0 }), // avoids adding a context in tests
    getOne: () => Promise.reject({ data: null }), // avoids adding a context in tests
    update: () => Promise.reject({ data: null }), // avoids adding a context in tests
    updateMany: () => Promise.reject({ data: [] }), // avoids adding a context in tests
});
