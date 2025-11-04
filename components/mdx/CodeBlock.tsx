"use client";
import { useState } from 'react';

export default function CodeBlock(props: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    const text = typeof props.children === 'string' ? props.children : String(props.children ?? '');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };
  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={onCopy}
        aria-label="Copy code"
        style={{
          position: 'absolute', right: 8, top: 8, zIndex: 1,
          padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.2)',
          background: 'rgba(0,0,0,0.3)', color: 'white', cursor: 'pointer'
        }}
      >{copied ? 'Copied' : 'Copy'}</button>
      <pre {...props} />
    </div>
  );
}

