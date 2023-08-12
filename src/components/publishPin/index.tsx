'use client';

import { ChangeEvent, useState, useRef } from 'react';
import Image from 'next/image';
import isAlphanumeric from 'validator/lib/isAlphanumeric';

import { Container } from './styled';

import ErrorMsg from '../errorMsg';

export default function PublishPin() {
  const [imgSrc, setImgSrc] = useState('');
  const [inputTitleInFocus, setInputTitleInFocus] = useState(false);
  const [inputTitleLength, setInputTitleLength] = useState(0);
  const [inputDescriptionInFocus, setInputDescriptionInFocus] = useState(false);
  const [inputDescriptionLength, setInputDescriptionLength] = useState(0);
  const [valueInputTags, setValueInputTags] = useState<any[]>([]);
  const [valueTag, setValueTag] = useState('');
  const [inputTagFocus, setInputTagsFocus] = useState(false);
  const [errorTitle, setErrorTitle] = useState({ msg: '', active: false });

  const inputTitle = useRef<HTMLInputElement | null>(null);
  const divIconUploadPhoto = useRef<HTMLDivElement | null>(null);
  const divBorderDashed = useRef<HTMLDivElement | null>(null);

  const handleSubmitFile = () => {
    let submit = true;
    setErrorTitle({ msg: '', active: false });
    if (!inputTitle.current) return;

    if (!imgSrc) {
      divBorderDashed.current?.classList.add('border-dashed-no-upload-img');
      divIconUploadPhoto.current?.classList.add('no-img-upload');
      submit = false;
    }
    if (inputTitle.current.value.length < 4) {
      setErrorTitle({ active: true, msg: 'Titulo muito curto.' });
      submit = false;
    }
    if (!isAlphanumeric(inputTitle.current.value)) {
      setErrorTitle({
        active: true,
        msg: 'Titulo deve conter apenas letras e números.',
      });
      submit = false;
    }
    if (!inputTitle.current.value) {
      setErrorTitle({ active: true, msg: 'Titulo não pode está vazio.' });
      submit = false;
    }

    if (!submit) return;
  };

  const handleChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;

    const file = event.target.files[0];
    const src = URL.createObjectURL(file);
    setImgSrc(src);
    divBorderDashed.current?.classList.remove('border-dashed-no-upload-img');
    divIconUploadPhoto.current?.classList.remove('no-img-upload');
  };

  const handleChangeTextatera = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputDescriptionLength(event.target.value.length);
    event.currentTarget.style.height = '5px';
    event.currentTarget.style.paddingBottom = '10px';
    event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`;
  };

  const handleAddTag = () => {
    if (!valueTag) return;
    if (valueInputTags.length >= 5) return;

    setValueInputTags(state => [...state, valueTag.trim()]);
    setValueTag('');
  };

  const handleDeleteTag = (index: number) => {
    const updateItems = [...valueInputTags];
    updateItems.splice(index, 1);
    setValueInputTags(updateItems);
  };

  return (
    <Container>
      <div className="publish-and-btn">
        <div className="publish">
          {imgSrc && (
            <div className="preview">
              <button type="button" onClick={() => setImgSrc('')}>
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
              <Image src={imgSrc} alt="preview-img" fill={true} sizes="100%" />
            </div>
          )}
          <div className={!imgSrc ? 'border-dashed' : ''} ref={divBorderDashed}>
            <label htmlFor="file">
              <div className="upload-photo" ref={divIconUploadPhoto}>
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
              onChange={handleChangeFile}
              multiple={false}
            />
            <span>
              Recomendamos o uso de arquivos de alta qualidade com no máximo
              500MB
            </span>
          </div>
        </div>
        <button type="button" onClick={handleSubmitFile}>
          Publicar
        </button>
      </div>
      <div className="title-description-tags">
        <div style={{ height: '105px', marginBottom: '10px' }}>
          <input
            id="title"
            name="title"
            ref={inputTitle}
            placeholder="Adicione um título"
            maxLength={100}
            type="text"
            onChange={event => setInputTitleLength(event.target.value.length)}
            onFocus={() => setInputTitleInFocus(true)}
            onBlur={() => setInputTitleInFocus(false)}
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
          {errorTitle.active && <ErrorMsg errorMsg={errorTitle.msg} />}
        </div>
        <div className="user">Foto e nome de usuário adcionar aqui</div>
        <div>
          <textarea
            id="description"
            name="description"
            placeholder="Adcione uma descrição"
            maxLength={500}
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
          <form
            tabIndex={1}
            data-tags-focus={inputTagFocus}
            className="container-input-tags"
            onSubmit={event => {
              event.preventDefault();
              handleAddTag();
            }}
          >
            {valueInputTags.map((value, index: number) => (
              <span key={index}>
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
                type="text"
                id="tags"
                value={valueTag}
                placeholder="Adcione tags a seu pin"
                maxLength={10}
                onChange={event => setValueTag(event.target.value)}
                onFocus={() => setInputTagsFocus(true)}
                onBlur={() => setInputTagsFocus(false)}
              />
            )}
            {valueInputTags.length !== 5 && (
              <button type="submit">
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
          </form>
          {inputTagFocus && (
            <div className="info-input">
              <span>Você pode adcionar até 5 tags no seu Pin.</span>
              <span>{5 - valueInputTags.length}</span>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}