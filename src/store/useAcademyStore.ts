import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { seedMentorQuests, seedRelationships, seedScenes, seedSchedule, seedTasks, seedWardrobe, seedWardrobeSlots } from '../data/seed';
import { buildStoryQueue, StoryTriggerContext } from '../story/triggerEngine';
import { AcademyBook, AvatarPoseId, ClothingFit, CustomArtAsset, DailyGift, DailyPreferences, FocusSession, JournalEntry, MentorQuest, Notebook, Relationship, SavedLook, ScheduleBlock, StatKey, StoryScene, StorySceneProgress, StudyNote, Task, WardrobeItem, WardrobeSlot } from '../types';

interface AcademyState {
  hasCompletedOnboarding: boolean;
  student: { name: string; level: number; xp: number; coins: number; streak: number };
  stats: Record<StatKey, number>;
  tasks: Task[];
  schedule: ScheduleBlock[];
  relationships: Relationship[];
  wardrobe: WardrobeItem[];
  wardrobeSlots: WardrobeSlot[];
  quests: MentorQuest[];
  story: StoryScene[];
  sessions: FocusSession[];
  books: AcademyBook[];
  selectedPose: AvatarPoseId;
  savedLooks: SavedLook[];
  storyProgress: StorySceneProgress[];
  storyEventQueue: string[];
  dismissedStoryEvents: string[];
  dismissedStoryEventDate: string;
  dailyNpcSceneHistory: Record<string,{date:string;sceneId:string;choiceLabel?:string}[]>;
  npcKnowledge: Record<string,string[]>;
  visitedLocations: string[];
  locationVisitCounts: Record<string,number>;
  journalEntries: JournalEntry[];
  notebooks: Notebook[];
  studyNotes: StudyNote[];
  avatarDesignNotes: Record<string,string>;
  selectedAvatarBust: 'romantic'|'classic'|'dreamy'|'bold';
  clothingFits:Record<string,ClothingFit>;
  storyFlags:string[];
  customArt:CustomArtAsset[];
  dailyGiftClaims:string[];
  dailyBlockCompletions:Record<string,string[]>;
  lastActiveDate:string;
  dailyPreferences:DailyPreferences;
  completeTask: (id: string) => void;
  addTask: (task: Task) => void;
  addWardrobeSlot: (slot:WardrobeSlot) => void;
  addScheduleBlock: (block:ScheduleBlock) => void;
  addScheduleBlocks: (blocks:ScheduleBlock[]) => void;
  updateScheduleBlock: (id:string, updates:Partial<ScheduleBlock>) => void;
  deleteScheduleBlock: (id:string) => void;
  duplicateScheduleBlock: (id:string) => void;
  completeScene: (id:string, choiceId?:string) => void;
  buyItem: (id: string) => void;
  equipItem: (id: string) => void;
  finishSession: (session: FocusSession, stat: StatKey) => void;
  addRelationshipPoints: (id: string, points: number) => void;
  addBook: (book: AcademyBook) => void;
  removeBook: (id: string) => void;
  updateBookPosition: (id:string, position:number) => void;
  setSelectedPose: (poseId:AvatarPoseId) => void;
  saveCurrentLook: () => void;
  wearSavedLook: (id:string) => void;
  removeSavedLook: (id:string) => void;
  refreshStoryEvents: (nowIso?:string) => void;
  recordLocationVisit: (locationId:string) => void;
  dismissStoryEvent: (sceneId:string) => void;
  restoreDismissedStoryEvents: () => void;
  recordDailyNpcScene: (npcId:string,date:string,sceneId:string) => void;
  recordDailyNpcChoice: (npcId:string,date:string,sceneId:string,choiceLabel:string,relationshipPoints:number) => void;
  unlockNpcKnowledge: (npcId:string,knowledgeKey:string) => void;
  addJournalEntry: (entry:JournalEntry) => void;
  updateJournalEntry: (id:string, updates:Partial<JournalEntry>) => void;
  deleteJournalEntry: (id:string) => void;
  addNotebook: (notebook:Notebook) => void;
  updateNotebook: (id:string, updates:Partial<Notebook>) => void;
  deleteNotebook: (id:string) => void;
  addStudyNote: (note:StudyNote) => void;
  updateStudyNote: (id:string, updates:Partial<StudyNote>) => void;
  deleteStudyNote: (id:string) => void;
  updateAvatarDesignNote: (catalogId:string, note:string) => void;
  setSelectedAvatarBust: (bustId:'romantic'|'classic'|'dreamy'|'bold') => void;
  updateClothingFit:(itemId:string,updates:Partial<ClothingFit>)=>void;
  addCustomArt:(asset:CustomArtAsset)=>void;
  updateCustomArt:(id:string,updates:Partial<CustomArtAsset>)=>void;
  deleteCustomArt:(id:string)=>void;
  claimDailyGift:(dateKey:string,gift:DailyGift)=>void;
  completeDailyBlock:(dateKey:string,blockId:string,kind:Task['kind'])=>void;
  setDailyPreferences:(updates:Partial<DailyPreferences>)=>void;
  completeOnboarding:(name:string,remindersEnabled:boolean)=>void;
  restoreBackup:(data:any)=>void;
  resetDemo: () => void;
}

