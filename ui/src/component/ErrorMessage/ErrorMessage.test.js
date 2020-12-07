import React from 'react';
import ErrorMessage from './ErrorMessage';
import {shallow} from 'enzyme';
import {Message} from "semantic-ui-react";

describe('ErrorMessage', () => {
    let error = {op: 'Load data', message: 'Connection failed'};

    it('should render components', () => {
        let wrapper = shallow(<ErrorMessage error={error}/>);
        expect(wrapper.find(Message)).toExist();
        expect(wrapper.find(Message)).toHaveProp('negative');
        expect(wrapper.find(Message.Header).childAt(0)).toHaveText(error.op);
        expect(wrapper.find('p').childAt(0)).toHaveText(error.message);
    });

    it('should render nothing if prop is null', () => {
        let wrapper = shallow(<ErrorMessage/>);
        expect(wrapper.find(Message)).not.toExist();
    });

});
