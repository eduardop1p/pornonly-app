'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { ReactNode, FormEvent, Dispatch, SetStateAction } from 'react';

import { Container } from './styled';
import Loading from '@/components/form/loading';
import { GlobalErrorComponent } from '@/components/form/globalErrorComponent';
import useGlobalError from '@/utils/useGlobalError';
import { GlobalSuccessComponent } from '@/components/form/globalSuccessComponent';
import useGlobalSuccess from '@/utils/useGlobalSuccess';
import { ResultsCommentsType } from '@/app/pin/[pinid]/page';

export default function AddComments({
  children,
  isAuth,
  token,
  midiaId,
  setStResultsComments,
  setAllCommentsInPin,
}: {
  children: ReactNode;
  token?: string;
  midiaId?: string;
  isAuth: boolean;
  setStResultsComments: Dispatch<SetStateAction<ResultsCommentsType[]>>;
  setAllCommentsInPin: Dispatch<SetStateAction<number>>;
}) {
  const router = useRouter();
  const pathName = usePathname();

  const [isLoading, setIsLoading] = useState(false);
  const [commentValue, setCommentValue] = useState('');
  const { handleSuccess, msgSuccess } = useGlobalSuccess();
  const { handleError, msgError } = useGlobalError();

  const handleAddCommentInPin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const commentsAndUsers = document.querySelector(
      '.comments-and-users'
    ) as HTMLDivElement;
    if (!commentValue || isLoading) return;
    if (!isAuth || !token) {
      router.push(`/login?from=${pathName}`);
      return;
    }
    if (commentValue.length > 100) {
      handleError('Comentário muito grande');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/comments/${midiaId}`,
        {
          method: 'POST',
          body: JSON.stringify({ comment: commentValue }),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const jsonData = await res.json();
      if (!res.ok) {
        handleError(jsonData.error as string);
        return;
      }
      handleSuccess('Comentário foi adcionado');
      setAllCommentsInPin(state => (state += 1));
      setStResultsComments(state => [jsonData, ...state]);
      setCommentValue('');
      commentsAndUsers.scrollTop = 0;
      // router.refresh();
    } catch (err) {
      // console.log(err);
      handleError('Erro interno no servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container onSubmit={handleAddCommentInPin}>
      {isLoading && <Loading />}
      <GlobalSuccessComponent successMsg={msgSuccess} />
      <GlobalErrorComponent errorMsg={msgError} />
      {children}
      <input
        name="comment"
        id="comment"
        placeholder="Adicionar comentário"
        style={{ marginLeft: isAuth ? '10px' : 0 }}
        maxLength={100}
        value={commentValue}
        onChange={event => setCommentValue(event.target.value)}
      />
      <button type="submit" className="send-comment">
        <svg
          height="18"
          width="18"
          viewBox="0 0 24 24"
          aria-hidden="true"
          aria-label=""
          role="img"
        >
          <path d="M.461 2.427.43 2.46a1.474 1.474 0 0 0-.282 1.68L3 10.5 16 12 3 13.5.147 19.86a1.474 1.474 0 0 0 .277 1.674l.041.042c.403.388 1.013.56 1.626.3l20.99-8.493c.185-.078.343-.184.472-.31l.034-.033c.686-.71.517-1.994-.507-2.423L2.09 2.123A1.52 1.52 0 0 0 1.496 2c-.398 0-.764.164-1.035.427z"></path>
        </svg>
      </button>
    </Container>
  );
}
