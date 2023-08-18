import { upperFirst } from 'lodash';
import { ReactNode } from 'react';
import type { FieldError, UseFormRegister } from 'react-hook-form';

import styles from './styles.module.css';

import { BodyCreateAccount } from '..';

import ErrorMsg from '../../errorMsg';

interface Props {
  label: string;
  type: string;
  name: keyof BodyCreateAccount;
  id: string;
  placeholder: string;
  children?: ReactNode;
  register: UseFormRegister<BodyCreateAccount>;
  errors: { message?: string; classError?: FieldError };
}

export default function Input({
  type,
  name,
  id,
  placeholder,
  label,
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
          className={errors.classError ? styles['error-input-border'] : ''}
          placeholder={placeholder}
          {...register(name)}
        />
        {children}
      </div>

      <ErrorMsg errorMsg={errors.message} />
    </div>
  );
}
