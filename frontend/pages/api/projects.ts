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
      const projectsList = await supabase
        .from(process.env.PROJECTS_TABLE as string)
        .select("project_id")
        .eq("user_id", user_id)
        .order("created_at", { ascending: false });

      // Return the project ids
      const uniqueProjects = new Set();
      const project_ids = [];
      for (const project of projectsList.data) {
        if (!uniqueProjects.has(project.project_id)) {
          project_ids.push(project.project_id);
          uniqueProjects.add(project.project_id);
        }
      }
      res.status(200).json({ project_ids });
    } else if (req.method !== "POST") {
      res.status(405).send("Method not allowed");
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in Fetching Projects");
    return;
  }
}
