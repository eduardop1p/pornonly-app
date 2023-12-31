'use client';

import Image from 'next/image';
import { ChangeEvent, ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { get } from 'lodash';

import { Container } from './styled';
import Loading from '../form/loading';
import useGlobalError from '@/utils/useGlobalError';
import { GlobalErrorComponent } from '../form/globalErrorComponent';
import { GlobalSuccessComponent } from '../form/globalSuccessComponent';
import useGlobalSuccess from '@/utils/useGlobalSuccess';
import { ProfilePhotoType } from '../masonry/userPin';

interface Props {
  children: ReactNode;
  token: string;
  photo: {
    profilePhoto: ProfilePhotoType[];
    username: string;
  };
}

export default function UserProfile({ children, token, photo }: Props) {
  const router = useRouter();
  const { profilePhoto, username } = photo;
  const [isLoading, setIsLoading] = useState(false);
  const [showAddPhotoProfile, setShowAddPhotoProfile] = useState(false);
  const [filePhoto, setFilePhoto] = useState<{
    file: any;
    src: string;
  }>({
    file: profilePhoto.length ? profilePhoto[0] : null,
    src: profilePhoto.length ? profilePhoto[0].url : '',
  });
  const { handleError, msgError } = useGlobalError();
  const { handleSuccess, msgSuccess } = useGlobalSuccess();

  const hableUploadUserPhoto = async () => {
    if (!filePhoto.file) return;
    if (get(filePhoto.file, '_id', false)) {
      handleError('Altere a foto primeiro');
      return;
    }

    const formData = new FormData();
    formData.append('photo', filePhoto.file);

    try {
      setIsLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/profile-photo`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      const jsonRes = await res.json();
      if (!res.ok) {
        handleError(jsonRes.error as string);
        return;
      }
      handleSuccess('Foto de perfil atualizada');
      setFilePhoto({
        file: jsonRes.profilePhoto,
        src: jsonRes.profilePhoto.url,
      });
      router.refresh();
    } catch (err) {
      handleError('Erro interno no servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const hableDeleteUserPhoto = async () => {
    if (!filePhoto.file) return;

    try {
      setIsLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/profile-photo`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const jsonRes = await res.json();
      if (!res.ok) {
        handleError(jsonRes.error as string);
        return;
      }
      handleSuccess('Foto de perfil excluida');
      setFilePhoto({
        file: null,
        src: '',
      });
      router.refresh();
    } catch (err) {
      handleError('Erro interno no servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeAddPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files == null) return;
    const file = event.target.files[0];
    const src = URL.createObjectURL(file);
    setFilePhoto({
      file,
      src,
    });
  };

  useEffect(() => {
    // este elemento não existe neste component
    const userSettings = document.querySelector(
      '#id-user-settings'
    ) as HTMLDivElement;
    if (userSettings) userSettings.onclick = () => setShowAddPhotoProfile(true);
  }, []);

  return (
    <Container>
      {isLoading && <Loading />}
      <GlobalErrorComponent errorMsg={msgError} />
      <GlobalSuccessComponent successMsg={msgSuccess} />

      <div
        className="user-children"
        onClick={() => setShowAddPhotoProfile(true)}
      >
        {children}
      </div>
      <div
        className="profile-container"
        data-show-add-photo-profile={showAddPhotoProfile}
        onClick={() => setShowAddPhotoProfile(false)}
      >
        <div className="profile" onClick={event => event.stopPropagation()}>
          <h1>Foto de perfil</h1>
          <div className="photo">
            <label htmlFor="add-photo">
              <input
                type="file"
                name="add-photo"
                id="add-photo"
                onChange={event => handleChangeAddPhoto(event)}
                onClick={event => (event.currentTarget.value = '')}
                accept="image/*"
                multiple={false}
              />
            </label>
            {filePhoto.file ? (
              <Image
                priority
                src={filePhoto.src}
                alt={username}
                fill
                sizes="100%"
              />
            ) : (
              <Image
                src="/assets/imgs/no-photo.png"
                alt="no-photo"
                fill
                priority
                sizes="100%"
              />
            )}
          </div>
          <span>Clique na foto pra trocar</span>
          <div className="btns-profile">
            <button
              type="button"
              className="profile-update"
              onClick={hableUploadUserPhoto}
            >
              Atualizar
            </button>
            <button
              type="button"
              className="profile-delete"
              onClick={hableDeleteUserPhoto}
            >
              Deletar
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}
