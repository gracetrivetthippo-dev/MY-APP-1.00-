import { LearningActivity, Relationship, ScheduleBlock, StoryScene, Task, WardrobeItem } from '../types';
import { yearOneScenes } from './yearOneStory';

export const seedTasks: Task[] = [
  { id:'t1', title:'Passé balance study', detail:'Three careful rounds on each side. Stop if dizzy.', kind:'ballet', minutes:12, xp:20, coins:12, completed:false, dueLabel:'Today' },
  { id:'t2', title:'French academy phrases', detail:'Learn five phrases for greeting a teacher.', kind:'french', minutes:15, xp:18, coins:10, completed:false, dueLabel:'Today' },
  { id:'t3', title:'Algebra review', detail:'Complete one focused practice set.', kind:'school', minutes:25, xp:25, coins:14, completed:false, dueLabel:'Today' },
];

export const seedSchedule: ScheduleBlock[] = [
  { id:'s1', day:0, days:[0], start:'19:00', end:'20:30', title:'Ballet Class', location:'Studio', kind:'ballet', recurrence:'weekly', affectsStory:true },
  { id:'s2', day:1, days:[1], start:'19:00', end:'20:30', title:'Ballet Class', location:'Studio', kind:'ballet', recurrence:'weekly', affectsStory:true },
];

export const seedRelationships: Relationship[] = [
  { id:'r1', name:'Madame Élodie Vasseur', initials:'ÉV', role:'Ballet Mistress', pronouns:'she/her', level:1, points:35, note:'Exacting without being cruel; she remembers effort longer than excuses.', personality:'Perceptive, disciplined, dryly funny', likes:['honest practice logs','musical phrasing','quiet persistence'], dislikes:['reckless overtraining','performative excuses'], homeLocation:'primaryStudio', scheduleHint:'Primary Studio during class hours; office corridor afterward.', color:'#B97B89' },
  { id:'r2', name:'Clara Bell', initials:'CB', role:'First-Year Academy Friend', pronouns:'she/her', year:'First year', level:2, points:68, note:'Your first real friend at the academy—and incapable of whispering normally.', personality:'Warm, quick-witted, observant', likes:['letters','library corners','rose tea'], dislikes:['being underestimated','awkward silences'], homeLocation:'dormCommon', scheduleHint:'Library before lessons; common room most evenings.', color:'#80917F' },
  { id:'r3', name:'Lucien Moreau', initials:'LM', role:'Music Student', pronouns:'he/him', year:'Second year', level:1, points:20, note:'Hears details other people miss and hides nerves behind immaculate manners.', personality:'Thoughtful, reserved, quietly mischievous', likes:['piano reductions','rain','old theatre programs'], dislikes:['crowds','careless tempo'], homeLocation:'musicWing', scheduleHint:'Music Wing afternoons; theatre before performances.', color:'#8B789A' },
  { id:'r4', name:'Amara Okafor', initials:'AO', role:'Senior Student Mentor', pronouns:'she/her', year:'Senior division', level:1, points:15, note:'A calm mentor who never mistakes kindness for softness.', personality:'Steady, ambitious, protective', likes:['early rehearsals','clear plans','strong port de bras'], dislikes:['gossip','unsafe competition'], homeLocation:'practiceStudio', scheduleHint:'Practice Studio early; Costume Atelier before events.', color:'#9B6F5D' },
  { id:'r5', name:'Sophie Laurent', initials:'SL', role:'First-Year Rival', pronouns:'she/her', year:'First year', level:1, points:8, note:'Polished, competitive, and more frightened of failure than she lets anyone see.', personality:'Brilliant, guarded, exacting', likes:['clean combinations','formal gardens','winning'], dislikes:['pity','public mistakes'], homeLocation:'primaryStudio', scheduleHint:'Primary Studio before class; Formal Gardens on weekends.', color:'#6F778D' },
  { id:'r6', name:'Mrs. Beatrice Finch', initials:'BF', role:'Academy Librarian', pronouns:'she/her', level:1, points:25, note:'Keeper of the library, misplaced letters, and several carefully chosen secrets.', personality:'Patient, eccentric, formidable', likes:['marginalia','returned books','precise questions'], dislikes:['folded page corners','dishonesty'], homeLocation:'library', scheduleHint:'Library every school day; Conservatory on quiet afternoons.', color:'#A48264' },
];

