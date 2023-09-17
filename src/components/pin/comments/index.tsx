'use client';

import { useState } from 'react';

import { Container } from './styled';
import { ResultsCommentsType } from '@/app/pin/[pinid]/page';
import UserPin from '../userPin';

export default function Comments({
  midiaId,
  results,
}: {
  midiaId: string;
  results: ResultsCommentsType[];
}) {
  const [showComments, setShowComments] = useState(true);

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
      <div className="comments-and-users" data-show-comments={showComments}>
        {results.map(comment => (
          <div key={comment._id}>
            <UserPin
              username={comment.userId.username}
              profilePhoto={comment.userId.profilePhoto}
              width={32}
              height={32}
              textComment={comment.comment}
            />
          </div>
        ))}
      </div>
    </Container>
  );
}
