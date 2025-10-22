import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class NavegacionPanel extends Component {
    state = {
        rol: ''
    }

    componentDidMount() {
        const rolUsuario = localStorage.getItem('rol');
        this.setState({ rol: rolUsuario });
    }

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
                <div className="container">
                    <Link className="navbar-brand" to="/dashboard">Abogados Perú</Link>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/clientes">Gestionar Clientes</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/casos">Gestionar Casos</Link>
                            </li>
                            {this.state.rol === 'admin' && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin">Panel de Admin</Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}