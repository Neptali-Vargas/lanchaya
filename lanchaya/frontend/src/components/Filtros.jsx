import { TIPOS, TIPO_INFO } from '../constants.js';

export default function Filtros({ filtros, destinos, hayFiltros, onCambiar }) {
  function cambiar(campo, valor) {
    onCambiar((previos) => ({ ...previos, [campo]: valor }));
  }

  function limpiar() {
    onCambiar({ destino: '', fecha: '', tipo: '' });
  }

  return (
    <section className="filtros" aria-label="Filtros de salidas">
      <div className="filtros__campo">
        <label htmlFor="filtro-destino">Destino</label>
        <select
          id="filtro-destino"
          value={filtros.destino}
          onChange={(e) => cambiar('destino', e.target.value)}
        >
          <option value="">Todos los destinos</option>
          {destinos.map((destino) => (
            <option key={destino} value={destino}>
              {destino}
            </option>
          ))}
        </select>
      </div>

      <div className="filtros__campo">
        <label htmlFor="filtro-fecha">Fecha de salida</label>
        <input
          id="filtro-fecha"
          type="date"
          value={filtros.fecha}
          onChange={(e) => cambiar('fecha', e.target.value)}
        />
      </div>

      <div className="filtros__campo">
        <label htmlFor="filtro-tipo">Tipo</label>
        <select
          id="filtro-tipo"
          value={filtros.tipo}
          onChange={(e) => cambiar('tipo', e.target.value)}
        >
          <option value="">Todos los tipos</option>
          {TIPOS.map((tipo) => (
            <option key={tipo} value={tipo}>
              {TIPO_INFO[tipo].etiqueta}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className="btn btn--ghost filtros__limpiar"
        onClick={limpiar}
        disabled={!hayFiltros}
      >
        Limpiar filtros
      </button>
    </section>
  );
}
