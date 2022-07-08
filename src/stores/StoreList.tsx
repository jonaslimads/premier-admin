import * as React from 'react';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import { Box, Chip, useMediaQuery, Theme } from '@mui/material';
import {
    List,
    Identifier,
    Datagrid,
    BooleanField,
    DateField,
    TextField,
    BulkDeleteButton,
    CreateButton,
    ExportButton,
    FilterButton,
    FilterForm,
    FilterContext,
    InputProps,
    ListBase,
    NumberInput,
    Pagination,
    ReferenceInput,
    SearchInput,
    SelectInput,
    SortButton,
    Title,
    TopToolbar,
    useTranslate,
    useGetResourceLabel,
} from 'react-admin';

import rowStyle from '../reviews/rowStyle';
import { CATEGORY_ID, onRealData } from '../dataProvider';
import StoreLinkField from './StoreLinkField';
import SellerNameField from './SellerNameField';
import Aside from './Aside';

export interface StoreRowProps {
    selectedRow?: Identifier;
}

const StoreListRow = ({ selectedRow }: StoreRowProps) => (
    <Datagrid
        rowClick="edit"
        rowStyle={rowStyle(selectedRow)}
        optimized
        sx={{
            '& .RaDatagrid-thead': {
                borderLeftColor: 'transparent',
                borderLeftWidth: 5,
                borderLeftStyle: 'solid',
            },
            '& .column-comment': {
                maxWidth: '18em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
            },
        }}
    >
        <StoreLinkField />
        <SellerNameField label="resources.stores.sellers.fields.name" />
        <TextField source="seller.attributes['email']" label="Email" />
        <TextField source="plan.name" label="resources.plans.fields.name" />
        <DateField source="plan.subscription.expiresOn" label="resources.plans.fields.expiresOn" />
        <BooleanField
            source="isPublished"
            label="resources.stores.fields.isPublished"
            sx={{ mt: -0.5, mb: -0.5 }}
        />
        {/* <DateField source="date" />
        <CustomerReferenceField link={false} />
        <ProductReferenceField link={false} />
        <StarRatingField size="small" />
        <TextField source="status" /> */}
    </Datagrid>
);

const StoreList = () => {
    const location = useLocation();

    const getResourceLabel = useGetResourceLabel();
    // const navigate = useNavigate();

    // const handleClose = useCallback(() => {
    //     navigate('/reviews');
    // }, [navigate]);

    const match = matchPath('/stores/:id', location.pathname);

    const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('md'));

    return (
        <ListBase perPage={24} sort={{ field: 'name', order: 'ASC' }}>
            <Title defaultTitle={getResourceLabel('stores', 2)} />
            <FilterContext.Provider value={storeFilters}>
                <ListActions isSmall={isSmall} />
                {isSmall && (
                    <Box m={1}>
                        <FilterForm />
                    </Box>
                )}
            </FilterContext.Provider>
            <Box display="flex">
                {/* <Aside /> */}
                <Box width={isSmall ? 'auto' : 'calc(100% - 16em)'}>
                    <StoreListRow
                        selectedRow={
                            !!match
                                ? parseInt((match as any).params.id, 10)
                                : undefined
                        }
                    />
                </Box>
            </Box>
        </ListBase>
    );
};

export const storeFilters = [
    <SearchInput source="q" alwaysOn />,
];

const ListActions = ({ isSmall }: any) => (
    <TopToolbar sx={{ minHeight: { sm: 56 } }}>
        {isSmall && <FilterButton />}
        <SortButton fields={['name']} />
        <CreateButton />
        <ExportButton />
    </TopToolbar>
);

export default StoreList;
