import { NextResponse } from "next/server"
import { generateToken } from "@/lib/auth"
import { findUserByEmail, createUser } from "@/lib/db"

export async function POST(request) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    const user = await createUser({
      email,
      password,
      name,
    })

    const token = generateToken(user._id.toString())

    return NextResponse.json({
      token,
      user: { id: user._id, email, name },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Registration failed" }, { status: 500 })
  }
}
