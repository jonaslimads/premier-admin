import * as React from 'react';
import { Box, Chip, useMediaQuery, Theme, Typography, } from '@mui/material';
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
import { Store, Page, Product } from '../types';

const StoreProductList = () => {
    const record = useRecordContext<Store>();
    if (!record || !record.pages || !record.unpagedProducts) {
        return null;
    }
    console.log('Record', record);

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
            <Box width={isSmall ? 'auto' : 'calc(100% - 16em)'} sx={{ margin: '16px' }}>
                {record.pages && record.pages.map(page => (
                    <PageList page={page} level={0} key={page.name} />
                ))}
                {record.pages.length === 0 && <div>No product pages</div>}
                {record.unpagedProducts && <ImageList products={record.unpagedProducts} />}
            </Box>
        </ListBase>
    );
};

interface PageProps {
    key: string,
    page: Page,
    level: number;
};

const PageList = (props: PageProps) => {
    const { page, level } = props;
    const products = page.products;

    let pageName = '>'.repeat(Math.max(0, level - 1)) + ' ' + page.name;

    return (
        <Box sx={{ marginLeft: level * 16 + 'px', marginTop: '16px' }}>
            <Typography
                variant={level === 0 ? 'h6' : 'subtitle1'}
                display='flex'
                flexWrap='nowrap'
                alignItems='center'
                component='div'
            >
                {pageName}
            </Typography>
            {products.length > 0 ? <ImageList products={products} /> : <div>No products</div>}
            {page.children && page.children.map(child => (
                <PageList page={child} level={level + 1} key={page.name + ' ' + child.name} />
            ))}
        </Box>
    );
}

export const productFilters = [];

// const ListActions = ({ isSmall }: any) => (
//     <TopToolbar sx={{ minHeight: { sm: 56 } }}>
//     </TopToolbar>
// );

export default StoreProductList;