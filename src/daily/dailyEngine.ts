import { DailyGift, Relationship, ScheduleBlock } from '../types';
import { scheduleBlockOccursOn, sortSchedule } from '../schedule/scheduleUtils';

export const localDateKey=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const hash=(value:string)=>[...value].reduce((total,char)=>(total*31+char.charCodeAt(0))>>>0,2166136261);
export type AcademySeason='autumn'|'winter'|'spring'|'summer';
export function academySeason(date=new Date()):AcademySeason {const month=date.getMonth()+1;return month>=9&&month<=11?'autumn':month===12||month<=2?'winter':month>=3&&month<=5?'spring':'summer';}
const weatherBySeason:Record<AcademySeason,{label:string;icon:string;note:string}[]>={
  autumn:[{label:'Rose-gold sun',icon:'partly-sunny-outline',note:'Warm light across the courtyards.'},{label:'Soft rain',icon:'rainy-outline',note:'Library windows and polished hallways.'},{label:'Crisp wind',icon:'leaf-outline',note:'Ribbons lifting along the garden paths.'}],
  winter:[{label:'Light snow',icon:'snow-outline',note:'A quiet white edge along the academy roofs.'},{label:'Silver rain',icon:'rainy-outline',note:'Work lights glow early in the studios.'},{label:'Clear frost',icon:'sparkles-outline',note:'Cold glass and bright morning skies.'}],
  spring:[{label:'Garden sun',icon:'sunny-outline',note:'The practice garden is warm enough to open.'},{label:'Petal breeze',icon:'flower-outline',note:'Rose petals gather near the courtyard doors.'},{label:'April shower',icon:'rainy-outline',note:'A quick rain over the conservatory glass.'}],
  summer:[{label:'Golden afternoon',icon:'sunny-outline',note:'Long light across the empty studios.'},{label:'Warm breeze',icon:'leaf-outline',note:'The grounds feel unhurried today.'},{label:'Summer rain',icon:'rainy-outline',note:'A cooling storm beyond the tall windows.'}],
};
export function academyWeather(date=new Date()){const season=academySeason(date);const options=weatherBySeason[season];return {season,...options[hash(localDateKey(date))%options.length]};}
export const isWeekend=(date=new Date())=>date.getDay()===0||date.getDay()===6;
export function dailySchedule(schedule:ScheduleBlock[],date=new Date()){return schedule.filter(block=>scheduleBlockOccursOn(block,date)).sort(sortSchedule);}
export interface AcademyHoliday { id:string; name:string; startDate:string; endDate:string; description:string; }
export const academyHolidays:AcademyHoliday[]=[
  {id:'autumn-lanterns',name:'Lantern Evening',startDate:'2026-10-20',endDate:'2026-10-20',description:'The courtyard fills with lanterns, music, and invitations that may or may not be formal.'},
  {id:'winter-break',name:'Winter Break',startDate:'2026-12-21',endDate:'2027-01-03',description:'Lessons pause while letters, gifts, and unfinished thoughts travel home.'},
  {id:'garden-festival',name:'Spring Garden Festival',startDate:'2027-04-15',endDate:'2027-04-15',description:'The academy makes room for flowers, shared work, and one afternoon without corrections.'},
  {id:'closing-ceremony',name:'Closing Ceremony',startDate:'2027-06-20',endDate:'2027-06-20',description:'The year gathers in the courtyard before summer begins.'},
];
export function academyHolidayFor(date=new Date()){const key=localDateKey(date);return academyHolidays.find(holiday=>key>=holiday.startDate&&key<=holiday.endDate);}

