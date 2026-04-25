"use client"

import DatabaseSchemaVisualizer from "@/components/database/database-schema-visualizer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDatabase } from "@/hooks/database"
import { useParams } from "next/navigation"

const Page = () => {
  const { id } = useParams<{ id: string }>()
  const { database } = useDatabase(id)

  if (!database) return <p>Loading...</p>

  return (
    <Tabs defaultValue="schema" className="min-h-screen">
      <TabsList variant={"line"}>
        <TabsTrigger value="schema">Schema</TabsTrigger>
        <TabsTrigger value="editor">SQL Editor</TabsTrigger>
        <TabsTrigger value="Settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="schema">
        <DatabaseSchemaVisualizer {...database} />
      </TabsContent>
    </Tabs>
  )
}

export default Page
