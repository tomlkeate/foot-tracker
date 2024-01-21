import connectMongoDB from "@/lib/mongodb";
import { time } from "console";
import { NextResponse } from "next/server";

export async function getTimeslices(params) {
    const { db } = await connectMongoDB();
    const timeslice = await db.collection("timeslice").find().toArray();
    console.log(timeslice)
    return NextResponse.json({ timeslice });
}