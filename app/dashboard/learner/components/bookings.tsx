"use client";

import {
  Calendar,
  Clock,
  Video,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function Bookings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Bookings</h2>
        <p className="text-muted-foreground mt-1">
          Manage your scheduled learning sessions
        </p>
      </div>

      {/* Booking Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Upcoming</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cancelled</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="border-b p-6">
          <h3 className="text-lg font-semibold">Upcoming Sessions</h3>
          <p className="text-sm text-muted-foreground mt-1">Next 30 days</p>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              No upcoming sessions
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Book a session with your favorite tutor to get started
            </p>
            <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Find a Tutor
            </button>
          </div>
        </div>
      </div>

      {/* Past Sessions */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="border-b p-6">
          <h3 className="text-lg font-semibold">Past Sessions</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Your learning history
          </p>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              No past sessions yet
            </p>
          </div>
        </div>
      </div>

      {/* Booking Tips */}
      <div className="rounded-lg border bg-blue-50 dark:bg-blue-950 p-6">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Booking Tips
            </h4>
            <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li>• Book sessions at least 24 hours in advance</li>
              <li>• Cancel or reschedule 12 hours before to avoid fees</li>
              <li>• Join sessions 5 minutes early to test your connection</li>
              <li>• Keep your learning materials ready before the session</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
