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
      const { data, error } = await supabase
        .from(process.env.NEXT_PUBLIC_IMAGE_TABLE as string)
        // Select distinct project_id's for the user
        .select("project_id")
        .eq("user_id", user_id);

      if (error) {
        res.status(500).send("Error in getting project_ids");
        return;
      }


      const unique_project_ids = new Set();
      const filtered__project_ids = [];

      // Filter out the duplicate project_ids
      for (let i = 0; i < data.length; i++) {
        const project_id = data[i].project_id;
        if (!unique_project_ids.has(project_id)) {
          unique_project_ids.add(project_id);
          filtered__project_ids.push(project_id);
        }
      }

      // Return the projects as a JSON
      res.status(200).send({ project_ids: filtered__project_ids });
    } else if (req.method !== "POST") {
      res.status(405).send("Method not allowed");
      return;
    }

    // Get the request parameters
    const should_delete = req?.query?.should_delete || false;
    const project_id_param = req?.query?.project_id || null;

    // if (project_id_param) {
    //   const { data, error } = await supabase
    //     .from(process.env.PROJECTS_TABLE as string)
    //     .select("*")
    //     .match({ project_id: project_id_param });

    //   if (data.length === 0) {
    //     res.status(400).send("Invalid project_id");
    //     return;
    //   }

    //   // Return the response as a JSON where all the keys in the object are the column names
    //   res.status(200).send(data[0]);
    //   return;
    // }

    const { body } = req;
    const payload = body;
    const { project_id, title, previewImage, canvasHistory, recently } =
      payload;

    if (should_delete) {
      const { data, error } = await supabase
        .from(process.env.PROJECTS_TABLE as string)
        .delete()
        .match({ project_id: project_id });
      res.status(200).send({ success: true, message: "Project deleted" });
    } else if (!project_id) {
      const user_id = req?.query?.user_id || null;

      // Create a new project

      const response = await supabase
        .from(process.env.PROJECTS_TABLE as string)
        .insert([{ title: "Untitled", user_id: user_id }])
        .select();

      // Return the project_id

      const data = response.data;
      const project_id = data[0].project_id;

      res.status(200).send({ success: true, project_id: project_id });
    } else {

      console.log("fdfdf")
      let bodyObject = {};

      if (title !== null) {
        bodyObject["title"] = title;
      }

      if (previewImage !== null) {
        bodyObject["previewImage"] = previewImage;
      }

      if (canvasHistory !== null) {
        bodyObject["canvasHistory"] = canvasHistory;
      }

      if (recently !== null) {
        bodyObject["recently"] = recently;
      }
      console.log("fdfdf",bodyObject)

      const { data, error } = await supabase
        .from(process.env.PROJECTS_TABLE as string)
        .update(bodyObject)
        .match({ project_id: project_id });
      console.log(project_id,"fdfdf",data)


      // Send success response
      res.status(200).send({ success: true, project_id: project_id });
    }
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in Creating/Updating Project");
    return;
  }
}
