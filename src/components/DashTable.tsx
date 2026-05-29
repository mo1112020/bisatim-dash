const TH: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 16px',
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'var(--dash-muted)',
  borderBottom: '1px solid var(--dash-border)',
  background: 'rgba(0,0,0,0.015)',
};

const TD: React.CSSProperties = {
  padding: '12px 16px',
  borderBottom: '1px solid var(--dash-border)',
  fontSize: 13,
};

export function DashTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="dash-panel" style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>{children}</table>
    </div>
  );
}

export function DashTh({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <th style={{ ...TH, ...style }}>{children}</th>;
}

export function DashTd({ children, style, colSpan }: { children: React.ReactNode; style?: React.CSSProperties; colSpan?: number }) {
  return <td style={{ ...TD, ...style }} colSpan={colSpan}>{children}</td>;
}

export function DashEmpty({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <tr>
      <DashTd colSpan={colSpan} style={{ textAlign: 'center', color: 'var(--dash-muted)', padding: '40px 16px' }}>
        {children}
      </DashTd>
    </tr>
  );
}
