/* eslint-disable react/display-name */
'use client';

import {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import type { SetStateAction, Dispatch, MouseEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import { UseFormResetField, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { get } from 'lodash';
import CircularProgress from '@mui/material/CircularProgress';
import VideoSnapshot from 'video-snapshot';

import {
  Container,
  ContainerBntPublish,
  ContainerBtnPublishsCreated,
  ContainerPublishsCreated,
  ContainerCreatedPinsList,
  ContainerNewPin,
  ContainerFormNewPin,
} from './styled';

import ErrorMsg from '../errorMsg';
import { GlobalError } from '../globalError';
import { GlobalSuccess } from '../globalSuccess';
import useGlobalErrorTime from '@/utils/useGlobalErrorTime';
import useGlobalSuccessTime from '@/utils/useGlobalSuccessTime';
import Loading from '../loading';
import revalidatePin from '@/services/revalidatePin';
import WaitingPin from '@/components/masonry/waitingPin';

interface Props {
  token: string;
}

interface CreatePinsType {
  fileType: string;
  pinSrc: string;
  file: Blob | string;
  videoThumb: Blob | string;
  title: string;
  description: string;
  tags: string[];
}

const ZodUserSchema = z.object({
  title: z
    .string()
    .trim()
    .superRefine((val, ctx) => {
      if (val.length < 4) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Titulo muito curto.',
        });
      }
      if (val.length > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Titulo muito grande.',
        });
      }
    }),
  // description: z.string().trim()
});

export type BodyFile = z.infer<typeof ZodUserSchema>;

const defaultCreatedPinCurrent = {
  fileType: '',
  description: '',
  pinSrc: '',
  tags: [],
  title: '',
  file: '',
  videoThumb: '',
};

