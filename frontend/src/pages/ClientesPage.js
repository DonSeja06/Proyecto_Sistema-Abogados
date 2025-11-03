import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import clienteAxios from '../config/axios';
import Notificacion from '../components/Notificacion';
import Modal from '../components/Modal';
import ConfirmacionModal from '../components/ConfirmacionModal';

export default class ClientesPage extends Component {
    state = {
        clientes: [],

        nombres: '',
        apellidos: '',
        dni: '',
        email: '',
        telefono: '',
        filtroDNI: '',

        notificacion: { mensaje: '', tipo: '' },

        modalVisible: false,
        clienteADelegar: null,
        abogadosDisponibles: [],
        abogadoSeleccionadoId: '',

        mostrarInactivos: false,

        confirmacionVisible: false,
        accionConfirmar: null,
        mensajeConfirmar: '',
        tituloConfirmar: ''
    }

    componentDidMount() {
        this.obtenerClientes();
        this.obtenerAbogados();
    }

    obtenerClientes = async () => {
        const token = localStorage.getItem('token');
        const config = { headers: { "Authorization": `Bearer ${token}` } };
        try {
            const respuesta = await clienteAxios.get('/clientes', config);
            this.setState({ clientes: respuesta.data });
        } catch (error) {
            console.log(error);
        }
    }

    obtenerAbogados = async () => {
        const token = localStorage.getItem('token');
        const config = { headers: { "Authorization": `Bearer ${token}` } };
        try {
            const respuesta = await clienteAxios.get('/usuarios/abogados', config);
            this.setState({ abogadosDisponibles: respuesta.data });
        } catch (error) {
            console.log("Error obteniendo abogados", error);
        }
    }

    solicitarDesactivarCliente = (id) => {
        this.setState({
            confirmacionVisible: true,
            tituloConfirmar: 'Desactivar Cliente',
            mensajeConfirmar: '¿Estás seguro de que deseas desactivar este cliente? Ya no aparecerá en las listas.',
            accionConfirmar: () => this.ejecutarDesactivarCliente(id)
        });
    }

    ejecutarDesactivarCliente = async (id) => {
        this.cerrarConfirmacion();
        const token = localStorage.getItem('token');
        const config = { headers: { "Authorization": `Bearer ${token}` } };
        try {
            await clienteAxios.put(`/clientes/desactivar/${id}`, {}, config);
            this.setState({ notificacion: { mensaje: 'Cliente desactivado', tipo: 'exito' } });
            this.obtenerClientes();
        } catch (error) {
            this.setState({ notificacion: { mensaje: 'Error al desactivar el cliente', tipo: 'error' } });
        } finally {
            setTimeout(() => this.setState({ notificacion: { mensaje: '', tipo: '' } }), 3000);
        }
    }

    solicitarReactivarCliente = (id) => {
        this.setState({
            confirmacionVisible: true,
            tituloConfirmar: 'Reactivar Cliente',
            mensajeConfirmar: '¿Seguro que deseas reactivar este cliente?',
            accionConfirmar: () => this.ejecutarReactivarCliente(id)
        });
    }

    ejecutarReactivarCliente = async (id) => {
        this.cerrarConfirmacion();
        const token = localStorage.getItem('token');
        const config = { headers: { "Authorization": `Bearer ${token}` } };
        try {
            await clienteAxios.put(`/clientes/reactivar/${id}`, {}, config);
            this.setState({ notificacion: { mensaje: 'Cliente reactivado con éxito', tipo: 'exito' } });
            this.obtenerClientes();
        } catch (error) {
            this.setState({ notificacion: { mensaje: 'Error al reactivar el cliente', tipo: 'error' } });
        } finally {
            setTimeout(() => this.setState({ notificacion: { mensaje: '', tipo: '' } }), 3000);
        }
    }

