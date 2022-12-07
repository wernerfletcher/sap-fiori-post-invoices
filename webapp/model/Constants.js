sap.ui.define([],
    function() {
        'use strict';
    
        const constants = {
            API_BASE_URL: 'https://apihana.sw-bs.eu:50000/b1s/v2',
            API_LOGIN: '/Login',
            API_LOGOUT: '/Logout',
            API_INVOICES: '/Invoices',
            REQ_HEADERS: {
                'Content-Type': 'application/json'
            }
        };
    
        return constants;
    });