"use client"

import { DatabaseQueryData } from "@/lib/types"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"

type Props = {
  open: boolean
  onClose: () => void
  title: string
  data: DatabaseQueryData | null
  loading?: boolean
  error?: string | null
}

export default function QueryResultDrawer({ open, onClose, title, data, loading, error }: Props) {
  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()} direction="bottom">
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-auto flex-1 px-4 pb-4">
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-4">Loading...</p>
          ) : error ? (
            <pre className="text-sm font-mono text-destructive bg-destructive/10 rounded p-3">{error}</pre>
          ) : data ? (
            data.rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">Query returned 0 rows.</p>
            ) : (
              <table className="w-full caption-bottom text-xs">
                <thead className="sticky top-0 z-10 bg-muted">
                  <tr className="border-b">
                    {data.columns.map(col => (
                      <th key={col} className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {data.rows.map((row, i) => (
                    <tr key={i} className="border-b hover:bg-muted/50">
                      {(row as unknown[]).map((cell, j) => (
                        <td key={j} className="px-2 py-1.5 align-middle whitespace-nowrap">
                          {cell === null
                            ? <span className="text-muted-foreground italic">null</span>
                            : String(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : null}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
