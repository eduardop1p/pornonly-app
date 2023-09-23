'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Container, ContainerLink } from './styled';

export interface UserIdResultsType {
  _id?: string;
  username: string;
  profilePhoto: {
    _id: string;
    url: string;
  }[];
  midia?: string[];
  saves?: string[];
}

export default function UserPin({
  username,
  profilePhoto,
  midia,
}: UserIdResultsType) {
  return !midia ? (
    <Container>
      {profilePhoto.length ? (
        <Image
          src={profilePhoto[0].url}
          alt={username}
          priority
          width={32}
          height={32}
        />
      ) : (
        <span>{username?.at(0)?.toUpperCase()}</span>
      )}
      <h4>{username}</h4>
    </Container>
  ) : (
    <Link
      href={`/${username}`}
      style={{ width: 'fit-content', display: 'inline-block' }}
    >
      <ContainerLink>
        {profilePhoto.length ? (
          <Image
            src={profilePhoto[0].url}
            alt={username}
            priority
            width={48}
            height={48}
          />
        ) : (
          <span>{username?.at(0)?.toUpperCase()}</span>
        )}
        <div>
          <h4>{username}</h4>
          <span className="publishs-count ">
            {midia.length === 1
              ? `${midia.length} publicação`
              : `${midia.length} publicações`}
          </span>
        </div>
      </ContainerLink>
    </Link>
  );
}
