import React from 'react';
import BookList from './BookList';
import {mount, shallow} from 'enzyme';
import {Button, Header, Icon, Input, Popup, Segment, Table} from 'semantic-ui-react';
import {act} from '@testing-library/react';
import ContactsApiMock from "../../ContactsApiMock";

describe('BookList', () => {
    const preventDefault = jest.fn();
    const props = {
        books: ContactsApiMock.getBooks(),
        addBook: (book) => ContactsApiMock.addBook(book),
        deleteBook: (id) => ContactsApiMock.deleteBook(id),
        addContact: (contact) => ContactsApiMock.addContact(contact),
        deleteContact: (bookId, contactId) => ContactsApiMock.deleteContact(bookId, contactId)
    }

    beforeEach(()=>{
        props.books = ContactsApiMock.getBooks();
    });

    afterEach(()=>{
        ContactsApiMock.reset();
    })

    it('should render components', () => {
        const wrapper = shallow(<BookList {...props}/>);
        expect(wrapper.find(Segment)).toExist();
        expect(wrapper.find(Header)).toExist();
        expect(wrapper.find(Header)).toHaveProp('as', 'h3');
        expect(wrapper.find(Header).childAt(0)).toHaveText('Books');
        expect(wrapper.find(Table)).toExist();
    });

    it('should render books table', () => {
        const wrapper = shallow(<BookList {...props}/>);
        const table = wrapper.find(Table);
        expect(table.find(Table.Header)).toExist();
        const headers = table.find(Table.HeaderCell);
        expect(headers).toHaveLength(2);

        expect(wrapper.find('.books-control').find(Input)).toHaveProp('label', 'Name');
        expect(wrapper.find('.books-control').find(Input)).toHaveProp('placeholder', "New book's name");
        expect(wrapper.find('.books-control').find(Popup)).toHaveProp('content', 'Please enter a new name');
        expect(wrapper.find('.books-control').find(Popup)).toHaveProp('trigger');
        const trigger = wrapper.find('.books-control').find(Popup).prop('trigger');
        const triggerComp = shallow(trigger);
        expect(triggerComp.find('span')).toExist();
        expect(triggerComp.find(Button).childAt(0)).toHaveText('Add Book');
        expect(table.find(Table.Body)).toExist();
        const tableBody = table.find(Table.Body);
        expect(tableBody.find(Table.Row)).toHaveLength(2);
        const row1 = tableBody.find(Table.Row).at(0);
        expect(row1.find(Table.Cell)).toHaveLength(2);
        expect(row1.find(Table.Cell).at(0).find('div').childAt(0)).toHaveText(props.books[0].name);
        expect(row1.find(Table.Cell).at(1).find(Popup)).toExist();
        const delTrigger = row1.find(Table.Cell).at(1).find(Popup).prop('trigger');
        const delWrapper = shallow(delTrigger);
        expect(delWrapper.find('button')).toExist();
        expect(delWrapper.find(Icon)).toHaveProp('name', 'delete');
        const row2 = tableBody.find(Table.Row).at(1);
        expect(row2.find(Table.Cell)).toHaveLength(2);
        expect(row2.find(Table.Cell).at(0).find('div').childAt(0)).toHaveText(props.books[1].name);
        expect(row2.find(Table.Cell).at(1).find(Popup)).toExist();
        const delTrigger2 = row1.find(Table.Cell).at(1).find(Popup).prop('trigger');
        const delWrapper2 = shallow(delTrigger2);
        expect(delWrapper2.find('button')).toExist();
        expect(delWrapper2.find(Icon)).toHaveProp('name', 'delete');
    });

    it('should not call addBook when enter pressed and newName is empty', async () => {
        const wrapper = shallow(<BookList {...props}/>);
        await act(async () => {
            wrapper.find(Input).props().onKeyUp({preventDefault: preventDefault, keyCode: 13});
            wrapper.update();
        });
        expect(preventDefault).not.toHaveBeenCalled();
        expect(ContactsApiMock.getBooks().length).toBe(2);
    });

    it('should active/deactivate row when it is clicked on', () => {
        const wrapper = shallow(<BookList {...props}/>);
        expect(wrapper.find(Table.Body).find(Table.Row).at(0)).toHaveProp('active', false);
        expect(wrapper.find(Table.Body).find(Table.Row).at(1)).toHaveProp('active', false);
        act(() => {
            wrapper.find(Table.Body).find(Table.Row).at(0).props().onClick({});
        })
        expect(wrapper.find(Table.Body).find(Table.Row).at(0)).toHaveProp('active', true);
        expect(wrapper.find(Table.Body).find(Table.Row).at(1)).toHaveProp('active', false);
        act(() => {
            wrapper.find(Table.Body).find(Table.Row).at(1).props().onClick({});
        })
        expect(wrapper.find(Table.Body).find(Table.Row).at(0)).toHaveProp('active', true);
        expect(wrapper.find(Table.Body).find(Table.Row).at(1)).toHaveProp('active', true);
        act(() => {
            wrapper.find(Table.Body).find(Table.Row).at(1).props().onClick({});
        })
        expect(wrapper.find(Table.Body).find(Table.Row).at(0)).toHaveProp('active', true);
        expect(wrapper.find(Table.Body).find(Table.Row).at(1)).toHaveProp('active', false);
    });

    it('calls addBook when Enter pressed and newName is not empty - success', async () => {
        const newBook = {name: 'New Book ENTER'};
        props.books = ContactsApiMock.getBooks();
        const wrapper = shallow(<BookList {...props}/>);

        await act(async () => {
            wrapper.find('.books-control').find(Input).props().onChange({}, {value: newBook.name});
        });
        wrapper.update();
        await act(async () => {
            wrapper.find('.books-control').find(Input).props().onKeyUp({preventDefault: preventDefault, keyCode: 13});
        });
        wrapper.update();
        expect(preventDefault).toHaveBeenCalled();
        expect(ContactsApiMock.getBooks().length).toBe(3);
        wrapper.setProps({...ContactsApiMock.getBooks()});
        wrapper.update();
        expect(wrapper.find('.books-table').find(Table.Body).find(Table.Row)).toHaveLength(3);
        expect(wrapper.find('.books-table').find(Table.Body).find(Table.Row).at(2).find(Table.Cell).at(0).childAt(0))
            .toHaveText(newBook.name);
    });


    it('calls addBook when Add Book button is clicked', async () => {
        const newBook = {name: 'New Book CLICK'};
        const mountWrapper = mount(<BookList {...props}/>);

        await act(async () => {
            mountWrapper.find('.books-control').find(Input).props().onChange({}, {value: newBook.name});
        });
        mountWrapper.update();
        await act(async () => {
            mountWrapper.find('.books-control').find(Button).props().onClick({preventDefault: preventDefault});
        });
        mountWrapper.update();
        expect(preventDefault).toHaveBeenCalled();
        expect(mountWrapper.find('.books-table').find(Table.Body).find(Table.Row)).toHaveLength(ContactsApiMock.getBooks().length);
        expect(mountWrapper.find('.books-table').find(Table.Body).find(Table.Row).at(2).find(Table.Cell).at(0).childAt(0)).toHaveText(newBook.name);
    });

    it('should call deleteBook when delete button is clicked', async () => {
        const stopPropagation = jest.fn();
        const mountWrapper = mount(<BookList {...props}/>);

        await act(async () => {
            mountWrapper.find(Table.Body).find(Button).at(0).props().onClick(
                {preventDefault: preventDefault, stopPropagation: stopPropagation}, 1
            );
            mountWrapper.setProps({...props});
            mountWrapper.update();
        });
        expect(preventDefault).toHaveBeenCalled();
        expect(stopPropagation).toHaveBeenCalled();
        expect(mountWrapper.find(Table.Body).find(Table.Row)).toHaveLength(1);

        stopPropagation.mockReset();
    });
});
