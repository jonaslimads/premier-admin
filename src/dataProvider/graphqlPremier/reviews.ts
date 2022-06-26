import gql from 'graphql-tag';

import { GraphQlResource } from './graphQlResource';
import { mapGetOneResult, mapGetListResult } from './mappers';

export const REVIEWS = 'reviews';

export class ReviewsGraphQl extends GraphQlResource {
    constructor() {
        super(REVIEWS)
    }

    public getList(params: any): Promise<any> {
        return this.runQuery(
            gql`
                query GetListReviews($filter: JSONObject, $sort: [OrderBy], $after: String, $before: String, $first: Int, $last: Int) {
                    data: reviews(filter: $filter, sort: $sort, after: $after, before: $before, first: $first, last: $last) {
                        edges {
                            node {
                                id
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
                fragment CategoryFields on StoreProductsViewCategory {
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
                        ...CategoryFields
                        children {
                            ...CategoryFields
                        }
                    }
                }
            `,
            params,
            mapGetOneResult);
    }
}