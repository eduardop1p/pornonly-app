/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';

import { Container } from './styled';
import { ResultsCommentsType } from '@/app/pin/[pinid]/page';
import UserPinAndComments from './userPinAndComments';

export default function Comments({
  midiaId,
  results,
  token,
  isAuth,
  userId,
}: {
  midiaId: string;
  token: string;
  isAuth: boolean;
  results: ResultsCommentsType[];
  userId: any;
}) {
  const [showComments, setShowComments] = useState(true);
  const [pinInfoElement, setPinInfoElement] = useState(
    document.body.querySelector('#pin-info-user')
  );
  const [pinContainer, setPinContainer] = useState(
    document.body.querySelector('#id-pin-default-container')
  );
  const [initialRender, setInitialRender] = useState(true);

  const [noHeight, setNoHeight] = useState(185);

  useEffect(() => {
    if (initialRender) {
      if (!pinInfoElement || !pinContainer) {
        setPinInfoElement(document.body.querySelector('#pin-info-user'));
        setPinContainer(
          document.body.querySelector('#id-pin-default-container')
        );
      }
      if (pinInfoElement && pinContainer) {
        const newNoHeight =
          pinContainer.clientHeight - (noHeight + pinInfoElement.clientHeight);
        setNoHeight(newNoHeight);
        setInitialRender(false);
      }
    }
  }, [pinInfoElement, pinContainer, noHeight, initialRender]);

  return (
    <Container $showComments={showComments}>
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
        data-show-comments={showComments}
        style={{ height: `${noHeight}px` }}
      >
        {results.map(comment => (
          <div key={comment._id}>
            <UserPinAndComments
              comment={comment}
              token={token}
              isAuth={isAuth}
              userId={userId}
            />
          </div>
        ))}
      </div>
    </Container>
  );
}
