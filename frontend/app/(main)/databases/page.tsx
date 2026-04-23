import GenerateDatabaseButton from "@/components/database/create-database-button"

const Page = () => {
  return (
    <div className="flex flex-col gap-10 items-center justify-center px-20 pt-10">
      <div className="flex justify-between items-center w-[60%]">
        <p className="font-bold text-xl">My Databases</p>
        <GenerateDatabaseButton />
      </div>
    </div>
  )
}

export default Page