export interface AcademyMoment { title:string; text:string; locationId:string; icon:string; action:string; npcId?:string; }
const academyMoments:Omit<AcademyMoment,'npcId'>[]=[
  {title:'A ribbon catches on the gate',text:'Someone has tied a fresh ribbon to the academy gates. It is too carefully placed to be an accident.',locationId:'frontGates',icon:'ribbon-outline',action:'Look closer'},
  {title:'Music through the open window',text:'A phrase repeats in the Music Wing, stops, and begins again with more confidence.',locationId:'musicWing',icon:'musical-notes-outline',action:'Follow the sound'},
  {title:'A note beneath the teacup',text:'The common room is empty except for a warm cup and a folded note with your name on it.',locationId:'dormCommon',icon:'mail-outline',action:'Read the note'},
  {title:'Light in the practice garden',text:'The outdoor barre is still silver with morning dew. Someone has left the work lights on.',locationId:'practiceGarden',icon:'sunny-outline',action:'Step outside'},
  {title:'A book left open',text:'A library book rests open to a passage about beginnings, with one sentence marked in pencil.',locationId:'library',icon:'library-outline',action:'Read the passage'},
  {title:'The theatre is breathing',text:'From the lobby, you can hear the quiet shift of curtains and a stage being prepared for something unnamed.',locationId:'theatreLobby',icon:'ticket-outline',action:'Visit the theatre'},
];
export function academyMoment(relationships:Relationship[],date=new Date()):AcademyMoment {
  const moment=academyMoments[hash(`moment-${localDateKey(date)}`)%academyMoments.length];
  const npc=relationships.length?relationships[hash(`moment-npc-${localDateKey(date)}`)%relationships.length]:undefined;
  return npc?{...moment,npcId:npc.id,text:`${moment.text} ${npc.name.split(' ')[0]} is nearby, though they have not seen you yet.`}:moment;
}

export const dailyGifts:DailyGift[]=[
  {id:'rose-coins',name:'Rose-Sealed Coin Purse',description:'A tiny purse left beside the morning letter.',icon:'rose-outline',coins:18,xp:6},
  {id:'practice-ribbon',name:'Practice Ribbon',description:'A ribbon for returning to the work.',icon:'ribbon-outline',coins:10,xp:14},
  {id:'library-token',name:'Library Token',description:'For one focused page, problem, or paragraph.',icon:'library-outline',coins:12,xp:12},
  {id:'music-note',name:'Music-Wing Note',description:'A small reward from the rehearsal desk.',icon:'musical-note-outline',coins:15,xp:10,relationshipId:'r3',relationshipPoints:3},
  {id:'clara-letter',name:'Letter from Clara',description:'Mostly affectionate. Slightly overdecorated.',icon:'mail-outline',coins:10,xp:10,relationshipId:'r2',relationshipPoints:5},
  {id:'mentor-pin',name:'Mentor’s Gold Pin',description:'A reminder that consistency counts.',icon:'sparkles-outline',coins:8,xp:18,relationshipId:'r4',relationshipPoints:4},
  {id:'tea-ticket',name:'Common-Room Tea Ticket',description:'Redeemable for imaginary tea and real progress.',icon:'cafe-outline',coins:20,xp:5},
  {id:'pressed-rose',name:'Pressed Rose',description:'Found between two pages of the academy chronicle.',icon:'flower-outline',coins:14,xp:12,relationshipId:'r6',relationshipPoints:3},
  {id:'studio-key',name:'Silver Studio Key',description:'Not a literal key. The Headmistress was extremely clear.',icon:'key-outline',coins:16,xp:12},
  {id:'sophie-card',name:'Sophie’s Correction Card',description:'Useful, specific, and almost friendly.',icon:'create-outline',coins:10,xp:14,relationshipId:'r5',relationshipPoints:4},
  {id:'weekend-box',name:'Weekend Music Box',description:'A gentler reward for an unhurried day.',icon:'musical-notes-outline',coins:22,xp:8},
  {id:'academy-crest',name:'Academy Crest Token',description:'A larger reward from the weekly rotation.',icon:'shield-outline',coins:28,xp:15},
];
export function giftForDate(date=new Date()){const weekendOffset=isWeekend(date)?2:0;return dailyGifts[(hash(localDateKey(date))+weekendOffset)%dailyGifts.length];}

