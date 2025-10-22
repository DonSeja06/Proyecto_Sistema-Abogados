import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navigation extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        AbogadosPerú
                    </Link>
                </div>
            </nav>
        )
    }
}