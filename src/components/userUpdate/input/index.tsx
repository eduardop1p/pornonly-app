import { upperFirst } from 'lodash';
import type { ReactNode } from 'react';
import type { FieldError, UseFormRegister } from 'react-hook-form';

import styles from './styles.module.css';

import { BodyUserUpdate } from '..';

import ErrorMsg from '@/components/form/errorMsg';

interface Props {
  defaultValue?: string;
  label: string;
  type: string;
  name: keyof BodyUserUpdate;
  id: string;
  placeholder: string;
  children?: ReactNode;
  register: UseFormRegister<BodyUserUpdate>;
  errors: { message?: string; classError?: FieldError };
}

export default function Input({
  defaultValue,
  type,
  name,
  id,
  placeholder,
  label,
  children,
  register,
  errors,
}: Props) {
  // const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   const containerBtns = document.querySelectorAll(
  //     '.container-btns > button'
  //   ) as NodeListOf<HTMLButtonElement>;
  //   const value = event.currentTarget.value;
  //   if (
  //     value === defaultValue ||
  //     (!value && typeof defaultValue === 'undefined')
  //   ) {
  //     containerBtns.forEach(btn => {
  //       btn.classList.add('equal-value');
  //       btn.disabled = true;
  //     });
  //   } else {
  //     containerBtns.forEach(btn => {
  //       btn.classList.remove('equal-value');
  //       btn.disabled = false;
  //     });
  //   }
  // };

  return (
    <div className={styles.container}>
      <div className={styles['container-input']}>
        <label htmlFor={id}>{upperFirst(label)}</label>
        <input
          type={type}
          id={id}
          defaultValue={defaultValue}
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