const weekdayLocations=['primaryStudio','library','musicWing','practiceStudio','dormCommon'];
const weekendLocations=['formalGardens','roseCourt','conservatory','dormCommon','practiceGarden'];
export interface NpcScheduleBlock { start:number; end:number; locationId:string; }
const npcWeekdaySchedules:Record<string,NpcScheduleBlock[]>= {
  r1:[{start:8,end:11,locationId:'primaryStudio'},{start:11,end:12,locationId:'hallway'},{start:12,end:13,locationId:'diningHall'},{start:13,end:18,locationId:'primaryStudio'},{start:18,end:20,locationId:'headmistress'}],
  r2:[{start:8,end:10,locationId:'library'},{start:10,end:13,locationId:'hallway'},{start:13,end:16,locationId:'library'},{start:16,end:20,locationId:'dormCommon'}],
  r3:[{start:8,end:11,locationId:'musicWing'},{start:11,end:13,locationId:'theatreSeats'},{start:13,end:17,locationId:'musicWing'},{start:17,end:20,locationId:'theatreLobby'}],
  r4:[{start:8,end:11,locationId:'practiceStudio'},{start:11,end:13,locationId:'atelier'},{start:13,end:17,locationId:'practiceStudio'},{start:17,end:20,locationId:'formalGardens'}],
  r5:[{start:8,end:12,locationId:'primaryStudio'},{start:12,end:14,locationId:'diningHall'},{start:14,end:17,locationId:'formalGardens'},{start:17,end:20,locationId:'primaryStudio'}],
  r6:[{start:8,end:12,locationId:'library'},{start:12,end:14,locationId:'conservatory'},{start:14,end:18,locationId:'library'},{start:18,end:20,locationId:'dormCommon'}],
};
const npcWeekendSchedules:Record<string,NpcScheduleBlock[]>= {
  r1:[{start:10,end:12,locationId:'formalGardens'},{start:12,end:15,locationId:'diningHall'},{start:15,end:18,locationId:'roseCourt'},{start:18,end:20,locationId:'dormCommon'}],
  r2:[{start:10,end:12,locationId:'dormCommon'},{start:12,end:15,locationId:'roseCourt'},{start:15,end:18,locationId:'conservatory'},{start:18,end:20,locationId:'dormCommon'}],
  r3:[{start:10,end:13,locationId:'theatreSeats'},{start:13,end:16,locationId:'lakeside'},{start:16,end:18,locationId:'musicWing'},{start:18,end:20,locationId:'dormCommon'}],
  r4:[{start:10,end:13,locationId:'practiceGarden'},{start:13,end:16,locationId:'formalGardens'},{start:16,end:18,locationId:'atelier'},{start:18,end:20,locationId:'dormCommon'}],
  r5:[{start:10,end:12,locationId:'formalGardens'},{start:12,end:15,locationId:'roseCourt'},{start:15,end:18,locationId:'practiceGarden'},{start:18,end:20,locationId:'dormCommon'}],
  r6:[{start:10,end:13,locationId:'library'},{start:13,end:16,locationId:'conservatory'},{start:16,end:18,locationId:'lakeside'},{start:18,end:20,locationId:'dormCommon'}],
};
export function npcScheduleFor(npcId:string,date=new Date()){return (isWeekend(date)?npcWeekendSchedules:npcWeekdaySchedules)[npcId]??[];}
export function npcPresence(relationships:Relationship[],date=new Date(),hour=date.getHours()){
  const pool=isWeekend(date)?weekendLocations:weekdayLocations;
  return relationships.map((npc,index)=>{
    if(hour<8)return {...npc,dailyLocation:'dormCommon',presenceNote:'Starting the day quietly'};
    if(hour>=20)return {...npc,dailyLocation:'dormCommon',presenceNote:'Evening common-room hours'};
    const schedule=npcScheduleFor(npc.id,date);
    const scheduledLocation=schedule.find(block=>hour>=block.start&&hour<block.end)?.locationId;
    const dailyLocation=scheduledLocation??(isWeekend(date)?pool[(hash(localDateKey(date)+npc.id)+index)%pool.length]:(npc.homeLocation??pool[index%pool.length]));
    const presenceNote=isWeekend(date)?'Weekend routine':scheduledLocation?`Scheduled here until ${String(schedule.find(block=>block.locationId===scheduledLocation&&hour>=block.start&&hour<block.end)?.end??20).padStart(2,'0')}:00`:'Academy-day routine';
    return {...npc,dailyLocation,presenceNote};
  });
}

