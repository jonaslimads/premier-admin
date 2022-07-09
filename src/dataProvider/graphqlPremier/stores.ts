import gql from 'graphql-tag';

import { GraphQlResource } from './graphQlResource';
import { mapGetOneResult, mapGetListResult } from './mappers';

export const STORES = 'stores';

export class StoresGraphQl extends GraphQlResource {
    constructor() {
        super(STORES)
    }

    public getList(params: any): Promise<any> {
        return this.runQuery(
            gql`
                fragment ProductFields on StoreProductsViewProduct {
                    id
                    name
                    slug
                    currency
                    price
                    attachments
                }
                fragment PageFields on StoreProductsViewPage {
                    name
                    slug
                    products {
                        ...ProductFields
                    }
                    children {
                        name
                        slug
                        products {
                            ...ProductFields
                        }
                        children {
                            name
                            slug
                            products {
                                ...ProductFields
                            }
                        }
                    }
                }
                query GetListStores($filter: JSONObject, $sort: [OrderBy], $after: String, $before: String, $first: Int, $last: Int) {
                    data: stores(filter: $filter, sort: $sort, after: $after, before: $before, first: $first, last: $last) {
                        edges {
                            node {
                                id
                                name
                                attributes
                                isPublished
                                seller {
                                    name
                                    attributes
                                }
                                plan {
                                    name
                                    attributes
                                    subscription {
                                        kind
                                        price {
                                            currency
                                            amount
                                        }
                                        expiresOn
                                    }
                                }
                                pages {
                                    ...PageFields
                                }
                                unpagedProducts {
                                    ...ProductFields
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
            params,
            mapGetListResult
        );
    }

    public getOne(params: any): Promise<any> {
        return this.runQuery(
            gql`
                fragment ProductFields on StoreProductsViewProduct {
                    id
                    name
                    slug
                    currency
                    price
                    attachments
                }
                fragment PageFields on StoreProductsViewPage {
                    name
                    slug
                    products {
                        ...ProductFields
                    }
                    children {
                        name
                        slug
                        products {
                            ...ProductFields
                        }
                        children {
                            name
                            slug
                            products {
                                ...ProductFields
                            }
                        }
                    }
                }
                query GetStore($id: String) {
                    data: store(id: $id) {
                        id
                        name
                        attributes
                        __typename
                        pages {
                            ...PageFields
                        }
                        unpagedProducts {
                            ...ProductFields
                        }
                    }
                }
            `,
            params,
            mapGetOneResult);
    }
}