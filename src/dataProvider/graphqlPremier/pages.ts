import gql from 'graphql-tag';

import { GraphQlResource } from './graphQlResource';
import { mapGetOneResult, mapGetListResult } from './mappers';

export const PAGES = 'pages';

export class PagesGraphQl extends GraphQlResource {
    constructor() {
        super(PAGES)
    }

    public getList(params: any): Promise<any> {
        return this.runQuery(
            gql`
                fragment GetListPageFields on PlatformViewPage {
                    id
                    name
                    slug
                }
                query GetListPages($filter: JSONObject, $sort: [OrderBy], $after: String, $before: String, $first: Int, $last: Int) {
                    data: pages(filter: $filter, sort: $sort, after: $after, before: $before, first: $first, last: $last) {
                        edges {
                            node {
                                ...GetListPageFields
                                children {
                                    ...GetListPageFields
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
                fragment GetOnePageFields on PlatformViewPage {
                    id
                    name
                    slug
                }
                query GetOnePage($id: String!, $filter: JSONObject) {
                    data: category(id: $id, filter: $filter) {
                        ...GetOnePageFields
                        children {
                            ...GetOnePageFields
                        }
                    }
                }
            `,
            params,
            mapGetOneResult);
    }
}