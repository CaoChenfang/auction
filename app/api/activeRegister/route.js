import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import AuctionGameData from "@/models/auctionGameData";

export async function POST(req) {
    try {
        const {userEmail, assignedValue} = await req.json();
        //console.log("The admin", role);
        //console.log("The email", email);
        await connectMongoDB();        
        await AuctionGameData.create({email: userEmail ,valuation: assignedValue})
        return NextResponse.json(
            {message: "Active user registered."}, {status: 201}
        );
        
    } catch (error) {
        return NextResponse.json(
            {message: "An error occurred while registering the user."}, {status: 500}
        )
    }
}