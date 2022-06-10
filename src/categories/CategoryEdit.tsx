import * as React from 'react';
import {
    Datagrid,
    Edit,
    EditButton,
    NumberField,
    Labeled,
    ReferenceManyField,
    SimpleForm,
    TextInput,
    TextField,
    useTranslate,
    useRecordContext,
} from 'react-admin';

import ThumbnailField from '../products/ThumbnailField';
import ProductRefField from '../products/ProductRefField';
import { Category } from '../types';
import { CATEGORY_ID } from '../dataProvider';

const CategoryEdit = () => (
    <Edit title={<CategoryTitle />}>
        <SimpleForm>
            <TextInput source="name" />
            <Labeled label="resources.categories.fields.products" fullWidth>
                <ReferenceManyField
                    reference="products"
                    target={CATEGORY_ID}
                    perPage={20}
                >
                    <Datagrid
                        sx={{
                            '& .column-thumbnail': {
                                width: 25,
                                padding: 0,
                            },
                        }}
                    >
                        <ThumbnailField source="thumbnail" label="" />
                        <ProductRefField source="name" />
                        <TextField source="slug" label="Slug" />
                        <NumberField
                            source="price"
                            options={{ style: 'currency', currency: 'USD' }}
                        />
                        {/* <NumberField
                            source="width"
                            options={{ minimumFractionDigits: 2 }}
                        />
                        <NumberField
                            source="height"
                            options={{ minimumFractionDigits: 2 }}
                        />
                        <NumberField source="stock" />
                        <NumberField source="sales" /> */}
                        <EditButton />
                    </Datagrid>
                </ReferenceManyField>
            </Labeled>
        </SimpleForm>
    </Edit>
);

const CategoryTitle = () => {
    const record = useRecordContext<Category>();
    const translate = useTranslate();

    return record ? (
        <span>
            {translate('resources.categories.name', { smart_count: 1 })} &quot;
            {record.name}&quot;
        </span>
    ) : null;
};

export default CategoryEdit;
