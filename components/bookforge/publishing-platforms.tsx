const platforms=[
 {name:'Amazon Kindle',file:'amazon-kindle',src:'amazon-kindle.svg',width:388,height:86},
 {name:'Barnes & Noble',file:'barnes-noble',src:'barnes-noble.svg',width:512,height:43},
 {name:'Lulu',file:'lulu',src:'lulu.svg',width:200,height:80},
 {name:'IngramSpark',file:'ingramspark',src:'ingramspark.png',width:507,height:105},
 {name:'Rakuten Kobo',file:'rakuten-kobo',src:'rakuten-kobo.svg',width:418,height:80},
 {name:'Apple Books',file:'apple-books',src:'apple-books.svg',width:512,height:512}
];

export function PublishingPlatforms(){return <section className="publishing-platforms" aria-labelledby="publishing-platforms-title">
 <div className="wrap platforms-heading"><h2 id="publishing-platforms-title">Your book. Your publishing path.</h2><p>Book files prepared around your chosen platform.</p></div>
 <div className="platforms-window" tabIndex={0} role="region" aria-label={'Publishing platforms: '+platforms.map(platform=>platform.name).join(', ')+'. Focus to pause the moving logos.'}>
  <div className="platforms-track" aria-hidden="true">{[0,1].map(group=><div className="platforms-group" key={group}>{[0,1].flatMap(repeat=>platforms.map(platform=><span className={'platform-mark platform-mark-'+platform.file} data-repeat={repeat>0?'true':undefined} key={repeat+'-'+platform.file}><img src={'/platforms/'+platform.src} width={platform.width} height={platform.height} alt=""/>{platform.file==='apple-books'&&<span>Apple Books</span>}</span>))}</div>)}</div>
 </div>
</section>}
