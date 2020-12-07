import React from 'react';
import {Message} from 'semantic-ui-react';
import PropTypes from 'prop-types';

const ErrorMessage = ({error}) => {
    return error ?
        <Message negative>
            <Message.Header>{error.op}</Message.Header>
            <p>{error.message}</p>
        </Message>
    : null;
}

ErrorMessage.propTypes = {
    error: PropTypes.shape({
            op: PropTypes.string.isRequired,
            message: PropTypes.string.isRequired
        })
}

export default ErrorMessage;
