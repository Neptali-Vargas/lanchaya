import { useEffect, useRef, useState } from 'react';

import { TIPOS, TIPO_INFO, ahoraLocalISO } from '../constants.js';

function valorInicial(salida) {
  if (!salida) {
    return {
      empresa: '',
      embarcacion: '',
      tipo: 'rapido',
      destino: '',
      puerto: '',
      fechaHora: '',
      duracionHoras: '',
      precio: '',
      cupos: '',
    };
  }

  return {
    empresa: salida.empresa ?? '',
    embarcacion: salida.embarcacion ?? '',
    tipo: salida.tipo ?? 'rapido',
    destino: salida.destino ?? '',
    puerto: salida.puerto ?? '',
    fechaHora: String(salida.fechaHora ?? '').slice(0, 16),
    duracionHoras: salida.duracionHoras ?? '',
    precio: salida.precio ?? '',
    cupos: salida.cupos ?? '',
  };
}

function validar(datos, { esEdicion }) {
  const errores = {};

  if (!datos.empresa.trim()) errores.empresa = 'La empresa es obligatoria.';
  if (!datos.destino.trim()) errores.destino = 'El destino es obligatorio.';
  if (!datos.puerto.trim()) errores.puerto = 'El puerto es obligatorio.';

  if (!datos.fechaHora) {
    errores.fechaHora = 'La fecha y hora son obligatorias.';
  } else {
    const fecha = new Date(datos.fechaHora);
    if (Number.isNaN(fecha.getTime())) {
      errores.fechaHora = 'La fecha y hora no son válidas.';
    } else if (!esEdicion && fecha.getTime() < Date.now()) {
      errores.fechaHora = 'La fecha y hora no pueden estar en el pasado.';
    }
  }

  if (!TIPOS.includes(datos.tipo)) {
    errores.tipo = 'Elige un tipo de embarcación válido.';
  }

  const precio = Number(datos.precio);
  if (datos.precio === '' || datos.precio === null) {
    errores.precio = 'El precio es obligatorio.';
  } else if (!Number.isFinite(precio) || precio <= 0) {
    errores.precio = 'El precio debe ser un número mayor que 0.';
  }

  if (datos.duracionHoras !== '') {
    const duracion = Number(datos.duracionHoras);
    if (!Number.isFinite(duracion) || duracion <= 0) {
      errores.duracionHoras = 'La duración debe ser mayor que 0.';
    }
  }

  if (datos.cupos !== '') {
    const cupos = Number(datos.cupos);
    if (!Number.isInteger(cupos) || cupos < 0) {
      errores.cupos = 'Los cupos deben ser un entero mayor o igual a 0.';
    }
  }

  return errores;
}

