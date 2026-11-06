export function resolveSiteOrigin(value:string|undefined){
 const fallback='https://bookforge.ink';
 try{const url=new URL(value||fallback);return ['https:','http:'].includes(url.protocol)&&!url.username&&!url.password?url.origin:fallback}catch{return fallback}
}
export const site = {
 name:'BookForge Publishing Studio',
 origin:resolveSiteOrigin(process.env.SITE_ORIGIN),
 indexable:process.env.SITE_INDEXABLE === 'true',
 contact:process.env.CONTACT_EMAIL || '',
};
export function backendReady(){return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY)}
export function inquiriesReady(){return backendReady() && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.RATE_LIMIT_SALT && process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)}
export function mailReady(){return Boolean(process.env.RESEND_API_KEY && process.env.MAIL_FROM && process.env.AGENCY_INBOX)}
