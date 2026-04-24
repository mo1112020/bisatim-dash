'use client';
import { Trash2 } from 'lucide-react';

interface Props {
  action: () => Promise<void>;
  confirm?: string;
}

export function DeleteButton({ action, confirm: msg = 'Delete? This cannot be undone.' }: Props) {
  return (
    <form action={action}>
      <button
        type="submit"
        className="btn btn-danger"
        style={{ padding: '5px 10px' }}
        onClick={e => { if (!window.confirm(msg)) e.preventDefault(); }}
      >
        <Trash2 size={12} />
      </button>
    </form>
  );
}
