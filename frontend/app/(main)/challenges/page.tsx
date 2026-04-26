import GenerateChallengeButton from "@/components/challenges/challenge-generate-button"

const Page = () => {
  return (
    <div className="flex flex-col gap-10 pt-10 mx-auto w-[60%]">
      <div className="flex justify-between items-center">
        <p className="font-bold text-xl">My Challenges</p>
        <GenerateChallengeButton />
      </div>
    </div>
  )
}

export default Page
