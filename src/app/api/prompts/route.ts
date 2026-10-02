import { NextResponse } from "next/server";
import { getPrompts } from "@/lib/prompts";
export async function GET(req:Request){
  const s=new URL(req.url).searchParams;
  const prompts=await getPrompts({search:s.get("search")||"",tier:s.get("tier")||"",category:s.get("category")||"",model:s.get("model")||"",type:s.get("type")||"",sort:s.get("sort")||"latest"});
  return NextResponse.json({prompts});
}
