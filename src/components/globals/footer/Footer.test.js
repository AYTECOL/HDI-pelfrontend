import React from 'react';
import Footer from './Footer';
import ReactDOM from 'react-dom';

it('test render Footer', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Footer/>, div);
    ReactDOM.unmountComponentAtNode(div);
});