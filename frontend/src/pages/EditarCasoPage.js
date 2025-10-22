import React, { Component } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import clienteAxios from '../config/axios';
import Notificacion from '../components/Notificacion';

function EditarCasoPageWrapper(props) {
    const params = useParams();
    const navigate = useNavigate();
    return <EditarCasoPage {...props} params={params} navigate={navigate} />;
}

class EditarCasoPage extends Component {
    state = {
        titulo: '',
        descripcion: '',
        estado: 'en_proceso',
        notificacion: { mensaje: '', tipo: '' }
    }

    componentDidMount() {
        this.obtenerCaso();
    }

    obtenerCaso = async () => {
        const { id } = this.props.params;
        const token = localStorage.getItem('token');
        const config = { headers: { "Authorization": `Bearer ${token}` } };
        try {
            const respuesta = await clienteAxios.get(`/casos/${id}`, config);
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
            await clienteAxios.put(`/casos/${id}`, this.state, config);
            this.setState({ notificacion: { mensaje: 'Caso actualizado con exito', tipo: 'exito' } });
            this.props.navigate('/casos');
        } catch (error) {
            this.setState({ notificacion: { mensaje: 'Error al actualizar el caso', tipo: 'error' } })
        }
    }

    render() {
        return (
            <div className="glass-card">
                <h5>Editar Caso</h5>
                <Notificacion 
                    mensaje={this.state.notificacion.mensaje} 
                    tipo={this.state.notificacion.tipo} 
                />
                
                <hr style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
                <form onSubmit={this.onSubmit}>
                    <div className="form-group mb-2"><label>Título</label><input type="text" className="form-control" name="titulo" onChange={this.onChange} value={this.state.titulo} /></div>
                    <div className="form-group mb-2"><label>Descripción</label><textarea className="form-control" name="descripcion" onChange={this.onChange} value={this.state.descripcion}></textarea></div>
                    <div className="form-group mb-2">
                        <label>Estado</label>
                        <select name="estado" className="form-control" onChange={this.onChange} value={this.state.estado}>
                            <option value="en_proceso">En Proceso</option>
                            <option value="cerrado">Cerrado</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mt-3">Guardar Cambios</button>
                </form>
            </div>
        );
    }
}

export default EditarCasoPageWrapper;