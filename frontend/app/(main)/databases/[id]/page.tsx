"use client"

import SqlEditor from "@/components/sql-editor/editor"
import DatabaseSchemaVisualizer from "@/components/database/database-schema-visualizer"
import DatabaseSettings from "@/components/database/database-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDatabase } from "@/hooks/database"
import { useParams } from "next/navigation"
import PageLoading from "@/components/page-loading"

const Page = () => {
  const { id } = useParams<{ id: string }>()
  const { database } = useDatabase(id)

  if (!database) return <PageLoading text="Loading database..." />

  return (
    <Tabs defaultValue="schema" className="h-dvh flex flex-col gap-0">
      <TabsList variant={"line"} className="shrink-0">
        <TabsTrigger value="schema">Schema</TabsTrigger>
        <TabsTrigger value="editor">SQL Editor</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="schema" className="flex-1 overflow-y-auto min-h-0">
        <DatabaseSchemaVisualizer {...database} />
      </TabsContent>
      <TabsContent value="editor" className="flex-1 overflow-y-auto min-h-0">
        <SqlEditor database={database} />
      </TabsContent>
      <TabsContent value="settings" className="flex-1 overflow-y-auto min-h-0">
        <DatabaseSettings {...database} />
      </TabsContent>
    </Tabs>
  )
}

export default Page
