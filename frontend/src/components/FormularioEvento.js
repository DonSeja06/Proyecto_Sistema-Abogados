import React, { Component } from 'react';

export default class FormularioEvento extends Component {
    state = {
        titulo: '',
        descripcion: '',
        tipo_evento: 'otro',
        fecha_evento: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0]
    }

    onChange = e => this.setState({ [e.target.name]: e.target.value });

    onSubmit = e => {
        e.preventDefault();
        this.props.onAgregarEvento(this.state);
        this.setState({ titulo: '', descripcion: '' });
    }

    render() {
        return (
            <div className="glass-card mb-4">
                <h5>Agregar Evento al Caso</h5>
                <hr style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
                <form onSubmit={this.onSubmit}>
                    <input className="form-control mb-2" placeholder="Título del Evento" name="titulo" value={this.state.titulo} onChange={this.onChange} required />
                    <textarea className="form-control mb-2" placeholder="Descripción" name="descripcion" value={this.state.descripcion} onChange={this.onChange}></textarea>
                    <input className="form-control mb-2" type="date" name="fecha_evento" value={this.state.fecha_evento} onChange={this.onChange} required />
                    <select className="form-control mb-2" name="tipo_evento" value={this.state.tipo_evento} onChange={this.onChange}>
                        <option value="otro">Otro</option>
                        <option value="audiencia">Audiencia</option>
                        <option value="reunion">Reunión</option>
                        <option value="presentacion_documentos">Presentación de Documentos</option>
                    </select>
                    <button type="submit" className="btn btn-primary w-100">Agregar Evento</button>
                </form>
            </div>
        );
    }
}