const initial = {
  hasCompletedOnboarding: false,
  student: { name:'Grace', level:1, xp:65, coins:175, streak:4 },
  stats: { ballet:42, strength:28, flexibility:31, academics:38, french:35, wellbeing:22 },
  tasks: seedTasks,
  schedule: seedSchedule,
  relationships: seedRelationships,
  wardrobe: seedWardrobe,
  wardrobeSlots: seedWardrobeSlots,
  quests: seedMentorQuests,
  story: seedScenes,
  sessions: [] as FocusSession[],
  books: [] as AcademyBook[],
  selectedPose: 'first' as AvatarPoseId,
  savedLooks: [] as SavedLook[],
  storyProgress: [] as StorySceneProgress[],
  storyEventQueue: [] as string[],
  dismissedStoryEvents: [] as string[],
  dismissedStoryEventDate: '',
  dailyNpcSceneHistory: {} as Record<string,{date:string;sceneId:string;choiceLabel?:string}[]>,
  npcKnowledge: {} as Record<string,string[]>,
  visitedLocations: [] as string[],
  locationVisitCounts: {} as Record<string,number>,
  journalEntries: [] as JournalEntry[],
  notebooks: [
    {id:'notebook-academics',name:'Academics',color:'#8B789A',createdAt:new Date().toISOString()},
    {id:'notebook-french',name:'French',color:'#80917F',createdAt:new Date().toISOString()},
    {id:'notebook-ballet',name:'Ballet',color:'#B97B89',createdAt:new Date().toISOString()},
  ] as Notebook[],
  studyNotes: [] as StudyNote[],
  avatarDesignNotes: {} as Record<string,string>,
  selectedAvatarBust: 'romantic' as const,
  storyFlags: [] as string[],
  customArt: [] as CustomArtAsset[],
  dailyGiftClaims: [] as string[],
  dailyBlockCompletions: {} as Record<string,string[]>,
  lastActiveDate: '',
  dailyPreferences:{remindersEnabled:false,reminderHour:16,reminderMinute:0} as DailyPreferences,
};
const mergeSeedCollection=(seedItems:any[],savedItems:any[])=>[...seedItems.map(seed=>({...seed,...savedItems.find(saved=>saved.id===seed.id)})),...savedItems.filter(saved=>!seedItems.some(seed=>seed.id===saved.id))];

const levelFromXp = (xp: number) => Math.floor(xp / 150) + 1;
const localDateKey=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const dateDistance=(from:string,to:string)=>Math.round((new Date(`${to}T12:00:00`).getTime()-new Date(`${from}T12:00:00`).getTime())/86_400_000);
const streakAfterActivity=(student:AcademyState['student'],lastActiveDate:string,dateKey:string)=>!lastActiveDate?1:lastActiveDate===dateKey?student.streak:dateDistance(lastActiveDate,dateKey)===1?student.streak+1:1;

