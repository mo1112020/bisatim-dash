'use client';

import { useFormStatus } from 'react-dom';

type Props = React.ComponentProps<'button'> & {
  pendingLabel?: React.ReactNode;
};

export function SubmitButton({ children, pendingLabel, className = 'btn btn-primary', disabled, ...props }: Props) {
  const { pending } = useFormStatus();
  return (
    <button
      {...props}
      type="submit"
      className={className}
      disabled={pending || disabled}
      aria-busy={pending}
    >
      {pending ? (pendingLabel ?? children) : children}
    </button>
  );
}
