import {backendReady,inquiriesReady,mailReady} from '@/lib/bookforge/config';
import {json} from '@/lib/bookforge/http';
export async function GET(){return json({status:backendReady()&&inquiriesReady()&&mailReady()?'configured':'setup_required',databaseConfigured:backendReady(),inquiriesConfigured:inquiriesReady(),emailConfigured:mailReady()})}
