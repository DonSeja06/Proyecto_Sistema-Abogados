import React, { Component } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import clienteAxios from '../config/axios';
import Notificacion from '../components/Notificacion';

function EditarClientePageWrapper(props) {
    const params = useParams();
    const navigate = useNavigate();
    return <EditarClientePage {...props} params={params} navigate={navigate} />;
}

class EditarClientePage extends Component {
    state = {
        nombres: '',
        apellidos: '',
        dni: '',
        email: '',
        telefono: '',
        notificacion: { mensaje: '', tipo: '' }
    }

    componentDidMount() {
        this.obtenerCliente();
    }

    obtenerCliente = async () => {
        const { id } = this.props.params;
        const token = localStorage.getItem('token');
        const config = { headers: { "Authorization": `Bearer ${token}` } };
        try {
            const respuesta = await clienteAxios.get(`/clientes/${id}`, config);
            this.setState(respuesta.data);
        } catch (error) {
            console.log(error);
        }
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit = async e => {
        e.preventDefault();
        const { id } = this.props.params;
        const token = localStorage.getItem('token');
        const config = { headers: { "Authorization": `Bearer ${token}` } };

        try {
            await clienteAxios.put(`/clientes/${id}`, this.state, config);
            this.setState({ notificacion: { mensaje: 'Cliente actualizado correctamente', tipo: 'exito' } });
            this.props.navigate('/clientes');
        } catch (error) {
            this.setState({ notificacion: { mensaje: 'Error al actualizar el cliente', tipo: 'error' } });
        }
    }

    render() {
        return (
            <div className="glass-card">
                <h5>Editar Cliente</h5>
                <Notificacion 
                    mensaje={this.state.notificacion.mensaje} 
                    tipo={this.state.notificacion.tipo} 
                />
                
                <hr style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
                <form onSubmit={this.onSubmit}>
                    <div className="form-group mb-2">
                        <input type="text" className="form-control" placeholder="Nombres" name="nombres" onChange={this.onChange} value={this.state.nombres} required />
                    </div>
                    <div className="form-group mb-2">
                        <input type="text" className="form-control" placeholder="Apellidos" name="apellidos" onChange={this.onChange} value={this.state.apellidos} required />
                    </div>
                    <div className="form-group mb-2">
                        <input type="text" className="form-control" placeholder="DNI" name="dni" onChange={this.onChange} value={this.state.dni} />
                    </div>
                    <div className="form-group mb-2">
                        <input type="email" className="form-control" placeholder="Email" name="email" onChange={this.onChange} value={this.state.email} />
                    </div>
                    <div className="form-group mb-2">
                        <input type="text" className="form-control" placeholder="Teléfono" name="telefono" onChange={this.onChange} value={this.state.telefono} />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Guardar Cambios</button>
                </form>
            </div>
        );
    }
}

export default EditarClientePageWrapper;