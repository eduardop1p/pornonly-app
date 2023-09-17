'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Container } from './styled';
import { UserIdResultsType } from '@/components/masonry/userPin';

interface Props {
  width: number;
  height: number;
  textComment?: string;
}

export default function UserPin({
  username,
  profilePhoto,
  midia,
  width,
  height,
  textComment,
}: UserIdResultsType & Props) {
  return (
    <Container $textComment={textComment}>
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
          {textComment && <span className="comment">{textComment}</span>}
        </div>

        {!textComment && typeof midia !== 'undefined' && (
          <span className="publishs-count">
            {midia.length == 1
              ? `${midia.length} publicação`
              : `${midia.length} publicações`}
          </span>
        )}
      </div>
    </Container>
  );
}
