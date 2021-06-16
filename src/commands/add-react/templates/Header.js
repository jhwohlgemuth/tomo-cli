import {useState, useEffect} from 'react';

const Header = () => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        const counter = setInterval(() => setCount(count + 1), 1000);// eslint-disable-line no-magic-numbers
        return () => clearInterval(counter);
    });
    return <header>
        <p>HMR Check</p>
        <p>Count: {count}</p>
    </header>;
};

export default Header;