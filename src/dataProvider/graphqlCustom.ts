import { ApolloQueryResult } from '@apollo/client';
import buildApolloClient, {
    buildQuery as buildQueryFactory,
} from './graphql-custom';
import { BuildQueryFactory } from 'ra-data-graphql';
import { CREATE, DataProvider, DELETE, GET_LIST } from 'react-admin';
import gql from 'graphql-tag';
import { IntrospectionType } from 'graphql';
import { HttpLink, DefaultOptions } from '@apollo/client';


const getGqlResource = (resource: string) => {
    switch (resource) {
        // case 'customers':
        //     return 'Customer';

        case 'categories':
            return 'Category';

        // case 'commands':
        //     return 'Command';

        // case 'products':
        //     return 'Product';

        // case 'reviews':
        //     return 'Review';

        // case 'invoices':
        //     return 'Invoice';

        default:
            throw new Error(`Unknown resource ${resource}`);
    }
};

const customBuildQuery: BuildQueryFactory = () => {
    const buildQuery = buildQueryFactory();
    return (type, resource, params) => {
        console.log(type, resource, params);
        if (type === GET_LIST) {
            return {
                query: gql`query allCategories($first: Int) {
                    numbers(first: $first) {
                        edges {
                            node
                            diff
                        }
                    }
                }`,
                // variables: { id: params.id },
                variables: { first: 2 },
                parseResponse: ({ data }: ApolloQueryResult<any>) => {
                    console.log("Got data", data);
                    return { data: [], total: 0 };
                }
            }
        }
        if (type === DELETE) {
            return {
                query: gql`mutation remove${resource}($id: ID!) {
                    remove${resource}(id: $id) {
                        id
                    }
                }`,
                variables: { id: params.id },
                parseResponse: ({ data }: ApolloQueryResult<any>) => {
                    if (data[`remove${resource}`]) {
                        return { data: { id: params.id } };
                    }

                    throw new Error(`Could not delete ${resource}`);
                },
            };
        }

        if (resource === 'Customer' && type === CREATE) {
            return {
                query: gql`
                    mutation createCustomer(
                        $first_name: String!
                        $last_name: String!
                        $email: String!
                        $address: String
                        $zipcode: String
                        $city: String
                        $stateAbbr: String
                        $birthday: Date
                        $first_seen: Date!
                        $last_seen: Date!
                        $has_ordered: Boolean!
                        $latest_purchase: Date
                        $has_newsletter: Boolean!
                        $groups: [String]!
                        $nb_commands: Int!
                        $total_spent: Float!
                    ) {
                        createCustomer(
                            first_name: $first_name
                            last_name: $last_name
                            email: $email
                            address: $address
                            zipcode: $zipcode
                            city: $city
                            stateAbbr: $stateAbbr
                            birthday: $birthday
                            first_seen: $first_seen
                            last_seen: $last_seen
                            has_ordered: $has_ordered
                            latest_purchase: $latest_purchase
                            has_newsletter: $has_newsletter
                            groups: $groups
                            nb_commands: $nb_commands
                            total_spent: $total_spent
                        ) {
                            id
                        }
                    }
                `,
                variables: params.data,
                parseResponse: ({ data }: ApolloQueryResult<any>) => {
                    if (data.createCustomer) {
                        return { data: { id: data.createCustomer.id } };
                    }

                    throw new Error(`Could not create Customer`);
                },
            };
        }

        return buildQuery(type, resource, params);
    };
};

export default async () => {
    const defaultOptions: DefaultOptions = {
        watchQuery: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'ignore',
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
    }

    const dataProvider = await buildApolloClient({
        clientOptions: {
            link: new HttpLink({
                uri: 'http://localhost:8000',
                fetchOptions: {
                    mode: 'no-cors'
                },
                headers: {
                    // 'Access-Control-Request-Method': 'POST',
                }
            }),
            defaultOptions: defaultOptions,
            connectToDevTools: true
        },
        introspection: false,
        // introspection: {
        //     operationNames: {
        //         [DELETE]: (resource: IntrospectionType) =>
        //             `remove${resource.name}`,
        //     },
        // },
        buildQuery: customBuildQuery,
    });

    return new Proxy<DataProvider>(defaultDataProvider, {
        get: (target, name) => {
            if (typeof name === 'symbol' || name === 'then') {
                return;
            }
            return async (resource: string, params: any) => {
                console.log(name, resource, params);
                // console.trace();
                // return { data: [], total: 0 };
                return dataProvider[name](getGqlResource(resource), {});
            };
        },
    });
};
// Only used to initialize proxy
const defaultDataProvider: DataProvider = {
    create: () => Promise.reject({ data: null }), // avoids adding a context in tests
    delete: () => Promise.reject({ data: null }), // avoids adding a context in tests
    deleteMany: () => Promise.resolve({ data: [] }), // avoids adding a context in tests
    getList: () => Promise.resolve({ data: [], total: 0 }), // avoids adding a context in tests
    getMany: () => Promise.resolve({ data: [] }), // avoids adding a context in tests
    getManyReference: () => Promise.resolve({ data: [], total: 0 }), // avoids adding a context in tests
    getOne: () => Promise.reject({ data: null }), // avoids adding a context in tests
    update: () => Promise.reject({ data: null }), // avoids adding a context in tests
    updateMany: () => Promise.resolve({ data: [] }), // avoids adding a context in tests
};
