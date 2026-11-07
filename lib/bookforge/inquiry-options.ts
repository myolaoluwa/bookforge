import {services} from './content';

const stages=['idea','draft','editing','ready','published'] as const;
const labels:Record<string,readonly string[]>={
 unsure:['I have a book idea','I am writing a manuscript','My manuscript is being edited','My manuscript is finished; help me plan the next step','My book is already published'],
 'manuscript-editing':['Planning the book and looking for editorial guidance','Writing a first draft','Revising a completed draft','Ready for a final edit or proofread','Revising a previously published book'],
 'ebook-formatting':['Deciding on my ebook edition','Still writing the manuscript','The manuscript is being edited','Final manuscript ready for EPUB formatting','An existing ebook needs reformatting'],
 'paperback-formatting':['Choosing a paperback format and trim size','Still writing the manuscript','The manuscript is being edited','Final manuscript ready for print layout','An existing paperback needs a new interior'],
 'hardcover-formatting':['Planning a hardcover edition','Preparing the manuscript for a hardcover','The manuscript is being edited','Final manuscript and printer specifications are ready','Adapting a published book into a hardcover'],
 'book-cover-design':['I have a concept and need a cover direction','Writing the book and exploring cover ideas','Editing is underway; I am planning the cover','Ready for a new cover design','A published book needs a cover redesign'],
 'kdp-publishing-preparation':['Planning to self-publish on KDP','Preparing my manuscript and book details','Editing or design is still in progress','Book files are ready; I need upload preparation','An existing KDP edition needs updating'],
 'book-marketing':['Planning my audience and positioning','Writing the book and building an author presence','Preparing a launch for a book in production','My finished book is approaching publication','My published book needs a discovery plan'],
 'goodreads-author-setup':['I do not have a Goodreads author profile yet','My author profile needs completing','My profile or book listings need corrections','My profile is ready; I need reader research','My published books need profile or listing support']
};

export function bookStageOptions(service:string){
 const copy=labels[service]||labels.unsure;
 return [{value:'unsure',label:'Help me work out the next step'},...stages.map((value,index)=>({value,label:copy[index]})),{value:'other',label:'Other — describe where you are'}];
}
type Choices={service:string;stage?:string;serviceOther?:string;stageOther?:string;description?:string};
export function inquiryServiceLabel(value:Choices){return value.service==='other'?value.serviceOther?.trim()||'Other author support':services.find(s=>s.slug===value.service)?.name||'Help choosing a service'}
export function inquiryStageLabel(value:Choices){return value.stage==='other'?value.stageOther?.trim()||'Other book stage':bookStageOptions(value.service).find(option=>option.value===value.stage)?.label||'To be discussed'}
export function inquiryProjectDescription(value:Choices){
 return [value.service==='other'?'Requested help: '+inquiryServiceLabel(value):'',value.stage&&value.stage!=='unsure'?'Book stage: '+inquiryStageLabel(value):'',value.description||''].filter(Boolean).join('\n\n');
}
