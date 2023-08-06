'use client';

import { ChangeEvent, useState } from 'react';
import Image from 'next/image';

import { Container } from './styled';

export default function PublishPin() {
  const [imgSrc, setImgSrc] = useState('');
  const [inputTitleInFocus, setInputTitleInFocus] = useState(false);
  const [inputTitleLength, setInputTitleLength] = useState(0);
  const [inputDescriptionInFocus, setInputDescriptionInFocus] = useState(false);
  const [inputDescriptionLength, setInputDescriptionLength] = useState(0);

  const handleChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;

    const file = event.target.files[0];
    const src = URL.createObjectURL(file);
    setImgSrc(src);
  };

  const handleSubmitFile = () => {
    console.log('publicar foto');
  };

  const handleChangeTextatera = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputDescriptionLength(event.target.value.length);
    event.currentTarget.style.height = '5px';
    event.currentTarget.style.paddingBottom = '10px';
    event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`;
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
          <div className={!imgSrc ? 'border-dashed' : ''}>
            <label htmlFor="file">
              <div>
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
        <div>
          <input
            id="title"
            name="title"
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
        </div>
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
      </div>
    </Container>
  );
}
