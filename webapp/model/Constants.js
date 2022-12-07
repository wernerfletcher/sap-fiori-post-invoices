sap.ui.define([],
    function() {
        'use strict';
    
        const constants = {
            API_BASE_URL: 'https://server/b1s/v2',
            API_LOGIN: '/Login',
            API_LOGOUT: '/Logout',
            API_INVOICES: '/Invoices',
            LOGIN_REQ_BODY: {
                'CompanyDB': '',
                'UserName': '',
                'Password': ''
            }
        };
    
        return constants;
    });