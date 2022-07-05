import gql from 'graphql-tag';

import { GraphQlResource } from './graphQlResource';
import { mapGetOneResult, mapGetListResult } from './mappers';

export const PLANS = 'plans';

export class PlansGraphQl extends GraphQlResource {
    constructor() {
        super(PLANS)
    }

    public getList(params: any): Promise<any> {
        return this.runQuery(
            gql`
                query GetListPlans {
                    data: plans {
                        edges {
                            node {
                                id: name
                                name
                                order
                                attributes
                                subscriptions {
                                    kind
                                    price {
                                        currency
                                        amount
                                    }
                                    expiresIn
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
                fragment GetOnePlanFields on PlatformViewPlan {
                    id
                    name
                    attributes
                }
                query GetOnePlan($id: String!, $filter: JSONObject) {
                    data: store(id: $id, filter: $filter) {
                        ...GetOnePlanFields
                    }
                }
            `,
            params,
            mapGetOneResult);
    }
}