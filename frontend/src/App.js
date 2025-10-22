import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginPageWrapper from './pages/LoginPage';
import DashboardPageWrapper from './pages/DashboardPage';
import CasoDetallePageWrapper from './pages/CasoDetallePage';
import EditarClientePageWrapper from './pages/EditarClientePage';
import EditarCasoPageWrapper from './pages/EditarCasoPage';

import RutaProtegida from './components/RutaProtegida';
import ClientesPage from './pages/ClientesPage';
import CasosPage from './pages/CasosPage';
import PanelLayout from './components/PanelLayout';

import RutaAdmin from './components/RutaAdmin';
import AdminPage from './pages/AdminPage';
import HonorariosPage from './pages/HonorariosPage';

class App extends Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginPageWrapper />} />

          <Route path="/dashboard" element={
            <RutaProtegida>
              <PanelLayout>
                <DashboardPageWrapper />
              </PanelLayout>
            </RutaProtegida>
          } />

          <Route path="/clientes" element={
            <RutaProtegida>
              <PanelLayout>
                <ClientesPage />
              </PanelLayout>
            </RutaProtegida>
          } />

          <Route path="/casos" element={
            <RutaProtegida>
              <PanelLayout>
                <CasosPage />
              </PanelLayout>
            </RutaProtegida>
          } />

          <Route path="/caso/:id" element={
            <RutaProtegida>
              <PanelLayout>
                <CasoDetallePageWrapper />
              </PanelLayout>
            </RutaProtegida>
          } />

          <Route path="/clientes/editar/:id" element={
            <RutaProtegida>
              <PanelLayout>
                <EditarClientePageWrapper />
              </PanelLayout>
            </RutaProtegida>
          } />

          <Route path="/casos/editar/:id" element={
            <RutaProtegida>
              <PanelLayout>
                <EditarCasoPageWrapper />
              </PanelLayout>
            </RutaProtegida>
          } />

          <Route path="/admin" element={
            <RutaAdmin>
              <PanelLayout>
                <AdminPage />
              </PanelLayout>
            </RutaAdmin>
          } />

          <Route path="/honorarios" element={
            <RutaProtegida>
              <PanelLayout>
                <HonorariosPage />
              </PanelLayout>
            </RutaProtegida>
          } />

        </Routes>
      </Router>
    );
  }
}

export default App;