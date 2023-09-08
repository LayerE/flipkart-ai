// pages/api/create.js

// import connectDB from "@/lib/db";
import Users from "@/models/Users";
// import type { NextResponse, NextRequest } from 'next'

// connectDB();




export default async ( req,res) => {
  try {
    if (req.method !== "GET") {
        return res.json({ error: "Method not allowed" });
      }
    const { title, description } = req.body;
    const { id } = req.query;
    if (!id) {
      return res.json({
        error: "Missing data query parameter",
      });
    }
    console.log("dfd", id)
    const user = await Users.findById({userId:id});
    console.log("dfd", id)

    console.log("dfd", user)
    if (!user) {
      const creatdUserr = new Users({
        userId: id,
        // jobIds: [],
        // canvas: {},
        // canvasHistory: {},
        // asserts: []
      });

      await creatdUserr.save();
      return  res.json(creatdUserr);
    }
    return res.json(user);

  } catch (error) {
    return  res.json({ error: "Server error" });
  }
};
