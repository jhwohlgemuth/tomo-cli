import React from 'react';
import PropTypes from 'prop-types';

const links = {
    tomo: 'https://github.com/jhwohlgemuth/tomo-cli',
    ninalimpi: 'https://twitter.com/ninalimpi',
    undraw: 'https://undraw.co/',
    forgetica: 'https://www.sansforgetica.rmit/'
};

const Footer = ({name}) => <footer>
    <p>{name} was created with <span className="heart">❤</span> using <a href={links.tomo}>tomo-cli</a></p>
    <p>Illustration created by <a href={links.ninalimpi}>Katerina Limpitsouni</a>, available at <a href={links.undraw}>unDraw</a></p>
    <p>Sans Forgetica font available for free from <a href={links.forgetica}>RMIT University</a></p>
</footer>;

Footer.propTypes = {
    name: PropTypes.string
};

export default Footer;