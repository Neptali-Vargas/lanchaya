import { TIPO_INFO, formatearFechaHora, nivelCupos } from '../constants.js';

export default function SalidaCard({ salida, onEditar, onEliminar }) {
  const tipo = TIPO_INFO[salida.tipo] ?? { etiqueta: salida.tipo };
  const nivel = nivelCupos(salida.cupos);

  return (
    <article className={`card card--${salida.tipo}`}>
      <div className="card__fila">
        <span className={`etiqueta etiqueta--${salida.tipo}`}>{tipo.etiqueta}</span>
        <span className={`cupos cupos--${nivel}`} title="Cupos disponibles">
          {salida.cupos} cupos
        </span>
      </div>

      <h3 className="card__destino">
        <svg
          className="card__flecha"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 12h15M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {salida.destino}
      </h3>

      <p className="card__empresa">
        {salida.empresa}
        {salida.embarcacion ? ` · ${salida.embarcacion}` : ''}
      </p>

      <dl className="card__datos">
        <div>
          <dt>Sale</dt>
          <dd>{formatearFechaHora(salida.fechaHora)}</dd>
        </div>
        <div>
          <dt>Puerto</dt>
          <dd>{salida.puerto}</dd>
        </div>
        {salida.duracionHoras != null && (
          <div>
            <dt>Duración</dt>
            <dd>{salida.duracionHoras} h</dd>
          </div>
        )}
      </dl>

      <div className="card__pie">
        <span className="precio">
          S/ {Number(salida.precio).toFixed(2)}
          <small> por pasajero</small>
        </span>

        <div className="card__acciones">
          <button
            type="button"
            className="btn btn--ghost btn--chico"
            onClick={() => onEditar(salida)}
          >
            Editar
          </button>
          <button
            type="button"
            className="btn btn--peligro btn--chico"
            onClick={() => onEliminar(salida)}
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}
