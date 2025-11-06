"use client";

import { Star, ThumbsUp, MessageSquare, TrendingUp, Award } from "lucide-react";

export default function Reviews() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Reviews & Ratings</h2>
        <p className="text-muted-foreground mt-1">
          Your feedback from students
        </p>
      </div>

      {/* Review Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
              <p className="text-2xl font-bold">0.0</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reviews</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <ThumbsUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Positive</p>
              <p className="text-2xl font-bold">0%</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <Award className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Response</p>
              <p className="text-2xl font-bold">0%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="border-b p-6">
          <h3 className="text-lg font-semibold">Rating Breakdown</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Distribution of your ratings
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 transition-all"
                    style={{ width: "0%" }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  0
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="border-b p-6">
          <h3 className="text-lg font-semibold">Recent Reviews</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Latest feedback from students
          </p>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">No reviews yet</p>
            <p className="text-xs text-muted-foreground">
              Complete sessions to receive reviews from students
            </p>
          </div>
        </div>
      </div>

      {/* Performance Tips */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="border-b p-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Improve Your Rating</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-lg border bg-background">
              <h4 className="font-medium mb-2">Be Responsive</h4>
              <p className="text-sm text-muted-foreground">
                Reply to messages and booking requests within 24 hours
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-background">
              <h4 className="font-medium mb-2">Quality Content</h4>
              <p className="text-sm text-muted-foreground">
                Provide well-structured lessons with clear learning outcomes
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-background">
              <h4 className="font-medium mb-2">Professional Conduct</h4>
              <p className="text-sm text-muted-foreground">
                Maintain punctuality and professionalism in all interactions
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-background">
              <h4 className="font-medium mb-2">Follow Up</h4>
              <p className="text-sm text-muted-foreground">
                Check in with students after sessions to ensure satisfaction
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
