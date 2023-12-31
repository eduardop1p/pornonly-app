/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { ChangeEvent, useState, ReactNode, useRef, useEffect } from 'react';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { get } from 'lodash';
import CircularProgress from '@mui/material/CircularProgress';
import VideoSnapshot from 'video-snapshot';

import { Container } from './styled';

import ErrorMsg from '../errorMsg';
import { GlobalErrorComponent } from '../globalErrorComponent';
import useGlobalError from '@/utils/useGlobalError';
import { GlobalSuccessComponent } from '../globalSuccessComponent';
import useGlobalSuccess from '@/utils/useGlobalSuccess';
import Loading from '../loading';
import WaitingPin from '@/components/masonry/waitingPin';
import revalidatePin from '@/services/revalidatePin';

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
      // eslint-disable-next-line
      // if (!val.match(/^[a-z0-9\s]*$/)) {
      //   ctx.addIssue({
      //     code: z.ZodIssueCode.custom,
      //     message: 'Titulo deve conter apenas letras e números.',
      //   });
      // }
    }),
  tags: z
    .string()
    .array()
    .refine(val => {
      console.log(val);
      return val.length >= 2 && val.length <= 2;
    }, 'Você tem que adcionar no minimo 2 tags.'),
  midia: z
    .instanceof(FileList)
    .refine(val => val.item(0) instanceof File, 'Nenhum arquivo adcionado.'),
});

export type BodyFile = z.infer<typeof ZodUserSchema>;

