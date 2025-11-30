'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useParams } from 'next/navigation';

interface TableContextValue {
  tableId: string;
}

const TableContext = createContext<TableContextValue | null>(null);

export function useTable() {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
}

export default function TableLayout({ children }: { children: ReactNode }) {
  const params = useParams();
  const tableId = params.tableId as string;

  return (
    <TableContext.Provider value={{ tableId }}>
      {children}
    </TableContext.Provider>
  );
}
