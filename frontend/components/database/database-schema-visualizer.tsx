"use client"

import { Database, DatabaseColumn, DatabaseQueryData, DatabaseSchema } from "@/lib/types"
import QueryResultDrawer from "./query-result-drawer"
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeProps,
  type NodeMouseHandler,
} from "@xyflow/react"
import { useEffect, useMemo, useState } from "react"
import { useDatabaseQuery } from "@/hooks/database"
import { toast } from "sonner"

type TableNodeData = {
  name: string
  row_count: number
  columns: DatabaseColumn[]
  referencedCols: Set<string>
}

function TableNode({ data }: NodeProps<Node<TableNodeData>>) {
  return (
    <div className="rounded-md border border-border bg-card text-card-foreground shadow-sm min-w-55 hover:border-2 hover:border-accent cursor-pointer">
      <div className="px-3 py-2 border-b border-border bg-muted rounded-t-md">
        <div className="font-semibold text-sm">{data.name}</div>
        <div className="text-xs text-muted-foreground">{data.row_count} rows</div>
      </div>
      <div className="text-xs">
        {data.columns.map((col) => {
          const isFK = col.generator?.method === "foreign_key"
          const isReferenced = data.referencedCols.has(col.name)
          const tag = col.primary_key ? "PK" : isFK ? "FK" : ""
          return (
            <div
              key={col.name}
              className="relative flex justify-between gap-3 px-3 py-1.5 border-b border-border last:border-0"
            >
              {isReferenced && (
                <Handle
                  id={`${col.name}-target`}
                  type="target"
                  position={Position.Left}
                  className="bg-primary! w-2! h-2!"
                />
              )}
              <span className="font-medium">
                {col.name}
                {tag && <span className="ml-1 text-[10px] text-primary font-bold">{tag}</span>}
              </span>
              <span className="text-muted-foreground">{col.type}</span>
              {isFK && (
                <Handle
                  id={`${col.name}-source`}
                  type="source"
                  position={Position.Right}
                  className="bg-primary! w-2! h-2!"
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const nodeTypes = { table: TableNode }

function buildGraph(schema: DatabaseSchema): { nodes: Node<TableNodeData>[]; edges: Edge[] } {
  const cols = 3
  const colWidth = 320
  const rowHeight = 360

  const referenced: Record<string, Set<string>> = {}
  const edges: Edge[] = []
  for (const t of schema.tables) {
    for (const col of t.columns) {
      if (col.generator?.method === "foreign_key" && col.generator.references) {
        const [refTable, refCol] = col.generator.references.split(".")
          ; (referenced[refTable] ??= new Set()).add(refCol)
        edges.push({
          id: `${t.name}.${col.name}->${refTable}.${refCol}`,
          source: t.name,
          sourceHandle: `${col.name}-source`,
          target: refTable,
          targetHandle: `${refCol}-target`,
        })
      }
    }
  }

  const nodes: Node<TableNodeData>[] = schema.tables.map((t, i) => ({
    id: t.name,
    type: "table",
    position: { x: (i % cols) * colWidth, y: Math.floor(i / cols) * rowHeight },
    data: {
      name: t.name,
      row_count: t.row_count ?? 0,
      columns: t.columns,
      referencedCols: referenced[t.name] ?? new Set(),
    },
  }))

  return { nodes, edges }
}

function Flow({ schema, onTableClick }: { schema: DatabaseSchema; onTableClick: (name: string) => void }) {
  const { nodes: initNodes, edges: initEdges } = useMemo(() => buildGraph(schema), [schema])
  const [nodes, , onNodesChange] = useNodesState<Node<TableNodeData>>(initNodes)
  const [edges, , onEdgesChange] = useEdgesState<Edge>(initEdges)

  useEffect(() => {
    const id = "rf-css"
    if (document.getElementById(id)) return
    const link = document.createElement("link")
    link.id = id
    link.rel = "stylesheet"
    link.href = "https://cdn.jsdelivr.net/npm/@xyflow/react@12/dist/style.css"
    document.head.appendChild(link)
  }, [])

  const handleNodeClick: NodeMouseHandler<Node<TableNodeData>> = (_, node) => {
    onTableClick(node.id)
  }

  return (
    <div className="w-full h-full min-h-0">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
      >
        <Background />
      </ReactFlow>
    </div>
  )
}

function TableDataDrawer({ open, onClose, databaseId, tableName }: {
  open: boolean
  onClose: () => void
  databaseId: string
  tableName: string
}) {
  const [data, setData] = useState<DatabaseQueryData | null>(null)
  const { query, querying } = useDatabaseQuery()

  useEffect(() => {
    if (!open) return
    const runQuery = async () => {
      const result = await query({ id: databaseId, dql: `SELECT * FROM ${tableName}` })
      if (result) {
        setData(result)
      } else {
        toast.error("Query failed.")
      }
    }
    runQuery()
  }, [open, databaseId, tableName])

  return (
    <QueryResultDrawer
      open={open}
      onClose={onClose}
      title={tableName}
      data={data}
      loading={querying}
    />
  )
}

export default function DatabaseSchemaVisualizer({ id, db_schema }: Database) {
  const [selectedTable, setSelectedTable] = useState<string | null>(null)

  return (
    <ReactFlowProvider>
      <Flow schema={db_schema as DatabaseSchema} onTableClick={setSelectedTable} />
      {selectedTable && (
        <TableDataDrawer
          open={!!selectedTable}
          onClose={() => setSelectedTable(null)}
          databaseId={id}
          tableName={selectedTable}
        />
      )}
    </ReactFlowProvider>
  )
}
