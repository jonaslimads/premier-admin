import * as React from 'react';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import { Box, Chip, useMediaQuery, Theme } from '@mui/material';
import {
    List,
    Identifier,
    Datagrid,
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
import VendorLinkField from './VendorLinkField';

export interface VendorRowProps {
    selectedRow?: Identifier;
}


const VendorListRow = ({ selectedRow }: VendorRowProps) => (
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
        <VendorLinkField />
        {/* <DateField source="date" />
        <CustomerReferenceField link={false} />
        <ProductReferenceField link={false} />
        <StarRatingField size="small" />
        <TextField source="status" /> */}
    </Datagrid>
);

const VendorList = () => {
    const isXSmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('sm')
    );
    const location = useLocation();
    // const navigate = useNavigate();

    // const handleClose = useCallback(() => {
    //     navigate('/reviews');
    // }, [navigate]);

    const match = matchPath('/vendors/:id', location.pathname);

    return (
        <Box display="flex">
            <List
                sx={{
                    flexGrow: 1,
                    transition: (theme: any) =>
                        theme.transitions.create(['all'], {
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    marginRight: !!match ? '400px' : 0,
                }}
                // filters={reviewFilters}
                perPage={25}
                sort={{ field: 'date', order: 'DESC' }}
            >
                <VendorListRow
                    selectedRow={
                        !!match
                            ? parseInt((match as any).params.id, 10)
                            : undefined
                    }
                />
            </List>
        </Box>
    );
};

export default VendorList;
