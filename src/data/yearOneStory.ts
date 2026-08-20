import { StoryScene } from '../types';

// Final Batch 1: the editable school-year spine. Dates, dialogue, rewards,
// trigger conditions, choices, and relationship effects can all be changed here.
export const yearOneScenes:StoryScene[] = [
  {id:'y1-sep-arrival',chapter:5,title:'The First Morning of Term',summary:'The academy changes when the full school year begins.',status:'locked',startsAt:'2026-09-02',locationId:'entrance',castIds:['r1','r2','r4','r5'],priority:100,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'c4s2'}]},lines:[
    {speaker:'Narrator',text:'On the first morning of term, the entrance hall is louder, brighter, and crowded with students carrying garment bags and impossible expectations.'},
    {speaker:'Madame Élodie',text:'Summer showed me how you begin. This year will show me how you continue.',expression:'stern'},
    {speaker:'Clara',text:'I made three plans for today. I have already lost two of them.',expression:'amused'},
  ],choices:[
    {id:'term-clara',label:'Help Clara find her classrooms',relationshipEffects:[{relationshipId:'r2',points:18}],flags:['term_began_with_clara'],response:[{speaker:'Clara',text:'If we become lost together, it becomes an architectural problem instead of a personal failure.',expression:'warm'}]},
    {id:'term-studio',label:'Go directly to the studio',relationshipEffects:[{relationshipId:'r1',points:12},{relationshipId:'r5',points:8}],flags:['term_began_in_studio'],response:[{speaker:'Sophie',text:'Of course you came early. Good. I was beginning to think I had no competition.',expression:'amused'}]},
  ],reward:{coins:35,xp:45}},
  {id:'y1-sep-placement',chapter:5,title:'Names on the Placement Board',summary:'The first public list of the year creates an immediate fault line.',status:'locked',startsAt:'2026-09-02',locationId:'hallway',castIds:['r1','r4','r5'],priority:90,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-sep-arrival'},{type:'location_visited',locationId:'hallway'}]},lines:[
    {speaker:'Narrator',text:'A new placement board hangs beneath the academy crest. Someone has drawn a thin pencil line through one student’s name.'},
    {speaker:'Amara',text:'Do not decide what it means before we know who changed it.',expression:'stern'},
    {speaker:'Sophie',text:'Easy advice when it is not your name.',expression:'worried'},
  ],choices:[
    {id:'placement-defend',label:'Stand beside Sophie publicly',relationshipEffects:[{relationshipId:'r5',points:22},{relationshipId:'r4',points:5}],flags:['defended_sophie'],response:[{speaker:'Sophie',text:'I did not ask you to do that. I am not saying I wish you had not.',expression:'warm'}]},
    {id:'placement-evidence',label:'Photograph the board and find Madame Élodie',relationshipEffects:[{relationshipId:'r1',points:18},{relationshipId:'r4',points:10}],flags:['placement_evidence'],response:[{speaker:'Madame Élodie',text:'Evidence before accusation. Keep that habit.',expression:'warm'}]},
  ],reward:{coins:28,xp:38}},
  {id:'y1-sep-first-class',chapter:5,title:'After the First Scheduled Class',summary:'Your real schedule opens a class reflection and the year’s first correction.',status:'locked',locationId:'primaryStudio',castIds:['r1','r5'],priority:78,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-sep-placement'},{type:'schedule_block_today',kind:'ballet',label:'Have ballet on today’s editable schedule'},{type:'session_count_at_least',count:1,kind:'practice'}]},lines:[
    {speaker:'Madame Élodie',text:'Your turnout is not permission to abandon placement. Strength must organize what flexibility makes possible.',expression:'stern'},
    {speaker:'Sophie',text:'She corrected me twice and you three times. I cannot decide which of us should be offended.',expression:'amused'},
    {speaker:'Narrator',text:'The correction is difficult, specific, and useful—the sort worth recording honestly.'},
  ],choices:[
    {id:'class-journal',label:'Record the correction without softening it',relationshipEffects:[{relationshipId:'r1',points:14}],flags:['honest_first_correction'],response:[{speaker:'Madame Élodie',text:'Good. A useful record is not a performance review written to flatter yourself.',expression:'warm'}]},
    {id:'class-sophie',label:'Ask Sophie to compare notes',relationshipEffects:[{relationshipId:'r5',points:18}],flags:['shared_corrections'],response:[{speaker:'Sophie',text:'Fine. But if your handwriting is decorative nonsense, I reserve the right to complain.',expression:'amused'}]},
  ],reward:{coins:24,xp:35}},

  {id:'y1-oct-archive',chapter:6,title:'The Archive Key',summary:'Mrs. Finch reveals what the altered lists have in common.',status:'locked',startsAt:'2026-10-01',locationId:'library',castIds:['r2','r6'],priority:92,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-sep-first-class'},{type:'location_visited',locationId:'library'}]},lines:[
    {speaker:'Mrs. Finch',text:'Every altered paper came from a year when the academy nearly cancelled its winter performance.',expression:'neutral'},
    {speaker:'Clara',text:'You say things like that and then wonder why nobody returns books on time.',expression:'surprised'},
    {speaker:'Narrator',text:'Mrs. Finch places a brass archive key between you.'},
  ],choices:[
    {id:'archive-open',label:'Open the archive with Mrs. Finch',relationshipEffects:[{relationshipId:'r6',points:22}],flags:['archive_supervised'],response:[{speaker:'Mrs. Finch',text:'The correct choice. Less thrilling, perhaps, but considerably less likely to end in expulsion.',expression:'amused'}]},
    {id:'archive-team',label:'Ask Clara to document every clue',relationshipEffects:[{relationshipId:'r2',points:18},{relationshipId:'r6',points:8}],flags:['archive_documented'],response:[{speaker:'Clara',text:'I have tabs, colored ink, and a deeply unhealthy enthusiasm for this.',expression:'amused'}]},
  ],reward:{coins:32,xp:42}},
  {id:'y1-oct-audition',chapter:6,title:'The Autumn Demonstration Audition',summary:'The first performance opportunity tests preparation rather than perfection.',status:'locked',startsAt:'2026-10-01',locationId:'theatre',castIds:['r1','r3','r4','r5'],priority:85,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-oct-archive'},{type:'session_count_at_least',count:3,kind:'practice'}]},lines:[
    {speaker:'Lucien',text:'The introduction is eight counts. I will not rescue anyone who begins on seven.',expression:'amused'},
    {speaker:'Amara',text:'Breathe before you enter. The room does not need you to apologize for taking space.',expression:'warm'},
    {speaker:'Madame Élodie',text:'Show me what you understand, not what you hope I overlook.',expression:'stern'},
  ],choices:[
    {id:'audition-musical',label:'Prioritize musicality and clean placement',relationshipEffects:[{relationshipId:'r1',points:16},{relationshipId:'r3',points:12}],flags:['audition_musical'],response:[{speaker:'Lucien',text:'You waited for the phrase instead of chasing it. Thank you.',expression:'warm'}]},
    {id:'audition-bold',label:'Take the risky performance choice',relationshipEffects:[{relationshipId:'r4',points:14},{relationshipId:'r5',points:10}],flags:['audition_bold'],response:[{speaker:'Amara',text:'Bold is useful when it is chosen, not when it is panic wearing makeup.',expression:'warm'}]},
  ],reward:{coins:40,xp:55}},
  {id:'y1-oct-rosecourt',chapter:6,title:'The Rose Court Agreement',summary:'Clara and Sophie force a temporary alliance before rumors split the year group.',status:'locked',startsAt:'2026-10-01',locationId:'roseCourt',castIds:['r2','r5'],priority:72,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-oct-audition'},{type:'location_visited',locationId:'roseCourt'}]},lines:[
    {speaker:'Clara',text:'Someone keeps telling different versions of the same story and waiting for us to fight about it.',expression:'worried'},
    {speaker:'Sophie',text:'Then disappoint them.',expression:'stern'},
    {speaker:'Narrator',text:'The agreement is simple: verify rumors before repeating them and never use private corrections as public weapons.'},
  ],choices:[
    {id:'agreement-lead',label:'Write the agreement and sign first',relationshipEffects:[{relationshipId:'r2',points:14},{relationshipId:'r5',points:18}],flags:['rose_agreement'],response:[{speaker:'Sophie',text:'A little dramatic. I approve.',expression:'warm'}]},
    {id:'agreement-private',label:'Keep the agreement between the three of you',relationshipEffects:[{relationshipId:'r2',points:18},{relationshipId:'r5',points:12}],flags:['quiet_alliance'],response:[{speaker:'Clara',text:'A secret pact in a rose garden. Entirely normal school behavior.',expression:'amused'}]},
  ],reward:{coins:25,xp:35}},

  {id:'y1-nov-midterm',chapter:7,title:'The Midterm Review',summary:'Practice records and reflections become evidence of growth.',status:'locked',startsAt:'2026-11-01',locationId:'headmistress',castIds:['r1','r4'],priority:88,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-oct-rosecourt'},{type:'journal_entry_exists',template:'practice-log',label:'Write at least one practice log'}]},lines:[
    {speaker:'Madame Élodie',text:'Your strongest quality is not turnout or balance. It is that you return to a problem after discovering it is difficult.',expression:'warm'},
    {speaker:'Amara',text:'Your record also shows where effort became too much. That matters.',expression:'neutral'},
    {speaker:'Narrator',text:'The review contains praise, two uncompromising goals, and no vague encouragement.'},
  ],choices:[
    {id:'review-strength',label:'Choose strength and control as the next focus',relationshipEffects:[{relationshipId:'r1',points:14},{relationshipId:'r4',points:10}],flags:['focus_strength_control'],response:[{speaker:'Madame Élodie',text:'A sensible priority. Quality before volume.',expression:'warm'}]},
    {id:'review-performance',label:'Choose confidence and performance as the next focus',relationshipEffects:[{relationshipId:'r4',points:16}],flags:['focus_performance'],response:[{speaker:'Amara',text:'Then practice being seen before you practice being impressive.',expression:'warm'}]},
  ],reward:{coins:35,xp:48}},
  {id:'y1-nov-lost-score',chapter:7,title:'The Missing Piano Score',summary:'A vanished score threatens the winter rehearsal and points toward the old archive.',status:'locked',startsAt:'2026-11-01',locationId:'musicWing',castIds:['r3','r6'],priority:94,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-nov-midterm'},{type:'location_visited',locationId:'musicWing'}]},lines:[
    {speaker:'Lucien',text:'It was on the piano at noon. By one, the cover remained and the score was gone.',expression:'worried'},
    {speaker:'Mrs. Finch',text:'The missing edition contains handwritten cuts used in the cancelled winter production.',expression:'neutral'},
    {speaker:'Narrator',text:'A thread of dusty-rose ribbon is caught beneath the piano hinge.'},
  ],choices:[
    {id:'score-search',label:'Search the public rooms methodically',relationshipEffects:[{relationshipId:'r3',points:16},{relationshipId:'r6',points:12}],flags:['score_methodical'],response:[{speaker:'Mrs. Finch',text:'Begin with ordinary explanations. They are common because they are often correct.',expression:'warm'}]},
    {id:'score-archive',label:'Compare the ribbon to the archive set',relationshipEffects:[{relationshipId:'r6',points:18},{relationshipId:'r3',points:8}],flags:['score_archive_link'],response:[{speaker:'Lucien',text:'I dislike that this makes sense.',expression:'worried'}]},
  ],reward:{coins:38,xp:50}},
  {id:'y1-nov-backstage',chapter:7,title:'A Light Left On Backstage',summary:'A late rehearsal reveals that someone has been recreating the cancelled production.',status:'locked',startsAt:'2026-11-01',locationId:'backstage',castIds:['r3','r4','r5'],priority:96,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-nov-lost-score'},{type:'location_visited',locationId:'backstage'}]},lines:[
    {speaker:'Narrator',text:'One work light burns above a table covered with copied staging notes, ribbon markers, and the missing score.'},
    {speaker:'Sophie',text:'This is not sabotage. Someone is trying to put the old production back together.',expression:'surprised'},
    {speaker:'Amara',text:'Without permission, using current students as pieces in an argument that began years ago.',expression:'stern'},
  ],choices:[
    {id:'backstage-secure',label:'Secure everything and notify faculty',relationshipEffects:[{relationshipId:'r4',points:18},{relationshipId:'r1',points:10}],flags:['evidence_secured'],response:[{speaker:'Amara',text:'Good. Nobody gets to remove context this time.',expression:'warm'}]},
    {id:'backstage-read',label:'Read the casting notes before closing the room',relationshipEffects:[{relationshipId:'r5',points:16},{relationshipId:'r3',points:8}],flags:['casting_notes_read'],response:[{speaker:'Sophie',text:'My name is written beside a role that did not exist on the new list.',expression:'worried'}]},
  ],reward:{coins:42,xp:55}},

  {id:'y1-dec-casting',chapter:8,title:'Winter Casting',summary:'The official casting list arrives under unusually careful supervision.',status:'locked',startsAt:'2026-12-01',locationId:'theatreLobby',castIds:['r1','r2','r3','r4','r5'],priority:100,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-nov-backstage'}]},lines:[
    {speaker:'Madame Élodie',text:'Casting measures the needs of one production. It is not a ranking of human worth.',expression:'stern'},
    {speaker:'Clara',text:'I know that intellectually. Emotionally, I am a decorative panic attack.',expression:'worried'},
    {speaker:'Sophie',text:'Whatever is on that page, we agreed not to turn it into ammunition.',expression:'neutral'},
  ],choices:[
    {id:'casting-friends',label:'Read the list with Clara and Sophie',relationshipEffects:[{relationshipId:'r2',points:16},{relationshipId:'r5',points:16}],flags:['casting_together'],response:[{speaker:'Clara',text:'All right. Nobody celebrates or collapses alone.',expression:'warm'}]},
    {id:'casting-alone',label:'Read privately, then check on everyone else',relationshipEffects:[{relationshipId:'r4',points:14}],flags:['casting_composed'],response:[{speaker:'Amara',text:'Taking a moment before reacting is not selfish. It is often generous.',expression:'warm'}]},
  ],reward:{coins:45,xp:60}},
  {id:'y1-dec-snow-rehearsal',chapter:8,title:'Rehearsal While Snow Falls',summary:'A rehearsal failure becomes the turning point the group needed.',status:'locked',startsAt:'2026-12-01',locationId:'primaryStudio',castIds:['r1','r3','r5'],priority:86,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-dec-casting'},{type:'session_count_at_least',count:5,kind:'practice'}]},lines:[
    {speaker:'Narrator',text:'Snow softens the windows while the same musical entrance fails for the fourth time.'},
    {speaker:'Lucien',text:'The tempo is not the problem. Everyone is waiting for someone else to commit.',expression:'stern'},
    {speaker:'Madame Élodie',text:'Again. This time, choose together.',expression:'stern'},
  ],choices:[
    {id:'snow-lead',label:'Give the group a clear count and begin',relationshipEffects:[{relationshipId:'r1',points:12},{relationshipId:'r3',points:14},{relationshipId:'r5',points:10}],flags:['rehearsal_leadership'],response:[{speaker:'Sophie',text:'That was better. Do not look pleased; we still have the ending.',expression:'amused'}]},
    {id:'snow-listen',label:'Ask Lucien to play the phrase once without dancing',relationshipEffects:[{relationshipId:'r3',points:20}],flags:['rehearsal_listened'],response:[{speaker:'Lucien',text:'There. The breath is before the step, not inside it.',expression:'warm'}]},
  ],reward:{coins:35,xp:50}},
  {id:'y1-dec-winter-performance',chapter:8,title:'The Winter Performance',summary:'The first major performance tests the promises made all term.',status:'locked',startsAt:'2026-12-15',locationId:'theatre',castIds:['r1','r2','r3','r4','r5'],priority:110,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-dec-snow-rehearsal'}]},lines:[
    {speaker:'Narrator',text:'From the wings, the theatre looks like a dark jewel box filled with waiting breath.'},
    {speaker:'Amara',text:'You have already done the work. Now let the audience see it.',expression:'warm'},
    {speaker:'Madame Élodie',text:'Places, everyone.',expression:'neutral'},
  ],choices:[
    {id:'winter-calm',label:'Center the group and perform with control',relationshipEffects:[{relationshipId:'r1',points:18},{relationshipId:'r4',points:14}],flags:['winter_controlled'],response:[{speaker:'Madame Élodie',text:'You did not chase the moment. You allowed it to arrive.',expression:'warm'}]},
    {id:'winter-heart',label:'Perform for the people beside you',relationshipEffects:[{relationshipId:'r2',points:14},{relationshipId:'r3',points:12},{relationshipId:'r5',points:14}],flags:['winter_connected'],response:[{speaker:'Clara',text:'I looked across the stage and stopped being afraid.',expression:'warm'}]},
  ],reward:{coins:80,xp:100}},

  {id:'y1-jan-return',chapter:9,title:'The Quiet Return',summary:'A new term begins with changed expectations and one unresolved question.',status:'locked',startsAt:'2027-01-04',locationId:'dormCommon',castIds:['r2','r5'],priority:82,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-dec-winter-performance'}]},lines:[
    {speaker:'Clara',text:'I expected everything to feel different after the performance. Instead the kettle is broken again.',expression:'amused'},
    {speaker:'Sophie',text:'Something is different. The old production notes are gone from the evidence room.',expression:'worried'},
    {speaker:'Narrator',text:'The mystery survived the holidays.'},
  ],choices:[
    {id:'return-report',label:'Report the missing evidence immediately',relationshipEffects:[{relationshipId:'r1',points:14},{relationshipId:'r5',points:8}],flags:['missing_evidence_reported'],response:[{speaker:'Sophie',text:'Good. I am tired of secrets pretending to be strategy.',expression:'warm'}]},
    {id:'return-check',label:'Check who had access before accusing anyone',relationshipEffects:[{relationshipId:'r6',points:14},{relationshipId:'r2',points:8}],flags:['access_checked'],response:[{speaker:'Clara',text:'A list first, dramatic confrontation second. We are becoming frighteningly responsible.',expression:'amused'}]},
  ],reward:{coins:30,xp:42}},
  {id:'y1-jan-goals',chapter:9,title:'One Honest Goal',summary:'A journal reflection turns the second term into a deliberate choice.',status:'locked',startsAt:'2027-01-04',locationId:'reflection',castIds:['r4'],priority:64,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-jan-return'},{type:'journal_entry_exists',template:'weekly-review',label:'Write a weekly review'}]},lines:[
    {speaker:'Amara',text:'Choose a goal you can practice, not an identity you can fail to become.',expression:'warm'},
    {speaker:'Narrator',text:'The blank journal page feels less like a judgment and more like a door.'},
  ],choices:[
    {id:'goal-consistency',label:'Choose consistency over intensity',relationshipEffects:[{relationshipId:'r4',points:18}],flags:['goal_consistency'],response:[{speaker:'Amara',text:'That goal will still matter on an ordinary Tuesday. Good.',expression:'warm'}]},
    {id:'goal-courage',label:'Choose courage in visible moments',relationshipEffects:[{relationshipId:'r4',points:15},{relationshipId:'r5',points:6}],flags:['goal_courage'],response:[{speaker:'Amara',text:'Then practice courage in small rooms before asking for it onstage.',expression:'warm'}]},
  ],reward:{coins:20,xp:32}},

  {id:'y1-feb-duet',chapter:10,title:'The Duet Assignment',summary:'A partnership assignment makes trust impossible to avoid.',status:'locked',startsAt:'2027-02-01',locationId:'primaryStudio',castIds:['r1','r5'],priority:84,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-jan-goals'}]},lines:[
    {speaker:'Madame Élodie',text:'A duet is not two solos occurring at the same time.',expression:'stern'},
    {speaker:'Sophie',text:'If we are paired, I want one rule: say the correction, do not hint at it.',expression:'neutral'},
    {speaker:'Narrator',text:'Trust begins as an agreement to be specific.'},
  ],choices:[
    {id:'duet-agree',label:'Agree and ask the same honesty from Sophie',relationshipEffects:[{relationshipId:'r5',points:25}],flags:['duet_honesty'],response:[{speaker:'Sophie',text:'Fine. No guessing, no sulking, no fake compliments.',expression:'warm'}]},
    {id:'duet-plan',label:'Build a rehearsal plan together',relationshipEffects:[{relationshipId:'r5',points:18},{relationshipId:'r1',points:8}],flags:['duet_planned'],response:[{speaker:'Madame Élodie',text:'Planning is useful. Leave room for listening.',expression:'warm'}]},
  ],reward:{coins:35,xp:48}},
  {id:'y1-feb-letter',chapter:10,title:'A Valentine Without a Name',summary:'An anonymous note contains a clue instead of a confession.',status:'locked',startsAt:'2027-02-10',expiresAt:'2027-02-28',optional:true,locationId:'dorm',castIds:['r2','r3'],letterFrom:'unknown',priority:58,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-feb-duet'}]},lines:[
    {speaker:'Narrator',text:'A tiny envelope is sealed with a pressed rose. Inside is a copied bar of music and the words: Ask who changed the ending.'},
    {speaker:'Clara',text:'This is either romantic or deeply inconvenient.',expression:'surprised'},
    {speaker:'Lucien',text:'The handwriting is disguised. The musical notation is not.',expression:'neutral'},
  ],choices:[
    {id:'letter-lucien',label:'Ask Lucien to identify the notation',relationshipEffects:[{relationshipId:'r3',points:20}],flags:['anonymous_notation'],response:[{speaker:'Lucien',text:'It belongs to the old répétiteur. He changed the ending before the production was cancelled.',expression:'worried'}]},
    {id:'letter-finch',label:'Bring the note to Mrs. Finch',relationshipEffects:[{relationshipId:'r6',points:16}],flags:['anonymous_archived'],response:[{speaker:'Mrs. Finch',text:'Pressed roses age. This one was sealed recently.',expression:'neutral'}]},
  ],reward:{coins:18,xp:28}},

  {id:'y1-mar-exams',chapter:11,title:'Spring Assessment Week',summary:'The academy assessment measures technique, reflection, and recovery under pressure.',status:'locked',startsAt:'2027-03-01',locationId:'primaryStudio',castIds:['r1','r4'],priority:90,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-feb-duet'},{type:'session_count_at_least',count:8,kind:'practice'}]},lines:[
    {speaker:'Madame Élodie',text:'An assessment is a sample, not a prophecy. Give me clean information.',expression:'stern'},
    {speaker:'Amara',text:'If dizziness or pain changes the work, you stop and record it. Recklessness earns no secret points.',expression:'stern'},
    {speaker:'Narrator',text:'The room asks for honesty as much as performance.'},
  ],choices:[
    {id:'exam-quality',label:'Choose clean repetitions and honest limits',relationshipEffects:[{relationshipId:'r1',points:20},{relationshipId:'r4',points:16}],flags:['assessment_quality'],response:[{speaker:'Madame Élodie',text:'That was disciplined. Remember that discipline includes stopping when technique is gone.',expression:'warm'}]},
    {id:'exam-expression',label:'Focus on musical clarity and port de bras',relationshipEffects:[{relationshipId:'r1',points:16},{relationshipId:'r3',points:8}],flags:['assessment_expression'],response:[{speaker:'Madame Élodie',text:'Your upper body understands the phrase. Now teach the rest of you to agree.',expression:'warm'}]},
  ],reward:{coins:55,xp:75}},
  {id:'y1-mar-truth',chapter:11,title:'The Person in the Archive',summary:'The mystery finally gains a face and a motive.',status:'locked',startsAt:'2027-03-01',locationId:'library',castIds:['r1','r3','r6'],priority:105,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-mar-exams'},{type:'location_visited',locationId:'library'}]},lines:[
    {speaker:'Mrs. Finch',text:'The former répétiteur has been entering with an old staff key. He believed the cancelled production was stolen from him.',expression:'stern'},
    {speaker:'Lucien',text:'So he manipulated current students to prove an old argument.',expression:'worried'},
    {speaker:'Madame Élodie',text:'Understanding a motive does not excuse its methods.',expression:'stern'},
  ],choices:[
    {id:'truth-accountability',label:'Ask for full accountability and transparency',relationshipEffects:[{relationshipId:'r1',points:20},{relationshipId:'r6',points:16}],flags:['truth_accountability'],response:[{speaker:'Madame Élodie',text:'Agreed. The academy cannot teach integrity while hiding its own failures.',expression:'warm'}]},
    {id:'truth-preserve',label:'Ask to preserve the old production history',relationshipEffects:[{relationshipId:'r3',points:18},{relationshipId:'r6',points:14}],flags:['truth_preserved'],response:[{speaker:'Mrs. Finch',text:'History should be kept, including the portions that embarrass its keepers.',expression:'warm'}]},
  ],reward:{coins:60,xp:80}},

  {id:'y1-apr-spring-casting',chapter:12,title:'Spring Production Casting',summary:'With the mystery exposed, casting must become about the present again.',status:'locked',startsAt:'2027-04-01',locationId:'theatreLobby',castIds:['r1','r2','r3','r4','r5'],priority:94,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-mar-truth'}]},lines:[
    {speaker:'Madame Élodie',text:'This production will not repair the past. It will belong to the students in this room.',expression:'neutral'},
    {speaker:'Sophie',text:'For once, I would like a list that is only a list.',expression:'amused'},
    {speaker:'Clara',text:'A radical artistic concept.',expression:'amused'},
  ],choices:[
    {id:'spring-company',label:'Treat the casting as a company responsibility',relationshipEffects:[{relationshipId:'r2',points:12},{relationshipId:'r4',points:14},{relationshipId:'r5',points:12}],flags:['spring_company'],response:[{speaker:'Amara',text:'That is how a production becomes larger than its best individual moment.',expression:'warm'}]},
    {id:'spring-role',label:'Commit fully to your assigned role',relationshipEffects:[{relationshipId:'r1',points:18}],flags:['spring_role_commitment'],response:[{speaker:'Madame Élodie',text:'Good. Make the role specific enough that nobody else could have made your choices.',expression:'warm'}]},
  ],reward:{coins:45,xp:60}},
  {id:'y1-apr-garden',chapter:12,title:'Rehearsal in the Practice Garden',summary:'A warm weekend rehearsal becomes a rare uncomplicated afternoon.',status:'locked',startsAt:'2027-04-01',optional:true,locationId:'practiceGarden',castIds:['r2','r3','r5'],priority:52,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-apr-spring-casting'},{type:'day_of_week',days:[5,6],label:'Return on a weekend'},{type:'location_visited',locationId:'practiceGarden'}]},lines:[
    {speaker:'Clara',text:'No mysteries. No altered lists. I refuse to investigate anything more complicated than this picnic.',expression:'amused'},
    {speaker:'Lucien',text:'The birds are ignoring my tempo.',expression:'neutral'},
    {speaker:'Sophie',text:'For once, let them.',expression:'warm'},
  ],choices:[
    {id:'garden-practice',label:'Run the difficult section once, then rest',relationshipEffects:[{relationshipId:'r3',points:10},{relationshipId:'r5',points:12}],flags:['garden_balanced'],response:[{speaker:'Sophie',text:'One clean run. I can accept this deeply reasonable tyranny.',expression:'amused'}]},
    {id:'garden-picnic',label:'Put the work away and join the picnic',relationshipEffects:[{relationshipId:'r2',points:18},{relationshipId:'r3',points:8}],flags:['garden_rest'],response:[{speaker:'Clara',text:'Finally, a choice displaying both wisdom and respect for cake.',expression:'warm'}]},
  ],reward:{coins:18,xp:25}},

  {id:'y1-may-final-review',chapter:13,title:'The Final Review',summary:'The year’s records reveal growth that daily effort made difficult to notice.',status:'locked',startsAt:'2027-05-01',locationId:'headmistress',castIds:['r1','r4'],priority:92,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-apr-spring-casting'},{type:'journal_entry_exists',template:'class-reflection',label:'Write a class reflection'}]},lines:[
    {speaker:'Madame Élodie',text:'At the beginning of the year you wanted proof that you belonged. Now you ask better questions.',expression:'warm'},
    {speaker:'Amara',text:'Your strongest improvement is not a position. It is judgment.',expression:'warm'},
    {speaker:'Narrator',text:'The first practice record and the newest one look as though they were written by students who know each other but are no longer the same.'},
  ],choices:[
    {id:'review-thank',label:'Thank them and name what still needs work',relationshipEffects:[{relationshipId:'r1',points:18},{relationshipId:'r4',points:18}],flags:['final_review_honest'],response:[{speaker:'Madame Élodie',text:'Excellent. Pride and accuracy are allowed in the same room.',expression:'warm'}]},
    {id:'review-future',label:'Ask what responsibility comes next year',relationshipEffects:[{relationshipId:'r4',points:22}],flags:['future_mentor'],response:[{speaker:'Amara',text:'You begin noticing who else needs the welcome you received.',expression:'warm'}]},
  ],reward:{coins:50,xp:70}},
  {id:'y1-may-dress',chapter:13,title:'The Dress Rehearsal Fracture',summary:'One last failure forces the company to choose between blame and repair.',status:'locked',startsAt:'2027-05-01',locationId:'theatre',castIds:['r1','r2','r3','r4','r5'],priority:102,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-may-final-review'}]},lines:[
    {speaker:'Narrator',text:'The spacing collapses, the music stops, and an entire year of pressure enters the silence.'},
    {speaker:'Sophie',text:'That entrance was changed without telling us.',expression:'worried'},
    {speaker:'Lucien',text:'The score was marked correctly. The stage call was not.',expression:'stern'},
  ],choices:[
    {id:'dress-repair',label:'Reconstruct the call calmly with everyone',relationshipEffects:[{relationshipId:'r2',points:10},{relationshipId:'r3',points:12},{relationshipId:'r5',points:14}],flags:['dress_repaired'],response:[{speaker:'Madame Élodie',text:'There. A company is visible in the moment after something breaks.',expression:'warm'}]},
    {id:'dress-lead',label:'Take responsibility for resetting the group',relationshipEffects:[{relationshipId:'r1',points:14},{relationshipId:'r4',points:16}],flags:['dress_led'],response:[{speaker:'Amara',text:'Clear, calm, and no unnecessary heroics. Again from the entrance.',expression:'warm'}]},
  ],reward:{coins:55,xp:75}},

  {id:'y1-jun-finale',chapter:14,title:'The Spring Performance',summary:'The year’s final performance belongs to the company you helped build.',status:'locked',startsAt:'2027-06-01',locationId:'theatre',castIds:['r1','r2','r3','r4','r5','r6'],priority:120,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-may-dress'}]},lines:[
    {speaker:'Narrator',text:'The curtain waits. Beyond it are the audience, the academy, and every ordinary day that made this one possible.'},
    {speaker:'Clara',text:'Whatever happens, meet me in the middle at the final bow.',expression:'warm'},
    {speaker:'Sophie',text:'And do not look at me if I cry. I will deny everything.',expression:'amused'},
    {speaker:'Lucien',text:'Listen for the breath before the first note.',expression:'warm'},
    {speaker:'Madame Élodie',text:'Begin.',expression:'neutral'},
  ],choices:[
    {id:'finale-company',label:'Dance for the company beside you',relationshipEffects:[{relationshipId:'r1',points:15},{relationshipId:'r2',points:20},{relationshipId:'r3',points:15},{relationshipId:'r4',points:15},{relationshipId:'r5',points:20}],flags:['year_one_company_finale'],response:[{speaker:'Narrator',text:'The final shape arrives together—not perfect, but alive, deliberate, and entirely yours.'}]},
    {id:'finale-self',label:'Dance as the student you became',relationshipEffects:[{relationshipId:'r1',points:22},{relationshipId:'r4',points:18}],flags:['year_one_personal_finale'],response:[{speaker:'Narrator',text:'You do not dance to prove that you belonged at the beginning. You dance because, somewhere along the way, you began to belong to yourself.'}]},
  ],reward:{coins:150,xp:200}},
  {id:'y1-jun-banquet',chapter:14,title:'The End-of-Year Banquet',summary:'Letters, gifts, and unfinished friendships close the first school year.',status:'locked',startsAt:'2027-06-01',locationId:'diningHall',castIds:['r1','r2','r3','r4','r5','r6'],priority:115,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-jun-finale'}]},lines:[
    {speaker:'Mrs. Finch',text:'Your archive card. One day you may enjoy discovering what I did not write on it.',expression:'amused'},
    {speaker:'Clara',text:'I made you a summer correspondence schedule. It is color-coded and emotionally binding.',expression:'warm'},
    {speaker:'Sophie',text:'Next year, I intend to beat you fairly. You had better continue improving.',expression:'warm'},
    {speaker:'Madame Élodie',text:'The academy will be here when the next year begins. Arrive curious.',expression:'warm'},
  ],choices:[
    {id:'banquet-letter',label:'Write one letter to your future self',relationshipEffects:[{relationshipId:'r6',points:12}],flags:['year_one_complete','future_letter'],response:[{speaker:'Narrator',text:'You seal the letter without promising perfection—only that you will keep returning to the work.'}]},
    {id:'banquet-friends',label:'Spend the final evening with your friends',relationshipEffects:[{relationshipId:'r2',points:20},{relationshipId:'r3',points:15},{relationshipId:'r5',points:20}],flags:['year_one_complete','friends_final_evening'],response:[{speaker:'Narrator',text:'The last evening is not dramatic. That is why you remember it: laughter, ribbon, music through an open door, and nowhere else you need to be.'}]},
  ],reward:{coins:100,xp:150}},
];
