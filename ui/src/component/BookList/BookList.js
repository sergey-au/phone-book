import React, {useCallback, useState} from 'react';
import './BookList.scss'
import PropTypes from "prop-types";
import {Button, Header, Icon, Input, Popup, Segment, Table} from "semantic-ui-react";
import ContactList from "../ContactList";
import {sortBy} from "lodash-es";

const BookList = ({books, addBook, deleteBook, addContact, deleteContact}) => {
    const [activeIds, setActiveIds] = useState([]);
    const [newName, setNewName] = useState('');
    const [direction, setDirection] = useState('ascending');

    const toggleBook = useCallback((e, id) => {
        const pos = activeIds.indexOf(id);
        if (pos !== -1) {
            activeIds.splice(pos, 1);
        } else {
            if (activeIds.length < 2) {
                activeIds.push(id);
            } else {
                activeIds[1] = id;
            }
        }
        setActiveIds([...activeIds]);
    }, [activeIds]);

    const clickAddBook = useCallback((e) => {
        if (newName) {
            e.preventDefault();
            const book = {name: newName};
            addBook(book);
            setNewName('');
        } else {
        }
    }, [newName, addBook]);

    const clickDeleteBook = useCallback((e, id) => {
        e.preventDefault();
        e.stopPropagation();
        const pos = books.findIndex((b) => b.id === id);
        if (pos >= 0) {
            const newActiveIds = [...activeIds];
            newActiveIds.splice(pos, 1);
            setActiveIds(newActiveIds);
            deleteBook(id);
        }
    }, [books, activeIds, deleteBook]);

    const nameChanged = useCallback((e, props) => {
        setNewName(props.value);
    }, []);

    const keyUp = useCallback((e) => {
        if (newName && e.keyCode === 13) {
            clickAddBook(e);
        }
    }, [newName, clickAddBook]);

    const sort = useCallback(() => {
        setDirection(direction === 'ascending' ? 'descending' : 'ascending')
    }, [direction]);

    const disableAddButton = !newName;
    let selectedBooks = [];
    if (activeIds.length === 1) {
        const book = books.find((b) => b.id === activeIds[0]);
        selectedBooks = [book];
    } else if (activeIds.length === 2) {
        const book1 = books.find((b) => b.id === activeIds[0]);
        const book2 = books.find((b) => b.id === activeIds[1]);
        selectedBooks = [book1, book2];
    }
    books = sortBy(books, b=>b.name);
    if(direction === "descending") books = books.reverse();

    return (
        <Segment className="books-segment">
            <Header as='h3'>
                Books
            </Header>
            <div className='books-control'>
                <Input label='Name' placeholder="New book's name" value={newName} onChange={nameChanged} onKeyUp={keyUp}/>
                <Popup content='Please enter a new name' disabled={!disableAddButton}
                       trigger={
                           <span className='button-span'>
                                            <Button disabled={disableAddButton} secondary onClick={clickAddBook}>Add Book</Button>
                                           </span>
                       }/>
            </div>

            <div className="scroll-container">
                <Table className="books-table" basic='very' celled collapsing selectable sortable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell sorted={direction} onClick={sort} width="13">
                                Name
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                Delete
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {books.map((b) => (
                            <Table.Row active={activeIds.includes(b.id)} onClick={(e) => toggleBook(e, b.id)} key={b.id}>
                                <Table.Cell>
                                    <div>{b.name}</div>
                                </Table.Cell>
                                <Table.Cell>
                                    <Popup content={"Delete book: " + b.name + '?'}
                                           trigger={
                                               <Button onClick={(e) => clickDeleteBook(e, b.id)} icon>
                                                   <Icon name='delete'/>
                                               </Button>
                                           }/>
                                </Table.Cell>
                            </Table.Row>
                        ))}

                    </Table.Body>
                </Table>
            </div>
            <ContactList books={selectedBooks} addContact={addContact} deleteContact={deleteContact}/>
        </Segment>
    )
};

BookList.propTypes = {
    books: PropTypes.arrayOf(
        PropTypes.shape({
                id: PropTypes.number.isRequired,
                name: PropTypes.string.isRequired,
                entries: PropTypes.arrayOf(
                    PropTypes.shape({
                        id: PropTypes.number.isRequired,
                        name: PropTypes.string.isRequired,
                        phone: PropTypes.string.isRequired
                    })
                )
            }
        )
    ),
    addBook: PropTypes.func.isRequired,
    deleteBook: PropTypes.func.isRequired,
    addContact: PropTypes.func.isRequired,
    deleteContact: PropTypes.func.isRequired
}

export default BookList;
