// @ts-nocheck

import { NextResponse, NextRequest } from "next/server";
export const maxDuration = 300;
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

export default async function handler(req: NextRequest, res: NextResponse) {
  try {
    if (req.method === "GET") {
      // Get the user_id from the query parameters
      const user_id = req?.query?.user_id || null;

      if (!user_id) {
        res.status(400).send("Missing user_id");
        return;
      }

      // Get the project ids for the user

      const projextlist = await supabase
        .from(process.env.PROJECTS_TABLE as string)
        .select("*")
        .eq("user_id", user_id);


const reversProjects = projextlist.data.reverse()
      // Return the projects as a JSON
      res.status(200).send({ project: reversProjects });
    } else if (req.method !== "POST") {
      res.status(405).send("Method not allowed");
      return;
    }

    
  
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in Creating/Updating Project");
    return;
  }
}
