import * as React from 'react';
import {
    NumberInput,
    ReferenceInput,
    required,
    SelectInput,
    TextInput,
} from 'react-admin';
import { InputAdornment, Grid } from '@mui/material';
import { CATEGORY_ID } from '../dataProvider';

export const ProductEditDetails = () => (
    <Grid container columnSpacing={2}>
        <Grid item xs={12} sm={8}>
            <TextInput source="name" fullWidth validate={req} />
        </Grid>
        <Grid item xs={12} sm={4}>
            <ReferenceInput source={CATEGORY_ID} reference="categories">
                <SelectInput source="name" validate={req} fullWidth />
            </ReferenceInput>
        </Grid>
        {/* <Grid item xs={12} sm={4}>
            <NumberInput
                source="width"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">cm</InputAdornment>
                    ),
                }}
                validate={req}
                fullWidth
            />
        </Grid>
        <Grid item xs={12} sm={4}>
            <NumberInput
                source="height"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">cm</InputAdornment>
                    ),
                }}
                validate={req}
                fullWidth
            />
        </Grid> */}
        <Grid item xs={0} sm={4}></Grid>
        <Grid item xs={12} sm={4}>
            <NumberInput
                source="price"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">€</InputAdornment>
                    ),
                }}
                validate={req}
                fullWidth
            />
        </Grid>
        {/* <Grid item xs={12} sm={4}>
            <NumberInput source="stock" validate={req} fullWidth />
        </Grid>
        <Grid item xs={12} sm={4}>
            <NumberInput source="sales" validate={req} fullWidth />
        </Grid> */}
    </Grid>
);

const req = [required()];
