"use client";

import { Star, ThumbsUp, MessageSquare, TrendingUp } from "lucide-react";

export default function Reviews() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Reviews & Ratings</h2>
        <p className="text-muted-foreground mt-1">
          Share your learning experience
        </p>
      </div>

      {/* Review Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Given</p>
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
              <p className="text-sm text-muted-foreground">Helpful</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Responses</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Reviews */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Pending Reviews</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Sessions waiting for your feedback
              </p>
            </div>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              0
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">No pending reviews</p>
          </div>
        </div>
      </div>

      {/* My Reviews */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="border-b p-6">
          <h3 className="text-lg font-semibold">My Reviews</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Your feedback history
          </p>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Star className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">No reviews yet</p>
            <p className="text-xs text-muted-foreground mb-4">
              Complete a session to leave your first review
            </p>
          </div>
        </div>
      </div>

      {/* Review Guidelines */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="border-b p-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Review Guidelines</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-1">Be Honest and Fair</h4>
              <p className="text-muted-foreground">
                Provide constructive feedback based on your actual experience
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Be Specific</h4>
              <p className="text-muted-foreground">
                Mention what you liked or what could be improved
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Be Respectful</h4>
              <p className="text-muted-foreground">
                Keep your reviews professional and courteous
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Be Timely</h4>
              <p className="text-muted-foreground">
                Leave reviews within 7 days of completing a session
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
