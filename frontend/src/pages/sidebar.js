import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';

export default function BurgerMenu() {
    return (
        <Menu>
            <Link className="menu-item" to="/">
                Home
            </Link>
            <Link className="menu-item" to="/region-search">
                Region Search
            </Link>
            <Link className="menu-item" to="/currency-search">
                Currency Search
            </Link>
        </Menu>
    );
}
