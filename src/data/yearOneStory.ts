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
  {id:'y1-oct-lantern-evening',chapter:6,title:'Lanterns in the Courtyard',summary:'The academy pauses its rivalries for one evening of light, music, and uncertain invitations.',status:'locked',startsAt:'2026-10-20',optional:true,locationId:'mainCourtyard',castIds:['r2','r3','r5'],priority:68,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-sep-first-class'},{type:'location_visited',locationId:'mainCourtyard'}]},lines:[
    {speaker:'Clara',text:'They have hung lanterns from every arch. I was told there would be no formal dancing, which means there will absolutely be formal dancing.',expression:'amused'},
    {speaker:'Lucien',text:'The music is only for the courtyard, not the stage. That makes everyone listen differently.',expression:'warm'},
    {speaker:'Sophie',text:'If anyone asks, I am here for the lighting. The lighting is very good.',expression:'neutral'},
  ],choices:[
    {id:'lantern-company',label:'Invite everyone into one circle',relationshipEffects:[{relationshipId:'r2',points:14},{relationshipId:'r3',points:12},{relationshipId:'r5',points:10}],flags:['lantern_company'],response:[{speaker:'Clara',text:'A social plan with no seating chart. We are growing reckless.',expression:'amused'}]},
    {id:'lantern-listen',label:'Find a quiet edge and listen to the music',relationshipEffects:[{relationshipId:'r3',points:18}],flags:['lantern_listened'],response:[{speaker:'Lucien',text:'You noticed the pause before the melody returned. Most people only notice the lights.',expression:'warm'}]},
  ],reward:{coins:24,xp:32}},
  {id:'y1-dec-holiday-letters',chapter:8,title:'Letters Before the Winter Break',summary:'Before the academy closes, everyone must decide what they are willing to send home.',status:'locked',startsAt:'2026-12-20',optional:true,locationId:'dormCommon',castIds:['r2','r3','r6'],priority:74,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-dec-winter-performance'},{type:'location_visited',locationId:'dormCommon'}]},lines:[
    {speaker:'Clara',text:'I have written four versions of the same holiday letter. In one, I sound mature. In another, I sound like I need rescuing.',expression:'worried'},
    {speaker:'Lucien',text:'You could write the version that is true and let it be less impressive.',expression:'warm'},
    {speaker:'Mrs. Finch',text:'A letter is not improved by pretending the year was simpler than it was.',expression:'stern'},
  ],choices:[
    {id:'holiday-honest',label:'Write an honest letter about the year',relationshipEffects:[{relationshipId:'r2',points:16},{relationshipId:'r6',points:12}],flags:['holiday_honesty'],response:[{speaker:'Mrs. Finch',text:'There. A record of a life, rather than a brochure for one.',expression:'warm'}]},
    {id:'holiday-gift',label:'Make a small gift instead of explaining everything',relationshipEffects:[{relationshipId:'r3',points:12},{relationshipId:'r2',points:12}],flags:['holiday_gift'],response:[{speaker:'Clara',text:'A handmade gift is still communication. Especially if it is not secretly a schedule.',expression:'amused'}]},
  ],reward:{coins:30,xp:40}},
  {id:'y1-apr-garden-festival',chapter:12,title:'The Garden Festival',summary:'The first warm festival of the year asks whether the company can rest together as well as work.',status:'locked',startsAt:'2027-04-15',optional:true,locationId:'formalGardens',castIds:['r2','r3','r4','r5'],priority:70,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-apr-spring-casting'},{type:'location_visited',locationId:'formalGardens'}]},lines:[
    {speaker:'Amara',text:'No corrections today. If you see someone carrying too many chairs, help them without turning it into a lesson.',expression:'warm'},
    {speaker:'Sophie',text:'I was promised a festival. So far I have been assigned a ribbon, two chairs, and Clara’s opinions.',expression:'amused'},
    {speaker:'Clara',text:'The roses are out early. Even they appear to have better timing than we do.',expression:'amused'},
  ],choices:[
    {id:'garden-host',label:'Help host the festival',relationshipEffects:[{relationshipId:'r2',points:14},{relationshipId:'r4',points:14}],flags:['garden_host'],response:[{speaker:'Amara',text:'You made room for other people to enjoy the day. That is a form of leadership.',expression:'warm'}]},
    {id:'garden-wander',label:'Leave the work and wander with friends',relationshipEffects:[{relationshipId:'r3',points:10},{relationshipId:'r5',points:14}],flags:['garden_wandered'],response:[{speaker:'Sophie',text:'Do not repeat this, but I am glad we left the schedule behind for an hour.',expression:'warm'}]},
  ],reward:{coins:26,xp:36}},
  {id:'y1-jun-closing-ceremony',chapter:14,title:'The Closing Ceremony',summary:'The academy gathers one last time before summer turns everyone into a letter, a plan, or a promise.',status:'locked',startsAt:'2027-06-20',locationId:'mainCourtyard',castIds:['r1','r2','r3','r4','r5','r6'],priority:118,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-jun-banquet'},{type:'location_visited',locationId:'mainCourtyard'}]},lines:[
    {speaker:'Madame Élodie',text:'A year is not a verdict. It is a shape you carry into the next room.',expression:'warm'},
    {speaker:'Clara',text:'I have made a summer correspondence schedule. Nobody agreed to it, which is why it is still perfect.',expression:'amused'},
    {speaker:'Mrs. Finch',text:'Leave one thing unfinished on purpose. It gives the future somewhere to begin.',expression:'neutral'},
  ],choices:[
    {id:'closing-return',label:'Promise to return curious',relationshipEffects:[{relationshipId:'r1',points:16},{relationshipId:'r6',points:12}],flags:['closing_curious'],response:[{speaker:'Madame Élodie',text:'Good. Curiosity travels better than certainty.',expression:'warm'}]},
    {id:'closing-letters',label:'Promise to keep writing to the people here',relationshipEffects:[{relationshipId:'r2',points:18},{relationshipId:'r3',points:14},{relationshipId:'r5',points:14}],flags:['closing_letters'],response:[{speaker:'Clara',text:'Excellent. I have stationery, color coding, and absolutely no restraint.',expression:'amused'}]},
  ],reward:{coins:45,xp:65}},
  {id:'y1-interlude-sep-conservatory',chapter:5,title:'The Conservatory Before Breakfast',summary:'A quiet morning gives the academy a different kind of lesson.',status:'locked',startsAt:'2026-09-15',optional:true,locationId:'conservatory',castIds:['r4'],priority:38,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-sep-first-class'},{type:'location_visited',locationId:'conservatory'}]},lines:[
    {speaker:'Amara',text:'You found the conservatory before the day became loud. That is a useful habit, though not one I can assign for credit.',expression:'warm'},
    {speaker:'Narrator',text:'The glass roof holds the first pale light. For once, nobody is asking what you will become by lunchtime.'},
  ],choices:[
    {id:'conservatory-breathe',label:'Stay and let the morning be quiet',relationshipEffects:[{relationshipId:'r4',points:12}],flags:['morning_quiet'],response:[{speaker:'Amara',text:'Rest is not the opposite of discipline. Sometimes it is how discipline survives.',expression:'warm'}]},
    {id:'conservatory-plan',label:'Ask Amara how she plans a difficult day',relationshipEffects:[{relationshipId:'r4',points:14}],flags:['morning_planning'],response:[{speaker:'Amara',text:'Choose one necessary thing, one generous thing, and one thing you will not make worse by rushing.',expression:'warm'}]},
  ],reward:{coins:12,xp:18}},
  {id:'y1-interlude-oct-library',chapter:6,title:'The Borrower Who Returned a Book',summary:'A small library mystery is resolved without anyone needing to be dramatic.',status:'locked',startsAt:'2026-10-12',optional:true,locationId:'library',castIds:['r2','r6'],priority:36,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-oct-archive'},{type:'location_visited',locationId:'library'}]},lines:[
    {speaker:'Clara',text:'Someone returned a book with three pressed leaves inside and no apology for the mud.',expression:'amused'},
    {speaker:'Mrs. Finch',text:'The book was overdue by eleven years. I am choosing to call this a successful return.',expression:'neutral'},
  ],choices:[
    {id:'library-forgive',label:'Help restore the damaged pages',relationshipEffects:[{relationshipId:'r6',points:14}],flags:['library_repair'],response:[{speaker:'Mrs. Finch',text:'Care is often less glamorous than discovery. It is no less important.',expression:'warm'}]},
    {id:'library-question',label:'Ask Clara who could have left the leaves',relationshipEffects:[{relationshipId:'r2',points:14}],flags:['library_curiosity'],response:[{speaker:'Clara',text:'I knew you would ask. Fortunately, I have already made a list and color-coded the suspicious leaves.',expression:'amused'}]},
  ],reward:{coins:14,xp:20}},
  {id:'y1-interlude-nov-tea',chapter:7,title:'Five Minutes of Tea',summary:'The common room offers a brief truce between assessments and rehearsal.',status:'locked',startsAt:'2026-11-15',optional:true,locationId:'dormCommon',castIds:['r2','r5'],priority:35,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-nov-midterm'},{type:'location_visited',locationId:'dormCommon'}]},lines:[
    {speaker:'Clara',text:'I made tea for everyone and only mislabeled one cup. This is a personal best.',expression:'amused'},
    {speaker:'Sophie',text:'If mine is the one labeled “bravery,” I object to the implication.',expression:'stern'},
    {speaker:'Narrator',text:'For five minutes, the room is allowed to be about tea instead of performance.'},
  ],choices:[
    {id:'tea-listen',label:'Let Sophie complain without correcting her',relationshipEffects:[{relationshipId:'r5',points:16}],flags:['tea_listened'],response:[{speaker:'Sophie',text:'You are strangely tolerable when you do not try to solve me.',expression:'warm'}]},
    {id:'tea-laugh',label:'Make Clara laugh hard enough to spill her tea',relationshipEffects:[{relationshipId:'r2',points:16}],flags:['tea_laughed'],response:[{speaker:'Clara',text:'I am choosing to remember the laughter and not the upholstery.',expression:'amused'}]},
  ],reward:{coins:14,xp:20}},
  {id:'y1-interlude-jan-reflection',chapter:9,title:'The Room with No Applause',summary:'A winter afternoon in the Reflection Room makes space for a conversation without a performance.',status:'locked',startsAt:'2027-01-18',optional:true,locationId:'reflection',castIds:['r4'],priority:40,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-jan-return'},{type:'location_visited',locationId:'reflection'}]},lines:[
    {speaker:'Amara',text:'People come here expecting to find a better version of themselves waiting in the chair.',expression:'neutral'},
    {speaker:'Narrator',text:'The room is warm, quiet, and entirely unimpressed by the calendar.'},
  ],choices:[
    {id:'reflection-rest',label:'Admit that you are tired',relationshipEffects:[{relationshipId:'r4',points:16}],flags:['winter_rest'],response:[{speaker:'Amara',text:'Good. Honesty is a better starting point than a heroic schedule.',expression:'warm'}]},
    {id:'reflection-return',label:'Name one thing you still want to try',relationshipEffects:[{relationshipId:'r4',points:14}],flags:['winter_return'],response:[{speaker:'Amara',text:'Then keep it small enough to begin before you feel ready.',expression:'warm'}]},
  ],reward:{coins:12,xp:18}},
  {id:'y1-interlude-feb-theatre',chapter:10,title:'The Empty Seats',summary:'The theatre is empty between rehearsals, which makes it possible to hear what the room remembers.',status:'locked',startsAt:'2027-02-20',optional:true,locationId:'theatreSeats',castIds:['r3','r5'],priority:37,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-feb-duet'},{type:'location_visited',locationId:'theatreSeats'}]},lines:[
    {speaker:'Lucien',text:'An empty theatre is not silent. It keeps the shape of every note people thought nobody heard.',expression:'warm'},
    {speaker:'Sophie',text:'That sounds poetic. I dislike that I understand what you mean.',expression:'amused'},
  ],choices:[
    {id:'theatre-listen',label:'Ask Lucien to play one unfinished phrase',relationshipEffects:[{relationshipId:'r3',points:16}],flags:['theatre_phrase'],response:[{speaker:'Lucien',text:'Unfinished is not the same as failed. I am trying to remember that.',expression:'warm'}]},
    {id:'theatre-imagine',label:'Imagine what the seats will see next',relationshipEffects:[{relationshipId:'r5',points:14}],flags:['theatre_imagined'],response:[{speaker:'Sophie',text:'Fine. For one minute, we can imagine the audience is kind and the floor is forgiving.',expression:'warm'}]},
  ],reward:{coins:15,xp:22}},
  {id:'y1-interlude-mar-lakeside',chapter:11,title:'The Long Way Around the Lake',summary:'After assessment week, the longer path home becomes its own small decision.',status:'locked',startsAt:'2027-03-20',optional:true,locationId:'lakeside',castIds:['r1','r6'],priority:34,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-mar-exams'},{type:'location_visited',locationId:'lakeside'}]},lines:[
    {speaker:'Mrs. Finch',text:'The shortest route is not always the route that returns you to yourself.',expression:'warm'},
    {speaker:'Madame Élodie',text:'Assessment week is finished. You may stop measuring every breath now.',expression:'amused'},
  ],choices:[
    {id:'lake-release',label:'Leave the week behind for one evening',relationshipEffects:[{relationshipId:'r1',points:12},{relationshipId:'r6',points:10}],flags:['lake_released'],response:[{speaker:'Madame Élodie',text:'There is the difference between reflection and rehearsal. One of them eventually ends.',expression:'warm'}]},
    {id:'lake-record',label:'Write down what the week taught you',relationshipEffects:[{relationshipId:'r6',points:14}],flags:['lake_recorded'],response:[{speaker:'Mrs. Finch',text:'Keep the record, but do not let it become a cage made of accurate sentences.',expression:'warm'}]},
  ],reward:{coins:13,xp:20}},
  {id:'y1-interlude-apr-atelier',chapter:12,title:'A Loose Thread in the Atelier',summary:'A costume fitting turns into a lesson about repair, patience, and who gets noticed.',status:'locked',startsAt:'2027-04-20',optional:true,locationId:'atelier',castIds:['r4','r5'],priority:39,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-apr-spring-casting'},{type:'location_visited',locationId:'atelier'}]},lines:[
    {speaker:'Amara',text:'A costume does not have to be perfect to be worth repairing.',expression:'warm'},
    {speaker:'Sophie',text:'Everyone notices a loose thread once it is onstage. Nobody notices the hour someone spent fixing it.',expression:'worried'},
  ],choices:[
    {id:'atelier-repair',label:'Stay and help with the repair',relationshipEffects:[{relationshipId:'r4',points:14}],flags:['atelier_repaired'],response:[{speaker:'Amara',text:'Useful work is still useful when it never becomes a story anyone tells about you.',expression:'warm'}]},
    {id:'atelier-sophie',label:'Ask Sophie what she wants people to notice',relationshipEffects:[{relationshipId:'r5',points:18}],flags:['atelier_seen'],response:[{speaker:'Sophie',text:'That is an unfairly good question. I was prepared for thread, not honesty.',expression:'warm'}]},
  ],reward:{coins:16,xp:23}},
  {id:'y1-interlude-may-garden',chapter:13,title:'The Last Ordinary Tuesday',summary:'Before the final rehearsals take over everything, the garden offers one ordinary afternoon.',status:'locked',startsAt:'2027-05-20',optional:true,locationId:'practiceGarden',castIds:['r2','r3'],priority:33,triggers:{mode:'ALL',conditions:[{type:'scene_complete',sceneId:'y1-may-final-review'},{type:'location_visited',locationId:'practiceGarden'}]},lines:[
    {speaker:'Clara',text:'I have decided this is not a rehearsal. If anyone begins counting, I am leaving.',expression:'amused'},
    {speaker:'Lucien',text:'The garden does not care whether the ending is clean. That may be why it is so restful.',expression:'warm'},
  ],choices:[
    {id:'garden-ordinary',label:'Let the afternoon stay ordinary',relationshipEffects:[{relationshipId:'r2',points:16}],flags:['ordinary_afternoon'],response:[{speaker:'Clara',text:'Good. We should remember that not every beautiful thing needs a climax.',expression:'warm'}]},
    {id:'garden-music',label:'Ask Lucien for one last piece of music',relationshipEffects:[{relationshipId:'r3',points:16}],flags:['ordinary_music'],response:[{speaker:'Lucien',text:'One piece, then. No encore. We should leave something for the future.',expression:'warm'}]},
  ],reward:{coins:12,xp:19}},
  {id:'y1-quest-pointe-shoes',chapter:5,title:'The Shoes with the Worn Ribbons',summary:'Madame Élodie gives you something that carries more history than polish.',status:'locked',startsAt:'2026-09-15',optional:true,locationId:'primaryStudio',castIds:['r1'],priority:82,triggers:{mode:'ALL',conditions:[{type:'story_flag',flag:'quest_q-releve-foundations_complete',label:'Complete Relevé Foundations'}]},lines:[
    {speaker:'Madame Élodie',text:'These are not beautiful anymore. That is not the same as saying they are finished.',expression:'warm'},
    {speaker:'Narrator',text:'The ribbons are softened by years of hands and rosin. The shoes look less like a prize than an argument for continuing.'},
    {speaker:'Madame Élodie',text:'Wear them when you need to remember that a dancer is made by returning to the work, not by looking untouched.'},
  ],choices:[
    {id:'pointe-accept',label:'Accept the shoes and promise to use them carefully',relationshipEffects:[{relationshipId:'r1',points:20}],flags:['pointe_shoes_received'],response:[{speaker:'Madame Élodie',text:'Good. Sentiment is allowed. Care is required.',expression:'warm'}]},
    {id:'pointe-question',label:'Ask what she remembers about wearing them',relationshipEffects:[{relationshipId:'r1',points:24}],flags:['pointe_history_asked'],response:[{speaker:'Madame Élodie',text:'I remember that the first useful lesson was learning when not to force the next step.',expression:'warm'}]},
  ],reward:{coins:18,xp:30}},
  {id:'y1-quest-library-card',chapter:7,title:'The Card Behind the Desk',summary:'Mrs. Finch decides that repeated visits deserve a name and a small privilege.',status:'locked',startsAt:'2026-11-01',optional:true,locationId:'library',castIds:['r6'],priority:78,triggers:{mode:'ALL',conditions:[{type:'story_flag',flag:'quest_q-library-regular_complete',label:'Become a familiar face in the library'}]},lines:[
    {speaker:'Mrs. Finch',text:'Three visits is not a record. It is a pattern.',expression:'amused'},
    {speaker:'Narrator',text:'She slides a card across the desk. Your name is written in the careful handwriting used for books that matter.'},
    {speaker:'Mrs. Finch',text:'Now you may ask me where the academy keeps the books it is not ready to admit it owns.'},
  ],choices:[
    {id:'library-card-accept',label:'Accept the card and ask about the hidden shelf',relationshipEffects:[{relationshipId:'r6',points:22}],flags:['library_card_received'],response:[{speaker:'Mrs. Finch',text:'Curiosity with a card is much easier to supervise.',expression:'amused'}]},
    {id:'library-card-thanks',label:'Thank her and offer to repair a damaged book',relationshipEffects:[{relationshipId:'r6',points:26}],flags:['library_card_care'],response:[{speaker:'Mrs. Finch',text:'Excellent. Belonging is often proved by what you are willing to care for.',expression:'warm'}]},
  ],reward:{coins:22,xp:34}},
];
