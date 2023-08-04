import { upperFirst } from 'lodash';
import { ReactNode } from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';

import styles from './styles.module.css';

import { BodyCreateAccount } from '..';

import ErrorForm from '../../errorForm';

interface Props {
  label: string;
  type: string;
  name: keyof BodyCreateAccount;
  id: string;
  placeholder: string;
  required?: boolean;
  children?: ReactNode;
  register: UseFormRegister<BodyCreateAccount>;
  errors: FieldErrors<BodyCreateAccount>;
}

export default function Input({
  type,
  name,
  id,
  placeholder,
  label,
  required = false,
  children,
  register,
  errors,
}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles['container-input']}>
        <label htmlFor={id}>{upperFirst(label)}</label>
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          required={required}
          {...register(name)}
        />
        {children}
      </div>
      {errors.username && name === 'username' && (
        <ErrorForm errorMsg={errors.username.message} />
      )}
      {errors.email && name === 'email' && (
        <ErrorForm errorMsg={errors.email.message} />
      )}
      {errors.password && name === 'password' && (
        <ErrorForm errorMsg={errors.password.message} />
      )}
      {errors.repeatPassword && name === 'repeatPassword' && (
        <ErrorForm errorMsg={errors.repeatPassword.message} />
      )}
    </div>
  );
}
