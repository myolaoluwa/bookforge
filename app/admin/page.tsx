import {redirect} from 'next/navigation';
import {adminIdentity} from '@/lib/bookforge/database';
import {AdminShell} from '@/components/bookforge/admin-shell';
import {resources} from '@/lib/bookforge/content';
export default async function Admin(){const identity=await adminIdentity();if(!identity)redirect('/admin/login');return <AdminShell name={identity.name} role={identity.role}><h1>The studio desk.</h1><p>Manage genuine work, considered copy and the next author conversation. Drafts stay private until explicitly published.</p><div className="admin-grid">{resources.map(resource=><a href={'/admin/'+resource} key={resource}>{resource}<span>Manage drafts and publication</span></a>)}</div><h2>Before launch</h2><p>Confirm service scope, verify all asset permissions, approve policies and test inquiry delivery. Configuration alone does not confirm a working integration.</p></AdminShell>}
