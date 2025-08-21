import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModels";
import { connect } from "@/dbConfig/dbConfig";

connect()

export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request)
        const user = User.findOne({_id: userId}).select("-password")
        return NextResponse.json({
            message: "User Found",
            data: user
        })
    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
            status: 400
        })
    }
}