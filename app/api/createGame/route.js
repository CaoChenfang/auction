import { connectMongoDB } from "@/lib/mongodb";
import AuctionGame from "@/models/auctionGame";
//import GameData from "@/models/gameData";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { maxNumBid, gameLength, auctionType, signal, bidMultiplier, reservePrice, maxValuation } = await req.json();
        console.log("the maximum of bid", maxNumBid);
        await connectMongoDB();
        //const user = await User.findOne({email}).select("_id");
        //await GameData.remove();
        await AuctionGame.create({            
            maxnumbid: maxNumBid,
            gamelength: gameLength,
            auctiontype: auctionType,
            signalvariance: signal,
            multiplier: bidMultiplier,
            max: maxValuation,
            min: reservePrice,
        })
      
        return NextResponse.json(
            {message: "Game created."}, {status: 201}
        );

    } catch (error) {
        console.log(error);
    }
}