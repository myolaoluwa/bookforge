export const storyBeats=[
 {start:0,label:'The last full stop.',text:'You finished writing your book.'},
 {start:3.5,label:'And then the next mountain.',text:'But now comes everything else.'},
 {start:8.5,label:'There is another way.',text:'Your story deserves better than the stress.'},
 {start:13,label:'Meet Bookforge.',text:'You wrote the book. We’ll handle what comes next.'},
 {start:17,label:'Your next chapter starts here.',text:'Let’s get your book ready.'}
];
export function beatAt(time:number){let index=0;for(let i=0;i<storyBeats.length;i++)if(time>=storyBeats[i].start)index=i;return index}
export function taskAt(time:number){const tasks=['Editing','Formatting','Cover design','Publishing','Marketing'];return time>=3.5&&time<8.5?tasks[Math.min(4,Math.floor(time-3.5))]:''}
export function fadeVolume(from:number,target:number,elapsed:number){const progress=Math.max(0,Math.min(elapsed/450,1));return Math.max(0,Math.min(1,from+(target-from)*progress))}
