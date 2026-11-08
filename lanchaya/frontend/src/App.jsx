import { useEffect, useState } from 'react';
import { api } from './services/api.js';
import { TIPOS } from './constants.js';
import lanchaImg from './assets/lancha.svg';

import Filtros from './components/Filtros.jsx';
import SalidaCard from './components/SalidaCard.jsx';
import SalidaForm from './components/SalidaForm.jsx';
import Aviso from './components/Aviso.jsx';

const FILTROS_INICIALES = { destino: '', fecha: '', tipo: '' };

export default function App() {
  const [salidas, setSalidas] = useState([]);
  const [destinos, setDestinos] = useState([]);
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [formAbierto, setFormAbierto] = useState(false);
  const [salidaEnEdicion, setSalidaEnEdicion] = useState(null);
  const [aviso, setAviso] = useState(null);

  const hayFiltros = Object.values(filtros).some(Boolean);

  async function cargarDestinos() {
    try {
      setDestinos(await api.getDestinos());
    } catch {
      // El error principal ya se muestra al cargar las salidas.
    }
  }

  async function cargarSalidas(filtrosActivos = filtros) {
    setCargando(true);
    setError('');

    try {
      setSalidas(await api.getSalidas(filtrosActivos));
    } catch (err) {
      setError(err.message);
      setSalidas([]);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarDestinos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    cargarSalidas(filtros);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros]);

  function abrirFormulario(salida = null) {
    setSalidaEnEdicion(salida);
    setFormAbierto(true);
  }

  function cerrarFormulario() {
    setFormAbierto(false);
    setSalidaEnEdicion(null);
  }

  async function guardarSalida(datos) {
    if (salidaEnEdicion) {
      await api.actualizarSalida(salidaEnEdicion.id, datos);
      setAviso({ tipo: 'exito', texto: 'Salida actualizada correctamente.' });
    } else {
      await api.crearSalida(datos);
      setAviso({ tipo: 'exito', texto: 'Salida registrada correctamente.' });
    }

    cerrarFormulario();
    await Promise.all([cargarSalidas(), cargarDestinos()]);
  }

  async function eliminarSalida(salida) {
    const confirmado = window.confirm(
      `¿Eliminar la salida a ${salida.destino} de ${salida.empresa}?\n\nEsta acción no se puede deshacer.`
    );
    if (!confirmado) return;

    try {
      await api.eliminarSalida(salida.id);
      setAviso({ tipo: 'exito', texto: 'Salida eliminada.' });
      await Promise.all([cargarSalidas(), cargarDestinos()]);
    } catch (err) {
      setAviso({ tipo: 'error', texto: err.message });
    }
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero__aurora" aria-hidden="true" />
        <div className="hero__contenido">
          <div className="hero__marca">
            <img src={lanchaImg} alt="LanchaYa" className="hero__logo" aria-hidden="true" />
            <div>
              <p className="hero__eyebrow">Transporte fluvial · Iquitos</p>
              <h1 className="hero__titulo">LanchaYa</h1>
              <p className="hero__lema">
                Todas las salidas del río, en un solo lugar. Consulta, filtra y publica
                en segundos.
              </p>
            </div>
          </div>

          <button className="btn btn--primario btn--grande" onClick={() => abrirFormulario()}>
            Registrar salida
          </button>
        </div>

        <div className="hero__stats">
          <div className="hero__stat">
            <strong>{salidas.length}</strong>
            <span>salidas</span>
          </div>
          <div className="hero__stat">
            <strong>{destinos.length}</strong>
            <span>destinos</span>
          </div>
          <div className="hero__stat">
            <strong>{TIPOS.length}</strong>
            <span>tipos de embarcación</span>
          </div>
          <div className="hero__stat hero__stat--live">
            <span className="punto" aria-hidden="true" />
            <span>Datos actualizados</span>
          </div>
        </div>
      </header>

      <main className="contenido">
        <Filtros
          filtros={filtros}
          destinos={destinos}
          hayFiltros={hayFiltros}
          onCambiar={setFiltros}
        />

        <section className="resultados" aria-live="polite">
          <div className="resultados__cabecera">
            <div>
              <h2>
                {hayFiltros ? 'Salidas filtradas' : 'Próximas salidas'}
                {!cargando && !error && (
                  <span className="resultados__contador">{salidas.length}</span>
                )}
              </h2>
              <p className="resultados__sub">Ordenadas por la salida más próxima</p>
            </div>
            {hayFiltros && (
              <button
                className="btn btn--texto"
                onClick={() => setFiltros(FILTROS_INICIALES)}
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {cargando && (
            <div className="estado">
              <span className="spinner" aria-hidden="true" />
              <p>Cargando salidas…</p>
            </div>
          )}

          {!cargando && error && (
            <div className="estado estado--error" role="alert">
              <p className="estado__titulo">No pudimos cargar las salidas</p>
              <p>{error}</p>
              <button className="btn btn--primario" onClick={() => cargarSalidas()}>
                Reintentar
              </button>
            </div>
          )}

          {!cargando && !error && salidas.length === 0 && (
            <div className="estado estado--vacio">
              <p className="estado__titulo">
                {hayFiltros ? 'No hay salidas con esos filtros' : 'Todavía no hay salidas registradas'}
              </p>
              <p>
                {hayFiltros
                  ? 'Prueba con otro destino, otra fecha u otro tipo de embarcación.'
                  : 'Sé el primero en registrar una salida fluvial.'}
              </p>
              {hayFiltros ? (
                <button className="btn btn--ghost" onClick={() => setFiltros(FILTROS_INICIALES)}>
                  Limpiar filtros
                </button>
              ) : (
                <button className="btn btn--primario" onClick={() => abrirFormulario()}>
                  Registrar salida
                </button>
              )}
            </div>
          )}

          {!cargando && !error && salidas.length > 0 && (
            <div className="grid">
              {salidas.map((salida) => (
                <SalidaCard
                  key={salida.id}
                  salida={salida}
                  onEditar={abrirFormulario}
                  onEliminar={eliminarSalida}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="pie">
        <p>LanchaYa Iquitos · Proyecto Full Stack · Datos referenciales</p>
      </footer>

      {formAbierto && (
        <SalidaForm
          salida={salidaEnEdicion}
          destinos={destinos}
          onGuardar={guardarSalida}
          onCerrar={cerrarFormulario}
        />
      )}

      <Aviso aviso={aviso} onCerrar={() => setAviso(null)} />
    </div>
  );
}
