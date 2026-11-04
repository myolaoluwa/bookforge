import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { backendReady } from './config';
import type { Entry, Resource } from './content';

export async function sessionClient(){
 if(!backendReady())return null;
 const jar=await cookies();
 return createServerClient(process.env.SUPABASE_URL!,process.env.SUPABASE_ANON_KEY!,{cookieOptions:{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/'},cookies:{getAll:()=>jar.getAll(),setAll:values=>{try{values.forEach(({name,value,options})=>jar.set(name,value,options))}catch{/* RSC reads cannot refresh cookies; API requests refresh. */}}}});
}
export function serviceClient(){
 if(!backendReady()||!process.env.SUPABASE_SERVICE_ROLE_KEY)return null;
 return createClient(process.env.SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
}
export async function adminIdentity(){
 const db=await sessionClient();if(!db)return null;
 const {data:{user},error}=await db.auth.getUser();if(error||!user)return null;
 const {data:profile}=await db.from('profiles').select('role,status,display_name').eq('id',user.id).eq('status','active').maybeSingle();
 if(!profile)return null;return {db,user,role:profile.role as 'owner'|'editor'|'viewer',name:profile.display_name as string};
}
export async function published(resource:Resource):Promise<Entry[]>{
 if(!backendReady())return [];
 const db=createClient(process.env.SUPABASE_URL!,process.env.SUPABASE_ANON_KEY!,{auth:{persistSession:false}});
 const {data,error}=await db.from(resource).select('*').eq('status','published').order('updated_at',{ascending:false}).limit(100);
 if(error)throw new Error('Published content is temporarily unavailable');return (data||[]) as Entry[];
}
