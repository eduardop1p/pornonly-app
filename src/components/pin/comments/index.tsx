/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { useState, ReactNode, useRef, useEffect } from 'react';
import type { Dispatch, SetStateAction, MutableRefObject } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Container, LikeContainer } from './styled';
import { ResultsCommentsType, CommentsType } from '@/app/pin/[pinid]/page';
import UserPinAndComments from './userPinAndComments';
import AddComments from '@/components/pin/comments/addComments';
import Loading from '@/components/form/loading';
import { GlobalErrorComponent } from '@/components/form/globalErrorComponent';
import useGlobalError from '@/utils/useGlobalError';
import { GlobalSuccessComponent } from '@/components/form/globalSuccessComponent';
import useGlobalSuccess from '@/utils/useGlobalSuccess';
import { MidiaResultsType } from '@/app/page';
import { useRouter, usePathname } from 'next/navigation';
import revalidatePin from '@/services/revalidatePin';
// import { default as LoadingHeight } from '../loading';

export default function Comments({
  midiaId,
  resultsComments,
  token,
  isAuth,
  userId,
  children,
  dataPin,
  totalComments,
}: {
  midiaId: string;
  token: string;
  isAuth: boolean;
  resultsComments: ResultsCommentsType[];
  userId?: string;
  children: ReactNode;
  dataPin: MidiaResultsType;
  totalComments: number;
}) {
  const router = useRouter();
  const pathName = usePathname();

  const [stResultsComments, setStResultsComments] = useState(resultsComments);
  const [showComments, setShowComments] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [stDataPin, setStDataPin] = useState(dataPin);
  const [isLikePin, setIsLikePin] = useState(
    stDataPin.likes.users.includes(userId as string)
  );
  const [allCommentsInPin, setAllCommentsInPin] = useState(totalComments);
  const [hasMore, setHasMore] = useState(true);
  const { handleSuccess, msgSuccess } = useGlobalSuccess();
  const { handleError, msgError } = useGlobalError();
  let currentPage = useRef(1);
  const refCommentsAndUsers = useRef<HTMLDivElement | null>(null);

  const newDataPin = dataPin;

  useEffect(() => {
    const containerCommentsHeight = document.querySelector(
      '#container-comments'
    )?.clientHeight as number;
    const pinUserInfoHeight = document.querySelector('#pin-info-user')
      ?.clientHeight as number;

    const dinamicHeight = pinUserInfoHeight + 216;
    if (refCommentsAndUsers.current) {
      // eslint-disable-next-line
      refCommentsAndUsers.current.style.height = `${containerCommentsHeight - dinamicHeight}px`;
    }
  }, []);

  const handleLikePin = async () => {
    if (!isAuth) {
      router.push(`/login?from=${pathName}`);
      return;
    }

    try {
      setIsLikePin(true);

      newDataPin.likes.likes += 1;
      newDataPin.likes.users.push(userId as string);
      setStDataPin(newDataPin);
      const res = await fetch(
        // eslint-disable-next-line
        `${process.env.NEXT_PUBLIC_URL_API}/midia/like-in-comment/${stDataPin._id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error('servererror');
      await revalidatePin();
      // router.refresh();
    } catch (err) {
      setIsLikePin(false);
      newDataPin.likes.likes -= 1;
      newDataPin.likes.users = newDataPin.likes.users.filter(
        value => value != userId
      );
      setStDataPin(newDataPin);
      handleError('Erro interno no servidor');
    }
  };

  const handleUnClickPin = async () => {
    if (!isAuth) {
      router.push(`/login?from=${pathName}`);
      return;
    }

    try {
      setIsLikePin(false);
      newDataPin.likes.likes -= 1;
      newDataPin.likes.users = newDataPin.likes.users.filter(
        value => value != userId
      );
      setStDataPin(newDataPin);
      const res = await fetch(
        // eslint-disable-next-line
        `${process.env.NEXT_PUBLIC_URL_API}/midia/unclick-in-comment/${stDataPin._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error('server error');
      await revalidatePin();
      // router.refresh();
    } catch (err) {
      setIsLikePin(true);
      newDataPin.likes.likes += 1;
      newDataPin.likes.users.push(userId as string);
      setStDataPin(newDataPin);
      handleError('Erro interno no servidor');
    }
  };

  return (
    <Container $showComments={showComments}>
      {isLoading && <Loading />}
      <GlobalSuccessComponent successMsg={msgSuccess} />
      <GlobalErrorComponent errorMsg={msgError} />
      <div className="container-comments-scrollab">
        <div className="title-and-icon">
          <h2>Comentários</h2>
          <button
            type="button"
            className="icon-container"
            onClick={() => setShowComments(!showComments)}
          >
            <svg
              height="18"
              width="18"
              viewBox="0 0 24 24"
              aria-hidden="true"
              aria-label=""
              role="img"
            >
              <path d="M12 19.5.66 8.29c-.88-.86-.88-2.27 0-3.14.88-.87 2.3-.87 3.18 0L12 13.21l8.16-8.06c.88-.87 2.3-.87 3.18 0 .88.87.88 2.28 0 3.14L12 19.5z"></path>
            </svg>
          </button>
        </div>
        <div
          className="comments-and-users"
          id="scroll-comments-and-users"
          data-show-comments={showComments}
          ref={refCommentsAndUsers}
        >
          {allCommentsInPin ? (
            <InfiniteScroll
              dataLength={allCommentsInPin}
              scrollThreshold={0.7}
              next={() =>
                useFetchItemsComments(
                  setHasMore,
                  currentPage,
                  setStResultsComments,
                  midiaId
                )
              }
              scrollableTarget="scroll-comments-and-users"
              hasMore={hasMore}
              loader={null}
              endMessage={
                <p
                  className="no-more-results"
                  style={{
                    textAlign: 'center',
                    fontSize: '15px',
                    color: 'var(--g-colorGray300)',
                    fontWeight: 400,
                    marginTop: '-8px',
                    marginBottom: '5px',
                  }}
                >{`Isso é tudo`}</p>
              }
              style={{ overflow: 'hidden' }}
            >
              {stResultsComments.map((comment, index) => (
                <div key={comment._id} className="container-comments">
                  <UserPinAndComments
                    comment={comment}
                    token={token}
                    isAuth={isAuth}
                    userId={userId}
                    setStResultsComments={setStResultsComments}
                    stResultsComments={stResultsComments}
                    handleError={handleError}
                    handleSuccess={handleSuccess}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    parentCommentIndex={index}
                    lastIndex={
                      stResultsComments.length == index + 1 &&
                      stResultsComments.length > 1
                    }
                    setAllCommentsInPin={setAllCommentsInPin}
                  />
                </div>
              ))}
            </InfiniteScroll>
          ) : (
            <div className="pin-no-comments">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width={80}
                height={80}
                viewBox="0 0 50 50"
              >
                <path d="M 25 4.0625 C 12.414063 4.0625 2.0625 12.925781 2.0625 24 C 2.0625 30.425781 5.625 36.09375 11 39.71875 C 10.992188 39.933594 11 40.265625 10.71875 41.3125 C 10.371094 42.605469 9.683594 44.4375 8.25 46.46875 L 7.21875 47.90625 L 9 47.9375 C 15.175781 47.964844 18.753906 43.90625 19.3125 43.25 C 21.136719 43.65625 23.035156 43.9375 25 43.9375 C 37.582031 43.9375 47.9375 35.074219 47.9375 24 C 47.9375 12.925781 37.582031 4.0625 25 4.0625 Z M 25 5.9375 C 36.714844 5.9375 46.0625 14.089844 46.0625 24 C 46.0625 33.910156 36.714844 42.0625 25 42.0625 C 22.996094 42.0625 21.050781 41.820313 19.21875 41.375 L 18.65625 41.25 L 18.28125 41.71875 C 18.28125 41.71875 15.390625 44.976563 10.78125 45.75 C 11.613281 44.257813 12.246094 42.871094 12.53125 41.8125 C 12.929688 40.332031 12.9375 39.3125 12.9375 39.3125 L 12.9375 38.8125 L 12.5 38.53125 C 7.273438 35.21875 3.9375 29.941406 3.9375 24 C 3.9375 14.089844 13.28125 5.9375 25 5.9375 Z"></path>
              </svg>
              <span>Não há comentários ainda</span>
            </div>
          )}
        </div>
      </div>
      <div className="add-comments">
        <div>
          <div className="commet-title-and-likes">
            <h3 className="comments-count">
              {!allCommentsInPin && 'Nenhum comentário'}
              {allCommentsInPin === 1 && `${allCommentsInPin} comentário`}
              {allCommentsInPin > 1 && `${allCommentsInPin} comentários`}
            </h3>
            <div>
              <span>{dataPin.likes.likes}</span>
              {isLikePin ? (
                <LikeContainer data-is-like={isLikePin}>
                  <button type="button" onClick={handleUnClickPin}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="yes-like"
                    >
                      <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                    </svg>
                  </button>
                </LikeContainer>
              ) : (
                <LikeContainer>
                  <button type="button" onClick={handleLikePin}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="no-like"
                    >
                      <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                    </svg>
                  </button>
                </LikeContainer>
              )}
            </div>
          </div>
          {/* {containerHeight && ( */}
          <AddComments
            token={token}
            isAuth={isAuth}
            midiaId={midiaId}
            setStResultsComments={setStResultsComments}
            setAllCommentsInPin={setAllCommentsInPin}
          >
            {children}
          </AddComments>
          {/* )} */}
        </div>
      </div>
    </Container>
  );
}

function useFetchItemsComments(
  setHasMore: Dispatch<SetStateAction<boolean>>,
  currentPage: MutableRefObject<number>,
  stResultsComments: Dispatch<SetStateAction<ResultsCommentsType[]>>,
  pinId: string
) {
  const fetchItems = async () => {
    try {
      currentPage.current += 1;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/comments/${pinId}?page=${currentPage.current}`,
        {
          method: 'GET',
          cache: 'no-cache',
        }
      );

      const data = (await res.json()) as CommentsType;
      const results = data.commentsMidia.results;
      if (!results.length) {
        setHasMore(false);
        return;
      }
      stResultsComments(state => [...state, ...results]);
    } catch (err) {
      console.error(err);
    }
  };

  return fetchItems();
}
