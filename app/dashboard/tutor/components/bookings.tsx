"use client";

import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
} from "lucide-react";

export default function Bookings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Bookings</h2>
        <p className="text-muted-foreground mt-1">
          Manage your teaching sessions with students
        </p>
      </div>

      {/* Booking Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
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
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
              <DollarSign className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Earnings</p>
              <p className="text-2xl font-bold">$0</p>
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
            <p className="text-xs text-muted-foreground">
              Students will book your skills once you create them
            </p>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="border-b p-6">
          <h3 className="text-lg font-semibold">Recent Bookings</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Latest booking requests
          </p>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">No recent bookings</p>
          </div>
        </div>
      </div>

      {/* Earnings Summary */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="border-b p-6">
          <h3 className="text-lg font-semibold">Earnings Summary</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Your income overview
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border bg-background">
              <div>
                <p className="font-medium">This Month</p>
                <p className="text-sm text-muted-foreground">Current period</p>
              </div>
              <span className="text-2xl font-bold text-green-600">$0</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border bg-background">
              <div>
                <p className="font-medium">Last Month</p>
                <p className="text-sm text-muted-foreground">Previous period</p>
              </div>
              <span className="text-2xl font-bold">$0</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border bg-background">
              <div>
                <p className="font-medium">Total Earnings</p>
                <p className="text-sm text-muted-foreground">All time</p>
              </div>
              <span className="text-2xl font-bold">$0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Session Tips */}
      <div className="rounded-lg border bg-green-50 dark:bg-green-950 p-6">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              Session Best Practices
            </h4>
            <ul className="space-y-1 text-sm text-green-800 dark:text-green-200">
              <li>• Join sessions 5 minutes early to prepare</li>
              <li>• Keep your teaching materials organized and ready</li>
              <li>• Provide clear instructions and feedback to students</li>
              <li>• Follow up with students after each session</li>
              <li>• Maintain professionalism and punctuality</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
