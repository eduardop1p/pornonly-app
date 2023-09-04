import Image from 'next/image';

import { Container } from './styled';

export interface UserIdResultsType {
  _id: string;
  profilePhoto: {
    url: string;
    _id: string;
  }[];
  username: string;
}

export default function UserPin({ username, profilePhoto }: UserIdResultsType) {
  return (
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
  );
}
