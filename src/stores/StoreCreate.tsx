import * as React from 'react';
import {
    Create,
    DateInput,
    SimpleForm,
    TextInput,
    useTranslate,
    PasswordInput,
    email,
} from 'react-admin';
import { Box, Typography } from '@mui/material';

export const validateForm = (
    values: Record<string, any>
): Record<string, any> => {
    const errors = {} as any;

    const seller = values.seller;

    if (!values.name) {
        errors.name = 'ra.validation.required';
    }

    if (!seller.name) {
        errors.seller_name = 'ra.validation.required';
    }
    if (!seller.attributes.email) {
        errors.seller_email = 'ra.validation.required';
    } else {
        const error = email()(seller.attributes.email);
        if (error) {
            errors.seller_email = error;
        }
    }

    return errors;
};

const StoreCreate = () => (
    <Create>
        <SimpleForm
            sx={{ maxWidth: 500 }}
            defaultValues={{}}
            validate={validateForm}
        >
            <SectionTitle label="resources.stores.fieldGroups.store" />
            <TextInput source="name" isRequired fullWidth />

            <Separator />

            <SectionTitle label="resources.stores.fieldGroups.seller" />
            <TextInput source="seller.name" label="resources.stores.fieldGroups.name" isRequired fullWidth />
            <TextInput type="email" source="seller.attributes.email" label="resources.stores.fieldGroups.email" isRequired fullWidth />

        </SimpleForm>
    </Create>
);

const SectionTitle = ({ label }: { label: string }) => {
    const translate = useTranslate();

    return (
        <Typography variant="h6" gutterBottom>
            {translate(label as string)}
        </Typography>
    );
};

const Separator = () => <Box pt="1em" />;

export default StoreCreate;
