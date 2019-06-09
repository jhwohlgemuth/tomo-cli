import React from 'react';
import PropTypes from 'prop-types';

const App = ({name}) => <div>{name} is functioning as desired!</div>;
App.propTypes = {
    name: PropTypes.string
};

export default App;