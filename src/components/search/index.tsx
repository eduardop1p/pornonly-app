/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import {
  useState,
  FormEvent,
  ChangeEvent,
  useEffect,
  useRef,
  useCallback,
  MouseEvent,
} from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';

import { Container } from './styled';
import Clear from './clear';

export default function Search() {
  const router = useRouter();
  const pathName = usePathname();

  const [focusSearch, setFocusSearch] = useState(false);
  const [titlesSuggestion, setTitleSugestions] = useState<
    { _id: string; title: string }[]
  >([]);
  const [searchValueInput, setSearchValueInput] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);
  const refFormContainer = useRef<HTMLFormElement | null>(null);
  let selectedIndex = useRef(-1);

  useEffect(() => {
    const main: HTMLElement | null = document.body.querySelector('main');
    if (focusSearch) {
      main?.setAttribute('search-in-focus', 'true');
    }
    if (!focusSearch) {
      main?.setAttribute('search-in-focus', 'false');
    }
  }, [focusSearch]);

  useEffect(() => {
    // const handleKeyDownSearch = (event: KeyboardEvent) => {
    //   const titlesSugestions = document.querySelectorAll(
    //     '.titles-suggestions'
    //   ) as NodeListOf<HTMLInputElement>;
    //   console.log(focusIndexTiSug.current);

    //   if (event.code == 'ArrowDown') {
    //     refFormContainer.current?.focus();
    //     titlesSugestions[focusIndexTiSug.current].setAttribute(
    //       'data-titles-suggestions-focus',
    //       'true'
    //     );
    //     focusIndexTiSug.current += 1;
    //   }
    //   if (event.code == 'ArrowUp') {
    //     refFormContainer.current?.focus();
    //     focusIndexTiSug.current -= 1;
    //     titlesSugestions[focusIndexTiSug.current].removeAttribute(
    //       'data-titles-suggestions-focus'
    //     );
    //   }
    //   // if(event.code == 'Enter')
    // };
    const handleKeyDownSearch = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const suggestionList = document.querySelector(
          '.titles-suggestions-container'
        ) as HTMLDivElement;
        const suggestionsCount = suggestionList.children.length;

        if (
          event.key === 'ArrowDown' &&
          selectedIndex.current < suggestionsCount - 1
        ) {
          selectedIndex.current++;
        } else if (event.key === 'ArrowUp' && selectedIndex.current > 0) {
          selectedIndex.current--;
        }

        // Remove a classe de seleção das sugestões
        for (let i = 0; i < suggestionsCount; i++) {
          suggestionList.children[i].classList.remove('selected');
        }
        if (selectedIndex.current >= 0) {
          suggestionList.children[selectedIndex.current].classList.add(
            'selected'
          );
          setSearchValueInput(
            suggestionList.children[selectedIndex.current].textContent as string
          );
        }
      }
    };
    window.addEventListener('keydown', handleKeyDownSearch);
    return () => window.removeEventListener('keydown', handleKeyDownSearch);
  }, []);

  useEffect(() => {
    if (pathName != '/search') setSearchValueInput('');
  }, [pathName]);

  const handleClickClear = () => {
    setSearchValueInput('');
  };

  const handleSubmitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchValueInput) return;
    setFocusSearch(false);
    inputRef.current?.blur();

    handleRemoveSelected();
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
      setTitleSugestions(data.midiaTitles);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickTiSu = (value: { _id: string; title: string }) => {
    setSearchValueInput(value.title);
    handleRemoveSelected();
    setFocusSearch(false);
    router.push(`/search?search_query=${value.title}`);
  };

  const handleRemoveSelected = () => {
    const suggestionList = document.querySelectorAll(
      '.titles-suggestions'
    ) as NodeListOf<HTMLDivElement>;
    suggestionList.forEach(el => el.classList.remove('selected'));
    selectedIndex.current = -1;
  };

  return (
    <Container
      data-focus-search={focusSearch}
      onFocus={() => setFocusSearch(true)}
      onBlur={() => setFocusSearch(false)}
      tabIndex={1}
      onSubmit={handleSubmitSearch}
      ref={refFormContainer}
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
            onClick={() => handleClickTiSu(value)}
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
