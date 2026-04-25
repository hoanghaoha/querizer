"use client"

import DatabaseCard from "@/components/database/database-card"
import GenerateDatabaseButton from "@/components/database/generate-database-button"
import { useDatabases } from "@/hooks/database"

const Page = () => {
  const { databases, refresh } = useDatabases()
  return (
    <div className="flex flex-col gap-10 pt-10 mx-auto w-[60%]">
      <div className="flex justify-between items-center">
        <p className="font-bold text-xl">My Databases</p>
        <GenerateDatabaseButton onClick={refresh} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {databases?.map(database => {
          return (
            <DatabaseCard key={database.id} {...database} />
          )
        }
        )}
      </div>
    </div>
  )
}

export default Page
