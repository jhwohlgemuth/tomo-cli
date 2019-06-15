import React, {Fragment, useEffect, useState} from 'react';
import {hot} from 'react-hot-loader';
import PropTypes from 'prop-types';
import Message from './Message';

const App = ({name}) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        const counter = setInterval(() => setCount(count + 1), 1000);// eslint-disable-line no-magic-numbers
        return () => clearInterval(counter);
    });
    return <Fragment>
        <Message name={name}></Message>
        <div>Count is: {count}</div>
    </Fragment>;
};
App.propTypes = {
    name: PropTypes.string
};

export default hot(module)(App);