export const seedWardrobe: WardrobeItem[] = [
  { id:'w1', name:'Ivory Practice Dress', slot:'dress', price:0, owned:true, equipped:true, color:'#E9DCCB' },
  { id:'w2', name:'Rose Rehearsal Skirt', slot:'dress', price:120, owned:false, equipped:false, color:'#C98F9C' },
  { id:'w3', name:'Academy Ribbon', slot:'accessory', price:0, owned:true, equipped:true, color:'#B97B89' },
  { id:'w4', name:'Pearl Tiara', slot:'accessory', price:220, owned:false, equipped:false, color:'#D8C092' },
  { id:'w5', name:'Soft Ballet Shoes', slot:'shoes', price:0, owned:true, equipped:true, color:'#D8A9A8' },
  { id:'w6', name:'Kings Uniform', slot:'dress', price:0, owned:false, equipped:false, color:'#4B4458', unlock:'Unlocks September 2' },
];

export const seedScenes: StoryScene[] = [
  { id:'c1s1', chapter:1, title:'The Letter with the Gold Seal', summary:'An invitation arrives from the Royal Ballet Academy.', status:'available', locationId:'dorm', castIds:['r1'], letterFrom:'r1', lines:[
    { speaker:'Narrator', text:'A cream envelope waits beneath the morning light, your name written in sweeping ink.' },
    { speaker:'Madame Élodie', text:'Grace, your place in the summer trial has been reserved. Come prepared to work—and to surprise yourself.' },
    { speaker:'You', text:'The seal breaks with a tiny crack. For one second, the whole room feels different.' },
  ], reward:{ coins:25, xp:30 }},
  { id:'c1s2', chapter:1, title:'Assembly Beneath the Chandeliers', summary:'Meet the academy and receive your first assignment.', status:'locked', locationId:'entrance', castIds:['r1','r2','r4','r5'], requirement:'Complete the previous scene', triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'c1s1',label:'Complete “The Letter with the Gold Seal”'}]}, priority:90, lines:[
    { speaker:'Clara', text:'You look as nervous as I feel. That is either comforting or a terrible sign.' },
    { speaker:'You', text:'Let’s call it comforting until proven otherwise.' },
  ], choices:[
    {id:'sit-clara',label:'Sit beside Clara',relationshipEffects:[{relationshipId:'r2',points:18}],flags:['assembly_clara'],response:[{speaker:'Clara',text:'Good. If I accidentally curtsy to a chair, you are legally required to pretend it never happened.',expression:'amused'}]},
    {id:'watch-room',label:'Stand back and observe',relationshipEffects:[{relationshipId:'r4',points:10}],flags:['assembly_observer'],response:[{speaker:'Amara',text:'Watching first is sensible. Just remember that eventually you have to step into the room.',expression:'warm'}]},
    {id:'front-row',label:'Take the front row',relationshipEffects:[{relationshipId:'r1',points:12},{relationshipId:'r5',points:5}],flags:['assembly_bold'],response:[{speaker:'Sophie',text:'You do not waste time, do you?',expression:'surprised'}]},
  ], reward:{ coins:30, xp:35 }},
  { id:'c2s1', chapter:2, title:'A Ribbon in the Library', summary:'A coded ribbon and a missing checkout card turn a study visit into a mystery.', status:'locked', locationId:'library', castIds:['r2','r6'], requirement:'Reach Academy Level 2', triggers:{mode:'ALL',conditions:[{type:'level_at_least',level:2}]}, priority:70, lines:[
    { speaker:'Narrator', text:'A dusty-rose ribbon waits between the pages of a French grammar, knotted around a blank checkout card.' },
    {speaker:'Clara',text:'That was not there yesterday. I know because yesterday I dropped this exact book on my foot.',expression:'worried'},
    {speaker:'Mrs. Finch',text:'A library remembers who opens what. The more interesting question is why someone wanted you to open this.',expression:'neutral'},
  ], choices:[
    {id:'tell-finch',label:'Hand the ribbon to Mrs. Finch',relationshipEffects:[{relationshipId:'r6',points:20}],flags:['ribbon_reported'],response:[{speaker:'Mrs. Finch',text:'Prudent. Not timid—there is a difference.',expression:'warm'}]},
    {id:'investigate-clara',label:'Investigate quietly with Clara',relationshipEffects:[{relationshipId:'r2',points:20}],flags:['ribbon_secret'],response:[{speaker:'Clara',text:'Excellent. I have always wanted to make one responsible but questionable decision.',expression:'amused'}]},
  ], reward:{ coins:40, xp:50 }},
  { id:'system-practice-check', chapter:1, title:'A Note Beside the Barre', summary:'A small event used to verify location and practice triggers.', status:'locked', optional:true, priority:20, triggers:{mode:'ALL',conditions:[{type:'location_visited',locationId:'practiceStudio',label:'Visit the Practice Studio'},{type:'session_count_at_least',count:1,kind:'practice',label:'Complete one ballet practice session'}]}, lines:[
    { speaker:'Narrator', text:'A folded practice note waits beside the barre—proof that location and session triggers are working together.' },
  ], reward:{coins:5,xp:5}},
  {id:'c2s2',chapter:2,title:'The Practice Room After Rain',summary:'Lucien asks for help testing a rehearsal tempo while the storm traps everyone inside.',status:'locked',locationId:'musicWing',castIds:['r3'],priority:65,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'c1s2'},{type:'location_visited',locationId:'musicWing'}]},lines:[
    {speaker:'Narrator',text:'Rain trembles against the Music Wing windows. A piano phrase stops, restarts, and stops again.'},
    {speaker:'Lucien',text:'Would you mark the combination while I play? I need to know whether the tempo breathes or merely survives.',expression:'worried'},
  ],choices:[
    {id:'help-lucien',label:'Mark the combination with him',relationshipEffects:[{relationshipId:'r3',points:22}],flags:['lucien_rehearsal'],response:[{speaker:'Lucien',text:'There. You heard the hesitation too. I was beginning to think I invented it.',expression:'warm'}]},
    {id:'invite-clara',label:'Invite Clara to help as well',relationshipEffects:[{relationshipId:'r2',points:8},{relationshipId:'r3',points:12}],flags:['music_trio'],response:[{speaker:'Lucien',text:'Three opinions. Dangerous—but useful.',expression:'amused'}]},
  ],reward:{coins:18,xp:25}},
  {id:'c3s1',chapter:3,title:'Thirty Seconds of Silence',summary:'A difficult class leaves Sophie alone in the studio after everyone else has gone.',status:'locked',locationId:'primaryStudio',castIds:['r1','r5'],priority:75,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'c1s2'},{type:'session_count_at_least',count:2,kind:'practice'}]},lines:[
    {speaker:'Madame Élodie',text:'Correction is information, not a verdict. Anyone who confuses the two will become impossible to teach.',expression:'stern'},
    {speaker:'Narrator',text:'Later, Sophie remains beside the mirror, repeating one transition with increasingly furious precision.'},
    {speaker:'Sophie',text:'If you are here to tell me it looked fine, do not.',expression:'worried'},
  ],choices:[
    {id:'honest-note',label:'Offer one honest technical observation',relationshipEffects:[{relationshipId:'r5',points:24},{relationshipId:'r1',points:5}],flags:['sophie_honesty'],response:[{speaker:'Sophie',text:'That is annoyingly specific. Do it again so I can watch.',expression:'neutral'}]},
    {id:'quiet-company',label:'Practice beside her without commenting',relationshipEffects:[{relationshipId:'r5',points:16}],flags:['sophie_company'],response:[{speaker:'Sophie',text:'You can stay. Just do not make this sentimental.',expression:'warm'}]},
  ],reward:{coins:22,xp:30}},
  {id:'c3s2',chapter:3,title:'The Sealed Rehearsal List',summary:'A rehearsal list appears backstage with one name carefully covered in ink.',status:'locked',locationId:'backstage',castIds:['r3','r4','r5'],priority:80,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'c2s1'},{type:'location_visited',locationId:'backstage'}]},lines:[
    {speaker:'Amara',text:'No one touches the list until we know whether it is official.',expression:'stern'},
    {speaker:'Lucien',text:'The paper is official. The ink is not.',expression:'neutral'},
    {speaker:'Narrator',text:'Beneath the black stroke, the first curve of a letter is still visible.'},
  ],choices:[
    {id:'bring-elodie',label:'Bring the list directly to Madame Élodie',relationshipEffects:[{relationshipId:'r1',points:16},{relationshipId:'r4',points:12}],flags:['list_official'],response:[{speaker:'Amara',text:'Correct. Secrets become dangerous when everyone decides they are entitled to solve them.',expression:'warm'}]},
    {id:'inspect-ink',label:'Ask Lucien to help inspect it first',relationshipEffects:[{relationshipId:'r3',points:18}],flags:['list_investigated'],response:[{speaker:'Lucien',text:'Hold it toward the work light. Whoever did this pressed much harder on the final stroke.',expression:'neutral'}]},
  ],reward:{coins:28,xp:38}},
  {id:'c4s1',chapter:4,title:'A Table Set for Five',summary:'A strained weekend tea forces rivals, friends, and mentors into one conversation.',status:'locked',locationId:'dormCommon',castIds:['r2','r4','r5'],priority:60,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'c3s1'},{type:'day_of_week',days:[5,6],label:'Return on a weekend'}]},lines:[
    {speaker:'Clara',text:'I made a seating plan. Then I realized seating plans are how wars begin.',expression:'worried'},
    {speaker:'Amara',text:'Tea first. War after the cakes.',expression:'amused'},
    {speaker:'Sophie',text:'I am only here because leaving would look frightened.',expression:'neutral'},
  ],choices:[
    {id:'seat-sophie',label:'Save the seat beside you for Sophie',relationshipEffects:[{relationshipId:'r5',points:25},{relationshipId:'r2',points:6}],flags:['tea_reconcile'],response:[{speaker:'Sophie',text:'This does not mean we are suddenly inseparable. Pass the sugar.',expression:'warm'}]},
    {id:'help-clara',label:'Help Clara rescue the tea',relationshipEffects:[{relationshipId:'r2',points:24}],flags:['tea_clara'],response:[{speaker:'Clara',text:'You are promoted from guest to emergency co-host.',expression:'amused'}]},
  ],reward:{coins:20,xp:30}},
  {id:'c4s2',chapter:4,title:'The Headmistress’s Second Envelope',summary:'The first mystery becomes an academy assignment with consequences for the winter performance.',status:'locked',locationId:'headmistress',castIds:['r1','r4','r6'],letterFrom:'r1',priority:95,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'c3s2'},{type:'relationship_level_at_least',relationshipId:'r1',level:1}]},lines:[
    {speaker:'Madame Élodie',text:'The altered list was not a prank. Someone is testing which students notice, which students speak, and which students can be divided.',expression:'stern'},
    {speaker:'Mrs. Finch',text:'The ribbon in the library belonged to the same set used for archived performance notes.',expression:'neutral'},
    {speaker:'Amara',text:'Then the winter casting is only part of the problem.',expression:'worried'},
  ],choices:[
    {id:'accept-team',label:'Agree to investigate with the others',relationshipEffects:[{relationshipId:'r1',points:12},{relationshipId:'r4',points:18},{relationshipId:'r6',points:10}],flags:['chronicle_team'],response:[{speaker:'Madame Élodie',text:'Good. Curiosity with supervision is called research. Without it, merely trouble.',expression:'warm'}]},
    {id:'focus-performance',label:'Ask to protect the performance first',relationshipEffects:[{relationshipId:'r1',points:18},{relationshipId:'r5',points:8}],flags:['performance_first'],response:[{speaker:'Madame Élodie',text:'A dancer’s answer. We will protect both the work and the people doing it.',expression:'warm'}]},
  ],reward:{coins:45,xp:55}},
  {id:'relationship-clara-letter',chapter:2,title:'Clara’s Unsent Letter',summary:'A friendship event unlocked by earning Clara’s trust.',status:'locked',optional:true,locationId:'roseCourt',castIds:['r2'],letterFrom:'r2',priority:45,triggers:{mode:'ALL',conditions:[{type:'relationship_level_at_least',relationshipId:'r2',level:2},{type:'location_visited',locationId:'roseCourt'}]},lines:[{speaker:'Clara',text:'I write letters when saying things aloud feels too large. This one was meant for nobody, which is apparently why I brought it to you.',expression:'worried'}],choices:[{id:'listen',label:'Let her read it in her own time',relationshipEffects:[{relationshipId:'r2',points:25}],flags:['clara_confidante'],response:[{speaker:'Clara',text:'Thank you for not trying to make the silence smaller.',expression:'warm'}]}],reward:{coins:12,xp:18}},
  {id:'relationship-lucien-program',chapter:3,title:'Notes in the Theatre Program',summary:'A quiet relationship event about music, pressure, and being heard.',status:'locked',optional:true,locationId:'theatreSeats',castIds:['r3'],priority:40,triggers:{mode:'ALL',conditions:[{type:'relationship_level_at_least',relationshipId:'r3',level:1},{type:'scene_complete',sceneId:'c2s2'}]},lines:[{speaker:'Lucien',text:'I mark every place the orchestra could breathe. It is easier than admitting where I cannot.',expression:'worried'}],choices:[{id:'share-pressure',label:'Tell him where you feel pressure too',relationshipEffects:[{relationshipId:'r3',points:24}],flags:['lucien_trust'],response:[{speaker:'Lucien',text:'Then perhaps neither of us has to pretend the difficult parts are effortless.',expression:'warm'}]}],reward:{coins:12,xp:18}},
  ...yearOneScenes,
];

