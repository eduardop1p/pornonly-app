import { upperFirst } from 'lodash';
import { ReactNode } from 'react';
import type { UseFormRegister } from 'react-hook-form';

import styles from './styles.module.css';

import { BodyCreateAccount } from '..';

import ErrorForm from '../../errorMsg';

interface Props {
  label: string;
  type: string;
  name: keyof BodyCreateAccount;
  id: string;
  placeholder: string;
  required?: boolean;
  children?: ReactNode;
  register: UseFormRegister<BodyCreateAccount>;
  errorMsg: string | undefined;
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
  errorMsg,
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

      <ErrorForm errorMsg={errorMsg} />
    </div>
  );
}
