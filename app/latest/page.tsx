"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useSkills } from "@/hooks/use-skills"
import { useTutors } from "@/hooks/use-tutors"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import Image from "next/image"

export default function LatestPage() {
  const { data: skills, isLoading: skillsLoading } = useSkills()
  const { data: tutors, isLoading: tutorsLoading } = useTutors()
  const router = useRouter()

  const latestSkills =
    skills?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6) || []
  const newTutors = tutors?.slice(0, 3) || []

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-foreground">Latest Sessions & Updates</h1>
              <p className="text-xl text-muted-foreground">
                Discover newly added courses and join the newest instructors
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Latest Courses</h2>

              {skillsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {latestSkills.map((skill) => (
                    <Card key={skill.id} className="hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                      <div className="relative w-full aspect-4/3 overflow-hidden bg-muted">
                        <Image
                          src={skill.image || "/placeholder.svg"}
                          alt={skill.title}
                          fill
                          className="object-cover object-center"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">New</Badge>
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-lg text-foreground">{skill.title}</CardTitle>
                            <CardDescription className="text-sm">{skill.category}</CardDescription>
                          </div>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{skill.level}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">{skill.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold">{skill.rating}</span>
                            <span className="text-muted-foreground">({skill.reviews})</span>
                          </div>
                          <span className="font-bold text-primary">${skill.price}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Image
                            src={skill.tutorAvatar || "/placeholder.svg"}
                            alt={skill.tutorName}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <Link href={`/tutor/${skill.tutorId}`} className="hover:text-primary">
                            {skill.tutorName}
                          </Link>
                        </div>
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                          <Link href={`/course/${skill.id}`} className="w-full">
                            View Course
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">New Tutors</h2>
              {tutorsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {newTutors.map((tutor) => (
                    <Card key={tutor.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <Image
                            src={tutor.avatar || "/placeholder.svg"}
                            alt={tutor.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <CardTitle className="text-lg text-foreground">{tutor.name}</CardTitle>
                            <CardDescription className="text-sm">{tutor.specialties[0]}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">{tutor.bio}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold">{tutor.rating}</span>
                          <span className="text-muted-foreground">({tutor.totalReviews} reviews)</span>
                        </div>
                        <Link
                          href={`/tutor/${tutor.id}`}
                          onClick={(e) => {
                            e.preventDefault()
                            router.push(`/tutor/${tutor.id}`)
                          }}
                          className="inline-flex items-center justify-center rounded-md font-medium transition-colors px-3 py-1.5 text-sm border border-border bg-transparent text-foreground w-full text-center"
                        >
                          View Profile
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="text-center pt-8">
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