export const learningActivities: LearningActivity[] = [
  { id:'a1', kind:'study', title:'Study Beside Your Character', subtitle:'A quiet academy desk, a real focus timer, and one clear goal.', minutes:25, stat:'academics', steps:['Choose one assignment','Work until the bell','Write one thing you learned'] },
  { id:'a2', kind:'french', title:'French in the Library', subtitle:'Learn useful academy French with Clara.', minutes:15, stat:'french', steps:['Read five phrases aloud','Cover the translations','Recall at least three'], resource:{ label:'Open Duolingo', url:'https://www.duolingo.com/' } },
  { id:'a3', kind:'practice', title:'Practice-Room Session', subtitle:'Your avatar practices while you complete a safe real-world set.', minutes:12, stat:'ballet', steps:['Warm up gently','Complete your chosen exercise','Log what felt strong'] },
  { id:'a4', kind:'reading', title:'Read in the Conservatory', subtitle:'A screen-light break for your paper book.', minutes:20, stat:'academics', steps:['Choose a stopping point','Read without multitasking','Record one favorite detail'] },
  { id:'a5', kind:'wellbeing', title:'Quiet Room Reset', subtitle:'A low-pressure reset when everything is too loud.', minutes:5, stat:'wellbeing', steps:['Unclench your jaw and shoulders','Take a sip of water','Name the smallest possible next step'] },
  { id:'a6', kind:'wellbeing', title:'Walk the Academy Grounds', subtitle:'Your character explores the gardens while you take a gentle real-world walk.', minutes:15, stat:'wellbeing', steps:['Choose a safe familiar route','Walk at a comfortable pace','Pause if dizzy or unwell','Log one thing you noticed'] },
  { id:'a7', kind:'custom', title:'Make Your Own Session', subtitle:'Choose your own task, timer, and tiny finish line.', minutes:10, stat:'wellbeing', steps:['Name the task','Choose the smallest useful finish line','Work beside your character','Write what you actually did'] },
];
