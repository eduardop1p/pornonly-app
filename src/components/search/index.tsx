/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, FormEvent, ChangeEvent, useEffect, useRef } from 'react';
import {
  useRouter,
  useSearchParams,
  usePathname,
  useParams,
} from 'next/navigation';
import { get } from 'lodash';
import { redirect } from 'next/navigation';

import { Container } from './styled';
import Clear from './clear';

export default function Search() {
  const router = useRouter();
  const pathName = usePathname();
  const search_query = useSearchParams().get('search_query') as string;
  const params = useParams();

  const [focusSearch, setFocusSearch] = useState(false);
  const [titlesSuggestion, setTitleSugestions] = useState<
    { _id: string; title: string }[]
  >([]);
  const [searchValueInput, setSearchValueInput] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const main: HTMLElement | null = document.body.querySelector('main');
    if (focusSearch) {
      // window.test([]);
      main?.setAttribute('search-in-focus', 'true');
    }
    if (!focusSearch) {
      main?.setAttribute('search-in-focus', 'false');
    }
  }, [focusSearch]);

  const handleClickClear = () => {
    setSearchValueInput('');
  };

  const handleSubmitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFocusSearch(false);
    inputRef.current?.blur();
    if (!searchValueInput) return;

    router.push(`/search?search_query=${searchValueInput}`);
  };

  const handleChangeSearch = async (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchValueInput(value);
    if (!value) return;

    try {
      const res = await fetch(
        // eslint-disable-next-line
        `${process.env.NEXT_PUBLIC_URL_API
        }/midia/get-all-midia-titles?search_query=${value}`,
        {
          method: 'GET',
          cache: 'no-cache',
        }
      );
      if (!res.ok) return;
      const data = await res.json();
      setTitleSugestions(data.titlesMidia);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container
      data-focus-search={focusSearch}
      onFocus={() => setFocusSearch(true)}
      onBlur={() => setFocusSearch(false)}
      tabIndex={1}
      onSubmit={handleSubmitSearch}
      id="form-search"
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
        value={searchValueInput}
        onChange={handleChangeSearch}
        ref={inputRef}
      />
      <Clear onClickCustom={handleClickClear} focusSearch={focusSearch} />
      <div
        className="titles-suggestions-container"
        data-show-suggestion={
          titlesSuggestion.length && focusSearch && searchValueInput
            ? true
            : false
        }
      >
        {titlesSuggestion.map(value => (
          <div
            key={value._id}
            className="titles-suggestions"
            onClick={() => {
              setFocusSearch(false);
              setSearchValueInput(value.title);
              router.push(`/search?search_query=${value.title}`);
            }}
          >
            <svg viewBox="0 0 24 24" aria-label="Ícone de pesquisa" role="img">
              <path d="M10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6m13.12 2.88-4.26-4.26A9.842 9.842 0 0 0 20 10c0-5.52-4.48-10-10-10S0 4.48 0 10s4.48 10 10 10c1.67 0 3.24-.41 4.62-1.14l4.26 4.26a3 3 0 0 0 4.24 0 3 3 0 0 0 0-4.24"></path>
            </svg>
            <span>{value.title}</span>
          </div>
        ))}
      </div>
    </Container>
  );
}
