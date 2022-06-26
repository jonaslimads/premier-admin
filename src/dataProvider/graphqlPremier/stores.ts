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
                query GetListStores($filter: JSONObject, $sort: [OrderBy], $after: String, $before: String, $first: Int, $last: Int) {
                    data: stores(filter: $filter, sort: $sort, after: $after, before: $before, first: $first, last: $last) {
                        edges {
                            node {
                                id,
                                name,
                                attributes,
                                seller {
                                    name
                                    attributes
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
                fragment GetOneStoreFields on PlatformViewStore {
                    id
                    name
                    attributes
                }
                query GetOneStore($id: String!, $filter: JSONObject) {
                    data: store(id: $id, filter: $filter) {
                        ...GetOneStoreFields
                    }
                }
            `,
            params,
            mapGetOneResult);
    }
}