import React, {useCallback, useState} from 'react';
import './App.css';
import BookList from "../BookList";
import {Header} from "semantic-ui-react";
import ContactsApi from "../../ContactsApi";
import ErrorMessage from "../ErrorMessage/ErrorMessage";


function App() {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);

    React.useEffect(() => {
        ContactsApi.listBooks()
            .then(res => {
                setBooks(res)
            })
            .catch(error => {
                setError({op: 'List books', message: error.message});
            })
        return () => setError(null);
    }, []);

    const addBook = useCallback((book) => {
        ContactsApi.addBook(book)
            .then(res => {
                const newBook = {...res, contacts: []}
                const newBooks = [...books, newBook];
                setBooks(newBooks);
            })
            .catch(error => {
                setError({op: 'Add book', message: error.message})
            })
    }, [books]);

    const deleteBook = useCallback((id) => {
        ContactsApi.deleteBook(id)
            .then(() => {
                const newBooks = [...books];
                const index = newBooks.findIndex((b) => b.id);
                newBooks.splice(index, 1);
                setBooks(newBooks);
            })
            .catch(error => {
                setError({op: 'Delete book', message: error.message});
            })
    }, [books]);

    const addContact = useCallback((bookId, contact) => {
        ContactsApi.addContact(bookId, contact)
            .then(res => {
                const newBooks = [...books];
                const bookIndex = newBooks.findIndex((b) => b.id === bookId);
                const book = books[bookIndex];
                book.contacts = [...book.contacts, res];
                setBooks(newBooks);
            })
            .catch(error => {
                setError({op: 'Add contact', message: error.message})
            })
    }, [books]);

    const deleteContact = useCallback((bookId, contactId) => {
        ContactsApi.deleteContact(bookId, contactId)
            .then(() => {
                const newBooks = [...books];
                const bookIndex = newBooks.findIndex((b) => b.id === bookId);
                const book = newBooks[bookIndex];
                const contacts = [...book.contacts];
                const contactIndex = book.contacts.findIndex((c) => c.id === contactId);
                book.contacts = contacts;
                contacts.splice(contactIndex, 1);
                setBooks(newBooks);
            })
            .catch(error => {
                setError({op: 'Delete contact', message: error.message});
            })

    }, [books]);
    return (
        <div className="App">
            <Header as='h1'>Contact Books</Header>
            {error ?
                <ErrorMessage error={error}/>
                :
                <BookList books={books} addBook={addBook} deleteBook={deleteBook}
                          addContact={addContact} deleteContact={deleteContact}/>
            }
        </div>
    );
}

export default App;
