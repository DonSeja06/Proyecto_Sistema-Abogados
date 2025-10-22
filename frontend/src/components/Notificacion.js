import React, { Component } from 'react';
import './Notificacion.css';

export default class Notificacion extends Component {
    render() {
        const { mensaje, tipo } = this.props;

        if (mensaje === null || mensaje === undefined || mensaje === '') {
            return null;
        }

        const claseNotificacion = `notificacion ${tipo === 'error' ? 'error' : 'exito'}`;

        return (
            <div className={claseNotificacion}>
                <p>{mensaje}</p>
            </div>
        );
    }
}