import { NextResponse, NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async (req: NextRequest) => {
  try {
    if (req.method !== "POST") {
      return NextResponse.json({ error: "Method not allowed" });
    }

    const body = await req.json();
    const { user_id, project_id, canvasdata } = body;

    console.log(user_id, project_id, canvasdata)

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" });
    }

    if (!canvasdata) {
      // We need to fetch the canvas data from the database

      const fetchUrl =
        project_id === null ? "" : `&project_id=eq.${project_id}`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${process.env.CANVAS_TABLE}?select=project_id,canvasdata&user_id=eq.${user_id}${fetchUrl}`,
        {
          headers: {
            apikey: process.env.SUPABASE_SERVICE_KEY as string,
            Authorization:
              `Bearer ${process.env.SUPABASE_SERVICE_KEY}` as string,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          method: "GET",
        }
      );

      const data = await response.json();
      const newData = data[data.length - 1]
      console.log("sdsd",newData);


  //  const da =await data[data?.length - 1]

      return NextResponse.json({ newData });
    } else if (!project_id) {
      return NextResponse.json({ error: "Missing project_id" });
    } else {
      // We need to save the canvas data to the database
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${process.env.CANVAS_TABLE}`,
        {
          headers: {
            apikey: process.env.SUPABASE_SERVICE_KEY as string,
            Authorization:
              `Bearer ${process.env.SUPABASE_SERVICE_KEY}` as string,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            user_id,
            project_id,
            canvasdata,
          }),
        }
      );


      return NextResponse.json({ data: "success" });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Something went wrong" });
  }
};
