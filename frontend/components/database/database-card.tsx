import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Database } from "@/lib/types"
import { DATABASE_INDUSTRY } from "@/lib/const"

const DatabaseCard = (database: Database) => {
  const IndustryIcon = DATABASE_INDUSTRY.find(i => i.title == database.industry)?.icon

  return (
    <Link href={`/databases/${database.id}`} className="flex flex-col justify-between h-min">
      <Card className="hover:border hover:border-foreground transition-colors cursor-pointer h-full flex flex-col">
        <CardHeader>
          <CardTitle>{database.name}</CardTitle>
          <CardDescription className="line-clamp-1">
            {database.description || "No description"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <Badge variant={"outline"} className="gap-1">
            {IndustryIcon && <IndustryIcon />}
            {database.industry}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  )
}

export default DatabaseCard
