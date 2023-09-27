/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState, ReactNode } from 'react';

import { Container } from './styled';
import { ResultsCommentsType } from '@/app/pin/[pinid]/page';
import UserPinAndComments from './userPinAndComments';
import AddComments from '@/components/pin/comments/addComments';
import Loading from '@/components/form/loading';
import { GlobalError } from '@/components/form/globalError';
import { GlobalSuccess } from '@/components/form/globalSuccess';
import useGlobalErrorTime from '@/utils/useGlobalErrorTime';
import useGlobalSuccessTime from '@/utils/useGlobalSuccessTime';

export default function Comments({
  midiaId,
  resultsComments,
  token,
  isAuth,
  userId,
  children,
  allCommentsInPin,
}: {
  midiaId: string;
  token: string;
  isAuth: boolean;
  resultsComments: ResultsCommentsType[];
  userId: any;
  children: ReactNode;
  allCommentsInPin: number;
}) {
  const [stResultsComments, setStResultsComments] = useState(resultsComments);
  const [showComments, setShowComments] = useState(true);
  const [pinInfoElement, setPinInfoElement] = useState(
    document.body.querySelector('#pin-info-user')
  );
  const [pinContainer, setPinContainer] = useState(
    document.body.querySelector('#id-pin-default-container')
  );
  const [initialRender, setInitialRender] = useState(true);
  const [containerHeight, setContainerHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { handleServerSuccess, msgGlobalSuccess, showGlobalSuccess } =
    useGlobalSuccessTime();
  const { handleServerError, msgGlobalError, showGlobalError } =
    useGlobalErrorTime();

  useEffect(() => {
    if (initialRender) {
      if (!pinInfoElement || !pinContainer) {
        setPinInfoElement(document.body.querySelector('#pin-info-user'));
        setPinContainer(
          document.body.querySelector('#id-pin-default-container')
        );
      }
      if (pinInfoElement && pinContainer) {
        const dch = pinInfoElement.clientHeight + 67;
        setContainerHeight(pinContainer.clientHeight - dch);
        setInitialRender(false);
      }
    }
  }, [pinInfoElement, pinContainer, containerHeight, initialRender]);

  return (
    <Container
      $showComments={showComments}
      style={{ height: `${containerHeight}px` }}
    >
      {isLoading && <Loading />}
      <GlobalSuccess
        successMsg={msgGlobalSuccess}
        showSuccess={showGlobalSuccess}
      />
      <GlobalError errorMsg={msgGlobalError} showError={showGlobalError} />
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
      <div className="comments-and-users" data-show-comments={showComments}>
        {allCommentsInPin ? (
          stResultsComments.map((comment, index) => (
            <div key={comment._id}>
              <UserPinAndComments
                comment={comment}
                token={token}
                isAuth={isAuth}
                userId={userId}
                setStResultsComments={setStResultsComments}
                handleServerError={handleServerError}
                handleServerSuccess={handleServerSuccess}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                parentCommentIndex={index}
              />
            </div>
          ))
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
      <div className="add-comments">
        <h3 className="comments-count">
          {allCommentsInPin === 1
            ? `${allCommentsInPin} comentário`
            : `${allCommentsInPin} comentários`}
        </h3>
        <AddComments
          token={token}
          isAuth={isAuth}
          midiaId={midiaId}
          setStResultsComments={setStResultsComments}
        >
          {children}
        </AddComments>
      </div>
    </Container>
  );
}
