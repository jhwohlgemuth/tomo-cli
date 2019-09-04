import {html} from 'lit-html';

const links = {
    tomo: 'https://github.com/jhwohlgemuth/tomo-cli',
    ninalimpi: 'https://twitter.com/ninalimpi',
    undraw: 'https://undraw.co/',
    forgetica: 'https://www.sansforgetica.rmit/'
};

export default ({name}) => html`
    <footer>
        <p>${name} was created with <span class="heart">❤</span> using <a href=${links.tomo}>tomo</a></p>
        <p>Illustration created by <a href=${links.ninalimpi}>Katerina Limpitsouni</a>, available at <a href=${links.undraw}>unDraw</a></p>
        <p>Sans Forgetica font available for free from <a href=${links.forgetica}>RMIT University</a></p>
    </footer>
`;