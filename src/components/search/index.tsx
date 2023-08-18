'use client';

import { useState, useRef, FormEvent } from 'react';

import { Container } from './styled';
import Clear from './clear';

export default function Search() {
  const [focusSearch, setFocusSearch] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  const handleClickClear = () => {
    if (searchRef.current === null) return;
    searchRef.current.value = '';
  };

  const handleSubmitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const searchValue = searchRef.current?.value;
    console.log(searchValue);
  };

  return (
    <Container
      data-focus-search={focusSearch}
      onFocus={() => setFocusSearch(true)}
      onBlur={() => setFocusSearch(false)}
      tabIndex={1}
      onSubmit={handleSubmitSearch}
    >
      <svg
        height="16"
        width="16"
        viewBox="0 0 24 24"
        aria-label="Ícone de pesquisa"
        role="img"
      >
        <path d="M10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6m13.12 2.88-4.26-4.26A9.842 9.842 0 0 0 20 10c0-5.52-4.48-10-10-10S0 4.48 0 10s4.48 10 10 10c1.67 0 3.24-.41 4.62-1.14l4.26 4.26a3 3 0 0 0 4.24 0 3 3 0 0 0 0-4.24"></path>
      </svg>
      <input
        type="text"
        name="search"
        placeholder="Pesquisar"
        ref={searchRef}
      />
      <Clear onClickCustom={handleClickClear} focusSearch={focusSearch} />
    </Container>
  );
}
