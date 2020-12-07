import React from 'react';
import App from './App';
import {mount} from "enzyme";
import {Header} from "semantic-ui-react";
import BookList from "../BookList";
import ContactsApi from "../../ContactsApi";
import ContactsApiMock from "../../ContactsApiMock";
import {act} from "@testing-library/react";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import {cloneDeep} from "lodash-es";

describe('App', () => {
    let wrapper;

    it('renders child components', async () => {
        ContactsApi.listBooks = ContactsApiMock.listBooks;
        await act(async () => {
            wrapper = mount(<App/>);
        })
        expect(wrapper.find('.App')).toExist();
        expect(wrapper.find(Header).at(0)).toHaveProp('as', 'h1');
        expect(wrapper.find(Header).at(0).childAt(0)).toHaveText('Contact Books');
        expect(wrapper.find(BookList)).toExist();
        expect(wrapper.find(BookList)).toHaveProp('books');
    });

    it('calls listBooks - success', async () => {
        ContactsApi.listBooks = ContactsApiMock.listBooks;
        await act(async () => {
            wrapper = mount(<App/>);
        })
        wrapper.update();
        let booksProp = null;
        await act(async () => {
            booksProp = wrapper.find(BookList).prop('books');
        });
        expect(booksProp).toEqual(ContactsApiMock.getBooks());
    });

    it('calls listBooks - fail', async () => {
        const errorMessage = 'Request failed'
        ContactsApi.listBooks = jest.fn().mockRejectedValue({message: errorMessage});
        await act(async () => {
            wrapper = mount(<App/>);
        })
        wrapper.update();
        expect(wrapper.find(BookList)).not.toExist();
        expect(wrapper.find(ErrorMessage)).toExist();
        expect(wrapper.find(ErrorMessage)).toHaveProp('error');
        expect(wrapper.find(ErrorMessage).props().error.op).toEqual('List books');
        expect(wrapper.find(ErrorMessage).props().error.message).toEqual(errorMessage);

        ContactsApi.listBooks.mockClear();
    });

    it('calls addBook', async () => {
        ContactsApi.listBooks = () => Promise.resolve(cloneDeep(ContactsApiMock.getBooks()));
        ContactsApi.addBook = (book) => ContactsApiMock.addBook(book);
        await act(async () => {
            wrapper = mount(<App/>);
        })
        wrapper.update();
        const newBook = {name: 'The book of the dead'}
        let addBook = null;
        await act(async () => {
            addBook = wrapper.find(BookList).prop('addBook');
            addBook(newBook);
        })

        wrapper.update();

        let booksProp = null;
        await act(async () => {
            booksProp = wrapper.find(BookList).prop('books');
        })
        expect(booksProp).toEqual(ContactsApiMock.getBooks());
    });

    it('calls deleteBook', async () => {
        ContactsApi.listBooks = () => Promise.resolve(cloneDeep(ContactsApiMock.getBooks()));
        ContactsApi.deleteBook = (book) => ContactsApiMock.deleteBook(book);
        await act(async () => {
            wrapper = mount(<App/>);
        })
        wrapper.update();
        let deleteBook = null;
        await act(async () => {
            deleteBook = wrapper.find(BookList).prop('deleteBook');
            deleteBook(1);
        })

        wrapper.update();

        let booksProp = null;
        await act(async () => {
            booksProp = wrapper.find(BookList).prop('books');
        })
        expect(booksProp).toEqual(ContactsApiMock.getBooks());
    });

    it('calls addContact', async () => {
        ContactsApiMock.reset();
        ContactsApi.listBooks = () => Promise.resolve(cloneDeep(ContactsApiMock.getBooks()));
        ContactsApi.addContact = (contact) => ContactsApiMock.addContact(contact);
        await act(async () => {
            wrapper = mount(<App/>);
        })
        wrapper.update();
        const newContact = {name: 'Felix', phone: '0400 444 111'};
        let addContact = null;
        await act(async () => {
            addContact = wrapper.find(BookList).prop('addContact');
            addContact(1, newContact);
        })

        wrapper.update();

        let booksProp = null;
        await act(async () => {
            booksProp = wrapper.find(BookList).prop('books');
        })
        expect(booksProp).toEqual(ContactsApiMock.getBooks());
    });

    it('calls deleteContact', async () => {
        ContactsApiMock.reset();
        ContactsApi.listBooks = () => Promise.resolve(cloneDeep(ContactsApiMock.getBooks()));
        ContactsApi.deleteContact = (bookId, contactId) => ContactsApiMock.deleteContact(bookId, contactId);
        await act(async () => {
            wrapper = mount(<App/>);
        })
        wrapper.update();
        let deleteContact = null;
        await act(async () => {
            deleteContact = wrapper.find(BookList).prop('deleteContact');
            deleteContact(1, 1);
        })

        wrapper.update();
        let booksProp = null;
        await act(async () => {
            booksProp = wrapper.find(BookList).prop('books');
        })
        expect(booksProp).toEqual(ContactsApiMock.getBooks());
    });


});
