import Link from 'next/link';
import Image from 'next/image';
import type { MouseEvent, Dispatch, SetStateAction, ReactNode } from 'react';
import ReactPlayer from 'react-player';
import { upperFirst } from 'lodash';

import { Container } from './styled';
import { MidiaResultsType } from '@/app/page';
import calHeight from '@/config/calcHeight';
import LoadingPin from '../LoadingPin';
// import WaitingPin from '../waitingPin';
import UserPin from '../userPin';
import AcceptPin from '../acceptPin';

interface Props {
  midiaValue: MidiaResultsType;
  masonryPublishs?: boolean;
  midiaIndex: number;
  handlePLayVideo(event: MouseEvent<HTMLAnchorElement | HTMLDivElement>): void;
  handlePauseVideo(event: MouseEvent<HTMLAnchorElement | HTMLDivElement>): void;
  columnWidth: number;
  handleRemoveLoading(element: Element | null): void;
  handleGetElement(id: string, index: number): Element | null;
  handleVideoCompleteLoad(element: Element | null): void;
  handleWaitingVideo(element: Element | null): void;
  visibleUserInfo?: boolean;
  isAdmin?: boolean;
  isUniqueUser?: boolean;
  setStResults: Dispatch<SetStateAction<MidiaResultsType[]>>;
  handleError(msg: string): void;
  handleServerSuccess(msg: string): void;
  token: string;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export default function Pin({
  midiaValue,
  masonryPublishs,
  midiaIndex,
  handlePLayVideo,
  handlePauseVideo,
  columnWidth,
  handleRemoveLoading,
  handleGetElement,
  handleVideoCompleteLoad,
  handleWaitingVideo,
  visibleUserInfo,
  isAdmin,
  setStResults,
  handleError,
  handleServerSuccess,
  isLoading,
  setIsLoading,
  token,
  isUniqueUser,
}: Props) {
  return (
    <>
      {midiaValue.midiaType === 'video' &&
        midiaValue.status === 'published' && (
          <PinVideoPublished
            columnWidth={columnWidth}
            handleGetElement={handleGetElement}
            handleRemoveLoading={handleRemoveLoading}
            midiaIndex={midiaIndex}
            midiaValue={midiaValue}
            handlePLayVideo={handlePLayVideo}
            handlePauseVideo={handlePauseVideo}
            handleVideoCompleteLoad={handleVideoCompleteLoad}
            handleWaitingVideo={handleWaitingVideo}
            masonryPublishs={masonryPublishs}
            visibleUserInfo={visibleUserInfo}
          />
        )}
      {(midiaValue.midiaType === 'img' || midiaValue.midiaType === 'gif') &&
        midiaValue.status === 'published' && (
          <PinImgPublished
            columnWidth={columnWidth}
            handleGetElement={handleGetElement}
            handleRemoveLoading={handleRemoveLoading}
            midiaIndex={midiaIndex}
            midiaValue={midiaValue}
            masonryPublishs={masonryPublishs}
            visibleUserInfo={visibleUserInfo}
          />
        )}
      {/* midia pendente */}
      {midiaValue.midiaType === 'video' && midiaValue.status === 'pending' && (
        <>
          {isUniqueUser && (
            <PinVideoPending
              columnWidth={columnWidth}
              handleGetElement={handleGetElement}
              handleRemoveLoading={handleRemoveLoading}
              midiaIndex={midiaIndex}
              midiaValue={midiaValue}
              masonryPublishs={masonryPublishs}
            />
          )}
          {isAdmin && (
            <PinVideoPublished
              columnWidth={columnWidth}
              handleGetElement={handleGetElement}
              handleRemoveLoading={handleRemoveLoading}
              midiaIndex={midiaIndex}
              midiaValue={midiaValue}
              handlePLayVideo={handlePLayVideo}
              handlePauseVideo={handlePauseVideo}
              handleVideoCompleteLoad={handleVideoCompleteLoad}
              handleWaitingVideo={handleWaitingVideo}
              masonryPublishs={masonryPublishs}
              visibleUserInfo={visibleUserInfo}
            >
              <AcceptPin
                token={token}
                midiaId={midiaValue._id}
                keyUrl={new URL(midiaValue.url).pathname.slice(1)}
                thumgUrl={
                  midiaValue.thumb
                    ? new URL(midiaValue.thumb).pathname.slice(1)
                    : undefined
                }
                setStResults={setStResults}
                handleError={handleError}
                handleServerSuccess={handleServerSuccess}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </PinVideoPublished>
          )}
        </>
      )}
      {(midiaValue.midiaType === 'img' || midiaValue.midiaType === 'gif') &&
        midiaValue.status === 'pending' && (
          <>
            {isUniqueUser && (
              <PinImgPending
                columnWidth={columnWidth}
                handleGetElement={handleGetElement}
                handleRemoveLoading={handleRemoveLoading}
                midiaIndex={midiaIndex}
                midiaValue={midiaValue}
                masonryPublishs={masonryPublishs}
              />
            )}

            {isAdmin && (
              <PinImgPublished
                columnWidth={columnWidth}
                handleGetElement={handleGetElement}
                handleRemoveLoading={handleRemoveLoading}
                midiaIndex={midiaIndex}
                midiaValue={midiaValue}
                masonryPublishs={masonryPublishs}
                visibleUserInfo={visibleUserInfo}
              >
                <AcceptPin
                  token={token}
                  midiaId={midiaValue._id}
                  keyUrl={new URL(midiaValue.url).pathname.slice(1)}
                  setStResults={setStResults}
                  handleError={handleError}
                  handleServerSuccess={handleServerSuccess}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </PinImgPublished>
            )}
          </>
        )}
    </>
  );
}

function PinImgPublished({
  midiaValue,
  midiaIndex,
  masonryPublishs,
  columnWidth,
  handleGetElement,
  handleRemoveLoading,
  visibleUserInfo,
  children,
}: {
  midiaValue: MidiaResultsType;
  masonryPublishs?: boolean;
  midiaIndex: number;
  columnWidth: number;
  handleRemoveLoading(element: Element | null): void;
  handleGetElement(id: string, index: number): Element | null;
  visibleUserInfo?: boolean;
  children?: ReactNode;
}) {
  return (
    <Container
      className={`${masonryPublishs ? 'pin-publishs-container' : ''}`}
      data-index={
        typeof midiaValue.index != 'undefined' ? midiaValue.index : false
      }
    >
      <Link
        href={`/pin/${midiaValue._id} `}
        className="pin"
        id={`pin-${midiaValue._id}-${midiaIndex}`}
        style={{
          width: `${columnWidth.toFixed(0)}px`,
          height: `${calHeight({
            customWidth: columnWidth,
            originalHeight: midiaValue.height,
            originalWidth: midiaValue.width,
          })}px`,
        }}
      >
        <Image
          src={midiaValue.url}
          alt={midiaValue.title}
          priority
          fill
          sizes="100%"
          onLoadingComplete={() =>
            handleRemoveLoading(handleGetElement(midiaValue._id, midiaIndex))
          }
          onError={() =>
            handleRemoveLoading(handleGetElement(midiaValue._id, midiaIndex))
          }
        />
        <LoadingPin />
      </Link>
      {visibleUserInfo && (
        <div className="pin-title-and-user">
          <Link
            href={`/pin/${midiaValue._id} `}
            title={upperFirst(midiaValue.title)}
            className="pin-title"
          >
            {upperFirst(midiaValue.title)}
          </Link>
          <Link
            className="pin-original-user"
            href={`/${midiaValue.userId.username} `}
          >
            <UserPin {...midiaValue.userId} />
          </Link>
        </div>
      )}
      {children}
    </Container>
  );
}

function PinImgPending({
  columnWidth,
  handleGetElement,
  handleRemoveLoading,
  midiaIndex,
  midiaValue,
  masonryPublishs,
}: {
  midiaValue: MidiaResultsType;
  midiaIndex: number;
  columnWidth: number;
  handleRemoveLoading(element: Element | null): void;
  handleGetElement(id: string, index: number): Element | null;
  masonryPublishs?: boolean;
}) {
  return (
    <Container
      className={`${masonryPublishs ? 'pin-publishs-container' : ''}`}
      data-index={
        typeof midiaValue.index != 'undefined' ? midiaValue.index : false
      }
    >
      <div
        className="pin pin-pending"
        id={`pin-${midiaValue._id}-${midiaIndex}`}
        style={{
          width: `${columnWidth.toFixed(0)}px`,
          height: `${calHeight({
            customWidth: columnWidth,
            originalHeight: midiaValue.height,
            originalWidth: midiaValue.width,
          })}px`,
        }}
      >
        <span className="title-pending">Em análise</span>
        <Image
          src={midiaValue.url}
          alt={midiaValue.title}
          priority
          fill
          sizes="100%"
          onLoadingComplete={() =>
            handleRemoveLoading(handleGetElement(midiaValue._id, midiaIndex))
          }
          onError={() =>
            handleRemoveLoading(handleGetElement(midiaValue._id, midiaIndex))
          }
        />
        <LoadingPin />
      </div>
    </Container>
  );
}

function PinVideoPublished({
  midiaValue,
  midiaIndex,
  masonryPublishs,
  columnWidth,
  handleGetElement,
  handleRemoveLoading,
  visibleUserInfo,
  handlePLayVideo,
  handlePauseVideo,
  handleVideoCompleteLoad,
  handleWaitingVideo,
  children,
}: {
  midiaValue: MidiaResultsType;
  masonryPublishs?: boolean;
  midiaIndex: number;
  columnWidth: number;
  handleRemoveLoading(element: Element | null): void;
  handleGetElement(id: string, index: number): Element | null;
  visibleUserInfo?: boolean;
  handlePLayVideo(event: MouseEvent<HTMLAnchorElement | HTMLDivElement>): void;
  handlePauseVideo(event: MouseEvent<HTMLAnchorElement | HTMLDivElement>): void;
  handleVideoCompleteLoad(element: Element | null): void;
  handleWaitingVideo(element: Element | null): void;
  children?: ReactNode;
}) {
  return (
    <Container
      className={`${masonryPublishs ? 'pin-publishs-container' : ''}`}
      data-index={
        typeof midiaValue.index != 'undefined' ? midiaValue.index : false
      }
    >
      <Link
        href={`/pin/${midiaValue._id}`}
        className="pin"
        id={`pin-${midiaValue._id}-${midiaIndex}`}
        onMouseEnter={handlePLayVideo}
        onMouseLeave={handlePauseVideo}
        style={{
          width: `${columnWidth.toFixed(0)}px`,
          height: `${calHeight({
            customWidth: columnWidth,
            originalHeight: midiaValue.height,
            originalWidth: midiaValue.width,
          })}px`,
        }}
      >
        <span className="video-time">{midiaValue.duration}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={30}
          height={30}
          viewBox="0 0 384 512"
          className="playing-icon"
        >
          <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
        </svg>
        <Image
          src={midiaValue.thumb ? midiaValue.thumb : ''}
          alt={midiaValue.title}
          priority
          fill
          sizes="100%"
          style={{ position: 'absolute', inset: 0, zIndex: 2 }}
          onLoadingComplete={() =>
            handleRemoveLoading(handleGetElement(midiaValue._id, midiaIndex))
          }
          onError={() =>
            handleRemoveLoading(handleGetElement(midiaValue._id, midiaIndex))
          }
        />
        <ReactPlayer
          url={midiaValue.url}
          controls={false}
          style={{ position: 'absolute', inset: 0, zIndex: 1 }}
          width="100%"
          height="100%"
          className="pin-play"
          // playing
          muted
          loop
          onReady={() =>
            handleVideoCompleteLoad(
              handleGetElement(midiaValue._id, midiaIndex)
            )
          }
          onBuffer={() =>
            handleWaitingVideo(handleGetElement(midiaValue._id, midiaIndex))
          }
        />
        <LoadingPin />
        {/* <WaitingPin /> */}
      </Link>
      {visibleUserInfo && (
        <div className="pin-title-and-user">
          <Link
            href={`/pin/${midiaValue._id}`}
            title={upperFirst(midiaValue.title)}
            className="pin-title"
          >
            {upperFirst(midiaValue.title)}
          </Link>
          <Link
            className="pin-original-user"
            href={`/${midiaValue.userId.username}`}
          >
            <UserPin {...midiaValue.userId} />
          </Link>
        </div>
      )}
      {children}
    </Container>
  );
}

function PinVideoPending({
  midiaValue,
  midiaIndex,
  columnWidth,
  handleGetElement,
  handleRemoveLoading,
  masonryPublishs,
}: {
  midiaValue: MidiaResultsType;
  midiaIndex: number;
  columnWidth: number;
  handleRemoveLoading(element: Element | null): void;
  handleGetElement(id: string, index: number): Element | null;
  masonryPublishs?: boolean;
}) {
  return (
    <Container
      className={`${masonryPublishs ? 'pin-publishs-container' : ''}`}
      data-index={
        typeof midiaValue.index != 'undefined' ? midiaValue.index : false
      }
    >
      <div
        className="pin pin-pending"
        id={`pin-${midiaValue._id}-${midiaIndex}`}
        style={{
          width: `${columnWidth.toFixed(0)}px`,
          height: `${calHeight({
            customWidth: columnWidth,
            originalHeight: midiaValue.height,
            originalWidth: midiaValue.width,
          })}px`,
        }}
      >
        <span className="title-pending">Em análise</span>
        <span className="video-time">{midiaValue.duration}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={30}
          height={30}
          viewBox="0 0 384 512"
          className="playing-icon"
        >
          <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
        </svg>
        <Image
          src={midiaValue.thumb ? midiaValue.thumb : ''}
          alt={midiaValue.title}
          priority
          fill
          sizes="100%"
          style={{ position: 'absolute', inset: 0, zIndex: 2 }}
          onLoadingComplete={() =>
            handleRemoveLoading(handleGetElement(midiaValue._id, midiaIndex))
          }
          onError={() =>
            handleRemoveLoading(handleGetElement(midiaValue._id, midiaIndex))
          }
        />
        <LoadingPin />
        {/* <WaitingPin /> */}
      </div>
    </Container>
  );
}
