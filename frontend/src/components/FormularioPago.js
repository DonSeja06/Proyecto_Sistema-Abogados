import React, { Component } from 'react';

export default class FormularioPago extends Component {
    state = {
        monto: '',
        descripcion: '',
        metodo_pago: 'efectivo'
    }

    onChange = e => this.setState({ [e.target.name]: e.target.value });

    onSubmit = e => {
        e.preventDefault();
        this.props.onRegistrarPago(this.state);
        this.setState({ monto: '', descripcion: '' });
    }

    render() {
        return (
            <div className="glass-card">
                <h5>Registrar Pago del Caso</h5>
                <hr style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
                <form onSubmit={this.onSubmit}>
                    <input className="form-control mb-2" type="number" placeholder="Monto (S/.)" name="monto" value={this.state.monto} onChange={this.onChange} required />
                    <input className="form-control mb-2" placeholder="Descripción (Ej: Honorarios)" name="descripcion" value={this.state.descripcion} onChange={this.onChange} />
                    <select className="form-control mb-2" name="metodo_pago" value={this.state.metodo_pago} onChange={this.onChange}>
                        <option value="efectivo">Efectivo</option>
                        <option value="transferencia">Transferencia</option>
                        <option value="tarjeta">Tarjeta</option>
                    </select>
                    <button type="submit" className="btn btn-success w-100">Registrar Pago</button>
                </form>
            </div>
        );
    }
}