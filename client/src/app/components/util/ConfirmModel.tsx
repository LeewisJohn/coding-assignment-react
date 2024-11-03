import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import ConfirmModal from './Model';
import toast from 'react-hot-toast';

export interface ConfirmOptions {
  confirmText?: string;
  successText?: string;
  btnName?: string;
  onConfirm?: () => void;
}

const ConfirmModalWrapper: React.FC<ConfirmOptions & { onClose: () => void }> = ({
  confirmText,
  successText,
  btnName,
  onConfirm,
  onClose
}) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    onConfirm?.();
    successText && toast.success(successText);
    onClose();
  };

  return (
    <ConfirmModal onClose={onClose} className='max-w-[19rem]'>
      <>
        <span>{confirmText}</span>
        <div className='mt-8 flex justify-center gap-x-6'>
          <button
            onClick={onClose}
            className='btn bg-transparent text-black hover:bg-green-100 active:bg-green-200'
          >
            Cancel
          </button>
          <button onClick={handleConfirm} className='btn bg-red-600 hover:bg-red-700'>
            {loading ? 'Proceeding ... ' : btnName}
          </button>
        </div>
      </>
    </ConfirmModal>
  );
};

const showConfirmModal = (params: ConfirmOptions) => {
  const modalContainer = document.createElement('div');
  document.body.appendChild(modalContainer);
  const root = createRoot(modalContainer);

  const handleClose = () => {
    root.unmount();
    document.body.removeChild(modalContainer);
  };

  root.render(<ConfirmModalWrapper {...params} onClose={handleClose} />);
};

export default showConfirmModal;
