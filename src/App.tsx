import * as React from 'react';
import { Admin, CustomRoutes, Resource } from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import { Route } from 'react-router';

import authProvider from './authProvider';
import { Login, Layout } from './layout';
import { Dashboard } from './dashboard';
import englishMessages from './i18n/en';
import { lightTheme } from './layout/themes';

import visitors from './visitors';
import categories from './categories';
import invoices from './invoices';
import orders from './orders';
import products from './products';
import plans from './plans';
import reviews from './reviews';
import stores from './stores';
import dataProviderFactory from './dataProvider';
import Configuration from './configuration/Configuration';
import Segments from './segments/Segments';

const i18nProvider = polyglotI18nProvider(locale => {
    if (locale === 'fr') {
        return import('./i18n/fr').then(messages => messages.default);
    }

    // Always fallback on english
    return englishMessages;
}, 'en');

const App = () => {
    return (
        <Admin
            title="Premier Admin"
            dataProvider={dataProviderFactory(
                process.env.REACT_APP_DATA_PROVIDER || ''
            )}
            authProvider={authProvider}
            dashboard={Dashboard}
            loginPage={Login}
            layout={Layout}
            i18nProvider={i18nProvider}
            disableTelemetry
            theme={lightTheme}
        >
            <CustomRoutes>
                <Route path="/configuration" element={<Configuration />} />
                <Route path="/segments" element={<Segments />} />
            </CustomRoutes>
            <Resource name="customers" {...visitors} />
            <Resource
                name="commands"
                {...orders}
                options={{ label: 'Orders' }}
            />
            <Resource name="categories" {...categories} />
            <Resource name="invoices" {...invoices} />
            <Resource name="plans" {...plans} />
            <Resource name="products" {...products} />
            <Resource name="reviews" {...reviews} />
            <Resource name="stores" {...stores} />
        </Admin>
    );
};

export default App;
