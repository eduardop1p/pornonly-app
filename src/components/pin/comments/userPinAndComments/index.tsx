'use client';

import Image from 'next/image';
import Link from 'next/link';
import { format } from 'timeago.js';
import { useEffect, useRef, useState } from 'react';
import type {
  Dispatch,
  SetStateAction,
  FormEvent,
  MouseEvent,
  ChangeEvent,
  KeyboardEvent,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { Container, ContainerComment, ContainerFormResponse } from './styled';
import {
  ResultsCommentsType,
  ResponsesCommentsType,
} from '@/app/pin/[pinid]/page';
import dateCommentsTranslate from '@/config/dateCommentsTranslate';

interface Props {
  token: string;
  isAuth: boolean;
  comment: ResultsCommentsType;
  userId: any;
  setStResultsComments: Dispatch<SetStateAction<ResultsCommentsType[]>>;
  handleServerError(msg: string): void;
  handleServerSuccess(msg: string): void;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  parentCommentIndex: number;
  lastIndex: boolean;
}

export default function UserPinAndComments({
  token,
  isAuth,
  comment,
  userId,
  setStResultsComments,
  handleServerError,
  handleServerSuccess,
  isLoading,
  setIsLoading,
  parentCommentIndex,
  lastIndex,
}: Props) {
  const router = useRouter();
  const pathName = usePathname();

  const [showResponseComment, setShowResponseComment] = useState(false);
  const [showResponseCommentParent, setShowResponseCommentParent] =
    useState(false);
  const [userNameResponse, setUserNameResponse] = useState('');

  const handleAddResponse = async (commentValue: string) => {
    if (!commentValue || isLoading) return;
    if (!isAuth || !token) {
      router.push(`/login?from=${pathName}`);
      return;
    }
    if (commentValue.length > 100) handleServerError('Comentário muito longo');

    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/responses-comments/${comment._id}`,
        {
          method: 'POST',
          body: JSON.stringify({ comment: commentValue, userNameResponse }),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const jsonData = await res.json();
      if (!res.ok) {
        handleServerError(jsonData.error as string);
        return;
      }
      handleServerSuccess('Resposta foi adicionada');
      setStResultsComments(state => {
        state[parentCommentIndex].responses.push(jsonData);
        return state;
      });
      // router.refresh();
    } catch (err) {
      // console.log(err);
      handleServerError('Erro interno no servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <div className="pin-info-and-comment-user">
        <UserComment
          comment={comment}
          isAuth={isAuth}
          token={token}
          userId={userId}
          handleServerError={handleServerError}
          handleServerSuccess={handleServerSuccess}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setStResultsComments={setStResultsComments}
          parentCommentIndex={parentCommentIndex}
          parentCommentId={comment._id}
          setShowResponseCommentParent={setShowResponseCommentParent}
          setUserNameResponse={setUserNameResponse}
          setShowResponseComment={setShowResponseComment}
          lastIndex={lastIndex && !comment.responses.length}
        />
        {comment.responses.length ? (
          <div className="responses-comments-container">
            {showResponseComment && (
              <AddResponse
                handleAddResponse={handleAddResponse}
                setShowResponseComment={setShowResponseComment}
                userNameResponse={userNameResponse}
                isAuth={isAuth}
                setUserNameResponse={setUserNameResponse}
              />
            )}
            {showResponseCommentParent && (
              <AddResponse
                handleAddResponse={handleAddResponse}
                setShowResponseCommentParent={setShowResponseCommentParent}
                userNameResponse={userNameResponse}
                isAuth={isAuth}
                setUserNameResponse={setUserNameResponse}
              />
            )}

            {comment.responses.map((response: ResponsesCommentsType, index) => (
              <UserComment
                key={response._id}
                comment={response}
                isAuth={isAuth}
                token={token}
                userId={userId}
                handleServerError={handleServerError}
                handleServerSuccess={handleServerSuccess}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                parentCommentId={comment._id}
                parentCommentIndex={parentCommentIndex}
                setStResultsComments={setStResultsComments}
                responseIndex={index}
                setShowResponseComment={setShowResponseComment}
                setUserNameResponse={setUserNameResponse}
                setShowResponseCommentParent={setShowResponseCommentParent}
                lastIndex={lastIndex && comment.responses.length == index + 1}
              />
            ))}
          </div>
        ) : (
          (showResponseComment || showResponseCommentParent) && (
            <div className="responses-comments-container">
              {showResponseComment && (
                <AddResponse
                  handleAddResponse={handleAddResponse}
                  setShowResponseComment={setShowResponseComment}
                  userNameResponse={userNameResponse}
                  isAuth={isAuth}
                  setUserNameResponse={setUserNameResponse}
                />
              )}
              {showResponseCommentParent && (
                <AddResponse
                  handleAddResponse={handleAddResponse}
                  setShowResponseCommentParent={setShowResponseCommentParent}
                  userNameResponse={userNameResponse}
                  isAuth={isAuth}
                  setUserNameResponse={setUserNameResponse}
                />
              )}
            </div>
          )
        )}
      </div>
    </Container>
  );
}

interface UserCommentType {
  comment: ResponsesCommentsType;
  userId: any;
  isAuth: boolean;
  token: string;
  handleServerError(msg: string): void;
  handleServerSuccess(msg: string): void;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  parentCommentId: string;
  setStResultsComments: Dispatch<SetStateAction<ResultsCommentsType[]>>;
  parentCommentIndex: number;
  setShowResponseComment: Dispatch<SetStateAction<boolean>>;
  setShowResponseCommentParent: Dispatch<SetStateAction<boolean>>;
  setUserNameResponse: Dispatch<SetStateAction<string>>;
  responseIndex?: number;
  lastIndex?: boolean;
}
function UserComment({
  comment,
  userId,
  isAuth,
  token,
  handleServerError,
  handleServerSuccess,
  isLoading,
  setIsLoading,
  parentCommentId,
  setStResultsComments,
  parentCommentIndex,
  responseIndex,
  setShowResponseComment,
  setShowResponseCommentParent,
  setUserNameResponse,
  lastIndex,
}: UserCommentType) {
  const router = useRouter();
  const pathName = usePathname();

  const [isLikeComment, setIsLikeComment] = useState(
    comment.likes.users.includes(userId)
  );
  const [showManageComment, setShowManageComment] = useState(false);

  const isUniqueUser = () => {
    return isAuth && userId === comment.userId._id;
  };

  const handleDeleteCommentUser = async () => {
    if (isLoading || !isAuth || !token) return;

    try {
      setIsLoading(true);
      const res = await fetch(
        typeof responseIndex !== 'undefined'
          ? `${process.env.NEXT_PUBLIC_URL_API}/responses-comments/${parentCommentId}/${comment._id}`
          : `${process.env.NEXT_PUBLIC_URL_API}/comments/delete-one/${comment._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        const jsonData = await res.json();
        handleServerError(jsonData.error as string);
        return;
      }
      handleServerSuccess('Comentário foi excluido');
      if (typeof responseIndex !== 'undefined') {
        setStResultsComments(state => {
          state[parentCommentIndex].responses = state[
            parentCommentIndex
          ].responses.filter(v => v._id != comment._id);
          return state;
        });
      }
      setStResultsComments(state =>
        state.filter(value => value._id != comment._id)
      );
      // router.refresh();
    } catch (err) {
      // console.log(err);
      handleServerError('Erro interno no servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetLike = () => {
    if (typeof responseIndex !== 'undefined') {
      setStResultsComments(state => {
        state[parentCommentIndex].responses[responseIndex].likes.likes += 1;
        state[parentCommentIndex].responses[responseIndex].likes.users.push(
          userId
        );
        return state;
      });
      return;
    }
    setStResultsComments(state => {
      state[parentCommentIndex].likes.likes += 1;
      state[parentCommentIndex].likes.users.push(userId);
      return state;
    });
  };

  const handleSetUnClick = () => {
    if (parentCommentId && typeof responseIndex !== 'undefined') {
      setStResultsComments(state => {
        state[parentCommentIndex].responses[responseIndex].likes.likes -= 1;
        state[parentCommentIndex].responses[responseIndex].likes.users = state[
          parentCommentIndex
        ].responses[responseIndex].likes.users.filter(value => value != userId);
        return state;
      });
      return;
    }
    setStResultsComments(state => {
      state[parentCommentIndex].likes.likes -= 1;
      state[parentCommentIndex].likes.users = state[
        parentCommentIndex
      ].likes.users.filter(value => value != userId);
      return state;
    });
  };

  const handleLikeComment = async () => {
    if (!isAuth) {
      router.push(`/login?from=${pathName}`);
      return;
    }

    try {
      setIsLikeComment(true);
      handleSetLike();
      const res = await fetch(
        // eslint-disable-next-line
        `${process.env.NEXT_PUBLIC_URL_API}/${typeof responseIndex !== 'undefined' ? 'responses-comments' : 'comments'
        }/like-in-comment/${comment._id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error('servererror');
      // router.refresh();
    } catch (err) {
      setIsLikeComment(false);
      handleSetUnClick();
      handleServerError('Erro interno no servidor.');
    }
  };

  const handleUnClickComment = async () => {
    if (!isAuth) {
      router.push(`/login?from=${pathName}`);
      return;
    }

    try {
      setIsLikeComment(false);
      handleSetUnClick();
      const res = await fetch(
        // eslint-disable-next-line
        `${process.env.NEXT_PUBLIC_URL_API}/${typeof responseIndex !== 'undefined' ? 'responses-comments' : 'comments'
        }/unclick-in-comment/${comment._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error('server error');
      // router.refresh();
    } catch (err) {
      setIsLikeComment(true);
      handleSetLike();
      handleServerError('Erro interno no servidor.');
    }
  };

  const handleShowResponseComment = (event: MouseEvent<HTMLButtonElement>) => {
    if (!isAuth) {
      router.push(`/login?from=${pathName}`);
      return;
    }
    if (typeof responseIndex !== 'undefined') {
      setUserNameResponse(
        event.currentTarget.offsetParent?.querySelector('.comment-username > a')
          ?.textContent as string
      );
      setShowResponseCommentParent(false);
      setShowResponseComment(true);
      return;
    }
    setUserNameResponse('');
    setShowResponseComment(false);
    setShowResponseCommentParent(true);
  };

  return (
    <ContainerComment $lastIndex={lastIndex}>
      <Link href={`/${comment.userId.username}`} className="pin-user-profile">
        {comment.userId.profilePhoto.length ? (
          <Image
            src={comment.userId.profilePhoto[0].url}
            alt={comment.userId.username}
            priority
            width={32}
            height={32}
          />
        ) : (
          <span style={{ width: '32px', height: '32px' }}>
            {comment.userId.username.at(0)?.toUpperCase()}
          </span>
        )}
      </Link>
      <div>
        <div className="comment-username-and-commet">
          <h4 className="comment-username">
            <Link href={`/${comment.userId.username}`}>
              {comment.userId.username}
            </Link>
          </h4>
          <div className="comment">
            {comment.userNameResponse && (
              <Link href={`/${comment.userNameResponse}`}>
                {comment.userNameResponse}
              </Link>
            )}
            <span>{comment.comment}</span>
          </div>
        </div>
        <div
          className="container-comment-manage"
          style={{
            marginTop: isUniqueUser() ? '2px' : '5px',
          }}
        >
          <span>
            {dateCommentsTranslate(format(comment.createIn as string, 'pt_BR'))}
          </span>
          <button
            type="button"
            className="response-comment"
            onClick={handleShowResponseComment}
          >
            Responder
          </button>

          {isLikeComment ? (
            <div className="likes-container">
              <button type="button" onClick={handleUnClickComment}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 512 512"
                  className="yes-like"
                >
                  <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                </svg>
              </button>
              <span>{comment.likes.likes}</span>
            </div>
          ) : (
            <div className="likes-container">
              <button type="button" onClick={handleLikeComment}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 512 512"
                  className="no-like"
                >
                  <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                </svg>
              </button>
              <span>{comment.likes.likes}</span>
            </div>
          )}
          {isUniqueUser() && (
            <div
              className="user-manage-comment"
              tabIndex={1}
              onBlur={event =>
                !event.currentTarget.contains(event.relatedTarget) &&
                setShowManageComment(false)
              }
            >
              <button
                type="button"
                onClick={() => setShowManageComment(!showManageComment)}
              >
                <svg
                  height="12"
                  width="12"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  aria-label=""
                  role="img"
                >
                  <path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3M3 9c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm18 0c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"></path>
                </svg>
              </button>
              <div
                className="manage-comment"
                data-show-manage-comment={showManageComment}
                onClick={event => event.stopPropagation()}
              >
                <button type="button" onClick={handleDeleteCommentUser}>
                  Excluir
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ContainerComment>
  );
}

function AddResponse({
  handleAddResponse,
  setShowResponseComment,
  setShowResponseCommentParent,
  userNameResponse,
  isAuth,
  setUserNameResponse,
}: {
  handleAddResponse(commentValue: string): Promise<void>;
  setShowResponseComment?: Dispatch<SetStateAction<boolean>>;
  setShowResponseCommentParent?: Dispatch<SetStateAction<boolean>>;
  userNameResponse?: string;
  isAuth: boolean;
  setUserNameResponse: Dispatch<SetStateAction<string>>;
}) {
  const [textareaValue, setTextareaValue] = useState('');
  const [breakTextarea, setBreakTextarea] = useState(false);
  const refTextarea = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    refTextarea.current?.focus();
  }, []);

  const handleSubmitFormResponse = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!isAuth) {
      return;
    }
    if (!textareaValue) return;
    await handleAddResponse(textareaValue);
    handleRemoveTextarea();
  };

  const handleRemoveTextarea = () => {
    if (setShowResponseComment) setShowResponseComment(false);
    if (setShowResponseCommentParent) setShowResponseCommentParent(false);
  };

  const handleChangeTextarea = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    if (event.target.clientHeight > 20 && userNameResponse)
      setBreakTextarea(true);
    if (event.target.clientHeight < 20 && !value && userNameResponse)
      setBreakTextarea(false);
    setTextareaValue(value);
    event.target.style.height = '5px';
    event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`;
  };

  const handleTextareaKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const { selectionStart } = event.currentTarget;
    if (event.code === 'Backspace' && !textareaValue.charAt(selectionStart - 1))
      setUserNameResponse('');
  };

  return (
    <ContainerFormResponse
      onSubmit={handleSubmitFormResponse}
      $breakTextarea={breakTextarea}
    >
      <div className="container-input">
        {userNameResponse && <span>{userNameResponse}</span>}
        <textarea
          onChange={event => handleChangeTextarea(event)}
          onKeyDown={handleTextareaKeyDown}
          ref={refTextarea}
          name="add-response"
          id="comment-add-response"
          placeholder="Responder"
          maxLength={100}
        ></textarea>
      </div>
      <div className="container-manage-input-response">
        <button
          type="submit"
          data-textarea-value={textareaValue ? true : false}
        >
          Salvar
        </button>
        <button type="button" onClick={() => handleRemoveTextarea()}>
          Cancelar
        </button>
      </div>
    </ContainerFormResponse>
  );
}
