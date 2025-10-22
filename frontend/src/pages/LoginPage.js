import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../config/axios';
import Notificacion from '../components/Notificacion';
import './LoginPage.css';
import fondoLogin from '../assets/login-background.jpg';

function LoginPageWrapper(props) {
    const navigate = useNavigate();
    return <LoginPage {...props} navigate={navigate} />;
}

class LoginPage extends Component {
    state = {
        email: '',
        password: '',
        notificacion: {
            mensaje: '',
            tipo: ''
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    
    onSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = this.state;

        if (email === '' || password === '') {
            this.setState({ notificacion: { mensaje: 'Todos los campos son obligatorios', tipo: 'error' } });
            return;
        }

        try {
            const respuesta = await clienteAxios.post('/usuarios/login', { email, password });
            localStorage.setItem('token', respuesta.data.token);
            localStorage.setItem('rol', respuesta.data.rol);
            this.props.navigate('/dashboard');

        } catch (error) {
            const mensajeError = error.response ? error.response.data.msg : 'No se pudo conectar con el servidor.';
            this.setState({ notificacion: { mensaje: mensajeError, tipo: 'error' } });
        }
    }

    render() {
        const { notificacion } = this.state;

        return (
            <div className="login-page-container" style={{ backgroundImage: `url(${fondoLogin})` }}>
                <div className="login-card">

                    <Notificacion mensaje={notificacion.mensaje} tipo={notificacion.tipo} />
                    
                    <h1><i className="bi bi-person-circle"></i> AbogadosPerú</h1>
                    <form onSubmit={this.onSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Usuario</label>
                            <input type="email" id="email" className="form-control" placeholder="Ingresa tu correo" name="email" onChange={this.onChange} value={this.state.email} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <input type="password" id="password" className="form-control" placeholder="Ingresa tu contraseña" name="password" onChange={this.onChange} value={this.state.password} required />
                        </div>
                        <button type="submit" className="btn btn-login text-white mt-2">
                            <i className="bi bi-box-arrow-in-right"></i> Iniciar sesión
                        </button>
                    </form>
                </div>
                <footer>
                    © 2025 AbogadosPerú - Todos los derechos reservados
                </footer>
            </div>
        )
    }
}

export default LoginPageWrapper;