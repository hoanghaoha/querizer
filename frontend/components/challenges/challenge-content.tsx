import ReactMarkdown from "react-markdown"
import { Challenge } from "@/lib/types"
import { Badge } from "../ui/badge"
import { CHALLENGE_LEVEL } from "@/lib/const"

const ChallengeContent = ({ challenge }: { challenge: Challenge }) => {
  const levelInfo = CHALLENGE_LEVEL.find(l => l.title === challenge.level)

  return (
    <div className="mx-auto w-[60%] py-10 flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold">{challenge.name}</h1>
        <div className="flex flex-wrap items-center gap-2">
          {levelInfo && (
            <Badge variant="outline" className={`gap-1 ${levelInfo.color}`}>
              <levelInfo.icon className="size-3" />
              {challenge.level}
            </Badge>
          )}
          {challenge.topics.map((topic, i) => (
            <Badge key={i} variant="secondary">{topic}</Badge>
          ))}
        </div>
      </div>

      <div className="text-sm leading-relaxed">
        <ReactMarkdown
          components={{
            h3: ({ children }) => <h3 className="mt-6 mb-2 text-base font-semibold first:mt-0">{children}</h3>,
            p: ({ children }) => <p className="mb-2">{children}</p>,
            ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5">{children}</ul>,
            ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5">{children}</ol>,
            code: ({ children }) => <code className="bg-muted rounded px-1 py-0.5 font-mono text-[0.85em]">{children}</code>,
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          }}
        >
          {challenge.description}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default ChallengeContent
