import mongoose, {Schema, models} from "mongoose";
const gameSchema = new Schema(
    {
        winner: {
            type: String,            
        },
        winningbids: {
            type: mongoose.Decimal128,
        },
        useraveragebid: {
            type: mongoose.Decimal128,
        },
        maxnumbid: {
            type: Number,
            required: true,
            default: 0,
        },
        gamelength: {
            type: Number,
            required: true,
            default: 0,
        },
        max: {
            type: mongoose.Decimal128,
            required: true, 
        },
        min: {
            type: mongoose.Decimal128,
            required: true,            
        },
        multiplier: {
            type: mongoose.Decimal128,
            required: true,            
        }, 
        auctiontype: {
            type: String,
            required: true,
            default: "open",
        },
        signalvariance: {
            type: mongoose.Decimal128,
            required: true,            
        },        
        isactive: {
            type: String,
            required: true,
            default: "active",
        },
        updated: { type: Date, default: Date.now },
    },
    
);

const AuctionGame = models.AuctionGame || mongoose.model("AuctionGame", gameSchema);
export default AuctionGame;