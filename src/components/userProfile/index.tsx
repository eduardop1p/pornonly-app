'use client';

import Image from 'next/image';
import { ReactNode, useState } from 'react';

import { Container } from './styled';

interface Props {
  children: ReactNode;
}

export default function UserProfile({ children }: Props) {
  const [showAddPhotoProfile, setShowAddPhotoProfile] = useState(false);

  return (
    <Container>
      <div className="user-avatar" onClick={() => setShowAddPhotoProfile(true)}>
        {children}
      </div>
      <div
        className="profile-container"
        data-show-add-photo-profile={showAddPhotoProfile}
        onClick={() => setShowAddPhotoProfile(false)}
      >
        <div className="profile" onClick={event => event.stopPropagation()}>
          <h1>Perfil</h1>
          <Image
            src="/assets/imgs/no-photo.png"
            alt="no-photo"
            width={172}
            height={172}
          />
          <span>Gerenciar foto de perfil</span>
          <div className="btns-profile">
            <button type="button" className="profile-update">
              Atualizar
            </button>
            <button type="button" className="profile-delete">
              Deletar
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}
