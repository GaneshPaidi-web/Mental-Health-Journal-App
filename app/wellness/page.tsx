"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

export default function WellnessPage() {
  const [breathingProgress, setBreathingProgress] = useState(0)
  const [breathingState, setBreathingState] = useState<"idle" | "inhale" | "hold" | "exhale">("idle")
  const [breathingActive, setBreathingActive] = useState(false)
  const [breathingInterval, setBreathingInterval] = useState<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const startBreathingExercise = () => {
    if (breathingActive) return

    setBreathingActive(true)
    setBreathingState("inhale")
    setBreathingProgress(0)

    let progress = 0
    let state: "inhale" | "hold" | "exhale" = "inhale"
    let stateTime = 0

    const interval = setInterval(() => {
      progress += 1

      // Update state based on progress
      if (progress <= 25) {
        state = "inhale"
        stateTime = Math.floor((progress / 25) * 4)
      } else if (progress <= 50) {
        state = "hold"
        stateTime = Math.floor(((progress - 25) / 25) * 7)
      } else if (progress <= 100) {
        state = "exhale"
        stateTime = Math.floor(((progress - 50) / 50) * 8)
      }

      setBreathingProgress(progress)
      setBreathingState(state)

      if (progress >= 100) {
        progress = 0
      }
    }, 100)

    setBreathingInterval(interval)
  }

  const stopBreathingExercise = () => {
    if (breathingInterval) {
      clearInterval(breathingInterval)
    }

    setBreathingActive(false)
    setBreathingState("idle")
    setBreathingProgress(0)
  }

  const getAffirmation = () => {
    const affirmations = [
      "I am worthy of love and respect.",
      "I trust myself to make the right decisions.",
      "I am in charge of how I feel today.",
      "I am calm and centered in every situation.",
      "I have the power to create change.",
      "I am becoming the best version of myself.",
      "I am grateful for everything I have.",
      "My possibilities are endless.",
      "I am strong and resilient.",
      "I believe in myself and my abilities.",
    ]

    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)]

    toast({
      title: "Daily Affirmation",
      description: randomAffirmation,
    })
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Wellness Tools</h2>
      </div>

      <Tabs defaultValue="breathing" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:w-[400px] rounded-lg">
          <TabsTrigger value="breathing" className="rounded-lg">
            Breathing Exercises
          </TabsTrigger>
          <TabsTrigger value="affirmations" className="rounded-lg">
            Affirmations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="breathing" className="space-y-4">
          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle>4-7-8 Breathing Technique</CardTitle>
              <CardDescription>
                A breathing pattern that can help reduce anxiety and help you fall asleep
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  {breathingState === "idle" && "Ready"}
                  {breathingState === "inhale" && "Inhale"}
                  {breathingState === "hold" && "Hold"}
                  {breathingState === "exhale" && "Exhale"}
                </div>
                <Progress value={breathingProgress} className="h-3 w-full" />
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div
                  className={`p-4 rounded-xl ${breathingState === "inhale" ? "bg-teal-100 dark:bg-teal-900" : "bg-gray-100 dark:bg-gray-800"}`}
                >
                  <div className="text-2xl font-bold">4</div>
                  <div className="text-sm">seconds</div>
                  <div className="text-xs text-gray-500">Inhale through nose</div>
                </div>
                <div
                  className={`p-4 rounded-xl ${breathingState === "hold" ? "bg-teal-100 dark:bg-teal-900" : "bg-gray-100 dark:bg-gray-800"}`}
                >
                  <div className="text-2xl font-bold">7</div>
                  <div className="text-sm">seconds</div>
                  <div className="text-xs text-gray-500">Hold breath</div>
                </div>
                <div
                  className={`p-4 rounded-xl ${breathingState === "exhale" ? "bg-teal-100 dark:bg-teal-900" : "bg-gray-100 dark:bg-gray-800"}`}
                >
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-sm">seconds</div>
                  <div className="text-xs text-gray-500">Exhale through mouth</div>
                </div>
              </div>

              <div className="text-sm">
                <p>
                  This technique works by taking slow, deep breaths that increase oxygen in your bloodstream, slow your
                  heart rate, and release carbon dioxide from your lungs.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              {!breathingActive ? (
                <Button onClick={startBreathingExercise} className="bg-teal-600 hover:bg-teal-700 rounded-lg">
                  Start Exercise
                </Button>
              ) : (
                <Button onClick={stopBreathingExercise} variant="outline" className="rounded-lg">
                  Stop Exercise
                </Button>
              )}
            </CardFooter>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle>Box Breathing</CardTitle>
                <CardDescription>Equal inhale, hold, exhale, and hold pattern</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Box breathing is a simple technique that can help you return to calm. Inhale for 4 seconds, hold for 4
                  seconds, exhale for 4 seconds, and hold for 4 seconds.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full rounded-lg">
                  Try Box Breathing
                </Button>
              </CardFooter>
            </Card>

            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle>Deep Breathing</CardTitle>
                <CardDescription>Simple deep breathing for relaxation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Deep breathing is one of the best ways to lower stress in the body. Take slow, deep breaths from your
                  belly, rather than shallow breaths from your chest.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full rounded-lg">
                  Try Deep Breathing
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="affirmations" className="space-y-4">
          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle>Daily Affirmations</CardTitle>
              <CardDescription>Positive statements that can help challenge negative thoughts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl text-center">
                <blockquote className="text-xl italic">"I am in control of my thoughts and emotions."</blockquote>
              </div>

              <div className="text-sm">
                <p>
                  Affirmations are positive statements that can help you to challenge and overcome self-sabotaging and
                  negative thoughts. When you repeat them often, and believe in them, you can start to make positive
                  changes.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={getAffirmation} className="bg-teal-600 hover:bg-teal-700 rounded-lg">
                Get New Affirmation
              </Button>
            </CardFooter>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle>Morning Affirmations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>"Today is full of possibilities."</li>
                  <li>"I am capable and strong."</li>
                  <li>"I choose to be happy today."</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle>Self-Love Affirmations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>"I am worthy of love and respect."</li>
                  <li>"I accept myself as I am."</li>
                  <li>"I am enough just as I am."</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle>Anxiety Relief</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>"I am safe and at peace."</li>
                  <li>"This feeling is temporary."</li>
                  <li>"I can handle whatever comes my way."</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
