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
    <Tabs defaultValue="schema" className="min-h-screen">
      <TabsList variant={"line"}>
        <TabsTrigger value="schema">Schema</TabsTrigger>
        <TabsTrigger value="editor">SQL Editor</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="schema">
        <DatabaseSchemaVisualizer {...database} />
      </TabsContent>
      <TabsContent value="editor">
        <SqlEditor database={database} />
      </TabsContent>
      <TabsContent value="settings">
        <DatabaseSettings {...database} />
      </TabsContent>
    </Tabs>
  )
}

export default Page
