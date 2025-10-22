import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import clienteAxios from '../config/axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default class HonorariosPage extends Component {
    state = {
        historialPagos: [],
        datosGrafico: [],
        cargando: true,
        mesFiltro: 'todos'
    }

    componentDidMount() {
        this.obtenerDatos();
    }

    obtenerDatos = async () => {
        const token = localStorage.getItem('token');
        const config = { headers: { "Authorization": `Bearer ${token}` } };
        try {
            const respuesta = await clienteAxios.get('/usuarios/honorarios-detallados', config);
            this.setState({
                historialPagos: respuesta.data.historialPagos,
                datosGrafico: respuesta.data.datosGrafico,
                cargando: false
            });
        } catch (error) {
            console.log(error);
            this.setState({ cargando: false });
        }
    }

    onFiltroChange = e => {
        this.setState({ mesFiltro: e.target.value });
    }

    render() {
        if (this.state.cargando) return <p style={{color: 'white'}}>Cargando...</p>;

        const datosGraficoFiltrados = this.state.datosGrafico.filter(item => {
            if (this.state.mesFiltro === 'todos') return true;
            return item._id.mes.toString() === this.state.mesFiltro;
        });

        const labels = this.state.datosGrafico.map(item => `${item._id.mes}/${item._id.anio}`);
        const data = {
            labels,
            datasets: [{
                label: 'Honorarios por Mes (S/.)',
                data: datosGraficoFiltrados.map(item => item.totalMes),
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            }],
        };

        const options = {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            },
            scales: {
                y: { 
                    ticks: {
                        color: 'white' 
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                x: { 
                    ticks: {
                        color: 'white' 
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)' 
                    }
                }
            }
        };

        const pagosFiltrados = this.state.historialPagos.filter(pago => {
            if (this.state.mesFiltro === 'todos') return true;
            const mesPago = new Date(pago.fecha_pago).getMonth() + 1;
            return mesPago.toString() === this.state.mesFiltro;
        });

        return (
            <div className="row">
                <div className="col-12 mb-4">
                    <div className="glass-card">
                        <h5>Crecimiento de Honorarios</h5>
                        <div style={{ position: 'relative', height: '400px' }}>
                            <Bar data={data} options={options} />
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <div className="glass-card">
                        <h5>Historial de Pagos Recibidos</h5>
                        <div className="form-group my-3">
                            <label>Filtrar por Mes:</label>
                            <select className="form-control" onChange={this.onFiltroChange} value={this.state.mesFiltro}>
                                <option value="todos">Todos los Meses</option>
                                {[...Array(12).keys()].map(i => <option key={i+1} value={i+1}>{i+1}</option>)}
                            </select>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-dark table-striped">
                                <thead><tr><th>Fecha</th><th>Caso</th><th>Monto</th></tr></thead>
                                <tbody>
                                    {pagosFiltrados.map(pago => (
                                        <tr key={pago._id}>
                                            <td>{new Date(pago.fecha_pago).toLocaleDateString()}</td>
                                            <td>{pago.caso ? pago.caso.titulo : 'Caso eliminado'}</td>
                                            <td>S/. {pago.monto.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}