import {backendReady} from '@/lib/bookforge/config';
import {LoginForm} from '@/components/bookforge/admin';
import {PageIntro} from '@/components/bookforge/ui';
export default function Login(){return <><PageIntro title="The studio desk."><p>A private space for content and project inquiries.</p></PageIntro><section className="paper-section"><div className="wrap body-section"><LoginForm configured={backendReady()}/></div></section></>}
