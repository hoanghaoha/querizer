"use client"

import ChallengeCard from "@/components/challenges/challenge-card"
import GenerateChallengeButton from "@/components/challenges/challenge-generate-button"
import { useChallenges } from "@/hooks/challenge"

const Page = () => {
  const { challenges, refresh } = useChallenges()
  return (
    <div className="flex flex-col gap-10 pt-10 mx-auto w-[60%]">
      <div className="flex justify-between items-center">
        <p className="font-bold text-xl">My Challenges</p>
        <GenerateChallengeButton onSuccess={refresh} />
      </div>
      <div className="flex flex-col gap-2">
        {challenges?.map(challenge => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onUpdated={refresh}
            onDeleted={refresh}
          />
        ))}
      </div>
    </div>
  )
}

export default Page
