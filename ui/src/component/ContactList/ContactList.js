import React, {useCallback, useState} from 'react';
import './ContactList.scss';
import PropTypes from "prop-types";
import {Button, Header, Icon, Input, Popup, Segment, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow} from "semantic-ui-react";
import Arrays from "../../Arrays";
import {sortBy} from "lodash-es";

const ContactList = ({books, addContact, deleteContact}) => {
    const [newName, setNewName] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [direction, setDirection] = useState('ascending');
    const [column, setColumn] = useState('name');

    const changeNewName = useCallback((e, props) => {
        setNewName(props.value);
    }, [])

    const changeNewPhone = useCallback((e, props) => {
        setNewPhone(props.value);
    }, [])

    const clickAddContact = useCallback((e) => {
        if (newName && newPhone) {
            e.preventDefault();
            const contact = {name: newName, phone: newPhone};
            addContact(books[0].id, contact);
            setNewName('');
            setNewPhone('');
        }
    }, [newName, newPhone, books, addContact]);

    const clickDeleteContact = useCallback((e, bookId, id) => {
        e.preventDefault();
        e.stopPropagation();
        deleteContact(bookId, id);
    }, [deleteContact]);

    const sort = useCallback((name) => {
        if(column === name) {
            setDirection(direction === 'ascending' ? 'descending' : 'ascending')
        } else {
            setDirection('ascending');
        }
        setColumn(name)
    }, [direction, column]);

    let contacts = [];
    let contactsInfo = '';
    if (books && books.length === 1 && books[0]) {
        contactsInfo = ' - ' + books[0].name;
        contacts = [...books[0].contacts];
        for(let i = 0; i < contacts.length; i++) {
            contacts[i] = {...contacts[i], bookId: books[0].id}
        }
    } else if (books && books.length === 2) {
        contactsInfo = ' - complement of ' + books[0].name + ' and ' + books[1].name;
        const contacts1 = [...books[0].contacts];
        for(let i = 0; i < contacts1.length; i++) {
            contacts1[i] = {...contacts1[i], bookId: books[0].id}
        }
        const contacts2 = [...books[1].contacts];
        for(let i = 0; i < contacts2.length; i++) {
            contacts2[i] = {...contacts2[i], bookId: books[1].id}
        }

        contacts = Arrays.complement(contacts1, contacts2, (b1, b2) => b1.name === b2.name);
        contacts = sortBy(contacts, [column]);
        if(direction === "descending") contacts = contacts.reverse();
    }

    const disableInput = books && books.length !== 1;
    return books && books.length ? (
        <Segment className="contacts-segment">
            <Header as='h3'>
                Contacts{contactsInfo}
            </Header>
            <div className="contacts-control" hidden={disableInput}>
                <Input disabled={disableInput} label='Name' placeholder='New name' value={newName}
                       onChange={changeNewName}/>
                <Input disabled={disableInput} label='Phone' placeholder='New phone' value={newPhone}
                       onChange={changeNewPhone}/>
                <Popup content='Please enter a new name and phone number'
                       trigger={
                           <span className="button-span">
                                           <Button disabled={disableInput || !newName || !newPhone} secondary
                                                   onClick={clickAddContact}>Add Contact</Button>
                                           </span>
                       }/>
            </div>
            <div className="scroll-container">
                <Table className="scroll-table" basic='very' celled collapsing sortable>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell
                                sorted={column === 'name' ? direction : null}
                                onClick={()=> sort('name')} width="6">
                                Name
                            </TableHeaderCell>

                            <TableHeaderCell
                                sorted={column === 'phone' ? direction : null}
                                onClick={()=> sort('phone')}
                                width="8"
                            >

                                Phone
                            </TableHeaderCell>
                            <TableHeaderCell> Delete </TableHeaderCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {contacts.map((c) => (
                            <Table.Row key={c.id}>
                                <TableCell>{c.name}</TableCell>
                                <TableCell>{c.phone}</TableCell>
                                <Table.Cell>
                                    <Popup content={"Delete contact: " + c.name + ', ' + c.phone + '?'}
                                           trigger={
                                               <Button onClick={(e) => clickDeleteContact(e, c.bookId, c.id)} icon>
                                                   <Icon name='delete'/>
                                               </Button>
                                           }/>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Segment>
    ) : null;
}

ContactList.propTypes = {
    books: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        })
    ),
    addContact: PropTypes.func.isRequired,
    deleteContact: PropTypes.func.isRequired
}

export default ContactList;
