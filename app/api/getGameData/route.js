import { connectMongoDB } from "@/lib/mongodb";
import AuctionGameData from "@/models/auctionGameData";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        await connectMongoDB();       
        const data = await AuctionGameData.find();
        return NextResponse.json(data);

    } catch (error) {
        console.log(error);
    }
}