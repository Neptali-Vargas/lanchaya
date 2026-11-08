import { useEffect } from 'react';

export default function Aviso({ aviso, onCerrar }) {
  useEffect(() => {
    if (!aviso) return undefined;

    const temporizador = setTimeout(onCerrar, 4000);
    return () => clearTimeout(temporizador);
  }, [aviso, onCerrar]);

  if (!aviso) return null;

  return (
    <div className={`aviso aviso--${aviso.tipo}`} role="status" aria-live="polite">
      <p>{aviso.texto}</p>
      <button type="button" className="aviso__cerrar" onClick={onCerrar}>
        Cerrar
      </button>
    </div>
  );
}
