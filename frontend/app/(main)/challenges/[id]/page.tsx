"use client"

import DatabaseSchemaVisualizer from "@/components/database/database-schema-visualizer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDatabase } from "@/hooks/database"
import { useChallenge } from "@/hooks/challenge"
import { useParams } from "next/navigation"
import SqlEditor from "@/components/sql-editor/editor"
import PageLoading from "@/components/page-loading"

const Page = () => {
  const { id } = useParams<{ id: string }>()
  const { challenge } = useChallenge(id)
  const { database } = useDatabase(challenge?.database_id ?? "")

  if (!challenge || !database) return <PageLoading text="Loading challenge..." />

  return (
    <Tabs defaultValue="schema" className="min-h-screen">
      <TabsList variant={"line"}>
        <TabsTrigger value="schema">Schema</TabsTrigger>
        <TabsTrigger value="editor">Assignment</TabsTrigger>
      </TabsList>
      <TabsContent value="schema">
        <DatabaseSchemaVisualizer {...database} />
      </TabsContent>
      <TabsContent value="editor">
        <SqlEditor database={database} challenge={challenge} />
      </TabsContent>
    </Tabs>
  )
}

export default Page
