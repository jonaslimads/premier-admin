import gql from 'graphql-tag';

import { GraphQlResource } from './graphQlResource';
import { mapGetOneResult, mapGetListResult } from './mappers';

export const VENDORS = 'vendors';

export class VendorsGraphQl extends GraphQlResource {
    constructor() {
        super(VENDORS)
    }

    public getList(params: any): Promise<any> {
        return this.runQuery(
            gql`
                fragment GetListVendorFields on VendorProductsView {
                    id,
                    name,
                    attributes,
                }
                query GetListVendors($filter: JSONObject, $sort: [OrderBy], $after: String, $before: String, $first: Int, $last: Int) {
                    data: vendors(filter: $filter, sort: $sort, after: $after, before: $before, first: $first, last: $last) {
                        edges {
                            node {
                                ...GetListVendorFields
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
                fragment GetOneVendorFields on PlatformViewVendor {
                    id
                    name
                    attributes
                }
                query GetOneVendor($id: String!, $filter: JSONObject) {
                    data: vendor(id: $id, filter: $filter) {
                        ...GetOneVendorFields
                    }
                }
            `,
            params,
            mapGetOneResult);
    }
}