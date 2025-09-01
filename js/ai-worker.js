// AI Web Worker: fast extractive summarization + lightweight NER
// Receives { type: 'summarize', text } and returns { type: 'summary', bullets, why, context, entities }

function tokenizeSentences(text){
	const clean = (text||'').replace(/\s+/g,' ').trim();
	if (!clean) return [];
	return clean.split(/(?<=[.!?])\s+(?=[A-Z0-9])/);
}

function extractiveSummary(text, maxSentences){
	const sentences = tokenizeSentences(text).slice(0, 80);
	if (sentences.length <= maxSentences) return sentences;
	const stop = new Set(['the','is','a','an','of','and','to','in','for','on','with','as','by','it','that','from','at','this','be','are','was','were','or']);
	const freq = Object.create(null);
	const words = text.toLowerCase().split(/[^a-z0-9]+/).filter(w=>w && !stop.has(w));
	words.forEach(w=>{ freq[w]=(freq[w]||0)+1; });
	const scored = sentences.map(s=>{
		const ws = s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
		const score = ws.reduce((acc,w)=> acc + (freq[w]||0), 0) + Math.min(s.length/80, 3);
		return { s, score };
	}).sort((a,b)=> b.score - a.score).slice(0, maxSentences);
	// keep original order
	const set = new Set(scored.map(x=>x.s));
	return sentences.filter(s=> set.has(s));
}

function simpleNER(text){
	// Very lightweight heuristics: Capitalized sequences and common markers
	const entities = { people: [], orgs: [], places: [] };
	const caps = text.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3})\b/g) || [];
	const uniq = (arr)=> Array.from(new Set(arr)).slice(0, 12);
	// crude classification by keywords
	const orgKeywords = /(Inc\.|Corp\.|LLC|Ltd|Company|Laboratories|University|Institute|Ministry|Agency|Commission)/i;
	const placeKeywords = /(City|County|Province|State|Republic|Kingdom|River|Ocean|Sea|Bay|Valley)/i;
	for (const c of caps){
		if (orgKeywords.test(c)) entities.orgs.push(c);
		else if (placeKeywords.test(c)) entities.places.push(c);
		else entities.people.push(c);
	}
	entities.people = uniq(entities.people);
	entities.orgs = uniq(entities.orgs);
	entities.places = uniq(entities.places);
	return entities;
}

function buildSections(text){
	const top10 = extractiveSummary(text, 10);
	const bullets = extractiveSummary(text, 6).map(s=> s.length>240 ? s.slice(0,237)+'…' : s);
	const why = top10[0] || '';
	// Context: select 2 sentences that contain time/scale cues
	const cues = /\b(since|over the past|in the last|by\s+\d{4}|as of|between\s+\d{4}|earlier this|meanwhile|additionally|however)\b/i;
	const context = tokenizeSentences(text).filter(s=> cues.test(s)).slice(0, 2).join(' ');
	const entities = simpleNER(top10.join(' '));
	return { bullets, why, context, entities };
}

self.onmessage = function(e){
	const { type, text } = e.data || {};
	if (type !== 'summarize' || !text) { self.postMessage({ type: 'error' }); return; }
	try{
		const res = buildSections(text);
		self.postMessage({ type: 'summary', ...res });
	}catch(_){ self.postMessage({ type: 'error' }); }
};