export default function PublishPin({ token }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectCreatedPinIndex, setSelectCreatedPinIndex] = useState<
    number | undefined
  >(undefined);
  const [createdPins, setCreatedPins] = useState<CreatePinsType[]>([]);
  const [createdPinCurrent, setCreatedPinCurrent] = useState<CreatePinsType>(
    defaultCreatedPinCurrent
  );

  const { handleServerError, msgGlobalError, showGlobalError } =
    useGlobalErrorTime();
  const { handleServerSuccess, msgGlobalSuccess, showGlobalSuccess } =
    useGlobalSuccessTime();

  const childNewPinRef = useRef<any>();

  useEffect(() => {
    if (typeof selectCreatedPinIndex !== 'undefined')
      setCreatedPinCurrent(createdPins[selectCreatedPinIndex]);
  }, [selectCreatedPinIndex, createdPins]);

  return (
    <Container>
      {isLoading && <Loading />}
      <GlobalError errorMsg={msgGlobalError} showError={showGlobalError} />
      <GlobalSuccess
        successMsg={msgGlobalSuccess}
        showSuccess={showGlobalSuccess}
      >
        {createdPinCurrent.pinSrc && (
          <Image
            src={createdPinCurrent.pinSrc}
            alt="preview"
            width={25}
            priority
            height={25}
          />
        )}
      </GlobalSuccess>

      <div className="container-created-title">
        <PublishsCreated
          createdPins={createdPins}
          setCreatedPins={setCreatedPins}
          setSelectCreatedPinIndex={setSelectCreatedPinIndex}
          selectCreatedPinIndex={selectCreatedPinIndex}
          setCreatedPinCurrent={setCreatedPinCurrent}
          createdPinCurrent={createdPinCurrent}
          resetField={childNewPinRef.current?.resetField}
        />
        <div className="container-new-pin-and-title">
          <div className="container-pin-title">
            <h2 className="pin-title">Criar pin</h2>
            {(createdPinCurrent.file || createdPinCurrent.pinSrc) && (
              <BntPublish
                handleSubmitPin={childNewPinRef.current.handleSubmitPin}
              />
            )}
          </div>
          <NewPin
            ref={childNewPinRef}
            createdPinCurrent={createdPinCurrent}
            handleServerError={handleServerError}
            handleServerSuccess={handleServerSuccess}
            setCreatedPinCurrent={setCreatedPinCurrent}
            setSelectCreatedPinIndex={setSelectCreatedPinIndex}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            token={token}
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
      handleServerError(msg: string): void;
      handleServerSuccess(msg: string): void;
      setCreatedPinCurrent: Dispatch<SetStateAction<CreatePinsType>>;
      setSelectCreatedPinIndex: Dispatch<SetStateAction<number | undefined>>;
      isLoading: boolean;
      setIsLoading: Dispatch<SetStateAction<boolean>>;
      token: string;
    },
    ref
  ) => {
    const {
      createdPinCurrent,
      handleServerError,
      handleServerSuccess,
      setCreatedPinCurrent,
      setSelectCreatedPinIndex,
      isLoading,
      setIsLoading,
      token,
    } = props;

    const {
      register,
      handleSubmit,
      formState: { errors },
      resetField,
      setValue,
    } = useForm<BodyFile>({
      resolver: zodResolver(ZodUserSchema),
    });

    const [uploadProgress, setUploadProgress] = useState(0);

    let refCreatedPinCurrent = useRef<CreatePinsType>(createdPinCurrent);
    useEffect(() => {
      refCreatedPinCurrent.current = createdPinCurrent;
    }, [createdPinCurrent]);

    useImperativeHandle(ref, () => ({
      handleSubmitPin: handleSubmitPin,
      resetField: resetField,
    }));

    const handleSubmitPin = async () => {
      if (isLoading) return;
      const { description, tags, title, file, videoThumb } =
        refCreatedPinCurrent.current;

      const formData = new FormData();
      formData.append('midia', file);
      formData.append('thumb', videoThumb);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('tags', tags.join(','));

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
        await revalidatePin();
        handleServerSuccess('Pin adcionado ao feed');
      } catch (err: any) {
        // console.log(err);
        if (get(err, 'response.data.error', false)) {
          handleServerError(err.response.data.error);
          return;
        }
        handleServerError('Parece que você está offline');
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
        handleServerError('Arquivo muito grande');
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
      setSelectCreatedPinIndex(undefined);
      setCreatedPinCurrent({
        fileType,
        description: '',
        pinSrc,
        tags: [],
        title: '',
        file,
        videoThumb: videoThumbBlob,
      });
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

    return (
      <ContainerNewPin>
        {createdPinCurrent.file || createdPinCurrent.pinSrc ? (
          <div className="container-file-img-current">
            <button
              type="button"
              onClick={() => {
                setSelectCreatedPinIndex(undefined);
                setCreatedPinCurrent(defaultCreatedPinCurrent);
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
                  onPlaying={event => handleNoWaitingVideo(event.currentTarget)}
                  onLoadedMetadata={event =>
                    handleVideoCompleteLoad(event.currentTarget)
                  }
                ></video>
                <WaitingPin alonePin />
              </>
            )}
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
              200MB
            </span>
          </div>
        )}
        <ContainerFormNewPin onSubmit={handleSubmit(handleSubmitPin)}>
          <div className="container-input">
            <label htmlFor="title">Titulo</label>
            <input
              id="title"
              placeholder="Adicione um título"
              maxLength={100}
              type="text"
              {...register('title', {
                onChange(event) {
                  setCreatedPinCurrent(state => {
                    state.title = event.target.value;
                    return state;
                  });
                },
              })}
            />
            {errors.title && <ErrorMsg errorMsg={errors.title.message} />}
          </div>
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
  resetField,
}: {
  createdPins: CreatePinsType[];
  setCreatedPins: Dispatch<SetStateAction<CreatePinsType[]>>;
  selectCreatedPinIndex?: number;
  setSelectCreatedPinIndex: Dispatch<SetStateAction<number | undefined>>;
  setCreatedPinCurrent: Dispatch<SetStateAction<CreatePinsType>>;
  createdPinCurrent: CreatePinsType;
  resetField: UseFormResetField<BodyFile>;
}) {
  const [btnDraftsActive, setbtnDraftsActive] = useState(false);

  return (
    <ContainerPublishsCreated className={btnDraftsActive ? 'btn-active' : ''}>
      <div className="container-btns-created-pins">
        {btnDraftsActive ? (
          <div className="btns-drafts-show">
            <div>
              <div className="container-created-pins">
                <h2>Pins criados</h2>
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
              onClick={() => {
                resetField('title');
                if (createdPinCurrent.file || createdPinCurrent.pinSrc)
                  setCreatedPins(state => [...state, createdPinCurrent]);
                setSelectCreatedPinIndex(undefined);
                setCreatedPinCurrent(defaultCreatedPinCurrent);
              }}
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
              resetField={resetField}
              setbtnDraftsActive={setbtnDraftsActive}
            />
          </div>
        )}
      </div>
      {btnDraftsActive &&
        createdPins.map((createdPin, index) => (
          <div
            key={`${createdPin.title}-${index}`}
            onClick={event => {
              const targetElement = event.target as Element;
              if (targetElement.getAttribute('data-st-ev')) {
                return event.stopPropagation();
              }
              setSelectCreatedPinIndex(index);
            }}
            // eslint-disable-next-line
            className="container-created-pins-list "
          >
            <CreatedPinsList
              selected={selectCreatedPinIndex === index}
              createdPin={createdPin}
              setCreatedPins={setCreatedPins}
              setCreatedPinCurrent={setCreatedPinCurrent}
              setSelectCreatedPinIndex={setSelectCreatedPinIndex}
            />
          </div>
        ))}
    </ContainerPublishsCreated>
  );
}

function CreatedPinsList({
  createdPin,
  selected,
  setCreatedPins,
  setCreatedPinCurrent,
  setSelectCreatedPinIndex,
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
            src={createdPin.pinSrc}
            alt={createdPin.title}
            priority
            fill
            sizes="100"
          />
        </div>
        <span className={`${selected ? 'selected' : ''}`}>
          {createdPin.title.length > 50
            ? `${createdPin.title.slice(0, 50)}...`
            : createdPin.title}
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
                setCreatedPinCurrent(defaultCreatedPinCurrent);
                setCreatedPins(state =>
                  state.filter(val => val.pinSrc !== createdPin.pinSrc)
                );
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
  resetField,
  setbtnDraftsActive,
}: {
  setSelectCreatedPinIndex: Dispatch<SetStateAction<number | undefined>>;
  setCreatedPinCurrent: Dispatch<SetStateAction<CreatePinsType>>;
  createdPinCurrent: CreatePinsType;
  setCreatedPins: Dispatch<SetStateAction<CreatePinsType[]>>;
  resetField: UseFormResetField<BodyFile>;
  setbtnDraftsActive: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <ContainerBtnPublishsCreated
      type="button"
      onClick={() => {
        resetField('title');
        if (createdPinCurrent.file || createdPinCurrent.pinSrc) {
          setbtnDraftsActive(true);
          setCreatedPins(state => [...state, createdPinCurrent]);
        }
        setSelectCreatedPinIndex(undefined);
        setCreatedPinCurrent(defaultCreatedPinCurrent);
      }}
    >
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
