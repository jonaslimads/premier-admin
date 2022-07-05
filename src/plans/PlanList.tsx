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
// import PlanLinkField from './PlanLinkField';

export interface PlanRowProps {
    selectedRow?: Identifier;
}

const storeFilters = [
    <SearchInput source="q" alwaysOn />,
];

const PlanListRow = ({ selectedRow }: PlanRowProps) => (
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
        <TextField source="name" label="resources.plans.fields.name" />
        <TextField source="attributes['description']" label="resources.plans.fields.description" />
        <TextField source="subscriptions" />
        {/* <PlanLinkField /> */}
        {/* <SellerNameField label="resources.stores.sellers.fields.name" /> */}
        {/* <TextField source="seller.attributes['email']" label="Email" />
        <TextField source="plan.name" label="resources.plans.fields.name" />
        <DateField source="plan.subscription.expiresOn" label="resources.plans.fields.expiresOn" />
        <BooleanField
            source="isPublished"
            label="resources.stores.fields.isPublished"
            sx={{ mt: -0.5, mb: -0.5 }}
        /> */}
        {/* <DateField source="date" />
        <CustomerReferenceField link={false} />
        <ProductReferenceField link={false} />
        <StarRatingField size="small" />
        <TextField source="status" /> */}
    </Datagrid>
);

const PlanList = () => {
    const isXSmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('sm')
    );
    const location = useLocation();
    // const navigate = useNavigate();

    // const handleClose = useCallback(() => {
    //     navigate('/reviews');
    // }, [navigate]);

    const match = matchPath('/plans/:id', location.pathname);

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
                filters={storeFilters}
                perPage={25}
                sort={{ field: 'date', order: 'DESC' }}
            >
                <PlanListRow
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

export default PlanList;