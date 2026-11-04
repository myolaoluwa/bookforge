import {sessionClient} from '@/lib/bookforge/database';
import {json,sameOrigin} from '@/lib/bookforge/http';
export async function POST(request:Request){if(!sameOrigin(request))return json({message:'Request rejected.'},403);const db=await sessionClient();if(db)await db.auth.signOut();return json({ok:true})}
