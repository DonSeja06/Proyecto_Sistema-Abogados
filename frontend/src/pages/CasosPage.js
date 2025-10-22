import React, { Component } from 'react';
import clienteAxios from '../config/axios';
import { Link } from 'react-router-dom';
import Notificacion from '../components/Notificacion';

export default class CasosPage extends Component {
    state = {
        casos: [],
        clientes: [],
        titulo: '',
        descripcion: '',
        clienteId: '',
        filtroDNI: '',
        notificacion: { mensaje: '', tipo: '' },
        mostrarArchivados: false
    }

    componentDidMount() {
        this.obtenerCasos();
        this.obtenerClientes();
    }

    obtenerCasos = async () => {
        const token = localStorage.getItem('token');
        const config = { headers: { "Authorization": `Bearer ${token}` } };
        const respuesta = await clienteAxios.get('/casos', config);
        this.setState({ casos: respuesta.data });
    }

    obtenerClientes = async () => {
        const token = localStorage.getItem('token');
        const config = { headers: { "Authorization": `Bearer ${token}` } };
        const respuesta = await clienteAxios.get('/clientes', config);
        if (respuesta.data.length > 0) {
            this.setState({
                clientes: respuesta.data,
                clienteId: respuesta.data[0]._id
            });
        }
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onFiltroChange = e => {
        this.setState({ filtroDNI: e.target.value });
    }

    onSubmit = async e => {
        e.preventDefault();
        const { titulo, descripcion, clienteId } = this.state;
        const nuevoCaso = { titulo, descripcion, clienteId };

        const token = localStorage.getItem('token');
        const config = { headers: { "Authorization": `Bearer ${token}` } };

        try {
            await clienteAxios.post('/casos', nuevoCaso, config);
            this.setState({
                notificacion: { mensaje: 'Caso agregado correctamente', tipo: 'exito' },
                titulo: '',
                descripcion: ''
            });
            this.obtenerCasos();
        } catch (error) {
            this.setState({ notificacion: { mensaje: 'Error al agregar el caso', tipo: 'error' } });
            console.log(error.response);
        }
    }

    archivarCaso = async (id) => {
        if (!window.confirm("¿Seguro que deseas archivar este caso?")) return;
        const token = localStorage.getItem('token');
        const config = { headers: { "Authorization": `Bearer ${token}` } };
        try {
            await clienteAxios.put(`/casos/archivar/${id}`, {}, config);
            this.setState({ notificacion: { mensaje: 'El caso fue archivado correctamente', tipo: 'exito' } });
            this.obtenerCasos();
        } catch (error) {
            this.setState({ notificacion: { mensaje: 'Error al archivar el caso', tipo: 'error' } });
        }
    }

    reactivarCaso = async(id) =>{
        if (!window.confirm("¿Seguro que deseas reactivar este caso?")) return;
        const token = localStorage.getItem('token');
        const config = { headers: { "Authorization": `Bearer ${token}` } };
        try{
            await clienteAxios.put(`/casos/reactivar/${id}`,{},config);
            this.setState({ notificacion: { mensaje: 'El caso fue reactivado correctamente', tipo: 'exito' } });
            this.obtenerCasos();
        }catch(error){
            this.setState({ notificacion: { mensaje: 'Error al reactivar el caso', tipo: 'error' } });
        }
    }

    toggleMostrarArchivados = () => {
        this.setState(prevState => ({ mostrarArchivados: !prevState.mostrarArchivados }));
    }

    render() {
        const casosNoArchivados = this.state.casos.filter(c => c.estado !== 'archivado');
        const casosArchivados = this.state.casos.filter(c => c.estado === 'archivado');

        const casosFiltrados = casosNoArchivados.filter(caso =>
            caso.cliente && caso.cliente.dni && caso.cliente.dni.includes(this.state.filtroDNI)
        );

        return (
            <div className="row">
                <div className="col-md-4">
                    <div className="glass-card">
                        <h5>Crear Nuevo Caso</h5>
                        <hr style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group mb-2">
                                <label>Título del Caso</label>
                                <input type="text" className="form-control" name="titulo" onChange={this.onChange} value={this.state.titulo} required />
                            </div>
                            <div className="form-group mb-2">
                                <label>Descripción</label>
                                <textarea className="form-control" name="descripcion" onChange={this.onChange} value={this.state.descripcion} required></textarea>
                            </div>
                            <div className="form-group mb-2">
                                <label>Asignar a Cliente</label>
                                <select name="clienteId" className="form-control" onChange={this.onChange} value={this.state.clienteId}>
                                    {this.state.clientes.map(cliente => (
                                        <option key={cliente._id} value={cliente._id}>
                                            {cliente.nombres} {cliente.apellidos}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary w-100 mt-3">Guardar Caso</button>
                        </form>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="glass-card">
                        <h5>Mis Casos</h5>
                        <Notificacion mensaje={this.state.notificacion.mensaje} tipo={this.state.notificacion.tipo} />
                        <hr style={{ borderColor: 'rgba(255,255,255,0.3)' }} />

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <input type="text" className="form-control w-75" placeholder="Filtrar por DNI del Cliente..." onChange={this.onFiltroChange} />
                            <div className="form-check form-switch ms-3">
                                <input className="form-check-input" type="checkbox" id="mostrarArchivados" onChange={this.toggleMostrarArchivados} checked={this.state.mostrarArchivados} />
                                <label className="form-check-label" htmlFor="mostrarArchivados">Ver Archivados</label>
                            </div>
                        </div>

                        <h6 className="mt-4">Activos y Cerrados</h6>
                        <ul className="list-group">
                            {casosFiltrados.map(caso => (
                                <li className="list-group-item d-flex justify-content-between align-items-center" key={caso._id} style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', marginBottom: '10px', borderRadius: '8px' }}>
                                    <Link to={`/caso/${caso._id}`} style={{ textDecoration: 'none', color: 'white', flexGrow: 1 }}>
                                        <h5>{caso.titulo} <span className={`badge bg-${caso.estado === 'en_proceso' ? 'primary' : 'secondary'}`}>{caso.estado}</span></h5>
                                        <p className="mb-1">{caso.descripcion}</p>
                                        <small>Cliente: {caso.cliente.nombres} {caso.cliente.apellidos} (DNI: {caso.cliente.dni})</small>
                                    </Link>
                                    <div className="ms-3 d-flex flex-column">
                                        <Link to={`/casos/editar/${caso._id}`} className="btn btn-warning btn-sm d-block mb-2">Editar</Link>
                                        <button onClick={() => this.archivarCaso(caso._id)} className="btn btn-secondary btn-sm d-block">Archivar</button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {this.state.mostrarArchivados && (
                            <>
                                <h6 className="mt-4">Archivados</h6>
                                <ul className="list-group">
                                    {casosArchivados.map(caso => (
                                        <li key={caso._id} className="list-group-item d-flex justify-content-between align-items-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', opacity: 0.7, color: 'white', border: 'none', marginBottom: '10px', borderRadius: '8px' }}>
                                            <Link to={`/caso/${caso._id}`} style={{ textDecoration: 'none', color: 'white', flexGrow: 1 }}>
                                                <h5>{caso.titulo} <span className="badge bg-dark">Archivado</span></h5>
                                                <small>Cliente: {caso.cliente.nombres} {caso.cliente.apellidos} (DNI: {caso.cliente.dni})</small>
                                            </Link>
                                            <div className="ms-3">
                                                <button onClick={() => this.reactivarCaso(caso._id)} className="btn btn-success btn-sm">Reactivar</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}