export default function PublishPin({
  children,
  token,
}: {
  children: ReactNode;
  token: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<BodyFile>({
    resolver: zodResolver(ZodUserSchema),
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileContent, setFileContent] = useState<{ src: string; file: any }>({
    src: '',
    file: null,
  });
  const [fileType, setFileType] = useState('');
  const [inputTitleInFocus, setInputTitleInFocus] = useState(false);
  const [inputTitleLength, setInputTitleLength] = useState(0);
  const [inputDescriptionInFocus, setInputDescriptionInFocus] = useState(false);
  const [inputDescriptionLength, setInputDescriptionLength] = useState(0);
  const [valueInputTags, setValueInputTags] = useState<string[]>([]);
  const [valueTag, setValueTag] = useState('');
  const [inputTagFocus, setInputTagsFocus] = useState(false);
  const [typeBtn, setTypeBtn] = useState<'submit' | 'button' | 'reset'>(
    'submit'
  );
  const [descriptionValue, setDescriptionValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [widthInputNameTags, setWidthInputNameTags] = useState(0);
  const { handleError, msgError } = useGlobalError();
  const { handleSuccess, msgSuccess } = useGlobalSuccess();
  const fileScrRef = useRef(fileContent.src);
  const thumbBlobVideoRef = useRef<Blob | string>('');

  useEffect(() => {
    const allNameTags = Array.from(document.body.querySelectorAll('.name-tag'));
    const totalWidthAllNameTags = allNameTags.reduce(
      (ac: number, vl) => ac + (vl.clientWidth + 15),
      0
    );
    setWidthInputNameTags(totalWidthAllNameTags);
  }, [valueInputTags]);

  useEffect(() => {
    setValue('tags', valueInputTags);
  }, [valueInputTags, setValue]);

  const handleSubmitFile: SubmitHandler<BodyFile> = async (body, event) => {
    event?.preventDefault();
    const btnSubmit = event?.target.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;
    if (isLoading) return;

    const { title } = body;
    const midia = body.midia[0] as Blob;
    const description = descriptionValue.trim();
    const tags = valueInputTags.join(' ');

    const formData = new FormData();
    formData.append('midia', midia);
    formData.append('thumb', thumbBlobVideoRef.current);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);

    try {
      setIsLoading(true);
      btnSubmit.focus();
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
      handleSuccess('Pin adcionado ao feed');
    } catch (err: any) {
      // console.log(err);
      if (get(err, 'response.data.error', false)) {
        handleError(err.response.data.error);
        return;
      }
      handleError('Parece que você está offline');
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

    const src = URL.createObjectURL(file);
    setFileContent({ src, file });
    setFileType(file.type);
    fileScrRef.current = src;

    if (file.type.includes('video')) {
      await handleGetThumbVideo(file);
    } else {
      thumbBlobVideoRef.current = '';
    }
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
    thumbBlobVideoRef.current = blob;
  };

  const handleChangeTextatera = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value == '\n') event.target.value = ''; // bug das linhas infinitas apertando o enter consertado aqui
    if (!event.target.value) return;

    setInputDescriptionLength(event.target.value.length);
    setDescriptionValue(event.target.value);
    event.currentTarget.style.height = '5px';
    event.currentTarget.style.paddingBottom = '10px';
    event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`;
  };

  const handleAddTag = () => {
    const value = valueTag.trim();
    if (!value) return;
    if (valueInputTags.length >= 5) return;

    setValueInputTags(state => [...state, value]);
    setValueTag('');
  };

  const handleDeleteTag = (index: number) => {
    const updateItems = [...valueInputTags];
    updateItems.splice(index, 1);
    setValueInputTags(updateItems);
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
    <Container>
      {isLoading && <Loading />}
      <GlobalErrorComponent errorMsg={msgError} />
      <GlobalSuccessComponent successMsg={msgSuccess}>
        {fileType.includes('video') && (
          <video src={fileScrRef.current} controls={false}></video>
        )}
        {fileType.includes('image') && (
          <Image
            src={fileScrRef.current}
            alt="preview"
            width={25}
            priority
            height={25}
          />
        )}
      </GlobalSuccessComponent>

      <form onSubmit={handleSubmit(handleSubmitFile)}>
        <div className="publish-and-btn">
          <div className="publish">
            {fileContent.file && (
              <div className="preview">
                {uploadProgress && (
                  <div className="progress-pin-upload">
                    <CircularProgress
                      variant="determinate"
                      value={uploadProgress}
                      style={{
                        width: '60px',
                        height: '60px',
                        color: 'var(--g-colorRed100)',
                      }}
                    />
                    <span className="upload-progress-value">{`${uploadProgress}%`}</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setFileContent({ src: '', file: null });
                    reset({
                      tags: [],
                      title: '',
                    });
                    setDescriptionValue('');
                    setValueInputTags([]);
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
                {fileType.includes('image') ? (
                  <Image
                    src={fileContent.src}
                    alt="preview-img"
                    fill={true}
                    sizes="100%"
                  />
                ) : (
                  <>
                    <video
                      src={fileContent.src}
                      controls={true}
                      onWaiting={event =>
                        handleWaitingVideo(event.currentTarget)
                      }
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
            )}
            <div
              className={
                errors.midia ? 'border-dashed-no-upload-file' : 'border-dashed'
              }
            >
              <label htmlFor="file">
                {/* eslint-disable-next-line */}
                <div className={`upload-photo ${errors.midia ? 'no-file-upload' : ''}`}>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height={10}
                      width={15}
                      viewBox="0 0 384 512"
                    >
                      <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
                    </svg>
                  </div>
                  <span>Clique para carregar ou arraste e solte</span>
                </div>
              </label>
              <input
                type="file"
                id="file"
                {...register('midia', {
                  onChange(event) {
                    handleChangeFile(event);
                  },
                })}
                onClick={event => (event.currentTarget.value = '')}
                accept="image/*, video/*"
                multiple={false}
              />
              <span>
                Recomendamos o uso de arquivos de alta qualidade com no máximo
                500MB
              </span>
            </div>
          </div>
          <button type={typeBtn}>Publicar</button>
        </div>
        <div className="title-description-tags">
          <div
            style={{ height: '105px', marginBottom: '10px' }}
            className="add-title"
          >
            <input
              id="title"
              placeholder="Adicione um título"
              maxLength={100}
              type="text"
              {...register('title', {
                onChange(event) {
                  setInputTitleLength(event.target.value.length);
                },
                onBlur() {
                  setInputTitleInFocus(false);
                },
              })}
              onFocus={() => setInputTitleInFocus(true)}
            />
            {inputTitleInFocus && (
              <div className="info-input">
                <span>
                  Os 40 primeiros caracteres são os que geralmente aparecem nos
                  feeds
                </span>
                <span>{100 - inputTitleLength}</span>
              </div>
            )}
            {errors.title && <ErrorMsg errorMsg={errors.title.message} />}
          </div>
          <div className="user">{children}</div>
          <div className="add-description">
            <textarea
              style={{ maxHeight: '138px' }}
              id="description"
              name="description"
              placeholder="Adcione uma descrição"
              maxLength={500}
              value={descriptionValue}
              onChange={handleChangeTextatera}
              onFocus={() => setInputDescriptionInFocus(true)}
              onBlur={() => setInputDescriptionInFocus(false)}
            ></textarea>
            {inputDescriptionInFocus && (
              <div className="info-input">
                <span>
                  As pessoas geralmente veem os primeiros 50 caracteres quando
                  clicam em seu Pin.
                </span>
                <span>{500 - inputDescriptionLength}</span>
              </div>
            )}
          </div>
          <div className="add-tags">
            <div
              tabIndex={1}
              data-tags-focus={inputTagFocus}
              className="container-input-tags"
              onKeyUp={event =>
                event.code.toLowerCase().includes('enter') && handleAddTag()
              }
            >
              {valueInputTags.map((value, index: number) => (
                <span key={index} className="name-tag">
                  {value}
                  <svg
                    height="18"
                    width="18"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    aria-label=""
                    role="img"
                    onClick={() => handleDeleteTag(index)}
                  >
                    <path d="m15.18 12 7.16-7.16c.88-.88.88-2.3 0-3.18-.88-.88-2.3-.88-3.18 0L12 8.82 4.84 1.66c-.88-.88-2.3-.88-3.18 0-.88.88-.88 2.3 0 3.18L8.82 12l-7.16 7.16c-.88.88-.88 2.3 0 3.18.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66L12 15.18l7.16 7.16c.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66.88-.88.88-2.3 0-3.18L15.18 12z"></path>
                  </svg>
                </span>
              ))}
              {valueInputTags.length !== 5 && (
                <input
                  style={{ width: `calc(100% - ${widthInputNameTags}px)` }}
                  type="text"
                  id="tags"
                  value={valueTag}
                  placeholder="Adcione tags ao seu pin"
                  maxLength={10}
                  {...register('tags', {
                    onChange(event) {
                      setValueTag(event.target.value);
                    },
                    onBlur() {
                      setTypeBtn('submit');
                      setInputTagsFocus(false);
                      handleAddTag();
                    },
                    setValueAs(value) {
                      return valueInputTags;
                    },
                  })}
                  onFocus={() => {
                    setTypeBtn('button');
                    setInputTagsFocus(true);
                  }}
                />
              )}
              {valueInputTags.length !== 5 && (
                <button type="button">
                  <svg
                    height="16"
                    width="16"
                    viewBox="0 0 24 24"
                    aria-label="Criar novo Pin"
                    role="img"
                  >
                    <path d="M22 10h-8V2a2 2 0 0 0-4 0v8H2a2 2 0 0 0 0 4h8v8a2 2 0 0 0 4 0v-8h8a2 2 0 0 0 0-4"></path>
                  </svg>
                </button>
              )}
            </div>
            {inputTagFocus && (
              <div className="info-input">
                <span>Você pode adcionar até 5 tags no seu Pin.</span>
                <span>{5 - valueInputTags.length}</span>
              </div>
            )}
            {errors.tags && <ErrorMsg errorMsg={errors.tags.message} />}
          </div>
        </div>
      </form>
    </Container>
  );
}