    cerrarConfirmacion = () => {
        this.setState({ confirmacionVisible: false, accionConfirmar: null, mensajeConfirmar: '', tituloConfirmar: '' });
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onFiltroChange = e => {
        this.setState({ filtroDNI: e.target.value });
    }

    onSubmit = async e => {
        e.preventDefault();
        const { nombres, apellidos, dni, email, telefono } = this.state;
        const nuevoCliente = { nombres, apellidos, dni, email, telefono };
        const token = localStorage.getItem('token');
        const config = { headers: { "Authorization": `Bearer ${token}` } };
        try {
            await clienteAxios.post('/clientes', nuevoCliente, config);
            this.setState({ notificacion: { mensaje: 'Cliente agregado correctamente', tipo: 'exito' } });
            this.setState({ nombres: '', apellidos: '', dni: '', email: '', telefono: '' });
            this.obtenerClientes();
        } catch (error) {
            this.setState({ notificacion: { mensaje: 'Error al agregar el cliente', tipo: 'error' } });
            console.log(error.response);
        }
    }

    abrirModal = (cliente) => {
        this.setState({
            modalVisible: true,
            clienteADelegar: cliente,
            abogadoSeleccionadoId: this.state.abogadosDisponibles.length > 0 ? this.state.abogadosDisponibles[0]._id : ''
        });
    }

    cerrarModal = () => {
        this.setState({ modalVisible: false, clienteADelegar: null, abogadoSeleccionadoId: '' });
    }

    handleDelegar = async () => {
        const { clienteADelegar, abogadoSeleccionadoId } = this.state;
        if (!abogadoSeleccionadoId) {
            alert("Por favor, selecciona un abogado.");
            return;
        }

        const token = localStorage.getItem('token');
        const config = { headers: { "Authorization": `Bearer ${token}` } };
        try {
            await clienteAxios.put(`/clientes/delegar/${clienteADelegar._id}`, { nuevoAbogadoId: abogadoSeleccionadoId }, config);
            this.setState({ notificacion: { mensaje: 'Cliente delegado con éxito', tipo: 'exito' } });
            this.cerrarModal();
            this.obtenerClientes();
        } catch (error) {
            this.setState({ notificacion: { mensaje: 'Error al delegar el cliente', tipo: 'error' } });
            console.log(error);
        }
    }

    toggleMostrarInactivos = () => {
        this.setState(prevState => ({ mostrarInactivos: !prevState.mostrarInactivos }));
    }

    render() {
        const clientesActivos = this.state.clientes.filter(c => c.estado !== false);
        const clientesInactivos = this.state.clientes.filter(c => c.estado === false);

        const clientesFiltrados = clientesActivos.filter(cliente =>
            cliente.dni && cliente.dni.includes(this.state.filtroDNI)
        );

        return (
            <>
                <div className="row">
                    <div className="col-md-4">
                        <div className="glass-card">
                            <h5>Agregar Nuevo Cliente</h5>
                            <hr style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
                            <form onSubmit={this.onSubmit}>
                                <div className="form-group mb-2"><input type="text" className="form-control" placeholder="Nombres" name="nombres" onChange={this.onChange} value={this.state.nombres} required /></div>
                                <div className="form-group mb-2"><input type="text" className="form-control" placeholder="Apellidos" name="apellidos" onChange={this.onChange} value={this.state.apellidos} required /></div>
                                <div className="form-group mb-2"><input type="text" className="form-control" placeholder="DNI" name="dni" onChange={this.onChange} value={this.state.dni} /></div>
                                <div className="form-group mb-2"><input type="email" className="form-control" placeholder="Email" name="email" onChange={this.onChange} value={this.state.email} /></div>
                                <div className="form-group mb-2"><input type="text" className="form-control" placeholder="Teléfono" name="telefono" onChange={this.onChange} value={this.state.telefono} /></div>
                                <button type="submit" className="btn btn-primary w-100">Guardar Cliente</button>
                            </form>
                        </div>
                    </div>

                    <div className="col-md-8">
                        <div className="glass-card">
                            <h5>Mis Clientes</h5>

                            <Notificacion
                                mensaje={this.state.notificacion.mensaje}
                                tipo={this.state.notificacion.tipo}
                            />

                            <hr style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
                            <div className="d-flex justify-content-between">
                                <input type="text" className="form-control w-75" placeholder="Filtrar por DNI..." onChange={this.onFiltroChange} />
                                <div className="form-check form-switch ms-3">
                                    <input className="form-check-input" type="checkbox" id="mostrarInactivos" onChange={this.toggleMostrarInactivos} />
                                    <label className="form-check-label" htmlFor="mostrarInactivos">Ver Inactivos</label>
                                </div>
                            </div>
                            <h6 className="mt-4">Activos</h6>
                            <ul className="list-group">
                                {clientesFiltrados.map(cliente => (
                                    <li className="list-group-item d-flex justify-content-between align-items-center" key={cliente._id} style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', marginBottom: '10px', borderRadius: '8px' }}>
                                        <div>{cliente.nombres} {cliente.apellidos}<br /><small>DNI: {cliente.dni}</small></div>
                                        <div>
                                            <button onClick={() => this.abrirModal(cliente)} className="btn btn-primary btn-sm me-2">Delegar</button>
                                            <Link to={`/clientes/editar/${cliente._id}`} className="btn btn-warning btn-sm me-2">Editar</Link>
                                            <button onClick={() => this.solicitarDesactivarCliente(cliente._id)} className="btn btn-secondary btn-sm">Desactivar</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {this.state.mostrarInactivos && (
                                <>
                                    <h6 className="mt-4">Inactivos</h6>
                                    <ul className="list-group">
                                        {clientesInactivos.map(cliente => (
                                            <li className="list-group-item d-flex justify-content-between align-items-center" key={cliente._id} style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', opacity: 0.7, color: 'white', border: 'none', marginBottom: '10px', borderRadius: '8px' }}>
                                                <div>{cliente.nombres} {cliente.apellidos}<br /><small>DNI: {cliente.dni}</small></div>
                                                <div>
                                                    <button onClick={() => this.solicitarReactivarCliente(cliente._id)} className="btn btn-success btn-sm">Reactivar</button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <Modal mostrar={this.state.modalVisible} onClose={this.cerrarModal}>
                    <h4>Delegar Cliente</h4>
                    {this.state.clienteADelegar && <p>Estás a punto de delegar a <strong>{this.state.clienteADelegar.nombres} {this.state.clienteADelegar.apellidos}</strong>.</p>}
                    <p>Todos sus casos asociados también serán reasignados.</p>
                    <div className="form-group my-3">
                        <label>Selecciona el nuevo abogado responsable:</label>
                        <select
                            className="form-control"
                            name="abogadoSeleccionadoId"
                            value={this.state.abogadoSeleccionadoId}
                            onChange={this.onChange}
                        >
                            {this.state.abogadosDisponibles.map(abogado => (
                                abogado._id !== this.props.usuarioId &&
                                <option key={abogado._id} value={abogado._id}>
                                    {abogado.nombres} {abogado.apellidos}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={this.handleDelegar} className="btn btn-success w-100">Confirmar Delegación</button>
                </Modal>

                <ConfirmacionModal
                    mostrar={this.state.confirmacionVisible}
                    titulo={this.state.tituloConfirmar}
                    mensaje={this.state.mensajeConfirmar}
                    onConfirmar={this.state.accionConfirmar}
                    onCancelar={this.cerrarConfirmacion}
                />
            </>
        )
    }
}