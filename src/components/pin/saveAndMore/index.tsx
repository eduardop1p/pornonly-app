'use client';

import { useState, useRef, FocusEvent } from 'react';

import { Container } from './styled';

export default function SaveAndMore({ url }: { url: string }) {
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const refMoreOptions = useRef<HTMLDivElement | null>(null);
  const fileName = url.split('/').pop() as string;

  const handleOnBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!refMoreOptions.current?.contains(event.relatedTarget)) {
      setShowMoreOptions(false);
    }
  };

  const handleDawnload = () => {
    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.href = url;
    link.download = fileName;
    link.click(); // link.click() vai simular um click no meu link
    document.body.removeChild(link);
  };

  return (
    <Container>
      <div
        className="more-options"
        onClick={() => setShowMoreOptions(!showMoreOptions)}
        onBlur={event => handleOnBlur(event)}
        tabIndex={0}
        ref={refMoreOptions}
      >
        <button
          type="button"
          className="btn-more-options"
          data-btn-more-options-active={showMoreOptions}
        >
          <svg
            height="20"
            width="20"
            viewBox="0 0 24 24"
            aria-hidden="true"
            aria-label=""
            role="img"
          >
            <path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3M3 9c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm18 0c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"></path>
          </svg>
        </button>
        <div
          className="container-more-options"
          data-more-options-active={showMoreOptions}
          onClick={event => event.stopPropagation()}
        >
          <button onClick={handleDawnload}>Baixar pin</button>
          <button type="button">Excluir</button>
          <button type="button">Remover dos salvos</button>
        </div>
      </div>
      <button type="button" className="btn-pin-save">
        Salvar
      </button>
    </Container>
  );
}
