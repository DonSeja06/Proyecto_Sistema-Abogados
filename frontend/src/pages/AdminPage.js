import React, { Component } from 'react';
import clienteAxios from '../config/axios';
import Notificacion from '../components/Notificacion';

export default class AdminPage extends Component {
    state = {
        usuarios: [],
        nombres: '',
        apellidos: '',
        email: '',
        password: '',
        dni: '',
        rol: 'abogado',

        clientes: [],
        casos: [],

        notificacion: { mensaje: '', tipo: '' }
    }

    componentDidMount() {
        this.obtenerUsuarios();
        this.obtenerTodosLosClientes();
        this.obtenerTodosLosCasos();
    }

    obtenerUsuarios = async () => {
        const token = localStorage.getItem('token');
        const config = { headers: { "Authorization": `Bearer ${token}` } };
        try {
            const respuesta = await clienteAxios.get('/admin/usuarios', config);
            this.setState({ usuarios: respuesta.data });
        } catch (error) {
            console.log(error);
        }
    }

    obtenerTodosLosClientes = async () => {
        const token = localStorage.getItem('token');
        const config = { headers: { "Authorization": `Bearer ${token}` } };
        try {
            const respuesta = await clienteAxios.get('/admin/clientes', config);
            this.setState({ clientes: respuesta.data });
        } catch (error) { console.log("Error obteniendo todos los clientes", error); }
    }

    obtenerTodosLosCasos = async () => {
        const token = localStorage.getItem('token');
        const config = { headers: { "Authorization": `Bearer ${token}` } };
        try {
            const respuesta = await clienteAxios.get('/admin/casos', config);
            this.setState({ casos: respuesta.data });
        } catch (error) { console.log("Error obteniendo todos los casos", error); }
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit = async e => {
        e.preventDefault();
        const nuevoUsuario = { ...this.state };
        delete nuevoUsuario.usuarios;

        const token = localStorage.getItem('token');
        const config = { headers: { "Authorization": `Bearer ${token}` } };

        try {
            await clienteAxios.post('/admin/usuarios', nuevoUsuario, config);
            this.setState({
                notificacion: { mensaje: 'Usuario creado correctamente', tipo: 'exito' },
                nombres: '', apellidos: '', email: '', password: '', dni: ''
            });
            this.obtenerUsuarios();
        } catch (error) {
            this.setState({
                notificacion: { mensaje: "Error al crear usuario", tipo: 'error' }
            });
        }
    }

    render() {
        return (
            <div>
                <Notificacion
                    mensaje={this.state.notificacion.mensaje}
                    tipo={this.state.notificacion.tipo}
                />
                
                <div className="row mb-4">
                    <div className="col-md-4">
                        <div className="glass-card">
                            <h5>Crear Nuevo Usuario</h5>
                            <hr style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
                            <form onSubmit={this.onSubmit}>
                                <input className="form-control mb-2" placeholder="Nombres" name="nombres" onChange={this.onChange} value={this.state.nombres} />
                                <input className="form-control mb-2" placeholder="Apellidos" name="apellidos" onChange={this.onChange} value={this.state.apellidos} />
                                <input className="form-control mb-2" placeholder="DNI" name="dni" onChange={this.onChange} value={this.state.dni} />
                                <input className="form-control mb-2" type="email" placeholder="Email" name="email" onChange={this.onChange} value={this.state.email} />
                                <input className="form-control mb-2" type="password" placeholder="Contraseña" name="password" onChange={this.onChange} value={this.state.password} />
                                <select name="rol" className="form-control mb-2" onChange={this.onChange} value={this.state.rol}>
                                    <option value="abogado">Abogado</option>
                                    <option value="admin">Administrador</option>
                                </select>
                                <button type="submit" className="btn btn-primary w-100">Crear Usuario</button>
                            </form>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="glass-card">
                            <h5>Lista de Usuarios del Sistema</h5>
                            <ul className="list-group">
                                {this.state.usuarios.map(user => (
                                    <li key={user._id} className="list-group-item d-flex justify-content-between" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', marginBottom: '5px' }}>
                                        <span>{user.nombres} {user.apellidos} ({user.email})</span>
                                        <span className={`badge bg-${user.rol === 'admin' ? 'success' : 'info'}`}>{user.rol}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="glass-card mb-4">
                    <h5>Vista Global de Clientes</h5>
                    <div className="table-responsive">
                        <table className="table table-dark table-striped">
                            <thead>
                                <tr>
                                    <th>Cliente</th>
                                    <th>DNI</th>
                                    <th>Abogado Asignado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.clientes.map(cliente => (
                                    <tr key={cliente._id}>
                                        <td>{cliente.nombres} {cliente.apellidos}</td>
                                        <td>{cliente.dni}</td>
                                        <td>{cliente.abogado ? `${cliente.abogado.nombres} ${cliente.abogado.apellidos}` : 'No asignado'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="glass-card">
                    <h5>Vista Global de Casos</h5>
                    <div className="table-responsive">
                        <table className="table table-dark table-striped">
                            <thead>
                                <tr>
                                    <th>Título del Caso</th>
                                    <th>Cliente</th>
                                    <th>Abogado Asignado</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.casos.map(caso => (
                                    <tr key={caso._id}>
                                        <td>{caso.titulo}</td>
                                        <td>{caso.cliente ? `${caso.cliente.nombres} ${caso.cliente.apellidos}` : 'No asignado'}</td>
                                        <td>{caso.abogadoAsignado ? `${caso.abogadoAsignado.nombres} ${caso.abogadoAsignado.apellidos}` : 'No asignado'}</td>
                                        <td><span className={`badge bg-light text-dark`}>{caso.estado}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}