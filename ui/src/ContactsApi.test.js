import React from 'react';
import axios from "axios";
import ContactsApi from './ContactsApi';
import {cloneDeep} from 'lodash-es';
import defaultBooks from './Books.mock';

jest.mock('axios');

describe('ContactsApi', () => {
    let books;
    let location;

    beforeEach(() => {
        books = cloneDeep(defaultBooks);
        axios.get.mockImplementation((url) => {
                if (url.endsWith('book')) {
                    return Promise.resolve({status: 200, data: books});
                } else if (url.endsWith('contact')) {
                    const u = new URL(url);
                    const parts = u.pathname.split('/');
                    const bookId = Number.parseInt(parts[2]);
                    return Promise.resolve({status: 200, data: books.find((b) => b.id === bookId).contacts});
                }
                return Promise.reject({status: 401, message: 'not found'});
            }
        );
        axios.put.mockImplementation((url, body) => {
            if (url.endsWith('book')) {
                const book = {id: 4, name: body.name};
                books = {...books, book};
                return Promise.resolve({status: 200, data: book});
            }
            if (url.endsWith('contact')) {
                const book1 = books [0];
                const newContact = {id: 13, name: body.name, phone: body.phone}
                book1.contacts = [newContact, ...book1.contacts];
                return Promise.resolve({status: 200, data: newContact});
            }
            return Promise.reject({status: 401, message: 'not found'});
        });
        axios.delete.mockImplementation((url) => {
            if (url.endsWith('book/1')) {
                books = books.slice(1);
                return Promise.resolve({status: 200});
            }
            if (url.endsWith('book/1/contact/1')) {
                books[0].contacts = books[0].contacts.slice(1);
                return Promise.resolve({status: 200});
            }
            return Promise.reject({status: 401, message: 'not found'});
        });
        location = global.window.location;
        delete global.window.location;
        global.window.location = {
            hostname: "localhost",
            port: "8080",
            protocol: "http:"
        }
    })

    afterEach(() => {
        global.window.location = location;
    });

    it('should list books', async () => {
        const dataReturned = await ContactsApi.listBooks();
        expect(axios.get).toHaveBeenCalledWith(ContactsApi.getApiUrl('http:', 'book'));
        expect(dataReturned).toEqual(books);
    });

    it('should create book', async () => {
        const book = {name: 'Book 4'};
        const dataReturned = await ContactsApi.addBook(book);
        expect(axios.put).toHaveBeenCalledWith(ContactsApi.getApiUrl('http:', 'book'), book);
        expect(dataReturned).toEqual({id: 4, name: book.name});
    });

    it('should delete book', async () => {
        const dataReturned = await ContactsApi.deleteBook(1);
        expect(axios.delete).toHaveBeenCalledWith(ContactsApi.getApiUrl('http:', 'book/1'));
        expect(dataReturned).toEqual(undefined);
        expect(books.length).toBe(1);
    });

    it('should create contact', async () => {
        const contact = {name: 'Felix', phone: '0000 000 000'};
        const dataReturned = await ContactsApi.addContact(1, contact);
        expect(axios.put).toHaveBeenCalledWith(ContactsApi.getApiUrl('http:', 'book/1/contact'), contact);
        expect(dataReturned).toEqual({...contact, id: 13});
        expect(books[0].contacts.length).toBe(3);
    });

    it('should delete contact', async () => {
        await ContactsApi.deleteContact(1, 1);
        expect(axios.delete).toHaveBeenCalledWith(ContactsApi.getApiUrl('http:', 'book/1/contact/1'));
        expect(books[0].contacts.length).toBe(1);
    });
})

