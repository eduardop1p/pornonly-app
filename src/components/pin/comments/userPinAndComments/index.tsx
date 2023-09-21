'use client';

import Image from 'next/image';
import Link from 'next/link';
import { format } from 'timeago.js';
import jwt from 'jsonwebtoken';

import { Container } from './styled';
import { UserIdResultsType } from '@/components/masonry/userPin';
import { ResultsCommentsType } from '@/app/pin/[pinid]/page';
import dateCommentsTranslate from '@/config/dateCommentsTranslate';

interface Props {
  token?: string;
  isAuth?: boolean;
  width: number;
  height: number;
  comment?: ResultsCommentsType;
}

export default function UserPinAndComments({
  token,
  isAuth,
  username,
  profilePhoto,
  midia,
  width,
  height,
  comment,
}: UserIdResultsType & Props) {
  const user: any = jwt.decode(token as string);

  return (
    <Container $comment={comment}>
      <Link href={`/${username}`} className="pin-user-profile">
        {profilePhoto.length ? (
          <Image
            src={profilePhoto[0].url}
            alt={username}
            priority
            width={width}
            height={height}
          />
        ) : (
          <span style={{ width, height }}>
            {username?.at(0)?.toUpperCase()}
          </span>
        )}
      </Link>
      <div className="pin-info-and-comment-user">
        <div>
          <h4>
            <Link href={`/${username}`}>{username}</Link>
          </h4>
          {comment && <span className="comment">{comment.comment}</span>}
        </div>

        {!comment && typeof midia !== 'undefined' ? (
          <span className="publishs-count">
            {midia.length == 1
              ? `${midia.length} publicação`
              : `${midia.length} publicações`}
          </span>
        ) : (
          <div
            className="createin-comment"
            style={{
              marginTop:
                isAuth && user._id === comment?.userId._id ? '2px' : '5px',
            }}
          >
            <span>
              {dateCommentsTranslate(
                format(comment?.createIn as string, 'pt_BR')
              )}
            </span>
            {isAuth && user._id === comment?.userId._id && (
              <button type="button">
                <svg
                  height="12"
                  width="12"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  aria-label=""
                  role="img"
                >
                  <path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3M3 9c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm18 0c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"></path>
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </Container>
  );
}
