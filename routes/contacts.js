exports.setRequestUrl = function(app){
    contacts = require('../model/contacts');

    app.get('/contact/addContact', contacts.addContact);
    app.get('/contact/showContact', contacts.showContact);
    app.get('/contact/removeContact', contacts.removeContact);
    app.get('/contact/updateContact', contacts.updateContact);
}