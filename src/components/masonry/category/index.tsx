import {
  useState,
  useRef,
  MutableRefObject,
  Dispatch,
  SetStateAction,
} from 'react';

import { Container } from './styled';

import { MidiaResultsType } from '@/app/page';

export default function Category({
  setStResults,
  midiaType,
}: {
  setStResults: Dispatch<SetStateAction<MidiaResultsType[]>>;
  midiaType: MutableRefObject<'img' | 'gif' | 'video' | ''>;
}) {
  const [showCategory, setShowCategory] = useState(false);

  const refBtnCategory = useRef<HTMLButtonElement | null>(null);

  const handleAddAnimationClick = () => {
    refBtnCategory.current?.classList.add('click');
    setTimeout(() => {
      refBtnCategory.current?.classList.remove('click');
    }, 300);
  };

  const handleFetchItemsHomeCategory = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/midia/get-all?midiaType=${midiaType.current}&order=popular&page=1`,
        {
          method: 'GET',
          cache: 'no-cache',
        }
      );

      const data = await res.json();
      const results = data.midia.results as MidiaResultsType[];
      setStResults(results);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container
      data-category-active={showCategory}
      // onBlur={() => {
      //   if (!showCategory) return;
      //   setShowCategory(false);

      //   handleAddAnimationClick();
      // }}
      tabIndex={1}
      onClick={() => {
        setShowCategory(!showCategory);
        handleAddAnimationClick();
      }}
    >
      <button
        type="button"
        ref={refBtnCategory}
        data-category-active={showCategory}
      >
        <svg
          height="20"
          width="20"
          viewBox="0 0 24 24"
          aria-hidden="true"
          aria-label=""
          role="img"
        >
          <path d="M9 19.5a1.75 1.75 0 1 1 .001-3.501A1.75 1.75 0 0 1 9 19.5M22.25 16h-8.321c-.724-2.034-2.646-3.5-4.929-3.5S4.795 13.966 4.071 16H1.75a1.75 1.75 0 0 0 0 3.5h2.321C4.795 21.534 6.717 23 9 23s4.205-1.466 4.929-3.5h8.321a1.75 1.75 0 0 0 0-3.5M15 4.5a1.75 1.75 0 1 1-.001 3.501A1.75 1.75 0 0 1 15 4.5M1.75 8h8.321c.724 2.034 2.646 3.5 4.929 3.5s4.205-1.466 4.929-3.5h2.321a1.75 1.75 0 0 0 0-3.5h-2.321C19.205 2.466 17.283 1 15 1s-4.205 1.466-4.929 3.5H1.75a1.75 1.75 0 0 0 0 3.5"></path>
        </svg>
      </button>
      <div className="categories" onClick={event => event.stopPropagation()}>
        <button
          type="button"
          onClick={() => {
            midiaType.current = 'img';
            handleFetchItemsHomeCategory();
          }}
        >
          Imagens
        </button>
        <button type="button">Gifs</button>
        <button type="button">Videos</button>
      </div>
    </Container>
  );
}
