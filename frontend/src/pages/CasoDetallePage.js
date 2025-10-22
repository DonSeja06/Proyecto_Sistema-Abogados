import React, { Component } from 'react';
import { useParams, Link } from 'react-router-dom';
import clienteAxios from '../config/axios';
import Notificacion from '../components/Notificacion';
import FormularioEvento from '../components/FormularioEvento';
import FormularioPago from '../components/FormularioPago';

function CasoDetallePageWrapper(props) {
    const params = useParams();
    return <CasoDetallePage {...props} params={params} />;
}

class CasoDetallePage extends Component {
    state = {
        caso: null,
        documentos: [],
        archivoSeleccionado: null,
        notificacion: { mensaje: '', tipo: '' },

        eventos: [],
        pagos: []
    }

    componentDidMount() {
        this.obtenerTodaLaInformacion();
    }

    obtenerTodaLaInformacion = async () => {
        const { id } = this.props.params;
        const token = localStorage.getItem('token');
        const config = { headers: { "Authorization": `Bearer ${token}` } };
        try {
            // Pedimos toda la información del caso en paralelo
            const [resCaso, resDocumentos, resEventos, resPagos] = await Promise.all([
                clienteAxios.get(`/casos/${id}`, config),
                clienteAxios.get(`/documentos/${id}`, config),
                clienteAxios.get(`/eventos/${id}`, config),
                clienteAxios.get(`/pagos/${id}`, config)
            ]);
            this.setState({
                caso: resCaso.data,
                documentos: resDocumentos.data,
                eventos: resEventos.data,
                pagos: resPagos.data
            });
        } catch (error) { console.log(error); }
    }

    onArchivoSeleccionado = e => {
        this.setState({ archivoSeleccionado: e.target.files[0] });
    }

    onSubirArchivo = async e => {
        e.preventDefault();
        const { archivoSeleccionado } = this.state;
        if (!archivoSeleccionado) {
            this.setState({ notificacion: { mensaje: 'Por favor, selecciona un archivo', tipo: 'error' } });
            return;
        }

        const formData = new FormData();
        formData.append('archivo', archivoSeleccionado);

        try {
            const respuestaUpload = await clienteAxios.post('http://localhost:5000/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const { url } = respuestaUpload.data;

            const token = localStorage.getItem('token');
            const config = { headers: { "Authorization": `Bearer ${token}` } };
            const nuevoDocumento = {
                nombre: archivoSeleccionado.name,
                rutaArchivo: url
            };
            const { id } = this.props.params;
            await clienteAxios.post(`/documentos/${id}`, nuevoDocumento, config);

            this.setState({ notificacion: { mensaje: 'Documento subido con éxito!', tipo: 'exito' } });
            this.obtenerTodaLaInformacion();

        } catch (error) {
            this.setState({ notificacion: { mensaje: 'Error al subir el archivo', tipo: 'error' } });
            console.log(error);
        } finally {
            setTimeout(() => {
                this.setState({ notificacion: { mensaje: '', tipo: '' } });
            }, 3000);
        }
    }

    handleAgregarEvento = async (datosEvento) => {
        const { id } = this.props.params;
        const token = localStorage.getItem('token');
        const config = { headers: { "Authorization": `Bearer ${token}` } };
        try {
            await clienteAxios.post(`/eventos/${id}`, datosEvento, config);
            this.setState({ notificacion: { mensaje: 'Evento agregado con éxito', tipo: 'exito' } });
            this.obtenerTodaLaInformacion(); // Recargamos todo
        } catch (error) {
            this.setState({ notificacion: { mensaje: 'Error al agregar evento', tipo: 'error' } });
        }
    }

    handleRegistrarPago = async (datosPago) => {
        const { id } = this.props.params;
        const token = localStorage.getItem('token');
        const config = { headers: { "Authorization": `Bearer ${token}` } };
        try {
            await clienteAxios.post(`/pagos/${id}`, datosPago, config);
            this.setState({ notificacion: { mensaje: 'Pago registrado con éxito', tipo: 'exito' } });
            this.obtenerTodaLaInformacion(); // Recargamos todo
        } catch (error) {
            this.setState({ notificacion: { mensaje: 'Error al registrar pago', tipo: 'error' } });
        }
    }

    render() {
        if (!this.state.caso) return <p style={{ color: 'white' }}>Cargando...</p>;
        const { caso, documentos, eventos, pagos, notificacion } = this.state;

        const totalPagado = pagos.reduce((total, pago) => total + pago.monto, 0);

        return (
            <div>
                <Notificacion mensaje={notificacion.mensaje} tipo={notificacion.tipo} />
                <div className="mb-3 d-flex justify-content-between align-items-center">
                    <h2>{caso.titulo}</h2>
                    <Link to="/casos" className="btn btn-secondary">
                        <i className="bi bi-arrow-left"></i> Volver
                    </Link>
                </div>

                <div className="row">
                    <div className="col-lg-4">
                        <FormularioEvento onAgregarEvento={this.handleAgregarEvento} />
                        <FormularioPago onRegistrarPago={this.handleRegistrarPago} />
                        <div className="glass-card mt-4">
                            <h5>Resumen Financiero</h5>
                            <hr style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
                            <h4>Total Pagado: S/. {totalPagado.toFixed(2)}</h4>
                            <ul className="list-group mt-3">
                                {pagos.map(pago => (
                                    <li key={pago._id} className="list-group-item d-flex justify-content-between" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}>
                                        <span>{pago.descripcion || 'Pago'} - {new Date(pago.fecha_pago).toLocaleDateString()}</span>
                                        <strong>S/. {pago.monto.toFixed(2)}</strong>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="col-lg-8">
                        <div className="glass-card">
                            <h5>Bitácora del Caso</h5>
                            {eventos.map(evento => (
                                <div key={evento._id} className="mb-3 p-3" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                                    <strong>{new Date(evento.fecha_evento).toLocaleDateString('es-ES', { timeZone: 'UTC' })} - {evento.titulo}</strong>
                                    <p className="mb-0">{evento.descripcion}</p>
                                </div>
                            ))}
                            <hr style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
                            <h5>Documentos del Caso</h5>
                            <form onSubmit={this.onSubirArchivo} className="input-group mb-3">
                                <input type="file" className="form-control" onChange={this.onArchivoSeleccionado} />
                                <button className="btn btn-primary" type="submit">Subir</button>
                            </form>
                            <ul className="list-group">
                                {documentos.map(doc => (
                                    <li key={doc._id} className="list-group-item d-flex justify-content-between" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}>
                                        {doc.nombre}
                                        <a href={`http://localhost:5000${doc.rutaArchivo}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-info">Ver</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CasoDetallePageWrapper;