export default function SalidaForm({ salida, destinos, onGuardar, onCerrar }) {
  const esEdicion = Boolean(salida);
  const [datos, setDatos] = useState(() => valorInicial(salida));
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState('');
  const [enviando, setEnviando] = useState(false);

  const primerCampo = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    primerCampo.current?.focus();

    function alPresionarTecla(evento) {
      if (evento.key === 'Escape') onCerrar();
    }
    document.addEventListener('keydown', alPresionarTecla);

    const overflowOriginal = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', alPresionarTecla);
      document.body.style.overflow = overflowOriginal;
    };
  }, [onCerrar]);

  function cambiar(campo, valor) {
    setDatos((previos) => ({ ...previos, [campo]: valor }));
    setErrores((previos) => {
      if (!previos[campo]) return previos;
      const copia = { ...previos };
      delete copia[campo];
      return copia;
    });
  }

  async function enviar(evento) {
    evento.preventDefault();

    const erroresCliente = validar(datos, { esEdicion });
    if (Object.keys(erroresCliente).length > 0) {
      setErrores(erroresCliente);
      const primero = Object.keys(erroresCliente)[0];
      panelRef.current?.querySelector(`[name="${primero}"]`)?.focus();
      return;
    }

    setEnviando(true);
    setErrorServidor('');

    const carga = {
      empresa: datos.empresa.trim(),
      embarcacion: datos.embarcacion.trim(),
      tipo: datos.tipo,
      destino: datos.destino.trim(),
      puerto: datos.puerto.trim(),
      fechaHora: datos.fechaHora,
      precio: Number(datos.precio),
      duracionHoras: datos.duracionHoras === '' ? undefined : Number(datos.duracionHoras),
      cupos: datos.cupos === '' ? undefined : Number(datos.cupos),
    };

    try {
      await onGuardar(carga);
    } catch (err) {
      setErrorServidor(err.message || 'No se pudo guardar la salida.');
      if (Array.isArray(err.errores) && err.errores.length > 0) {
        setErrores((previos) => ({ ...previos, _general: err.errores.join(' ') }));
      }
      setEnviando(false);
    }
  }

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-formulario"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) onCerrar();
      }}
    >
      <div className="modal__panel" ref={panelRef}>
        <header className="modal__cabecera">
          <div>
            <h2 id="titulo-formulario">{esEdicion ? 'Editar salida' : 'Registrar salida'}</h2>
            <p>
              {esEdicion
                ? 'Actualiza los datos de la salida fluvial.'
                : 'Publica una nueva salida desde Iquitos.'}
            </p>
          </div>
          <button
            type="button"
            className="modal__cerrar"
            onClick={onCerrar}
            aria-label="Cerrar formulario"
          >
            ✕
          </button>
        </header>

        <form className="formulario" onSubmit={enviar} noValidate>
          <div className="formulario__fila">
            <div className="campo">
              <label htmlFor="empresa">Empresa *</label>
              <input
                id="empresa"
                name="empresa"
                ref={primerCampo}
                type="text"
                placeholder="Transportes Río Itaya"
                value={datos.empresa}
                onChange={(e) => cambiar('empresa', e.target.value)}
                aria-invalid={Boolean(errores.empresa)}
              />
              {errores.empresa && <p className="campo__error">{errores.empresa}</p>}
            </div>

            <div className="campo">
              <label htmlFor="embarcacion">Embarcación</label>
              <input
                id="embarcacion"
                name="embarcacion"
                type="text"
                placeholder="Don José II"
                value={datos.embarcacion}
                onChange={(e) => cambiar('embarcacion', e.target.value)}
              />
            </div>
          </div>

          <div className="formulario__fila">
            <div className="campo">
              <label htmlFor="destino">Destino *</label>
              <input
                id="destino"
                name="destino"
                type="text"
                list="destinos-sugeridos"
                placeholder="Nauta"
                value={datos.destino}
                onChange={(e) => cambiar('destino', e.target.value)}
                aria-invalid={Boolean(errores.destino)}
              />
              <datalist id="destinos-sugeridos">
                {destinos.map((destino) => (
                  <option key={destino} value={destino} />
                ))}
              </datalist>
              {errores.destino && <p className="campo__error">{errores.destino}</p>}
            </div>

            <div className="campo">
              <label htmlFor="puerto">Puerto *</label>
              <input
                id="puerto"
                name="puerto"
                type="text"
                list="puertos-sugeridos"
                placeholder="Puerto Productores"
                value={datos.puerto}
                onChange={(e) => cambiar('puerto', e.target.value)}
                aria-invalid={Boolean(errores.puerto)}
              />
              <datalist id="puertos-sugeridos">
                <option value="Puerto Henry" />
                <option value="Puerto Masusa" />
                <option value="Puerto Productores" />
                <option value="Puerto Bellavista Nanay" />
              </datalist>
              {errores.puerto && <p className="campo__error">{errores.puerto}</p>}
            </div>
          </div>

          <div className="formulario__fila">
            <div className="campo">
              <label htmlFor="tipo">Tipo de embarcación *</label>
              <select
                id="tipo"
                name="tipo"
                value={datos.tipo}
                onChange={(e) => cambiar('tipo', e.target.value)}
                aria-invalid={Boolean(errores.tipo)}
              >
                {TIPOS.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {TIPO_INFO[tipo].etiqueta}
                  </option>
                ))}
              </select>
              {errores.tipo && <p className="campo__error">{errores.tipo}</p>}
            </div>

            <div className="campo">
              <label htmlFor="fechaHora">Fecha y hora de salida *</label>
              <input
                id="fechaHora"
                name="fechaHora"
                type="datetime-local"
                min={esEdicion ? undefined : ahoraLocalISO()}
                value={datos.fechaHora}
                onChange={(e) => cambiar('fechaHora', e.target.value)}
                aria-invalid={Boolean(errores.fechaHora)}
              />
              {errores.fechaHora && <p className="campo__error">{errores.fechaHora}</p>}
            </div>
          </div>

          <div className="formulario__fila formulario__fila--tres">
            <div className="campo">
              <label htmlFor="precio">Precio (S/) *</label>
              <input
                id="precio"
                name="precio"
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                placeholder="20"
                value={datos.precio}
                onChange={(e) => cambiar('precio', e.target.value)}
                aria-invalid={Boolean(errores.precio)}
              />
              {errores.precio && <p className="campo__error">{errores.precio}</p>}
            </div>

            <div className="campo">
              <label htmlFor="duracionHoras">Duración (horas)</label>
              <input
                id="duracionHoras"
                name="duracionHoras"
                type="number"
                min="0.5"
                step="0.5"
                inputMode="decimal"
                placeholder="2"
                value={datos.duracionHoras}
                onChange={(e) => cambiar('duracionHoras', e.target.value)}
                aria-invalid={Boolean(errores.duracionHoras)}
              />
              {errores.duracionHoras && (
                <p className="campo__error">{errores.duracionHoras}</p>
              )}
            </div>

            <div className="campo">
              <label htmlFor="cupos">Cupos</label>
              <input
                id="cupos"
                name="cupos"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                placeholder="30"
                value={datos.cupos}
                onChange={(e) => cambiar('cupos', e.target.value)}
                aria-invalid={Boolean(errores.cupos)}
              />
              {errores.cupos && <p className="campo__error">{errores.cupos}</p>}
            </div>
          </div>

          {(errorServidor || errores._general) && (
            <p className="formulario__error-general" role="alert">
              {errorServidor || errores._general}
            </p>
          )}

          <div className="formulario__acciones">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={onCerrar}
              disabled={enviando}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn--primario" disabled={enviando}>
              {enviando ? 'Guardando…' : esEdicion ? 'Guardar cambios' : 'Registrar salida'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
