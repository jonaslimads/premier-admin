import * as React from 'react';
import {
    DateInput,
    Edit,
    NullableBooleanInput,
    TextInput,
    PasswordInput,
    SimpleForm,
    useTranslate,
    RecordContextProvider
} from 'react-admin';
import { Grid, Box, Typography } from '@mui/material';

import StoreNameField from './StoreNameField';
import StoreProductList from './StoreProductList';

const StoreEdit = () => {
    const translate = useTranslate();

    return (
        <Edit title={<StoreTitle />}>
            {/* <Grid container width={{ xs: '100%', xl: 800 }} spacing={2}>
                <Grid item xs={12} md={8}>
                    <Typography variant="h6" gutterBottom>
                        {translate(
                            'resources.customers.fieldGroups.identity'
                        )}
                    </Typography>
                </Grid>
            </Grid> */}
            <StoreProductList />
        </Edit>
    );
}

const StoreTitle = () => <StoreNameField size="32" sx={{ margin: '5px 0' }} />;

export default StoreEdit;
