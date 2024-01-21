import connectMongoDB from "@/lib/mongodb";
import { time } from "console";
import { NextResponse } from "next/server";

async function getTimeSlices(params: string) {
    const { db } = await connectMongoDB();
    const timeslice = await db.collection("timeslices").find().toArray();
    return timeslice;
}

export default getTimeSlices;