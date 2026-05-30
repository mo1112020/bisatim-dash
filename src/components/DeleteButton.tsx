'use client';
import { Trash2 } from 'lucide-react';

interface Props {
  action: () => Promise<void>;
  confirm?: string;
  label?: string;
}

export function DeleteButton({ action, confirm: msg = 'Delete? This cannot be undone.', label }: Props) {
  return (
    <form action={action}>
      <button
        type="submit"
        className={label ? 'btn btn-danger' : 'btn btn-danger'}
        style={label ? undefined : { padding: '5px 10px' }}
        onClick={e => { if (!window.confirm(msg)) e.preventDefault(); }}
      >
        {label ?? <Trash2 size={12} />}
      </button>
    </form>
  );
}
