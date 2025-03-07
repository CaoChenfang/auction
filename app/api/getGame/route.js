import { connectMongoDB } from "@/lib/mongodb";
import AuctionGame from "@/models/auctionGame";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        await connectMongoDB();       
        const data = await AuctionGame.find({});
        return NextResponse.json( data );

    } catch (error) {
        console.log(error);
    }
}