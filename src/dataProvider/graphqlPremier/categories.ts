export const CATEGORIES = 'categories';

import gql from 'graphql-tag';

import { GraphQlResource } from './graphQlResource';
import { mapGetOneResult, mapGetListResult } from './mappers';

export class CategoriesGraphQl extends GraphQlResource {
    constructor() {
        super(CATEGORIES)
    }

    public getList(params: any): Promise<any> {
        return this.runQuery(
            gql`
                fragment GetListCategoryFields on VendorProductsViewCategory {
                    id
                    name
                    slug
                }
                query GetListCategories($filter: JSONObject, $sort: [OrderBy], $after: String, $before: String, $first: Int, $last: Int) {
                    data: categories(filter: $filter, sort: $sort, after: $after, before: $before, first: $first, last: $last) {
                        edges {
                            node {
                                ...GetListCategoryFields
                                children {
                                    ...GetListCategoryFields
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
                fragment GetOneCategoryFields on VendorProductsViewCategory {
                    id
                    name
                    slug
                    products {
                        id
                        name
                        slug
                        currency
                        price
                    }
                }
                query GetOneCategory($id: String!, $filter: JSONObject) {
                    data: category(id: $id, filter: $filter) {
                        ...GetOneCategoryFields
                        children {
                            ...GetOneCategoryFields
                        }
                    }
                }
            `,
            params,
            mapGetOneResult);
    }
}