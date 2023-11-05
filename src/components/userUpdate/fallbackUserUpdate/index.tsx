import type { Dispatch, SetStateAction } from 'react';

import { Container } from './styled';

export default function FallbackUserUpdate({
  setSendUserUpdate,
  setSuccessUserUpdate,
}: {
  setSendUserUpdate: Dispatch<SetStateAction<boolean>>;
  setSuccessUserUpdate: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Container onClick={() => setSendUserUpdate(state => !state)}>
      <div
        className="container-info"
        onClick={event => event.stopPropagation()}
      >
        <h2>Tem certeza?</h2>
        <p>
          Se continuar terar que fazer login novalmente na conta com os novos
          dados
        </p>
        <div>
          <button
            type="button"
            onClick={() => {
              setSuccessUserUpdate(true);
              setSendUserUpdate(false);
            }}
          >
            Sim
          </button>
          <button
            type="button"
            onClick={() => {
              setSendUserUpdate(false);
              setSuccessUserUpdate(false);
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </Container>
  );
}
