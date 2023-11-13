'use client';

import { useCallback, useEffect, ReactNode } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const toastId = 'toast-id';

export function GlobalSuccessToastify({
  successMsg,
  children,
}: {
  successMsg?: string;
  children?: ReactNode;
}) {
  const handleToast = useCallback(() => {
    if (successMsg) {
      toast.success(successMsg, {
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
        className: 'toast-custom-success',
        bodyClassName: 'toast-custom-success-text',
        // eslint-disable-next-line
        icon(props) {
          return children;
        },
      });
    }
  }, [successMsg, children]);

  useEffect(() => {
    handleToast();
  }, [handleToast]);

  return (
    successMsg && <ToastContainer className="container-toast-custom-success" />
  );
}
