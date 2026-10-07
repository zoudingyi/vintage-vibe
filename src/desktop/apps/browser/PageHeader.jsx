import React from 'react';

export default function PageHeader({ eyebrow, title, children }) {
  return (
    <header className="vapornet-page-header">
      <span className="vapornet-page-eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      {children}
    </header>
  );
}
