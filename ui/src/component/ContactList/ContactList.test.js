import React from 'react';
import ContactList from './ContactList';
import {mount, shallow} from 'enzyme';
import {Button, Header, Icon, Input, Popup, Segment, Table} from "semantic-ui-react";
import {act} from "@testing-library/react";
import ContactsApiMock from "../../ContactsApiMock";

describe('ContactLit', () => {
    const preventDefault = jest.fn();
    const props = {
        addContact: (bookId, contact) => ContactsApiMock.addContact(bookId, contact),
        deleteContact: (bookId, contactId) => ContactsApiMock.deleteContact(bookId, contactId)
    }

    beforeEach(() => {
        props.books = [ContactsApiMock.getBooks()[0]];
    });

    afterEach(() => {
        ContactsApiMock.reset();
    })


    it('should render nothing if prop is null', () => {
        let wrapper = shallow(<ContactList addContact={props.addContact} deleteContact={props.deleteContact}/>);
        expect(wrapper.find(Segment)).not.toExist();
    });

    it('should render components', async () => {
        let mountWrapper = null;
        await act(async () => {
            mountWrapper = mount(<ContactList {...props}/>);
        });
        mountWrapper.update();
        expect(mountWrapper.find(Segment)).toExist();
        expect(mountWrapper.find(Segment)).toHaveClassName('contacts-segment');
        expect(mountWrapper.find(Header)).toHaveProp('as', 'h3');
        expect(mountWrapper.find(Header).childAt(0)).toHaveText('Contacts - ' + props.books[0].name);
        expect(mountWrapper.find(Table)).toHaveClassName('scroll-table');
        expect(mountWrapper.find(Table)).toHaveProp('basic', 'very');
        expect(mountWrapper.find(Table)).toHaveProp('celled');
        expect(mountWrapper.find(Table)).toHaveProp('collapsing');
        expect(mountWrapper.find(Table)).toHaveProp('sortable');
        expect(mountWrapper.find(Table.HeaderCell)).toHaveLength(3);
        expect(mountWrapper.find('.contacts-control').find(Input).at(0)).toHaveProp('label', 'Name');
        expect(mountWrapper.find('.contacts-control').find(Input).at(1)).toHaveProp('label', 'Phone');
        expect(mountWrapper.find('.contacts-control').find(Popup)).toHaveProp('content',
            'Please enter a new name and phone number');
        await act(async () => {
            mountWrapper.update();
        })
        await expect(mountWrapper.find(Table.Body).find(Table.Row)).toHaveLength(props.books[0].contacts.length);

        function expectContactMatchRow(i) {
            const cells = mountWrapper.find(Table.Body).find(Table.Row).at(i).find(Table.Cell);
            expect(cells).toHaveLength(3);
            expect(cells.at(0).childAt(0)).toHaveText(props.books[0].contacts[i].name);
            expect(cells.at(1).childAt(0)).toHaveText(props.books[0].contacts[i].phone);
            expect(cells.at(2).find(Popup)).toHaveProp('content', 'Delete contact: '
                + props.books[0].contacts[i].name + ', '
                + props.books[0].contacts[i].phone + '?');
            const trigger = cells.at(2).find(Popup).prop('trigger');
            const triggerMountWrapper = shallow(trigger);
            expect(triggerMountWrapper.find('button')).toExist();
            expect(triggerMountWrapper.find(Icon)).toHaveProp('name', 'delete');
        }

        for (let i = 0; i < props.books[0].contacts.length; i++) {
            expectContactMatchRow(i);
        }
    });

    it('should call addContact when Add Contact button is pressed', async () => {
        let mountWrapper = null;
        await act(async () => {
            mountWrapper = mount(<ContactList {...props} />);
        });
        mountWrapper.update();

        await act(async () => {
            mountWrapper.find(Input).at(0).props().onChange({}, {value: 'Sam'});
            mountWrapper.find(Input).at(1).props().onChange({}, {value: '1111 222 333'});
        });
        mountWrapper.update();

        await act(async () => {
            mountWrapper.find('.contacts-control').find(Popup).find(Button).props().onClick({preventDefault: preventDefault});
        });
        mountWrapper.update();

        expect(preventDefault).toHaveBeenCalled();
        expect(mountWrapper.find(Table.Body).find(Table.Row)).toHaveLength(3);
        expect(mountWrapper.find(Table.Body).find(Table.Row).at(2).find(Table.Cell).at(0).childAt(0))
            .toHaveText('Sam');
        expect(mountWrapper.find(Table.Body).find(Table.Row).at(2).find(Table.Cell).at(1).childAt(0))
            .toHaveText('1111 222 333');
    });

    it('should call deleteContact when delete button is clicked', async () => {
        const stopPropagation = jest.fn();
        let mountWrapper = null;
        await act(async () => {
            mountWrapper = mount(<ContactList {...props}/>);
        });
        mountWrapper.update();
        await act(async () => {
            mountWrapper.find(Table.Body).find(Button).at(0).props().onClick(
                {preventDefault: preventDefault, stopPropagation: stopPropagation}, 1
            );
        });
        mountWrapper.update();
        expect(preventDefault).toHaveBeenCalled();
        expect(stopPropagation).toHaveBeenCalled();
        expect(mountWrapper.find(Table.Body).find(Table.Row)).toHaveLength(2);

        stopPropagation.mockClear();
    });

    it('should render complement of two books', async() => {
        let mountWrapper = null;
        ContactsApiMock.reset();
        props.books = ContactsApiMock.getBooks();
        await act(async () => {
            mountWrapper = mount(<ContactList {...props}/>);
        });
        mountWrapper.update();
        expect(mountWrapper.find(Header).childAt(0)).toHaveText('Contacts - complement of '
            + props.books[0].name + ' and ' + props.books[1].name);
    });
});
