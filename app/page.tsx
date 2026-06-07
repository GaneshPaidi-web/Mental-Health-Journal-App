import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CalendarIcon,
  LineChartIcon,
  PenIcon,
  SearchIcon,
  ShieldIcon,
  HeartIcon,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-950 to-gray-900 text-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-gray-950/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <PenIcon className="h-6 w-6 text-teal-500" />
            <span className="text-xl font-bold">MindJournal</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="rounded-lg hidden sm:inline-flex">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-teal-600 hover:bg-teal-700 rounded-lg">
                <span className="sm:inline hidden">Get Started</span>
                <span className="sm:hidden">Start</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Your Mental Health Journey Starts Here
                  </h1>
                  <p className="max-w-[600px] text-gray-400 md:text-xl">
                    Track your moods, record your thoughts, and gain insights into your emotional well-being with our
                    secure and intuitive journaling platform.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="bg-teal-600 hover:bg-teal-700 rounded-full">
                      Start Journaling
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <img
                src="https://images.unsplash.com/photo-1517971071642-34a2d3ecc9cd?q=80&w=1000"
                width={550}
                height={550}
                alt="Person writing in journal with a cup of coffee"
                className="mx-auto aspect-video overflow-hidden rounded-3xl object-cover object-center sm:w-full lg:order-last shadow-xl"
              />
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
                <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to track and improve your mental well-being
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow border-gray-800 bg-gray-950">
                <CardHeader>
                  <PenIcon className="h-6 w-6 text-teal-500 mb-2" />
                  <CardTitle>Journal Entries</CardTitle>
                  <CardDescription className="text-gray-400">
                    Create detailed entries with titles, dates, and rich text formatting
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-gray-400">
                  <p>Express yourself freely with our intuitive editor. Tag entries to organize your thoughts.</p>
                </CardContent>
              </Card>
              <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow border-gray-800 bg-gray-950">
                <CardHeader>
                  <LineChartIcon className="h-6 w-6 text-teal-500 mb-2" />
                  <CardTitle>Mood Tracking</CardTitle>
                  <CardDescription className="text-gray-400">
                    Visualize your emotional journey with interactive charts and graphs
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-gray-400">
                  <p>Track patterns in your mood over time and gain insights into your emotional well-being.</p>
                </CardContent>
              </Card>
              <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow border-gray-800 bg-gray-950">
                <CardHeader>
                  <CalendarIcon className="h-6 w-6 text-teal-500 mb-2" />
                  <CardTitle>Calendar View</CardTitle>
                  <CardDescription className="text-gray-400">
                    See your journaling history at a glance with our calendar visualization
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-gray-400">
                  <p>Quickly navigate to past entries and maintain a consistent journaling practice.</p>
                </CardContent>
              </Card>
              <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow border-gray-800 bg-gray-950">
                <CardHeader>
                  <SearchIcon className="h-6 w-6 text-teal-500 mb-2" />
                  <CardTitle>Advanced Search</CardTitle>
                  <CardDescription className="text-gray-400">
                    Find entries by keywords, tags, dates, or mood
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-gray-400">
                  <p>Powerful search capabilities help you revisit important moments and track recurring themes.</p>
                </CardContent>
              </Card>
              <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow border-gray-800 bg-gray-950">
                <CardHeader>
                  <ShieldIcon className="h-6 w-6 text-teal-500 mb-2" />
                  <CardTitle>Privacy & Security</CardTitle>
                  <CardDescription className="text-gray-400">Your data is encrypted and protected</CardDescription>
                </CardHeader>
                <CardContent className="text-gray-400">
                  <p>We prioritize your privacy with secure authentication and data protection measures.</p>
                </CardContent>
              </Card>
              <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow border-gray-800 bg-gray-950">
                <CardHeader>
                  <HeartIcon className="h-6 w-6 text-teal-500 mb-2" />
                  <CardTitle>Wellness Tools</CardTitle>
                  <CardDescription className="text-gray-400">
                    Access guided breathing exercises and affirmations
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-gray-400">
                  <p>Enhance your mental well-being with our collection of wellness resources and tools.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-950">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Track Your Mood Journey
                  </h2>
                  <p className="max-w-[600px] text-gray-400 md:text-xl">
                    Visualize your emotional patterns over time with our intuitive mood tracking tools. Identify
                    triggers and celebrate progress.
                  </p>
                </div>
                <ul className="grid gap-2 py-4">
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-teal-900/50 p-1">
                      <CheckCircle2 className="h-4 w-4 text-teal-500" />
                    </div>
                    <span className="text-gray-300">Daily mood check-ins</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-teal-900/50 p-1">
                      <CheckCircle2 className="h-4 w-4 text-teal-500" />
                    </div>
                    <span className="text-gray-300">Interactive mood charts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-teal-900/50 p-1">
                      <CheckCircle2 className="h-4 w-4 text-teal-500" />
                    </div>
                    <span className="text-gray-300">Pattern recognition insights</span>
                  </li>
                </ul>
              </div>
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000"
                width={550}
                height={400}
                alt="Mood tracking chart visualization"
                className="mx-auto aspect-video overflow-hidden rounded-3xl object-cover object-center shadow-xl"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-900 to-gray-950">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Start Your Mental Health Journey Today
                </h2>
                <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of users who are improving their mental well-being through journaling
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="bg-teal-600 hover:bg-teal-700 rounded-full gap-2">
                    Create Free Account
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-gray-800 py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-gray-400 md:text-left">
            © 2025 MindJournal. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-sm text-gray-400 underline-offset-4 hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-gray-400 underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="/contact" className="text-sm text-gray-400 underline-offset-4 hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
