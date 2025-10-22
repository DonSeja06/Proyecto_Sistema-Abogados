import React, { Component } from 'react';
import './Modal.css';

export default class Modal extends Component {
    render() {
        if (!this.props.mostrar) {
            return null;
        }

        return (
            <div className="modal-overlay">
                <div className="modal-content glass-card">
                    <button onClick={this.props.onClose} className="modal-close-button">&times;</button>
                    {this.props.children}
                </div>
            </div>
        );
    }
}