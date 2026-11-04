import {adminIdentity} from '@/lib/bookforge/database';
import {json,sameOrigin} from '@/lib/bookforge/http';
import {deliverInquiryEmails} from '@/lib/bookforge/mail';
import {z} from 'zod';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){if(!sameOrigin(request))return json({message:'Request rejected.'},403);const identity=await adminIdentity();if(!identity)return json({message:'Sign in required.'},401);if(identity.role!=='owner')return json({message:'Owner access required.'},403);const {id}=await params;if(!z.string().uuid().safeParse(id).success)return json({message:'Invalid inquiry.'},422);return json({emailStatus:await deliverInquiryEmails(id)})}