export type ConversationTopic='academy'|'practice'|'personal';
export function generateNpcLine(npc:Relationship,topic:ConversationTopic,turn:number,date=new Date(),memory:{favoritesKnown?:boolean;previousChoice?:string}={}):string {
  const firstName=npc.name.split(' ')[0];
  const options:Record<ConversationTopic,string[]>= {
    academy:[`The academy is quieter from this corridor. I like hearing a building settle between lessons.`,`There is always another door here, but not every door needs to be opened today.`,`I have learned that most academy rumors become less dramatic when you ask one careful question.`],
    practice:[`Do one useful repetition before you do five impressive ones. Your body keeps better records than your ambition.`,`You look like you are deciding whether effort counts if nobody sees it. It does.`,`Try the phrase once without correcting yourself halfway through. Then we can talk about what actually happened.`],
    personal:[`People assume I am easier to understand than I am. I do not always correct them.`,`Tell me one ordinary thing from your day. The ordinary parts are usually where the truth hides.`,`I brought a thought here and forgot whether I meant to share it. That is a very academy sort of problem.`],
  };
  const index=hash(`conversation-${npc.id}-${topic}-${turn}-${localDateKey(date)}`)%options[topic].length;
  const aside=npc.likes?.length?` It is almost as satisfying as ${npc.likes[index%npc.likes.length]}.`:'';
  const favoriteMemory=memory.favoritesKnown&&topic==='personal'&&npc.likes?.length?` I may have mentioned that I keep returning to ${npc.likes[index%npc.likes.length]}.`:'';
  const choiceMemory=memory.previousChoice?` I remember you chose “${memory.previousChoice}” before. I wondered what you would say today.`:'';
  return `${firstName}: ${options[topic][index]}${aside}${favoriteMemory}${choiceMemory}`;
}

