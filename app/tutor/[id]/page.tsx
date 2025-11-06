"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useTutorDetail } from "@/hooks/use-tutor-detail"
import { useParams } from "next/navigation"
import { Loader2, Star, Users, Clock, MessageSquare } from "lucide-react"
import Image from "next/image"

export default function TutorProfilePage() {
  const params = useParams()
  const tutorId = params.id as string
  const { data, isLoading } = useTutorDetail(tutorId)

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Tutor not found</p>
            <Link href="/tutors">
              <Button>Back to Tutors</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const { tutor, skills } = data

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Tutor Header */}
            <Card className="overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10" />
              <CardContent className="pt-0">
                <div className="flex flex-col md:flex-row gap-6 -mt-16 mb-6">
                  <Image
                    src={tutor.avatar || "/placeholder.svg"}
                    alt={tutor.name}
                    width={120}
                    height={120}
                    className="w-32 h-32 rounded-lg border-4 border-background object-cover"
                  />
                  <div className="flex-1 pt-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">{tutor.name}</h1>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tutor.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">{tutor.bio}</p>
                    <div className="flex flex-wrap gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{tutor.rating}</span>
                        <span className="text-muted-foreground">({tutor.totalReviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <span>{tutor.studentsCount} students</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        <span>Response: {tutor.responseTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    {/* <div className="text-right">
                      <p className="text-3xl font-bold text-primary">${tutor.hourlyRate}</p>
                      <p className="text-sm text-muted-foreground">per hour</p>
                    </div> */}
           
                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Enroll now
                    </Button>
                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <MessageSquare className="mr-2 h-5 w-5" />
                  Book a tutorial
                    </Button>
               
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">About</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground leading-relaxed">{tutor.bio}</p>
                </CardContent>
              </Card>
            </div>

            {/* Courses Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Courses by {tutor.name}</h2>
              {skills.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground text-center">No courses available yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {skills.map((skill) => (
                    <Card key={skill.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                      <div className="relative h-40 w-full bg-muted">
                        <Image
                          src={skill.image || "/placeholder.svg"}
                          alt={skill.title}
                          fill
                          className="object-cover"
                        />
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
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{skill.rating}</span>
                            <span className="text-muted-foreground">({skill.reviews})</span>
                          </div>
                          <span className="font-bold text-primary">${skill.price}</span>
                        </div>
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                          Enroll Now
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="text-center pt-8">
              <Link href="/tutors">
                <Button variant="outline">Back to Tutors</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
