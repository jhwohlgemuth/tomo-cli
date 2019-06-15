import React from 'react';
import PropTypes from 'prop-types';

const Message = ({name}) => <div>{name} is working!</div>;
Message.propTypes = {
    name: PropTypes.string
};

export default Message;