export interface DailyNpcSceneChoice { label:string; response:string; }
export interface DailyNpcScene { id:string; title:string; locationId:string; lines:string[]; choices:DailyNpcSceneChoice[]; fullBeat:boolean; }
const dailyNpcScenes:Record<string,DailyNpcScene[]>= {
  r1:[
    {id:'correction-before-class',title:'The Correction Before Class',locationId:'primaryStudio',lines:['Madame Élodie stops beside the barre before the room fills.','“Do not spend the whole morning trying to look ready. Spend one minute becoming ready.”'],choices:[{label:'Ask for one precise correction',response:'“Good. Specific questions make useful dancers.”'},{label:'Thank her and begin quietly',response:'“Then let the work answer for you.”'}],fullBeat:false},
    {id:'note-on-mirror',title:'A Note on the Mirror',locationId:'primaryStudio',lines:['A small paper is tucked into the corner of the studio mirror. Madame Élodie recognizes the handwriting before you ask.','“I leave reminders where students are most likely to argue with themselves.”','She points to the final line: Continue, but do not punish the body for being human.'],choices:[{label:'Keep the note for your journal',response:'“That is what records are for: remembering the useful sentence.”'},{label:'Leave it for the next dancer',response:'“Generous. Advice improves when it travels.”'}],fullBeat:true},
  ],
  r2:[
    {id:'clara-plan',title:'Clara Has a Plan',locationId:'dormCommon',lines:['Clara catches you in the common room with three ribbons, a pencil, and no visible plan.','“I have scheduled a calm afternoon. The schedule is already causing me stress.”'],choices:[{label:'Help simplify the plan',response:'“One thing at a time. Horrifying. Sensible.”'},{label:'Add one more ridiculous idea',response:'“Excellent. The day was dangerously manageable.”'}],fullBeat:false},
    {id:'clara-letter',title:'The Letter She Did Not Send',locationId:'roseCourt',lines:['Clara is sitting beneath the roses with an envelope balanced on her knee.','“It is not a sad letter. It is just a letter that knows too much.”','She turns it over and asks whether you think silence can be a kind of answer.'],choices:[{label:'Tell her to send it honestly',response:'“Honest is frightening. I suppose that is why it matters.”'},{label:'Offer to sit without advising',response:'“Thank you. I wanted company, not a committee.”'}],fullBeat:true},
  ],
  r3:[
    {id:'phrase-wall',title:'A Phrase Through the Wall',locationId:'musicWing',lines:['Lucien is listening to a melody through the practice-room wall instead of playing it.','“The wrong note is not always the problem. Sometimes it is the note everyone is afraid to follow.”'],choices:[{label:'Ask him to play it again',response:'“You heard the hesitation. That is useful.”'},{label:'Let the silence continue',response:'“Perhaps the silence was part of the phrase after all.”'}],fullBeat:false},
    {id:'missing-page',title:'The Missing Page',locationId:'theatreSeats',lines:['Lucien finds a torn page beneath an empty theatre seat. It is covered in rehearsal marks but has no name.','“Someone worked very hard on this and then decided not to be seen.”','He asks whether unfinished work belongs to the person who made it or the person who finds it.'],choices:[{label:'Return it to the music desk',response:'“A careful answer. Ownership should not be decided by curiosity.”'},{label:'Study the markings together',response:'“Then we will look without pretending that looking makes it ours.”'}],fullBeat:true},
  ],
  r4:[
    {id:'chairs',title:'Amara Counts the Chairs',locationId:'practiceStudio',lines:['Amara is arranging chairs in the practice studio even though nobody asked her to.','“A room tells people what is expected of them before anyone speaks.”'],choices:[{label:'Help arrange the room',response:'“You noticed the work before the applause. Keep that.”'},{label:'Ask who the room is for',response:'“Everyone who needs somewhere to begin.”'}],fullBeat:false},
    {id:'door-open',title:'The Door Left Open',locationId:'atelier',lines:['Amara finds the atelier door open after hours and pauses before entering.','Inside, a costume has been left half-repaired, one sleeve pinned and the other waiting.','“Some problems are asking for patience, not permission to become emergencies.”'],choices:[{label:'Help finish the repair',response:'“Good. Quiet competence is still courage.”'},{label:'Close the door and report it',response:'“Also wise. Care includes knowing what is not yours to fix.”'}],fullBeat:true},
  ],
  r5:[
    {id:'unofficial-score',title:'Sophie’s Unofficial Score',locationId:'primaryStudio',lines:['Sophie has drawn a tiny score beside the studio timetable. It is not an assessment, but she is treating it like one.','“Do not look at it. I am deciding whether today was acceptable.”'],choices:[{label:'Ask what would make today acceptable',response:'“A precise question. Annoying, but precise.”'},{label:'Tell her one good thing you noticed',response:'“One thing is not enough. It is also not nothing.”'}],fullBeat:false},
    {id:'garden-invitation',title:'The Invitation She Almost Refused',locationId:'formalGardens',lines:['Sophie holds an invitation to the garden festival as if it might contain a trap.','“Everyone says it is informal. Informal events are where people make the most permanent observations.”','She asks whether you would notice if she left early.'],choices:[{label:'Promise to notice',response:'“That is either kind or dangerous. I will assume kind.”'},{label:'Tell her she can leave without explanation',response:'“You make it sound easy. I may try.”'}],fullBeat:true},
  ],
  r6:[
    {id:'borrowing-rule',title:'Mrs. Finch’s Borrowing Rule',locationId:'library',lines:['Mrs. Finch has placed a new handwritten sign beside the checkout desk: Return the book, not merely the idea of the book.','“People are very fond of remembering that they meant to return something.”'],choices:[{label:'Ask what she is reading',response:'“A question with excellent manners. I may answer it.”'},{label:'Offer to help sort returns',response:'“Then begin with the books that look most offended.”'}],fullBeat:false},
    {id:'archive-window',title:'The Archive Has a Window',locationId:'conservatory',lines:['Mrs. Finch leads you to a narrow window near the conservatory shelves. Dust turns in the light like a slow snowfall.','“Archives are not only where the academy keeps its secrets.”','She points outside: “They are also where it keeps the evidence that people once hoped.”'],choices:[{label:'Ask what she hopes for now',response:'“That students learn the difference between preserving a past and obeying it.”'},{label:'Ask to write this down',response:'“Please do. Memory is a charmingly unreliable librarian.”'}],fullBeat:true},
  ],
};
export function dailyNpcScene(npc:Relationship,date=new Date(),recent:{date:string;sceneId:string}[]=[]):DailyNpcScene {
  const scenes=dailyNpcScenes[npc.id]??[{id:'passing-thought',title:'A Passing Thought',locationId:npc.homeLocation??'dormCommon',lines:[`${npc.name.split(' ')[0]} pauses beside you with a thought they almost kept to themselves.`,`“The academy is full of days that look ordinary until someone remembers them.”`],choices:[{label:'Ask them to continue',response:'“Perhaps I will, another day.”'},{label:'Share the quiet',response:'“That is enough for now.”'}],fullBeat:false}];
  const today=localDateKey(date);
  const recentIds=new Set(recent.filter(entry=>entry.date!==today).slice(-3).map(entry=>entry.sceneId));
  const available=scenes.filter(scene=>!recentIds.has(scene.id));
  const candidates=available.length?available:scenes;
  return candidates[hash(`daily-scene-${npc.id}-${today}`)%candidates.length];
}
