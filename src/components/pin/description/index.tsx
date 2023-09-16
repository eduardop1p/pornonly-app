/* eslint-disable prettier/prettier */
'use client';

import { upperFirst } from 'lodash';
import { useState } from 'react';

import styles from './styles.module.css';

export default function Description({ description }: { description: string }) {
  const [descriptionLength] = useState(150);
  const [showDescription, setShowDescription] = useState(false);

  return (
    <div>
      {!showDescription && description.length > descriptionLength
        ? upperFirst(description.slice(0, descriptionLength))
        : upperFirst(description)}
      <button
        type="button"
        onClick={() => setShowDescription(!showDescription)}
        className={styles['btn-description']}
      >
        {!showDescription && description.length > descriptionLength
          ? '...mais'
          : description.length > descriptionLength ? 'menos' : ''}
      </button>
    </div>
  );
}
