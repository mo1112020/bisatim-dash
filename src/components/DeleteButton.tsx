'use client';

import { useFormStatus } from 'react-dom';
import { Trash2 } from 'lucide-react';

interface Props {
  action: () => Promise<void>;
  confirm?: string;
  label?: string;
}

export function DeleteButton({ action, confirm: msg = 'Delete? This cannot be undone.', label }: Props) {
  return (
    <form action={action}>
      <DeleteButtonInner msg={msg} label={label} />
    </form>
  );
}

function DeleteButtonInner({ msg, label }: { msg: string; label?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="btn btn-danger"
      style={label ? undefined : { padding: '5px 10px' }}
      disabled={pending}
      aria-busy={pending}
      onClick={e => { if (!window.confirm(msg)) e.preventDefault(); }}
    >
      {pending ? '…' : (label ?? <Trash2 size={12} />)}
    </button>
  );
}
