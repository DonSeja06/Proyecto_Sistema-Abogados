import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../config/axios';
import { Link } from 'react-router-dom'

class DashboardPage extends Component {
    state = {
        usuario: null,
        estadisticas: {
            casosActivos: 0,
            clientesActivos: 0,
            totalHonorarios: 0,
            proximosEventos: []
        },
        cargando: true
    }

    componentDidMount() {
        this.obtenerDatosDashboard();
    }

    obtenerDatosDashboard = async () => {
        const token = localStorage.getItem('token');
        const config = { headers: { "Authorization": `Bearer ${token}` } };
        try {
            const [resPerfil, resEstadisticas] = await Promise.all([
                clienteAxios.get('/usuarios/perfil', config),
                clienteAxios.get('/usuarios/estadisticas', config)
            ]);

            this.setState({
                usuario: resPerfil.data,
                estadisticas: resEstadisticas.data,
                cargando: false
            });
        } catch (error) {
            console.log("Error obteniendo datos del dashboard", error);
            this.setState({ cargando: false });
        }
    }

    handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        this.props.navigate('/');
    }

    render() {
        const { usuario, estadisticas, cargando } = this.state;
        if (cargando || !usuario) {
            return <p style={{ color: 'white', textAlign: 'center' }}>Cargando dashboard...</p>;
        }

        return (
            <div>
                <div className="container">
                    <div className="glass-card mb-4">
                        <h2>Panel Principal</h2>
                        <hr style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
                        <p>¡Bienvenido, {usuario.nombres} {usuario.apellidos}!</p>
                        <button onClick={this.handleLogout} className="btn btn-danger">
                            Cerrar Sesión
                        </button>
                    </div>

                    <div className="row">
                        <div className="col-xl-3 col-md-6 mb-4">
                            <div className="glass-card text-center h-100">
                                <div className="card-body">
                                    <h5 className="card-title">Casos Activos</h5>
                                    <p className="card-text display-4">{estadisticas.casosActivos}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6 mb-4">
                            <div className="glass-card text-center h-100">
                                <div className="card-body">
                                    <h5 className="card-title">Clientes Activos</h5>
                                    <p className="card-text display-4">{estadisticas.clientesActivos}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6 mb-4">
                            <Link to="/honorarios" className="text-decoration-none text-white">
                                <div className="glass-card text-center h-100">
                                    <div className="card-body">
                                        <h5 className="card-title">Mis Honorarios</h5>
                                        <p className="card-text display-6">S/. {estadisticas.totalHonorarios.toFixed(2)}</p>
                                        <small>Ver detalles &rarr;</small>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="col-xl-3 col-md-6 mb-4">
                            <div className="glass-card h-100">
                                <div className="card-body">
                                    <h5 className="card-title text-center">Próximos Eventos</h5>
                                    <ul className="list-group list-group-flush">
                                        {estadisticas.proximosEventos.length > 0 ? estadisticas.proximosEventos.map(evento => (
                                            <li key={evento._id} className="list-group-item" style={{ backgroundColor: 'transparent', color: 'white', border: 'none' }}>
                                                <strong>{new Date(evento.fecha_evento).toLocaleDateString('es-ES', { timeZone: 'UTC' })}:</strong> {evento.titulo}
                                                <br />
                                                <small style={{ color: 'rgba(255,255,255,0.8)' }}>
                                                    Caso: {evento.caso.titulo} ({evento.caso.cliente.nombres} {evento.caso.cliente.apellidos})
                                                </small>
                                            </li>

                                        )) : <p className="text-center">No hay eventos próximos.</p>}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function DashboardPageWrapper(props) {
    const navigate = useNavigate();
    return <DashboardPage {...props} navigate={navigate} />;
}

export default DashboardPageWrapper;