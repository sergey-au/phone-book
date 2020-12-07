import defaultBooks from './Books.mock';
import {cloneDeep} from "lodash-es";

export default class ContactsApiMock {
    static books = cloneDeep(defaultBooks);
    static contactId = ContactsApiMock.books.map((b) => b.contacts.length).reduce((total, next) => total + next);
    static bookId = ContactsApiMock.books.length + 1;


    static getBooks() {
        return ContactsApiMock.books;
    }

    static reset() {
        ContactsApiMock.books = cloneDeep(defaultBooks);
        ContactsApiMock.contactId = ContactsApiMock.books.map((b) => b.contacts.length).reduce((total, next) => total + next);
        ContactsApiMock.bookId = ContactsApiMock.books.length + 1;
    }

    static getApiUrl = (protocol, path) => {
        const host = process.env.REACT_APP_CONTACTS_API_HOST || window.location.hostname;
        const port = process.env.REACT_APP_CONTACTS_API_PORT || window.location.port;
        return `${protocol}//${host}:${port}/${path}`;
    };

    static listBooks = async () => {
        return Promise.resolve(cloneDeep(ContactsApiMock.books));
    }

    static listContacts = async (bookId) => {
        const book = ContactsApiMock.books.find((b) => b.id === bookId);
        if (book) {
            return Promise.resolve(book.contacts);
        }
        return Promise.reject("Cannot find book with id: " + bookId);
    }

    static addBook = async (book) => {
        const newBook = {id: ContactsApiMock.bookId++, name: book.name, contacts: []};
        ContactsApiMock.books.push(newBook);
        return Promise.resolve(newBook);
    }

    static deleteBook = async (id) => {
        const index = ContactsApiMock.books.findIndex((e) => e.id === id);
        if (index !== -1) {
            ContactsApiMock.books.splice(index, 1);
        }
        return Promise.resolve();
    }

    static addContact = async (bookId, contact) => {
        const index = ContactsApiMock.books.findIndex((b) => b.id === bookId);
        if (index !== -1) {
            const newContact = {...contact, id: ContactsApiMock.contactId++};
            ContactsApiMock.books[index].contacts.push(newContact);
            return Promise.resolve(newContact);
        }
        return Promise.reject({message: 'Invalid book id: ' + bookId});

    }

    static deleteContact = async (bookId, contactId) => {
        const index = ContactsApiMock.books.findIndex((e) => e.id === bookId);
        if (index !== -1) {
            const contactIndex = ContactsApiMock.books[index].contacts.findIndex((e) => e.id === contactId);
            ContactsApiMock.books[index].contacts.splice(contactIndex, 1);
            return Promise.resolve();
        }
        return Promise.reject({message: 'Invalid book id: ' + bookId});
    }
}
