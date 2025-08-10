import * as React from 'react';

export function Card({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={'rounded-lg border border-zinc-200 p-4 shadow-sm ' + className} {...props} />
  );
}

