"use client"

import { Challenge } from "@/lib/types"
import { Button } from "../ui/button"
import ReactMarkdown from "react-markdown"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"
import { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemTitle } from "../ui/item"
import { IconArrowRight, IconGlobe, IconLock, IconTrash } from "@tabler/icons-react"
import { Badge } from "../ui/badge"
import { useRouter } from "next/navigation"
import { useDatabase } from "@/hooks/database"
import { useChallengeDelete, useChallengeUpdate } from "@/hooks/challenge"
import { CHALLENGE_LEVEL, DATABASE_INDUSTRY } from "@/lib/const"

const ChallengeCard = ({ challenge, onDeleted, onUpdated }: { challenge: Challenge, onDeleted?: () => void, onUpdated?: () => void }) => {
  const { database } = useDatabase(challenge.database_id)
  const { update, updating } = useChallengeUpdate(onUpdated)
  const { deleteChallenge, deleting } = useChallengeDelete(onDeleted)
  const router = useRouter()

  const industryIcon = DATABASE_INDUSTRY.find(i => i.title === database?.industry)
  const levelInfo = CHALLENGE_LEVEL.find(l => l.title === challenge.level)

  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>
          <HoverCard>
            <HoverCardTrigger className="hover:underline flex items-center justify-start gap-2">
              <p>{challenge.name.length > 50 ? challenge.name.slice(0, 40) + "..." : challenge.name}</p>
              {industryIcon && (
                <Badge variant="outline" className="gap-1">
                  <industryIcon.icon className="size-3" />
                  {database?.industry}
                </Badge>
              )}
            </HoverCardTrigger>
            <HoverCardContent className="max-h-[50vh] overflow-y-auto border-primary border-2" align="start">
              <ReactMarkdown
                components={{
                  h3: ({ children }) => <h3 className="mt-4 mb-2 text-base font-semibold first:mt-0">{children}</h3>,
                  p: ({ children }) => <p className="mb-2">{children}</p>,
                  ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5">{children}</ul>,
                  ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5">{children}</ol>,
                  code: ({ children }) => <code className="bg-muted rounded px-1 py-0.5 font-mono text-[0.85em]">{children}</code>,
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                }}
              >{challenge.description}</ReactMarkdown>
            </HoverCardContent>
          </HoverCard>
        </ItemTitle>
        <ItemDescription className={`font-bold flex items-center gap-1 ${levelInfo?.color}`}>
          {levelInfo && <levelInfo.icon className="size-4" />}
          {challenge.level}
        </ItemDescription>
      </ItemContent>

      <ItemActions>
        <Button
          size="icon"
          variant="outline"
          disabled={updating}
          title={challenge.public ? "Make private" : "Make public"}
          onClick={async () => await update({ id: challenge.id, public: !challenge.public })}
        >
          {challenge.public
            ? <IconGlobe className="size-4 text-emerald-300" />
            : <IconLock className="size-4 text-muted-foreground" />
          }
        </Button>
        <Button size="icon" onClick={() => router.push(`/challenges/${challenge.id}`)}>
          <IconArrowRight />
        </Button>
        <Button disabled={deleting} size="icon" variant="destructive" onClick={async () => await deleteChallenge({ id: challenge.id })}>
          <IconTrash />
        </Button>
      </ItemActions>
      <ItemFooter className="flex flex-row items-center justify-between">
        <div className="flex flex-row gap-2 flex-wrap">
          {challenge.topics.map((topic, i) => (
            <Badge key={i} variant="secondary">{topic}</Badge>
          ))}
        </div>
      </ItemFooter>
    </Item>
  )
}

export default ChallengeCard
