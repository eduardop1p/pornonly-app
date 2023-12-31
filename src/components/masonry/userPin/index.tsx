'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Container, ContainerLink } from './styled';

import VerifyIcon from '@/components/verify';

export interface UserIdResultsType {
  _id?: string;
  username: string;
  profilePhoto: ProfilePhotoType[];
  midia?: string[];
  saves?: string[];
  email?: string;
  isAdmin: boolean;
}

export interface ProfilePhotoType {
  _id: string;
  url: string;
}

export default function UserPin({
  username,
  profilePhoto,
  midia,
  isAdmin,
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
        <span style={{ width: '32px', height: '32px' }}>
          {username?.at(0)?.toUpperCase()}
        </span>
      )}
      <div className="container-username">
        <h4
          style={{ width: isAdmin ? 'calc(100% - 56px)' : 'calc(100% - 32px)' }}
        >
          {username}
        </h4>
        {isAdmin && (
          <VerifyIcon width={15} height={15} marginLeft="3px" marginTop="2px" />
        )}
      </div>
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
          <span style={{ width: '48px', height: '48px' }}>
            {username?.at(0)?.toUpperCase()}
          </span>
        )}
        <div>
          <h4>
            {username}
            {isAdmin && (
              <VerifyIcon
                width={15}
                height={15}
                marginLeft="3px"
                marginTop="2px"
              />
            )}
          </h4>
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
