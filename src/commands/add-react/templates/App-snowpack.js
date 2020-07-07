import React, {StrictMode} from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';

const App = ({name}) => <StrictMode>
    <Header></Header>
    <Body></Body>
    <Footer name={name}></Footer>
</StrictMode>;

App.propTypes = {
    name: PropTypes.string
};

export default App;