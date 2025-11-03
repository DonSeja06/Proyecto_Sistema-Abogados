import React, { Component } from 'react';
import Modal from './Modal';

export default class ConfirmacionModal extends Component {
    render() {
        const { mostrar, titulo, mensaje, onConfirmar, onCancelar } = this.props;

        if (!mostrar) {
            return null;
        }

        return (
            <Modal mostrar={mostrar} onClose={onCancelar}>
                <h4>{titulo || 'Confirmar Acción'}</h4>
                <p>{mensaje || '¿Estás seguro de que deseas continuar?'}</p>
                <hr style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
                <div className="d-flex justify-content-end">
                    <button onClick={onCancelar} className="btn btn-secondary me-2">Cancelar</button>
                    <button onClick={onConfirmar} className="btn btn-danger">Confirmar</button>
                </div>
            </Modal>
        );
    }
}