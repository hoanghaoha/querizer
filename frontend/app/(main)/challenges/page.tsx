import GenerateChallengeButton from "@/components/challenges/generate-challenge-button"

const Page = () => {
  return (
    <div className="flex flex-col gap-10 items-center justify-center px-20 pt-10">
      <div className="flex justify-between items-center w-[60%]">
        <p className="font-bold text-xl">My Challenges</p>
        <GenerateChallengeButton />
      </div>
    </div>
  )
}

export default Page