function storyRefresh(state:AcademyState,patch:Partial<AcademyState>={},nowIso?:string):Partial<AcademyState> {
  const merged={...state,...patch};
  const context:StoryTriggerContext={
    now:nowIso?new Date(nowIso):new Date(), level:merged.student.level, tasks:merged.tasks,
    schedule:merged.schedule, relationships:merged.relationships, wardrobe:merged.wardrobe,
    sessions:merged.sessions, visitedLocations:merged.visitedLocations, progress:merged.storyProgress,
    journalEntries:merged.journalEntries, studyNotes:merged.studyNotes,
    storyFlags:merged.storyFlags,
  };
  const storyEventQueue=buildStoryQueue(merged.story,context,merged.dismissedStoryEvents);
  const story=merged.story.map(scene=>{
    const completions=merged.storyProgress.find(progress=>progress.sceneId===scene.id)?.completions ?? 0;
    if(completions>0&&(scene.repeat?.mode??'once')==='once') return {...scene,status:'complete' as const};
    return {...scene,status:storyEventQueue.includes(scene.id)?'available' as const:'locked' as const};
  });
  return {...patch,storyEventQueue,story};
}
function advanceQuests(state:AcademyState,matches:(quest:MentorQuest)=>boolean):Partial<AcademyState> {
  const quests=state.quests.map(quest=>matches(quest)&&!quest.completed?{...quest,progress:Math.min(quest.goal,quest.progress+1),completed:quest.progress+1>=quest.goal}:quest);
  const completedIds=quests.filter(quest=>quest.completed&&!state.quests.find(old=>old.id===quest.id)?.completed).map(quest=>quest.id);
  const rewardIds=quests.filter(quest=>completedIds.includes(quest.id)).map(quest=>quest.rewardItemId);
  return {quests,wardrobe:rewardIds.length?state.wardrobe.map(item=>rewardIds.includes(item.id)?{...item,owned:true,unlock:undefined}:item):state.wardrobe,storyFlags:completedIds.length?Array.from(new Set([...state.storyFlags,...completedIds.map(id=>`quest_${id}_complete`)])):state.storyFlags};
}

