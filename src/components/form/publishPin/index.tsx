/* eslint-disable prettier/prettier */
/* eslint-disable react/display-name */
'use client';

import {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
} from 'react';
import type { SetStateAction, Dispatch, MouseEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
import axios from 'axios';
import { get } from 'lodash';
import VideoSnapshot from 'video-snapshot';
import LinearProgress, {
  LinearProgressProps,
} from '@mui/material/LinearProgress';
import { Typography, Box } from '@mui/material';

import {
  Container,
  ContainerBntPublish,
  ContainerBtnPublishsCreated,
  ContainerPublishsCreated,
  ContainerCreatedPinsList,
  ContainerNewPin,
  ContainerFormNewPin,
  ContainerShowTags,
  ContainerSelectedTags,
} from './styled';

import ErrorMsg from '../errorMsg';
import { GlobalErrorComponent } from '../globalErrorComponent';
import useGlobalError from '@/utils/useGlobalError';
import { GlobalSuccessComponent } from '../globalSuccessComponent';
import useGlobalSuccess from '@/utils/useGlobalSuccess';
import Loading from '../loading';
import revalidatePin from '@/services/revalidatePin';
import WaitingPin from '@/components/masonry/waitingPin';

interface Props {
  token: string;
  isAdmin: boolean;
}

interface CreatePinsType {
  fileType: string;
  pinSrc: string;
  file: Blob | string;
  videoThumb: Blob | string;
  title: string;
  author: string;
  description: string;
  tags: string[];
}

// const ZodUserSchema = z.object({
//   title: z.string().trim(),
//   description: z.string().trim(),
//   tags: z.string().trim(),
//   // tags: z
//   //   .string()
//   //   .array()
//   //   .refine(val => {
//   //     return val.length >= 2 && val.length <= 2;
//   //   }, 'Você tem que adcionar no minimo 2 tags.'),
// });

// export type BodyFile = z.infer<typeof ZodUserSchema>;

interface BodyForm {
  title: string;
  author: string;
  description: string;
  tags: string;
}

const defaultCreatedPinCurrent = {
  index: undefined,
  fileType: '',
  author: '',
  description: '',
  pinSrc: '',
  tags: [],
  title: '',
  file: '',
  videoThumb: '',
};

export default function PublishPin({ token, isAdmin }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectCreatedPinIndex, setSelectCreatedPinIndex] = useState<
    number | undefined
  >(undefined);
  const [createdPins, setCreatedPins] = useState<CreatePinsType[]>([]);
  const [createdPinCurrent, setCreatedPinCurrent] = useState<CreatePinsType>(
    defaultCreatedPinCurrent
  );

  const { handleError, msgError } = useGlobalError();
  const { handleSuccess, msgSuccess } = useGlobalSuccess();

  const childNewPinRef = useRef<any>();

  useEffect(() => {
    if (typeof selectCreatedPinIndex !== 'undefined')
      setCreatedPinCurrent(createdPins[selectCreatedPinIndex]);
  }, [selectCreatedPinIndex, createdPins]);

  return (
    <Container>
      {isLoading && <Loading />}
      <GlobalErrorComponent errorMsg={msgError} />
      <GlobalSuccessComponent
        successMsg={msgSuccess}
      >
        {createdPinCurrent.pinSrc && (
          <Image
            src={
              createdPinCurrent.fileType === 'img'
                ? createdPinCurrent.pinSrc
                : URL.createObjectURL(createdPinCurrent.videoThumb as Blob)
            }
            alt="preview"
            width={25}
            priority
            height={25}
          />
        )}
      </ GlobalSuccessComponent>

      <div className="container-created-title">
        <PublishsCreated
          createdPins={createdPins}
          setCreatedPins={setCreatedPins}
          setSelectCreatedPinIndex={setSelectCreatedPinIndex}
          selectCreatedPinIndex={selectCreatedPinIndex}
          setCreatedPinCurrent={setCreatedPinCurrent}
          createdPinCurrent={createdPinCurrent}
          handleResetFilds={childNewPinRef.current?.handleResetFilds}
          handleError={handleError}
        />
        <div className="container-new-pin-and-title">
          <div className="container-pin-title">
            <h2 className="pin-title">Criar pin</h2>
            {createdPinCurrent.file && (
              <BntPublish
                handleSubmitPin={childNewPinRef.current.handleSubmitPin}
              />
            )}
          </div>
          <NewPin
            ref={childNewPinRef}
            createdPinCurrent={createdPinCurrent}
            handleError={handleError}
            handleSuccess={handleSuccess}
            setCreatedPinCurrent={setCreatedPinCurrent}
            selectCreatedPinIndex={selectCreatedPinIndex}
            setCreatedPins={setCreatedPins}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            token={token}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </Container>
  );
}

