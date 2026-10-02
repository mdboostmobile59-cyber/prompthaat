import { prisma } from "./prisma";
import { allPromptsData } from "./sample-data";
export type PublicPrompt={id:string;slug:string;title:string;category:string;description:string;imageUrl:string;isPremium:boolean;price:number;aiModel:string;promptType:string;isFeatured:boolean;createdAt:string};
function mapDb(p:any):PublicPrompt{ return {id:p.id,slug:p.slug,title:p.title,category:p.category?.name||"General",description:p.description,imageUrl:p.imageUrl,isPremium:p.isPremium,price:Number(p.price||0),aiModel:p.aiModel,promptType:p.promptType,isFeatured:p.isFeatured,createdAt:p.createdAt?.toISOString?.()||String(p.createdAt)} }
function mapSample(p:any):PublicPrompt{ return {id:p.id,slug:p.slug,title:p.title,category:p.category,description:p.description,imageUrl:p.imageUrl,isPremium:p.isPremium,price:Number(p.price|| (p.isPremium?49:0)),aiModel:p.aiModel||"AI",promptType:p.promptType||"Image",isFeatured:false,createdAt:p.createdAt||""} }
// DB-first; sample only as fallback when DB is empty/unreachable so the site is never blank in preview.
export async function getPrompts(opts:{search?:string;tier?:string;category?:string;model?:string;type?:string;sort?:string;featured?:boolean;premiumOnly?:boolean;take?:number}={}):Promise<PublicPrompt[]>{
  try{
    const where:any={status:"PUBLISHED"};
    if(opts.tier==="Free") where.isPremium=false; if(opts.tier==="Premium"||opts.premiumOnly) where.isPremium=true;
    if(opts.featured) where.isFeatured=true;
    if(opts.category && opts.category!=="All Categories") where.category={name:opts.category};
    if(opts.model && opts.model!=="All Models") where.aiModel=opts.model;
    if(opts.type && opts.type!=="All Types") where.promptType=opts.type;
    if(opts.search){ where.OR=[{title:{contains:opts.search,mode:"insensitive"}},{description:{contains:opts.search,mode:"insensitive"}},{aiModel:{contains:opts.search,mode:"insensitive"}}]; }
    let orderBy:any={createdAt:"desc"}; if(opts.sort==="oldest") orderBy={createdAt:"asc"}; if(opts.sort==="price-low") orderBy={price:"asc"}; if(opts.sort==="price-high") orderBy={price:"desc"}; if(opts.sort==="popular") orderBy={viewCount:"desc"};
    const rows=await prisma.prompt.findMany({where,include:{category:true},orderBy,take:opts.take||100});
    if(rows.length) return rows.map(mapDb);
  }catch(e){ console.error("getPrompts DB fallback",e); }
  let list=allPromptsData.map(mapSample);
  if(opts.tier==="Free") list=list.filter(x=>!x.isPremium); if(opts.tier==="Premium"||opts.premiumOnly) list=list.filter(x=>x.isPremium);
  if(opts.category && opts.category!=="All Categories") list=list.filter(x=>x.category===opts.category);
  if(opts.search) list=list.filter(x=>(x.title+x.description+x.aiModel).toLowerCase().includes(opts.search!.toLowerCase()));
  return list.slice(0,opts.take||100);
}
export async function getPromptBySlug(slug:string){
  try{ const p=await prisma.prompt.findUnique({where:{slug},include:{category:true}}); if(p) return {...mapDb(p),promptContent:p.promptContent}; }catch{}
  const f=allPromptsData.find(x=>x.slug===slug); return f?{...mapSample(f),promptContent:f.promptContent}:null;
}
export async function getCategories(){
  try{ const c=await prisma.category.findMany({where:{isActive:true},include:{_count:{select:{prompts:true}}},orderBy:{name:"asc"}}); if(c.length) return c.map((x:any)=>({id:x.id,name:x.name,slug:x.slug,description:x.description||"",iconUrl:x.iconUrl||"",count:x._count?.prompts||0})); }catch{}
  return [...new Set(allPromptsData.map(x=>x.category))].map((name,i)=>({id:String(i),name,slug:name.toLowerCase().replace(/[^a-z0-9]+/g,"-"),description:"",iconUrl:"",count:allPromptsData.filter(x=>x.category===name).length}));
}
export async function minPremiumPrice(){ const list=await getPrompts({premiumOnly:true}); const prices=list.filter(x=>x.price>0).map(x=>x.price); return prices.length?Math.min(...prices):30; }
