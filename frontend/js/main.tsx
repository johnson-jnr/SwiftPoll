import 'vite/modulepreload-polyfill';
import axios from 'axios';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp, router } from '@inertiajs/react';
import Layout from './layouts/Layout';
import DashboardLayout from './layouts/DashboardLayout';

import '../css/main.css';
import '../css/style.sass';

const pages = import.meta.glob<{ default: any }>('./pages/**/*.tsx');

document.addEventListener('DOMContentLoaded', () => {
    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';

    createInertiaApp({
        resolve: async (name) => {
            const page = (await pages[`./pages/${name}.tsx`]()).default;
            page.layout = name.toLowerCase().startsWith('dashboard')
                ? DashboardLayout
                : Layout;
            return page;
        },
        setup({ el, App, props }) {
            createRoot(el).render(<App {...props} />);
        },
        title: (title) => `${title} - SwiftPoll`,
    });
});