const NewPin = forwardRef(
  (
    props: {
      createdPinCurrent: CreatePinsType;
      setCreatedPins: Dispatch<SetStateAction<CreatePinsType[]>>;
      handleError(msg: string): void;
      handleSuccess(msg: string): void;
      setCreatedPinCurrent: Dispatch<SetStateAction<CreatePinsType>>;
      selectCreatedPinIndex: number | undefined;
      isLoading: boolean;
      setIsLoading: Dispatch<SetStateAction<boolean>>;
      token: string;
      isAdmin: boolean;
    },
    ref
  ) => {
    const {
      createdPinCurrent,
      handleError,
      handleSuccess,
      setCreatedPinCurrent,
      isLoading,
      setIsLoading,
      token,
      selectCreatedPinIndex,
      setCreatedPins,
      isAdmin,
    } = props;

    const {
      register,
      handleSubmit,
      formState: { errors },
      setError,
      clearErrors,
      reset,
    } = useForm<BodyForm>({ reValidateMode: undefined });

    const [uploadProgress, setUploadProgress] = useState(0);
    const [searchTagsArr, setSearchTagsArr] = useState<
      { _id: string; tag: string }[]
    >([]);
    const [showTagsArr, setShowTagsArr] = useState(false);
    const [tagValue, setTagValue] = useState('');
    const [manageTitleTag, setManageTitleTag] = useState(false);

    let refCreatedPinCurrent = useRef<CreatePinsType>(createdPinCurrent);
    let submitForm = useRef(false);

    useEffect(() => {
      refCreatedPinCurrent.current = createdPinCurrent;
    }, [createdPinCurrent]);

    useImperativeHandle(ref, () => ({
      handleSubmitPin: handleSubmitPin,
      handleResetFilds: handleResetFilds,
    }));

    const handleFormErrors = useCallback(
      (title: string, description: string, tags: string[]) => {
        let controller = true;
        clearErrors('title');
        clearErrors('description');
        clearErrors('tags');

        if (title.trim().length < 4 && !isAdmin) {
          setError('title', { message: 'Titulo muito curto.' });
          controller = false;
        }
        if (title.trim().length > 100 && !isAdmin) {
          setError('title', { message: 'Titulo muito grande.' });
          controller = false;
        }
        if (description.trim().length > 500) {
          setError('description', { message: 'Descrição muito grande.' });
          controller = false;
        }
        if (tags.length < 2) {
          setError('tags', {
            message: 'Você tem que adcionar no minimo 2 tags.',
          });
          controller = false;
        }

        return controller;
      },
      [setError, clearErrors, isAdmin]
    );

    useEffect(() => {
      if (manageTitleTag && submitForm.current) {
        handleFormErrors(createdPinCurrent.title, createdPinCurrent.description, createdPinCurrent.tags);
        setManageTitleTag(false);
      }
    }, [createdPinCurrent, manageTitleTag, handleFormErrors]);

    const handleResetFilds = () => {
      reset({
        author: '',
        description: '',
        tags: '',
        title: '',
      })
      setTagValue('');
      setShowTagsArr(false);
      submitForm.current = false;
    };

    const handleSubmitPin = async () => {
      submitForm.current = true;
      if (isLoading) return;

      const { description, tags, title, file, videoThumb, author, } =
        refCreatedPinCurrent.current;
      if (!handleFormErrors(title, description, tags)) return;

      const formData = new FormData();
      formData.append('midia', file);
      formData.append('thumb', videoThumb);
      formData.append('title', title.trim());
      formData.append('author', author.trim());
      formData.append('description', description.trim());
      formData.append('tags', tags.join(',').trim());

      try {
        setIsLoading(true);
        await axios.post(`${process.env.NEXT_PUBLIC_URL_API}/midia`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress(progressEvent) {
            const loaded = progressEvent.loaded;
            const total = progressEvent.total || 0;
            const percentage = Math.round((loaded / total) * 100);
            setUploadProgress(percentage);
          },
        });
        if (isAdmin) {
          await revalidatePin();
          handleSuccess('Pin adicionado ao feed');
          return;
        }
        handleSuccess('Pin enviado para análise aguarde');
      } catch (err: any) {
        // console.log(err);
        if (get(err, 'response.data.error', false)) {
          handleError(err.response.data.error);
          return;
        }
        handleError('Erro interno no servidor');
      } finally {
        setIsLoading(false);
        setUploadProgress(0);
      }
    };

    const handleChangeFile = async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.item(0);
      if (!file) return;

      const maxFileSize = 500 * 1024 * 1024;
      // console.log(`${size}MB`);
      if (file.size > maxFileSize) {
        handleError('Arquivo muito grande');
        return;
      }

      let pinSrc: string;
      let videoThumbBlob: Blob | string = '';
      const fileType = file.type.includes('video') ? 'video' : 'img';
      if (fileType === 'video') {
        videoThumbBlob = await handleGetThumbVideo(file);
        pinSrc = URL.createObjectURL(file);
      } else {
        pinSrc = URL.createObjectURL(file);
      }
      if (typeof selectCreatedPinIndex !== 'undefined') {
        setCreatedPinCurrent(state => ({
          ...state,
          fileType,
          pinSrc,
          file,
          videoThumb: videoThumbBlob,
        }));
        setCreatedPins(state => {
          state[selectCreatedPinIndex] = {
            ...createdPinCurrent,
            file,
            pinSrc,
            fileType,
            videoThumb: videoThumbBlob,
          };
          return state;
        });
        return;
      }

      setCreatedPinCurrent(state => ({
        ...state,
        fileType,
        pinSrc,
        file,
        videoThumb: videoThumbBlob,
      }));
    };

    const handleGetThumbVideo = async (videoFile: Blob) => {
      const snapshoter = new VideoSnapshot(videoFile);
      const base64Image = await snapshoter.takeSnapshot();
      const byteCharacters = atob(base64Image.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      return blob;
    };

    const handleVideoCompleteLoad = (video: HTMLVideoElement) => {
      handleNoWaitingVideo(video);
    };

    const handleWaitingVideo = (video: HTMLVideoElement) => {
      const parentVideo = video.parentElement;
      const waitingPin = parentVideo?.querySelector(
        '#waiting-pin'
      ) as HTMLDivElement;
      waitingPin.classList.add('waiting');
    };

    const handleNoWaitingVideo = (video: HTMLVideoElement) => {
      const parentVideo = video.parentElement;
      const waitingPin = parentVideo?.querySelector(
        '#waiting-pin'
      ) as HTMLDivElement;
      waitingPin.classList.remove('waiting');
    };

    const handleChangeTextatera = (event: ChangeEvent<HTMLTextAreaElement>) => {
      const currentTarget = event.currentTarget;
      if (currentTarget.value == '\n') currentTarget.value = ''; // bug das linhas infinitas apertando o enter consertado aqui
      if (!currentTarget.value) return;

      currentTarget.style.height = '5px';
      currentTarget.style.paddingBottom = '1rem';
      currentTarget.style.height = `${currentTarget.scrollHeight}px`;
    };

    const handleSearchTags = async (tag: string) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL_API}/midia/get-all-midia-tags?tag=${tag}`,
          {
            method: 'GET',
          }
        );
        const data = await res.json();
        if (!res.ok) {
          handleError(data.error);
          return;
        }
        setSearchTagsArr(data.midiaTags);
      } catch (err: any) {
        // console.log(err);
        // if (get(err, 'response.data.error', false)) {
        //   handleError(err.response.data.eraror);
        //   return;
        // }
        // handleError('Erro interno no servidor');
      }
    };

    return (
      <ContainerNewPin>
        {uploadProgress ? (
          <UploadPinProgress progress={uploadProgress} />
        ) : null}
        {createdPinCurrent.file ? (
          <div className="container-img-100vh">
            <div className="container-file-img-current">
              <button
                type="button"
                onClick={() => {
                  clearErrors('root');
                  submitForm.current = false;
                  setCreatedPinCurrent(state => ({ ...state, file: '' }));
                }}
              >
                <svg
                  height="18"
                  width="18"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  aria-label=""
                  role="img"
                >
                  <path d="M4.878 22.116A2 2 0 0 0 6.875 24h10.229a2 2 0 0 0 1.995-1.881L20 7H4l.88 15.116zM22 3.5A1.5 1.5 0 0 1 20.5 5h-17a1.5 1.5 0 0 1 0-3h6V1a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1h6A1.5 1.5 0 0 1 22 3.5z"></path>
                </svg>
              </button>
              {createdPinCurrent.fileType === 'img' ? (
                <Image
                  src={createdPinCurrent.pinSrc}
                  alt={createdPinCurrent.title}
                  fill
                  priority
                  sizes="100%"
                />
              ) : (
                <>
                  <video
                    src={createdPinCurrent.pinSrc}
                    controls={true}
                    onWaiting={event => handleWaitingVideo(event.currentTarget)}
                    onPlaying={event =>
                      handleNoWaitingVideo(event.currentTarget)
                    }
                    onLoadedMetadata={event =>
                      handleVideoCompleteLoad(event.currentTarget)
                    }
                  ></video>
                  <WaitingPin alonePin />
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="file-upload">
            <label htmlFor="file">
              <input
                type="file"
                id="file"
                onChange={event => handleChangeFile(event)}
                onClick={event => (event.currentTarget.value = '')}
                accept="image/*, video/*"
                multiple={false}
              />
            </label>
            <div className="container-suggestion-and-icon">
              <svg height="32" width="32" viewBox="0 0 24 24">
                <path d="M24 12c0-6.627-5.372-12-12-12C5.373 0 0 5.373 0 12s5.373 12 12 12c6.628 0 12-5.373 12-12zm-10.767 3.75a1.25 1.25 0 0 1-2.5 0v-3.948l-1.031 1.031a1.25 1.25 0 0 1-1.768-1.768L12 7l4.066 4.065a1.25 1.25 0 0 1-1.768 1.768l-1.065-1.065v3.982z"></path>
              </svg>
              <span>Escolha um arquivo ou arraste e solte-o aqui</span>
            </div>
            <span className="warning-file">
              Recomendamos o uso de arquivos de alta qualidade com menos de
              500MB
            </span>
          </div>
        )}
        <ContainerFormNewPin
          onSubmit={handleSubmit(handleSubmitPin)}
          data-hidden-form={!createdPinCurrent.file ? true : false}
        >
          <div className="container-input">
            <label htmlFor="title">Titulo</label>
            <input
              data-input-error={errors.title ? true : false}
              id="title"
              placeholder="Adicione um título"
              maxLength={100}
              value={createdPinCurrent.title}
              type="text"
              {...register('title', {
                onChange(event) {
                  const value = event.target.value;
                  setCreatedPinCurrent(state => ({
                    ...state,
                    title: value,
                  }));
                  setManageTitleTag(true);
                  if (typeof selectCreatedPinIndex !== 'undefined') {
                    setCreatedPins(state => {
                      state[selectCreatedPinIndex] = {
                        ...createdPinCurrent,
                        title: value,
                      };
                      return state;
                    });
                  }
                },
                disabled: !createdPinCurrent.file ? true : false,
              })}
            />
            {errors.title && <ErrorMsg errorMsg={errors.title.message} />}
          </div>
          {isAdmin && <div className='container-input'>
            <label htmlFor="author">Autor</label>
            <input
              id="author"
              placeholder="Nome do autor"
              maxLength={100}
              value={createdPinCurrent.author}
              type="text"
              {...register('author', {
                onChange(event) {
                  const value = event.target.value;
                  setCreatedPinCurrent(state => ({
                    ...state,
                    author: value,
                  }));
                },
                disabled: !createdPinCurrent.file ? true : false,
              })}
            />
          </div>}
          <div className="container-input" >
            <label htmlFor="description">Descrição</label>
            <textarea
              disabled={!createdPinCurrent.file ? true : false}
              data-input-error={errors.description ? true : false}
              id="description"
              value={createdPinCurrent.description}
              placeholder="Adicione uma descrição detalhada"
              maxLength={500}
              {...register('description', {
                onChange(event) {
                  handleChangeTextatera(event);
                  setCreatedPinCurrent(state => ({
                    ...state,
                    description: event.target.value,
                  }));
                },
              })}
            ></textarea>
            {errors.description && <ErrorMsg errorMsg={errors.description.message} />}
          </div>
          <div className="container-input">
            <label htmlFor="tags">Tags</label>
            <div
              className="container-show-tags-and-input"
              tabIndex={1}
              onBlur={event => {
                if (!event.currentTarget.contains(event.relatedTarget))
                  setShowTagsArr(false);
              }}
            >
              <ContainerShowTags
                style={{ display: showTagsArr ? 'flex' : 'none' }}
              >
                <div className="container-search-tags">
                  <span>Tags correspondentes ({searchTagsArr.length})</span>
                  {searchTagsArr.map(value => (
                    <div
                      key={value._id}
                      tabIndex={1}
                      onClick={() => {
                        if (createdPinCurrent.tags.length >= 5) {
                          handleError('Número máximo de tags excedido');
                          return;
                        }
                        setCreatedPinCurrent(state => ({
                          ...state,
                          tags: !state.tags.includes(value.tag)
                            ? [...state.tags, value.tag]
                            : state.tags,
                        }));
                        setManageTitleTag(true);
                      }}
                    >
                      <button type="button">{value.tag}</button>
                    </div>
                  ))}
                </div>
              </ContainerShowTags>
              <input
                data-input-error={errors.tags ? true : false}
                id="tags"
                placeholder="Procure uma tag"
                maxLength={50}
                type="text"
                value={tagValue}
                {...register('tags', {
                  onChange(event) {
                    const value = event.target.value;
                    setTagValue(value);
                    value ? setShowTagsArr(true) : setShowTagsArr(false);
                    handleSearchTags(value);
                  },
                  disabled: !createdPinCurrent.file ? true : false,
                })}
                onFocus={() =>
                  tagValue ? setShowTagsArr(true) : setShowTagsArr(false)
                }
              />
            </div>
            {errors.tags && <ErrorMsg errorMsg={errors.tags.message} />}
            <ContainerSelectedTags>
              {createdPinCurrent.tags.map((tag, index) => (
                <div key={index} className="pin-tag">
                  <span>{tag}</span>
                  <button
                    type="button"
                    tabIndex={1}
                    onClick={() => {
                      setCreatedPinCurrent(state => ({
                        ...state,
                        tags: state.tags.filter(val => val !== tag),
                      }));
                      setManageTitleTag(true);
                    }}
                  >
                    <svg height="12" width="12" viewBox="0 0 24 24">
                      <path d="m15.18 12 7.16-7.16c.88-.88.88-2.3 0-3.18-.88-.88-2.3-.88-3.18 0L12 8.82 4.84 1.66c-.88-.88-2.3-.88-3.18 0-.88.88-.88 2.3 0 3.18L8.82 12l-7.16 7.16c-.88.88-.88 2.3 0 3.18.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66L12 15.18l7.16 7.16c.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66.88-.88.88-2.3 0-3.18L15.18 12z"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </ContainerSelectedTags>
          </div>
          {createdPinCurrent.file && (
            <input type="submit" style={{ visibility: 'hidden', opacity: 0, height: '0', width: '0' }} />
          )}
        </ContainerFormNewPin>
      </ContainerNewPin>
    );
  }
);

function PublishsCreated({
  createdPins,
  setCreatedPins,
  setSelectCreatedPinIndex,
  selectCreatedPinIndex,
  setCreatedPinCurrent,
  createdPinCurrent,
  handleError,
  handleResetFilds,
}: {
  createdPins: CreatePinsType[];
  setCreatedPins: Dispatch<SetStateAction<CreatePinsType[]>>;
  selectCreatedPinIndex?: number;
  setSelectCreatedPinIndex: Dispatch<SetStateAction<number | undefined>>;
  setCreatedPinCurrent: Dispatch<SetStateAction<CreatePinsType>>;
  createdPinCurrent: CreatePinsType;
  handleError(msg: string): void;
  handleResetFilds(): void;
}) {
  const [btnDraftsActive, setbtnDraftsActive] = useState(false);
  let refCreatedPinCurrent = useRef(createdPinCurrent);
  let refCreatedPins = useRef(createdPins);

  useEffect(() => {
    refCreatedPins.current = createdPins;
    refCreatedPinCurrent.current = createdPinCurrent;
  }, [createdPinCurrent, createdPins]);

  const handleAddNewPublishPin = () => {
    if (!refCreatedPinCurrent.current.file) return;
    if (refCreatedPins.current.length >= 5) {
      handleError('Número máximo de rascunhos atingido');
      return;
    }
    handleResetFilds();
    if (typeof selectCreatedPinIndex === 'undefined') {
      setSelectCreatedPinIndex(undefined);
      setCreatedPinCurrent(defaultCreatedPinCurrent);
      setCreatedPins(state => [...state, refCreatedPinCurrent.current]);
      return;
    }
    setSelectCreatedPinIndex(undefined);
    setCreatedPinCurrent(defaultCreatedPinCurrent);
  };

  return (
    <ContainerPublishsCreated className={btnDraftsActive ? 'btn-active' : ''}>
      <div className="container-btns-created-pins">
        {btnDraftsActive ? (
          <div className="btns-drafts-show">
            <div>
              <div className="container-created-pins">
                <h2>Seus rascunhos</h2>
                {createdPins.length ? (
                  <span>({createdPins.length})</span>
                ) : null}
              </div>
              <BtnDraftsCurrent
                btnDraftsActive={btnDraftsActive}
                setbtnDraftsActive={setbtnDraftsActive}
              />
            </div>
            <button
              type="button"
              className="btn-add-new-publish-pin"
              onClick={handleAddNewPublishPin}
            >
              Criar novo
            </button>
          </div>
        ) : (
          <div className="btns-drafts-hidden">
            <BtnDraftsCurrent
              btnDraftsActive={btnDraftsActive}
              setbtnDraftsActive={setbtnDraftsActive}
            />
            <BtnAddNewPublishPin
              setSelectCreatedPinIndex={setSelectCreatedPinIndex}
              setCreatedPinCurrent={setCreatedPinCurrent}
              setCreatedPins={setCreatedPins}
              createdPinCurrent={createdPinCurrent}
              handleResetFilds={handleResetFilds}
              setbtnDraftsActive={setbtnDraftsActive}
              createdPins={createdPins}
              handleError={handleError}
              selectCreatedPinIndex={selectCreatedPinIndex}
            />
          </div>
        )}
      </div>
      {btnDraftsActive && createdPins.length
        ? createdPins.map((createdPin, index) => (
          <div
            key={`${createdPin.title}-${index}`}
            onClick={event => {
              const targetElement = event.target as Element;
              if (targetElement.getAttribute('data-st-ev')) {
                return event.stopPropagation();
              }
              setSelectCreatedPinIndex(index);
            }}
            className="container-created-pins-list "
          >
            <CreatedPinsList
              selected={selectCreatedPinIndex === index}
              createdPin={createdPin}
              setCreatedPins={setCreatedPins}
              setSelectCreatedPinIndex={setSelectCreatedPinIndex}
              setCreatedPinCurrent={setCreatedPinCurrent}
            />
          </div>
        ))
        : null}
    </ContainerPublishsCreated>
  );
}

function CreatedPinsList({
  createdPin,
  selected,
  setCreatedPins,
  setSelectCreatedPinIndex,
  setCreatedPinCurrent,
}: {
  createdPin: CreatePinsType;
  selected: boolean;
  setCreatedPins: Dispatch<SetStateAction<CreatePinsType[]>>;
  setCreatedPinCurrent: Dispatch<SetStateAction<CreatePinsType>>;
  setSelectCreatedPinIndex: Dispatch<SetStateAction<number | undefined>>;
}) {
  const [activeDelete, setActiveDelete] = useState(false);

  const handleAddAnimationClick = (event: MouseEvent<HTMLButtonElement>) => {
    const currentTarget = event.currentTarget;
    currentTarget.classList.add('click');
    setTimeout(() => {
      currentTarget.classList.remove('click');
    }, 300);
  };

  return (
    <ContainerCreatedPinsList className={`${selected ? 'selected' : ''}`}>
      <div className="container-img-preview-and-title">
        <div className="img-preview">
          <Image
            src={
              createdPin.fileType === 'img'
                ? createdPin.pinSrc
                : URL.createObjectURL(createdPin.videoThumb as Blob)
            }
            alt={createdPin.title}
            priority
            fill
            sizes="100"
          />
        </div>
        <span className={`${selected ? 'selected' : ''}`}>
          {/* eslint-disable-next-line */}
          {createdPin.title.length > 50 ? `${createdPin.title.slice(0, 50)}...` : createdPin.title.length ? createdPin.title : '(Sem título)'}
        </span>
      </div>
      <div
        // eslint-disable-next-line
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setActiveDelete(false);
        }}
        className="more-options"
        tabIndex={1}
        data-st-ev={true}
      >
        <button
          type="button"
          className={`btn-more-options ${selected ? 'selected' : ''}`}
          onClick={event => {
            setActiveDelete(!activeDelete);
            handleAddAnimationClick(event);
          }}
          data-st-ev={true}
        >
          <svg height="15" width="15" viewBox="0 0 24 24" data-st-ev={true}>
            <path
              data-st-ev={true}
              d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3M3 9c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm18 0c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"
            ></path>
          </svg>
        </button>
        {activeDelete && (
          <div
            data-st-ev={true}
            // eslint-disable-next-line
            className={`container-delete-created-pin ${activeDelete ? 'active-delete' : ''}`}
          >
            <button
              data-st-ev={true}
              onClick={() => {
                setSelectCreatedPinIndex(undefined);
                setCreatedPins(state =>
                  state.filter(val => val.pinSrc !== createdPin.pinSrc)
                );
                setCreatedPinCurrent(defaultCreatedPinCurrent);
                setActiveDelete(false);
              }}
            >
              Excluir
            </button>
          </div>
        )}
      </div>
    </ContainerCreatedPinsList>
  );
}

function BtnDraftsCurrent({
  btnDraftsActive,
  setbtnDraftsActive,
}: {
  btnDraftsActive: boolean;
  setbtnDraftsActive: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <ContainerBtnPublishsCreated
      type="button"
      onClick={() => setbtnDraftsActive(!btnDraftsActive)}
    >
      <svg
        height="20"
        width="20"
        viewBox="0 0 24 24"
        role="img"
        className={btnDraftsActive ? 'btn-active' : ''}
      >
        <path d="M4.51524 20.5516L11.9051 13.0822C12.0717 12.9273 12.1904 12.7616 12.2613 12.5852C12.3321 12.4088 12.3676 12.2234 12.3676 12.0288C12.3676 11.8343 12.3321 11.6425 12.2613 11.4535C12.1904 11.2645 12.0717 11.0925 11.9051 10.9375L4.51524 3.4302C4.22096 3.13128 3.87532 2.98813 3.47831 3.00077C3.08127 3.01341 2.73563 3.16919 2.44138 3.46812C2.14713 3.76704 2 4.11818 2 4.52153C2 4.92487 2.14713 5.27601 2.44138 5.57494L8.7943 12.0288L2.44138 18.4827C2.14713 18.7816 2.00351 19.1264 2.01052 19.5172C2.01757 19.9079 2.16118 20.2527 2.44138 20.5516C2.74969 20.8505 3.09884 21 3.48883 21C3.87883 21 4.22096 20.8505 4.51524 20.5516ZM14.1477 20.5516L21.5375 13.0822C21.7041 12.9273 21.8229 12.7616 21.8937 12.5852C21.9646 12.4088 22 12.2234 22 12.0288C22 11.8343 21.9646 11.6425 21.8937 11.4535C21.8229 11.2645 21.7041 11.0925 21.5375 10.9375L14.1477 3.4302C13.8534 3.13128 13.5078 2.98813 13.1108 3.00077C12.7137 3.01341 12.3681 3.16919 12.0738 3.46812C11.7796 3.76704 11.6324 4.11818 11.6324 4.52153C11.6324 4.92487 11.7796 5.27601 12.0738 5.57494L18.4478 12.0288L12.0738 18.4827C11.7796 18.7816 11.636 19.1264 11.643 19.5172C11.65 19.9079 11.7936 20.2527 12.0738 20.5516C12.3822 20.8505 12.7313 21 13.1213 21C13.5113 21 13.8534 20.8505 14.1477 20.5516Z"></path>
      </svg>
    </ContainerBtnPublishsCreated>
  );
}

function BtnAddNewPublishPin({
  setSelectCreatedPinIndex,
  setCreatedPinCurrent,
  createdPinCurrent,
  setCreatedPins,
  setbtnDraftsActive,
  createdPins,
  selectCreatedPinIndex,
  handleError,
  handleResetFilds,
}: {
  setSelectCreatedPinIndex: Dispatch<SetStateAction<number | undefined>>;
  selectCreatedPinIndex: number | undefined;
  setCreatedPinCurrent: Dispatch<SetStateAction<CreatePinsType>>;
  createdPinCurrent: CreatePinsType;
  setCreatedPins: Dispatch<SetStateAction<CreatePinsType[]>>;
  setbtnDraftsActive: Dispatch<SetStateAction<boolean>>;
  createdPins: CreatePinsType[];
  handleError(msg: string): void;
  handleResetFilds(): void;
}) {
  let refCreatedPinCurrent = useRef(createdPinCurrent);
  let refCreatedPins = useRef(createdPins);

  useEffect(() => {
    refCreatedPins.current = createdPins;
    refCreatedPinCurrent.current = createdPinCurrent;
  }, [createdPinCurrent, createdPins]);

  const handleAddNewPublishPin = () => {
    if (!refCreatedPinCurrent.current.file) return;
    if (createdPins.length >= 5) {
      handleError('Número máximo de rascunhos atingido');
      return;
    }
    handleResetFilds();
    setbtnDraftsActive(true);
    if (typeof selectCreatedPinIndex === 'undefined') {
      setSelectCreatedPinIndex(undefined);
      setCreatedPinCurrent(defaultCreatedPinCurrent);
      setCreatedPins(state => [...state, refCreatedPinCurrent.current]);
      return;
    }
    setSelectCreatedPinIndex(undefined);
    setCreatedPinCurrent(defaultCreatedPinCurrent);
  };

  return (
    <ContainerBtnPublishsCreated type="button" onClick={handleAddNewPublishPin}>
      <svg height="20" width="20" viewBox="0 0 24 24" role="img">
        <path d="M22 10h-8V2a2 2 0 0 0-4 0v8H2a2 2 0 0 0 0 4h8v8a2 2 0 0 0 4 0v-8h8a2 2 0 0 0 0-4"></path>
      </svg>
    </ContainerBtnPublishsCreated>
  );
}

function BntPublish({ handleSubmitPin }: { handleSubmitPin(): void }) {
  return (
    <ContainerBntPublish type="button" onClick={() => handleSubmitPin()}>
      Publicar
    </ContainerBntPublish>
  );
}

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number; valueBuffer: number }
) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '4px',
      }}
    >
      <Box sx={{ width: '100%' }}>
        <LinearProgress variant="buffer" color="error" {...props} />
      </Box>
      <Box sx={{ minWidth: 35, marginTop: '5px' }}>
        <Typography
          style={{ color: '#000', fontSize: '0.9rem', fontWeight: '500' }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

function UploadPinProgress({ progress }: { progress: number }) {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 10,
      }}
    >
      <LinearProgressWithLabel variant='determinate' value={progress} valueBuffer={progress} />
    </Box>
  );
}
