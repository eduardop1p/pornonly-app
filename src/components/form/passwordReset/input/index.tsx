import { upperFirst } from 'lodash';
import { ReactNode } from 'react';
import type { FieldError, UseFormRegister } from 'react-hook-form';

import styles from './styles.module.css';

import { BodyPasswordReset } from '..';

import ErrorMsg from '../../errorMsg';

interface Props {
  value?: string;
  label: string;
  type: string;
  name: keyof BodyPasswordReset;
  id: string;
  placeholder: string;
  children?: ReactNode;
  register: UseFormRegister<BodyPasswordReset>;
  errors: { message?: string; classError?: FieldError };
}

export default function Input({
  value,
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
          defaultValue={value}
          type={type}
          className={errors.classError ? styles['error-input-border'] : ''}
          id={id}
          placeholder={placeholder}
          {...register(name)}
        />
        {children}
      </div>

      <ErrorMsg errorMsg={errors.message} />
    </div>
  );
}
