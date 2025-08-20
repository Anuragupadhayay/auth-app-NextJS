import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModels"
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"


connect()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {email, password} = reqBody
        console.log(reqBody);
        
        //check if user exists

        const user = await User.findOne({email})
        if(!user){
            return NextResponse.json({error: "User does not exist"}, {status: 400})
        }

        //check if the password is correct

        const validPassword = await bcrypt.compare(password, user.password)

        if(!validPassword){
            return NextResponse.json({error: "invalid password"}, {status: 400})
        }

        //create token data

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        //email token

        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1h" })

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}