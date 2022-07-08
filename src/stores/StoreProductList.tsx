import * as React from 'react';
import { Box, Chip, useMediaQuery, Theme } from '@mui/material';
import {
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
    useRecordContext
} from 'react-admin';

import ImageList from '../products/GridList';
import { Store } from '../types';

const StoreProductList = () => {
    const record = useRecordContext<Store>();
    if (!record) {
        return null;
    }

    const getResourceLabel = useGetResourceLabel();
    const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('md'));

    return (
        <ListBase perPage={24} sort={{ field: 'name', order: 'ASC' }}>
            <Title defaultTitle={getResourceLabel('products', 2)} />
            <FilterContext.Provider value={productFilters}>
                {/* <ListActions isSmall={isSmall} /> */}
                {isSmall && (
                    <Box m={1}>
                        <FilterForm />
                    </Box>
                )}
            </FilterContext.Provider>
            <Box display="flex">
                <Box width={isSmall ? 'auto' : 'calc(100% - 16em)'}>
                    <ImageList storeId={record.id} />
                    <Pagination rowsPerPageOptions={[12, 24, 48, 72]} />
                </Box>
            </Box>
        </ListBase>
    );
};

export const productFilters = [];

// const ListActions = ({ isSmall }: any) => (
//     <TopToolbar sx={{ minHeight: { sm: 56 } }}>
//     </TopToolbar>
// );

export default StoreProductList;