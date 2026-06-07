import { NextResponse } from "next/server"
import { exec } from "child_process"
import path from "path"
import { promisify } from "util"

const execPromise = promisify(exec)

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    // Path to the Python script
    const scriptPath = path.join(process.cwd(), "scripts", "sentiment_analysis.py")
    
    // Execute the Python script with the text as an argument
    // Using JSON.stringify(text) to handle special characters and quotes
    const { stdout, stderr } = await execPromise(`python "${scriptPath}" ${JSON.stringify(text)}`)

    if (stderr && !stdout) {
      console.error("Python script error:", stderr)
      return NextResponse.json({ error: "Error executing sentiment analysis" }, { status: 500 })
    }

    const result = JSON.parse(stdout)
    return NextResponse.json(result)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
