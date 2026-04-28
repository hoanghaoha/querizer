"use client"

import DatabaseSchemaVisualizer from "@/components/database/database-schema-visualizer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDatabase } from "@/hooks/database"
import { useChallenge } from "@/hooks/challenge"
import { useParams } from "next/navigation"
import SqlEditor from "@/components/sql-editor/editor"
import PageLoading from "@/components/page-loading"
import ChallengeContent from "@/components/challenges/challenge-content"

const Page = () => {
  const { id } = useParams<{ id: string }>()
  const { challenge } = useChallenge(id)
  const { database } = useDatabase(challenge?.database_id ?? "")

  if (!challenge || !database) return <PageLoading text="Loading challenge..." />

  return (
    <Tabs defaultValue="topic" className="h-dvh flex flex-col gap-0">
      <TabsList variant={"line"} className="shrink-0">
        <TabsTrigger value="topic">Topic</TabsTrigger>
        <TabsTrigger value="schema">Schema</TabsTrigger>
        <TabsTrigger value="editor">Assignment</TabsTrigger>
      </TabsList>
      <TabsContent forceMount value="topic" className="flex-1 overflow-y-auto min-h-0 data-[state=inactive]:hidden">
        <ChallengeContent challenge={challenge} />
      </TabsContent>
      <TabsContent forceMount value="schema" className="flex-1 overflow-y-auto min-h-0 data-[state=inactive]:hidden">
        <DatabaseSchemaVisualizer {...database} />
      </TabsContent>
      <TabsContent forceMount value="editor" className="flex-1 overflow-y-auto min-h-0 data-[state=inactive]:hidden">
        <SqlEditor database={database} challenge={challenge} />
      </TabsContent>
    </Tabs>
  )
}

export default Page
