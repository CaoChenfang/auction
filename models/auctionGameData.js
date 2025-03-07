import mongoose, {Schema, models} from "mongoose";
const gameDataSchema = new Schema(
    {       
        email: {
            type: String,
            required: true,
        },
        bid: {
                type: [mongoose.Decimal128], 
                required: true,},
        valuation: {
                    type:mongoose.Decimal128,
                    required: true,
                },       
        updated: { type: Date, default: Date.now },
    }
);

const AuctionGameData = models.AuctionGameData || mongoose.model("AuctionGameData", gameDataSchema);
export default AuctionGameData;