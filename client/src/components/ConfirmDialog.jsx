import { useState } from 'react';
import Modal from './Modal';

// Asks "are you sure?". If requireWord is given (e.g. "DELETE"), the user must type it first.
export default function ConfirmDialog({ title = 'Are you sure?', message, confirmLabel = 'Delete', requireWord, onConfirm, onCancel }) {
  const [typed, setTyped] = useState('');
  const blocked = requireWord && typed !== requireWord;

  return (
    <Modal title={title} onClose={onCancel}>
      <p>{message}</p>
      {requireWord && (
        <div className="form-group">
          <label>Type {requireWord} to continue</label>
          <input value={typed} onChange={(e) => setTyped(e.target.value)} />
        </div>
      )}
      <div className="modal-actions">
        <button className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn-primary" disabled={blocked} onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </Modal>
  );
}