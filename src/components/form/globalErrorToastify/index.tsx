'use client';

import { useCallback, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const toastId = 'toast-id';

export function GlobalErrorToastify({ errorMsg }: { errorMsg?: string }) {
  const handleToast = useCallback(() => {
    if (errorMsg) {
      toast.error(errorMsg, {
        position: 'bottom-center',
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        closeButton: false,
        progress: undefined,
        toastId,
        className: 'toast-custom-error',
        bodyClassName: 'toast-custom-error-text',
      });
    }
  }, [errorMsg]);

  useEffect(() => {
    handleToast();
  }, [handleToast]);

  return (
    errorMsg && <ToastContainer className="container-toast-custom-error" />
  );
}
