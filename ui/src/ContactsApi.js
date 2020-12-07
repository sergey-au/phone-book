import axios from 'axios';

export default class ContactsApi {

    static getApiUrl = (protocol, path) => {
        const host = process.env.REACT_APP_SITES_API_HOST || window.location.hostname;
        const port = process.env.REACT_APP_SITES_API_PORT || window.location.port;
        return `${protocol}//${host}:${port}/${path}`;
    };

    static listBooks = async () => {
        const url = ContactsApi.getApiUrl(window.location.protocol, 'book');
        const {data} = await axios.get(url);
        return data;
    }

    static addBook = async (book) => {
        const url = ContactsApi.getApiUrl(window.location.protocol, 'book');
        const {data} = await axios.put(url, book);
        return data;
    }

    static deleteBook = async (id) => {
        const url = ContactsApi.getApiUrl(window.location.protocol, 'book/' + id);
        const {data} = await axios.delete(url);
        return data;
    }

    static addContact = async (bookId, contact) => {
        const url = ContactsApi.getApiUrl(window.location.protocol, 'book/' + bookId + "/contact");
        const {data} = await axios.put(url, contact);
        return data;
    }

    static deleteContact = async (bookId, contactId) => {
        const url = ContactsApi.getApiUrl(window.location.protocol, 'book/' + bookId + "/contact/" + contactId);
        const {data} = await axios.delete(url);
        return data;
    }

}
