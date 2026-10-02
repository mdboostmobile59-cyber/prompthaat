import { prisma } from "./prisma";
export async function isVipUser(userId?:string|null){
  if(!userId) return false;
  try{
    const v=await prisma.vipSubscription.findUnique({where:{userId}});
    if(!v || v.status!=="ACTIVE") return false;
    if(v.expiresAt && v.expiresAt < new Date()) return false;
    return true;
  }catch{ return false; }
}
export async function hasPromptAccess(user:any, prompt:any){
  if(!prompt) return false;
  if(!user) return false;
  if(!prompt.isPremium) return true; // free + logged in
  if(await isVipUser(user.userId)) return true;
  try{
    const p=await prisma.purchase.findUnique({where:{userId_promptId:{userId:user.userId,promptId:prompt.id}}});
    return !!p && p.status==="COMPLETED";
  }catch{ return false; }
}