export const useAcademyStore = create<AcademyState>()(persist((set) => ({
  ...initial,
  completeTask: (id) => set((state) => {
    const task = state.tasks.find((item) => item.id === id);
    if (!task || task.completed) return state;
    const xp = state.student.xp + task.xp;
    return storyRefresh(state,{
      tasks: state.tasks.map((item) => item.id === id ? { ...item, completed:true } : item),
      student: { ...state.student, xp, coins:state.student.coins + task.coins, level:levelFromXp(xp) },
      stats: { ...state.stats, [task.kind === 'school' ? 'academics' : task.kind]: (state.stats[task.kind === 'school' ? 'academics' : task.kind as StatKey] ?? 0) + task.xp },
    }) as AcademyState;
  }),
  addTask: (task) => set((state) => ({ tasks:[...state.tasks, task] })),
  addWardrobeSlot: (slot) => set((state)=>({wardrobeSlots:[...state.wardrobeSlots,slot]})),
  addScheduleBlock: (block) => set((state)=>storyRefresh(state,{schedule:[...state.schedule,block]}) as AcademyState),
  addScheduleBlocks: (blocks) => set((state)=>storyRefresh(state,{schedule:[...state.schedule,...blocks]}) as AcademyState),
   clothingFits: {},
  updateScheduleBlock: (id, updates) => set((state)=>storyRefresh(state,{schedule:state.schedule.map(block=>block.id===id?{...block,...updates,id}:block)}) as AcademyState),
  deleteScheduleBlock: (id) => set((state)=>storyRefresh(state,{schedule:state.schedule.filter(block=>block.id!==id)}) as AcademyState),
  duplicateScheduleBlock: (id) => set((state)=>{
    const source=state.schedule.find(block=>block.id===id);
    if(!source) return state;
    const copy:ScheduleBlock={...source,id:`schedule-${Date.now()}`,title:`${source.title} Copy`,createdAt:new Date().toISOString()};
    return storyRefresh(state,{schedule:[...state.schedule,copy]}) as AcademyState;
  }),
  completeScene: (id, choiceId) => set((state) => {
    const scene = state.story.find(item=>item.id===id);
    if (!scene || scene.status !== 'available') return state;
    const existing=state.storyProgress.find(progress=>progress.sceneId===id);
    if((scene.repeat?.mode??'once')==='once'&&(existing?.completions??0)>0) return state;
    const choice=scene.choices?.find(option=>option.id===choiceId);
    if(scene.choices?.length&&!choice) return state;
    const xp = state.student.xp + (scene.reward?.xp ?? 0) + (choice?.xp ?? 0);
    const storyProgress:StorySceneProgress[]=existing
      ? state.storyProgress.map(progress=>progress.sceneId===id?{...progress,completions:progress.completions+1,lastCompletedAt:new Date().toISOString(),choiceId:choice?.id}:progress)
      : [...state.storyProgress,{sceneId:id,completions:1,lastCompletedAt:new Date().toISOString(),choiceId:choice?.id}];
    const relationships=state.relationships.map(relationship=>{
      const points=(choice?.relationshipEffects ?? []).filter(effect=>effect.relationshipId===relationship.id).reduce((sum,effect)=>sum+effect.points,0);
      return points?{...relationship,points:relationship.points+points,level:Math.floor((relationship.points+points)/100)+1}:relationship;
    });
    return storyRefresh(state,{
      storyProgress,
      dismissedStoryEvents:state.dismissedStoryEvents.filter(sceneId=>sceneId!==id),
      relationships,
      storyFlags:Array.from(new Set([...state.storyFlags,...(choice?.flags ?? [])])),
      student: { ...state.student, xp, coins:state.student.coins + (scene.reward?.coins ?? 0) + (choice?.coins ?? 0), level:levelFromXp(xp) },
    }) as AcademyState;
  }),
  buyItem: (id) => set((state) => {
    const item = state.wardrobe.find((entry) => entry.id === id);
    if (!item || item.owned || item.unlock || state.student.coins < item.price) return state;
    const questPatch=advanceQuests(state,quest=>quest.kind==='item_owned'&&quest.target===id);
    return storyRefresh(state,{...questPatch,wardrobe:state.wardrobe.map((entry) => entry.id === id ? { ...entry, owned:true } : entry), student:{ ...state.student, coins:state.student.coins - item.price } }) as AcademyState;
  }),
  equipItem: (id) => set((state) => {
    const item = state.wardrobe.find((entry) => entry.id === id);
    if (!item?.owned) return state;
    return storyRefresh(state,{ wardrobe:state.wardrobe.map((entry) => entry.slot === item.slot ? { ...entry, equipped:entry.id === id } : entry) }) as AcademyState;
  }),
  finishSession: (session, stat) => set((state) => {
    const xp = state.student.xp + session.xp;
    const isReleveSession=session.title.toLowerCase().includes('relev');
    const questPatch=advanceQuests(state,quest=>quest.kind==='session_kind'&&(quest.target==='releve'?isReleveSession:quest.target===session.kind));
    return storyRefresh(state,{...questPatch,sessions:[session, ...state.sessions], stats:{ ...state.stats, [stat]:state.stats[stat] + session.xp }, student:{ ...state.student, xp, coins:state.student.coins + Math.ceil(session.minutes / 2), level:levelFromXp(xp) } }) as AcademyState;
  }),
  addRelationshipPoints: (id, points) => set((state) => storyRefresh(state,{ relationships:state.relationships.map((r) => r.id === id ? { ...r, points:r.points + points, level:Math.floor((r.points + points) / 100) + 1 } : r) }) as AcademyState),
  addBook: (book) => set((state) => ({ books:[book,...state.books] })),
  removeBook: (id) => set((state) => ({ books:state.books.filter((book)=>book.id!==id) })),
  updateBookPosition: (id, position) => set((state) => ({ books:state.books.map((book)=>book.id===id?{...book,lastPosition:position}:book) })),
  setSelectedPose: (poseId) => set({ selectedPose:poseId }),
  saveCurrentLook: () => set((state) => {
    const nextNumber=state.savedLooks.length + 1;
    const look:SavedLook={id:`look-${Date.now()}`,name:`Academy Look ${nextNumber}`,poseId:state.selectedPose,equippedItemIds:state.wardrobe.filter(item=>item.equipped).map(item=>item.id),createdAt:new Date().toISOString()};
    return { savedLooks:[look,...state.savedLooks].slice(0,12) };
  }),
  wearSavedLook: (id) => set((state) => {
    const look=state.savedLooks.find(entry=>entry.id===id);
    if(!look) return state;
    return storyRefresh(state,{ selectedPose:look.poseId, wardrobe:state.wardrobe.map(item=>({...item,equipped:look.equippedItemIds.includes(item.id)})) }) as AcademyState;
  }),
  removeSavedLook: (id) => set((state) => ({ savedLooks:state.savedLooks.filter(look=>look.id!==id) })),
  refreshStoryEvents: (nowIso) => set((state)=>{
    const today=localDateKey(nowIso?new Date(nowIso):new Date());
    const dismissedStoryEvents=state.dismissedStoryEventDate&&state.dismissedStoryEventDate!==today?[]:state.dismissedStoryEvents;
    return storyRefresh(state,{dismissedStoryEvents,dismissedStoryEventDate:today},nowIso) as AcademyState;
  }),
  recordLocationVisit: (locationId) => set((state)=>{
    const visitedLocations=state.visitedLocations.includes(locationId)?state.visitedLocations:[...state.visitedLocations,locationId];
    const locationVisitCounts={...state.locationVisitCounts,[locationId]:(state.locationVisitCounts[locationId]??0)+1};
    const questPatch=advanceQuests(state,quest=>quest.kind==='location_visit'&&quest.target===locationId);
    return storyRefresh(state,{...questPatch,visitedLocations,locationVisitCounts}) as AcademyState;
  }),
  dismissStoryEvent: (sceneId) => set((state)=>storyRefresh(state,{dismissedStoryEvents:Array.from(new Set([...state.dismissedStoryEvents,sceneId])),dismissedStoryEventDate:localDateKey()}) as AcademyState),
  restoreDismissedStoryEvents: () => set((state)=>storyRefresh(state,{dismissedStoryEvents:[],dismissedStoryEventDate:''}) as AcademyState),
  recordDailyNpcScene: (npcId,date,sceneId) => set((state)=>{
    const history=state.dailyNpcSceneHistory[npcId]??[];
    if(history.some(entry=>entry.date===date&&entry.sceneId===sceneId))return state;
    return {dailyNpcSceneHistory:{...state.dailyNpcSceneHistory,[npcId]:[...history,{date,sceneId}].slice(-12)}};
  }),
  recordDailyNpcChoice: (npcId,date,sceneId,choiceLabel,relationshipPoints) => set((state)=>{
    const history=state.dailyNpcSceneHistory[npcId]??[];
    const existing=history.find(entry=>entry.date===date&&entry.sceneId===sceneId);
    if(existing?.choiceLabel)return state;
    const nextHistory=existing
      ? history.map(entry=>entry===existing?{...entry,choiceLabel}:entry)
      : [...history,{date,sceneId,choiceLabel}].slice(-12);
    const relationships=relationshipPoints?state.relationships.map(relationship=>relationship.id===npcId?{...relationship,points:relationship.points+relationshipPoints,level:Math.floor((relationship.points+relationshipPoints)/100)+1}:relationship):state.relationships;
    return {dailyNpcSceneHistory:{...state.dailyNpcSceneHistory,[npcId]:nextHistory},relationships};
  }),
  unlockNpcKnowledge: (npcId,knowledgeKey) => set((state)=>({npcKnowledge:{...state.npcKnowledge,[npcId]:Array.from(new Set([...(state.npcKnowledge[npcId]??[]),knowledgeKey]))}})),
  addJournalEntry: (entry) => set((state)=>storyRefresh(state,{...advanceQuests(state,quest=>quest.kind==='journal_template'&&quest.target===entry.template),journalEntries:[entry,...state.journalEntries]}) as AcademyState),
  updateJournalEntry: (id, updates) => set((state)=>storyRefresh(state,{journalEntries:state.journalEntries.map(entry=>entry.id===id?{...entry,...updates,id,updatedAt:new Date().toISOString()}:entry)}) as AcademyState),
  deleteJournalEntry: (id) => set((state)=>storyRefresh(state,{journalEntries:state.journalEntries.filter(entry=>entry.id!==id)}) as AcademyState),
  addNotebook: (notebook) => set((state)=>({notebooks:[...state.notebooks,notebook]})),
  updateNotebook: (id, updates) => set((state)=>({notebooks:state.notebooks.map(notebook=>notebook.id===id?{...notebook,...updates,id}:notebook)})),
  deleteNotebook: (id) => set((state)=>storyRefresh(state,{notebooks:state.notebooks.filter(notebook=>notebook.id!==id),studyNotes:state.studyNotes.filter(note=>note.notebookId!==id)}) as AcademyState),
  addStudyNote: (note) => set((state)=>storyRefresh(state,{studyNotes:[note,...state.studyNotes]}) as AcademyState),
  updateStudyNote: (id, updates) => set((state)=>storyRefresh(state,{studyNotes:state.studyNotes.map(note=>note.id===id?{...note,...updates,id,updatedAt:new Date().toISOString()}:note)}) as AcademyState),
  deleteStudyNote: (id) => set((state)=>storyRefresh(state,{studyNotes:state.studyNotes.filter(note=>note.id!==id)}) as AcademyState),
  updateAvatarDesignNote: (catalogId, note) => set((state)=>({avatarDesignNotes:{...state.avatarDesignNotes,[catalogId]:note}})),
  setSelectedAvatarBust: (bustId) => set({selectedAvatarBust:bustId}),
updateClothingFit:(itemId,updates)=>set((state)=>({
  clothingFits:{
    ...state.clothingFits,
    [itemId]:{
      ...state.clothingFits[itemId],
      ...updates,
      x: updates.x ?? state.clothingFits[itemId]?.x ?? 0,
      y: updates.y ?? state.clothingFits[itemId]?.y ?? 0,
      scale: updates.scale ?? state.clothingFits[itemId]?.scale ?? 1,
    }
  }
})),
  addCustomArt:(asset)=>set(state=>({customArt:[asset,...state.customArt]})),
  updateCustomArt:(id,updates)=>set(state=>({customArt:state.customArt.map(asset=>asset.id===id?{...asset,...updates,id}:asset)})),
  deleteCustomArt:(id)=>set(state=>({customArt:state.customArt.filter(asset=>asset.id!==id)})),
  claimDailyGift:(dateKey,gift)=>set(state=>{
    if(state.dailyGiftClaims.includes(dateKey))return state;
    const xp=state.student.xp+gift.xp;
    const relationships=gift.relationshipId?state.relationships.map(relationship=>relationship.id===gift.relationshipId?{...relationship,points:relationship.points+(gift.relationshipPoints??0),level:Math.floor((relationship.points+(gift.relationshipPoints??0))/100)+1}:relationship):state.relationships;
    return storyRefresh(state,{dailyGiftClaims:[dateKey,...state.dailyGiftClaims].slice(0,400),lastActiveDate:dateKey,relationships,student:{...state.student,xp,coins:state.student.coins+gift.coins,level:levelFromXp(xp),streak:streakAfterActivity(state.student,state.lastActiveDate,dateKey)}}) as AcademyState;
  }),
  completeDailyBlock:(dateKey,blockId,kind)=>set(state=>{
    const completed=state.dailyBlockCompletions[dateKey]??[];
    if(completed.includes(blockId))return state;
    const xp=state.student.xp+12;
    const stat:StatKey=kind==='school'?'academics':kind==='personal'?'wellbeing':kind;
    return storyRefresh(state,{dailyBlockCompletions:{...state.dailyBlockCompletions,[dateKey]:[...completed,blockId]},lastActiveDate:dateKey,student:{...state.student,xp,coins:state.student.coins+8,level:levelFromXp(xp),streak:streakAfterActivity(state.student,state.lastActiveDate,dateKey)},stats:{...state.stats,[stat]:(state.stats[stat]??0)+6}}) as AcademyState;
  }),
  setDailyPreferences:(updates)=>set(state=>({dailyPreferences:{...state.dailyPreferences,...updates}})),
  completeOnboarding:(name,remindersEnabled)=>set(state=>({hasCompletedOnboarding:true,student:{...state.student,name},dailyPreferences:{...state.dailyPreferences,remindersEnabled}})),
  restoreBackup:(data)=>set(state=>storyRefresh(state,{
    student:data.student??state.student,stats:data.stats??state.stats,tasks:Array.isArray(data.tasks)?data.tasks:state.tasks,
    schedule:Array.isArray(data.schedule)?data.schedule:state.schedule,relationships:Array.isArray(data.relationships)?data.relationships:state.relationships,
    wardrobe:Array.isArray(data.wardrobe)?data.wardrobe:state.wardrobe,wardrobeSlots:Array.isArray(data.wardrobeSlots)?data.wardrobeSlots:state.wardrobeSlots,quests:Array.isArray(data.quests)?data.quests:state.quests,sessions:Array.isArray(data.sessions)?data.sessions:state.sessions,
    books:Array.isArray(data.books)?data.books:state.books,selectedPose:data.selectedPose??state.selectedPose,savedLooks:Array.isArray(data.savedLooks)?data.savedLooks:state.savedLooks,
    storyProgress:Array.isArray(data.storyProgress)?data.storyProgress:state.storyProgress,dismissedStoryEvents:Array.isArray(data.dismissedStoryEvents)?data.dismissedStoryEvents:state.dismissedStoryEvents,dismissedStoryEventDate:data.dismissedStoryEventDate??state.dismissedStoryEventDate,dailyNpcSceneHistory:data.dailyNpcSceneHistory??state.dailyNpcSceneHistory,npcKnowledge:data.npcKnowledge??state.npcKnowledge,
    visitedLocations:Array.isArray(data.visitedLocations)?data.visitedLocations:state.visitedLocations,locationVisitCounts:data.locationVisitCounts??state.locationVisitCounts,journalEntries:Array.isArray(data.journalEntries)?data.journalEntries:state.journalEntries,
    notebooks:Array.isArray(data.notebooks)?data.notebooks:state.notebooks,studyNotes:Array.isArray(data.studyNotes)?data.studyNotes:state.studyNotes,
    avatarDesignNotes:data.avatarDesignNotes??state.avatarDesignNotes,selectedAvatarBust:data.selectedAvatarBust??state.selectedAvatarBust,
    storyFlags:Array.isArray(data.storyFlags)?data.storyFlags:state.storyFlags,customArt:Array.isArray(data.customArt)?data.customArt:state.customArt,
    dailyGiftClaims:Array.isArray(data.dailyGiftClaims)?data.dailyGiftClaims:state.dailyGiftClaims,dailyBlockCompletions:data.dailyBlockCompletions??state.dailyBlockCompletions,
    lastActiveDate:data.lastActiveDate??state.lastActiveDate,dailyPreferences:data.dailyPreferences??state.dailyPreferences,
  }) as AcademyState),
  resetDemo: () => set(initial),
}), { name:'rba-academy-state-v1', version:19, storage:createJSONStorage(() => AsyncStorage), migrate:(persisted:any)=>({ ...initial, ...persisted, hasCompletedOnboarding:persisted?.hasCompletedOnboarding??!!persisted?.student, story:seedScenes, relationships:seedRelationships.map(seed=>({...seed,...(persisted?.relationships ?? []).find((old:Relationship)=>old.id===seed.id),name:seed.name,role:seed.role,note:seed.note,personality:seed.personality,likes:seed.likes,dislikes:seed.dislikes,homeLocation:seed.homeLocation,scheduleHint:seed.scheduleHint,initials:seed.initials})), schedule:(persisted?.schedule ?? initial.schedule).filter((block:ScheduleBlock)=>!(block.id==='s3'&&block.title==='French Practice')).map((block:ScheduleBlock)=>({...block,days:block.days?.length?block.days:[block.day],recurrence:block.recurrence??'weekly',affectsStory:block.affectsStory??true})), storyProgress:persisted?.storyProgress ?? (persisted?.story ?? []).filter((scene:StoryScene)=>scene.status==='complete').map((scene:StoryScene)=>({sceneId:scene.id,completions:1})), storyEventQueue:persisted?.storyEventQueue ?? [], dismissedStoryEvents:persisted?.dismissedStoryEvents ?? [], dismissedStoryEventDate:persisted?.dismissedStoryEventDate??'', dailyNpcSceneHistory:persisted?.dailyNpcSceneHistory??{}, npcKnowledge:persisted?.npcKnowledge??{}, visitedLocations:persisted?.visitedLocations ?? [], locationVisitCounts:persisted?.locationVisitCounts??{}, journalEntries:persisted?.journalEntries ?? [], notebooks:persisted?.notebooks?.length?persisted.notebooks:initial.notebooks, studyNotes:persisted?.studyNotes ?? [], quests:Array.isArray(persisted?.quests)?persisted.quests:initial.quests, wardrobe:mergeSeedCollection(seedWardrobe,Array.isArray(persisted?.wardrobe)?persisted.wardrobe:[]), wardrobeSlots:mergeSeedCollection(seedWardrobeSlots,Array.isArray(persisted?.wardrobeSlots)?persisted.wardrobeSlots:[]), avatarDesignNotes:persisted?.avatarDesignNotes ?? {}, selectedAvatarBust:persisted?.selectedAvatarBust ?? initial.selectedAvatarBust, clothingFits:persisted?.clothingFits ?? {}, storyFlags:persisted?.storyFlags ?? [], customArt:persisted?.customArt ?? [],dailyGiftClaims:persisted?.dailyGiftClaims??[],dailyBlockCompletions:persisted?.dailyBlockCompletions??{},lastActiveDate:persisted?.lastActiveDate??'',dailyPreferences:persisted?.dailyPreferences??initial.dailyPreferences }) }));
