"use client";

import { Search, BookOpen, Star, Clock } from "lucide-react";
import { useState } from "react";

export default function Skills() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Discover Skills</h2>
        <p className="text-muted-foreground mt-1">
          Find the perfect tutor for your learning goals
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search for skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {/* Popular Categories */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="border-b p-6">
          <h3 className="text-lg font-semibold">Popular Categories</h3>
        </div>
        <div className="p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Programming",
              "Design",
              "Business",
              "Languages",
              "Music",
              "Fitness",
            ].map((category) => (
              <button
                key={category}
                className="flex items-center gap-3 rounded-lg border bg-background p-4 hover:bg-accent transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">{category}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Tutors */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="border-b p-6">
          <h3 className="text-lg font-semibold">Featured Tutors</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Top-rated tutors in your area
          </p>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Start searching to discover amazing tutors
            </p>
            <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Browse All Tutors
            </button>
          </div>
        </div>
      </div>

      {/* My Learning */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="border-b p-6">
          <h3 className="text-lg font-semibold">My Learning</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border bg-background">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Active Courses</p>
                  <p className="text-sm text-muted-foreground">0 enrolled</p>
                </div>
              </div>
              <span className="text-2xl font-bold">0</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border bg-background">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">Completed</p>
                  <p className="text-sm text-muted-foreground">
                    Skills mastered
                  </p>
                </div>
              </div>
              <span className="text-2xl font-bold">0</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border bg-background">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Learning Hours</p>
                  <p className="text-sm text-muted-foreground">Total time</p>
                </div>
              </div>
              <span className="text-2xl font-bold">0h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
