import 'react-native-gesture-handler';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, ImageBackground, ImageSourcePropType, Linking, Platform, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';
import { Directory, File, Paths } from 'expo-file-system';
import DateTimePicker from '@react-native-community/datetimepicker';
import { learningActivities } from './src/data/seed';
import { evaluateStoryScene, StoryTriggerContext } from './src/story/triggerEngine';
import { blockDays, dateKey, scheduleBlockOccursOn, scheduleBlocksOverlap, sortSchedule, validDate, validTime } from './src/schedule/scheduleUtils';
import { academyHolidayFor, academyMoment, academySeason, academyWeather, ConversationTopic, dailyNpcScene, dailySchedule, generateNpcLine, giftForDate, isWeekend, localDateKey, npcPresence, npcScheduleFor } from './src/daily/dailyEngine';
import { GoldButton, PaperCard, Pill, ProgressBar, ScreenTitle, SectionLabel } from './src/components/ui';
import { useAcademyStore } from './src/store/useAcademyStore';
import { colors, radius, spacing } from './src/theme';
import { ArtCategory, ArtLayer, CustomArtAsset, JournalMood, JournalTemplate, LearningActivity, Relationship, ScheduleBlock, StoryScene, TaskKind, WardrobeSlotAppearance } from './src/types';

type LocationId = 'entrance'|'hallway'|'library'|'primaryStudio'|'practiceStudio'|'musicWing'|'dorm'|'dormHallway'|'dormCommon'|'conservatory'|'headmistress'|'reflection'|'healthWing'|'bathroom'|'laundry'|'atelier'|'diningHall'|'theatreExterior'|'theatreLobby'|'theatreSeats'|'backstage'|'theatre'|'exterior'|'frontGates'|'mainCourtyard'|'roseCourt'|'formalGardens'|'practiceGarden'|'fountainCourtyard'|'conservatoryExterior'|'gardenPaths'|'pathToTown'|'townEntrance'|'lakeside';
type RootStackParamList = { AcademyTabs: undefined; Grounds:undefined; Focus: { activityId:string }; Scene: { sceneId:string }; Location:{locationId:LocationId}; BookLibrary:undefined; BookReader:{bookId:string}; Relationships:undefined; Conversation:{npcId:string}; Schedule:undefined; Journal:undefined; ArtPortal:undefined; Settings:undefined };
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator();
const locationArt = {
  entrance: require('./assets/locations/entrance-hall.png'),
  hallway: require('./assets/locations/grand-hallway.png'),
  library: require('./assets/locations/library.png'),
  primaryStudio: require('./assets/locations/primary-studio.png'),
  practiceStudio: require('./assets/locations/practice-studio.png'),
  musicWing: require('./assets/locations/music-wing.png'),
  dorm: require('./assets/locations/empty-dorm.png'),
  decoratedDorm: require('./assets/locations/student-dorm.png'),
  dormHallway: require('./assets/locations/dorm-hallway.png'),
  campusMap: require('./assets/locations/campus-map.png'),
  studio: require('./assets/locations/primary-studio.png'),
  commonRoom: require('./assets/locations/dorm-common-room.png'),
  conservatory: require('./assets/locations/conservatory.png'),
  headmistress: require('./assets/locations/headmistress-office.png'),
  reflection: require('./assets/locations/reflection-room.png'),
  healthWing: require('./assets/locations/health-wing.png'),
  bathroom: require('./assets/locations/bathroom.png'),
  laundry: require('./assets/locations/laundry.png'),
  atelier: require('./assets/locations/costume-atelier.png'),
  diningHall: require('./assets/locations/dining-hall.png'),
  theatre: require('./assets/locations/grand-theatre.png'),
  exterior: require('./assets/locations/academy-exterior.png'),
  frontGates: require('./assets/locations/front-gates.png'),
  mainCourtyard: require('./assets/locations/main-courtyard.png'),
  roseCourt: require('./assets/locations/rose-court.png'),
  formalGardens: require('./assets/locations/formal-gardens.png'),
  practiceGarden: require('./assets/locations/practice-garden.png'),
  fountainCourtyard: require('./assets/locations/fountain-courtyard.png'),
  conservatoryExterior: require('./assets/locations/conservatory-exterior.png'),
  gardenPaths: require('./assets/locations/garden-paths.png'),
  pathToTown: require('./assets/locations/path-to-town.png'),
  townEntrance: require('./assets/locations/town-entrance-locked.png'),
  lakeside: require('./assets/locations/lakeside.png'),
};

const balletPoses = [
  { id:'first', name:'First Position', note:'Turnout begins at the hips; heels meet softly.', art:require('./assets/avatar/poses/first-position.png') },
  { id:'fifth', name:'Fifth Position', note:'Heel meets toe with both knees tracking over the feet.', art:require('./assets/avatar/poses/fifth-position.png') },
  { id:'tendu', name:'Tendu à la seconde', note:'Brush and lengthen through the working foot without shifting the hips.', art:require('./assets/avatar/poses/tendu.png') },
  { id:'arabesque', name:'First Arabesque', note:'Reach in two directions while keeping the standing side lifted.', art:require('./assets/avatar/poses/arabesque.png') },
  { id:'attitude', name:'Attitude derrière', note:'Lift the thigh behind and keep the bent leg supported.', art:require('./assets/avatar/poses/attitude.png') },
  { id:'jete', name:'Grand Jeté', note:'A suspended split line with straight knees and fully pointed feet.', art:require('./assets/avatar/poses/grand-jete.png') },
] as const;
const avatarBusts = [
  {id:'romantic',name:'Romantic',details:'Soft round brown eyes · classic bun · warm brown',art:require('./assets/avatar/busts/romantic.png')},
  {id:'classic',name:'Classic',details:'Almond green eyes · braided bun · deep brunette',art:require('./assets/avatar/busts/classic.png')},
  {id:'dreamy',name:'Dreamy',details:'Blue-gray eyes · half-up waves · light blonde',art:require('./assets/avatar/busts/dreamy.png')},
  {id:'bold',name:'Bold',details:'Hooded dark eyes · sleek high bun · black hair',art:require('./assets/avatar/busts/bold.png')},
] as const;
const wardrobeArt:Record<string,{source:any;style:any}>={
  w19:{source:require('./assets/avatar/clothing/striped-sweater.png'),style:{width:'44%',height:'34%',top:'29%',left:'28%'}},
  w20:{source:require('./assets/avatar/clothing/sage-day-dress.png'),style:{width:'48%',height:'54%',top:'25%',left:'26%'}},
  w21:{source:require('./assets/avatar/clothing/blush-gala-gown.png'),style:{width:'54%',height:'42%',top:'48%',left:'23%'}},
  w22:{source:require('./assets/avatar/clothing/black-practice-leotard.png'),style:{width:'42%',height:'48%',top:'27%',left:'29%'}},
  w23:{source:require('./assets/avatar/clothing/rose-practice-leotard.png'),style:{width:'42%',height:'48%',top:'27%',left:'29%'}},
  w24:{source:require('./assets/avatar/clothing/academy-warmup.png'),style:{width:'48%',height:'38%',top:'28%',left:'26%'}},
};
const artLayerOrder:Record<ArtLayer,number>={background:0,'hair-back':10,base:20,body:25,face:30,expression:35,outfit:40,shoes:45,'hair-front':50,accessory:60,furniture:70,portrait:75,foreground:90};
const artLayersByCategory:Record<ArtCategory,ArtLayer[]>={
  npc:['portrait','expression','foreground'],
  avatar:['hair-back','base','body','face','expression','outfit','shoes','hair-front','accessory'],
  furniture:['background','furniture','foreground'],
  location:['background','foreground'],
};
function PlacedArt({assets,style}:{assets:CustomArtAsset[];style?:any}) {
  return <View pointerEvents="none" style={[StyleSheet.absoluteFill,style]}>{assets.filter(asset=>asset.enabled).sort((a,b)=>(a.zIndex+artLayerOrder[a.layer])-(b.zIndex+artLayerOrder[b.layer])).map(asset=><Image key={asset.id} source={{uri:asset.uri}} resizeMode="contain" style={{position:'absolute',width:'100%',height:'100%',left:`${asset.x}%`,top:`${asset.y}%`,opacity:asset.opacity,transform:[{scale:asset.scale}]}}/>)}</View>;
}
function SeasonalOverlay({season}:{season:'autumn'|'winter'|'spring'|'summer'}) {
  const marks=season==='winter'?['✦','·','✧','·','✦']:season==='autumn'?['❧','✦','❧','·','❧']:season==='spring'?['❀','·','✿','·','❀']:['✦','☼','·','✦','☼'];
  const color=season==='winter'?'#EAF3F7':season==='autumn'?'#C98F72':season==='spring'?'#EAB4C3':'#F1D08D';
  return <View pointerEvents="none" style={styles.seasonOverlay}>{marks.map((mark,index)=><Text key={`${mark}-${index}`} style={[styles.seasonMark,{color,left:`${8+index*20}%`,top:index%2?22:8}]}>{mark}</Text>)}</View>;
}
type LocationExit = { label:string; icon:string; target:LocationId|'Grounds'|'Wardrobe'|'Relationships'|'BookLibrary' };
const coreLocations: Record<LocationId,{title:string;subtitle:string;description:string;art:ImageSourcePropType;activityId?:string;exits?:LocationExit[]}> = {
  entrance:{title:'Grand Entrance Hall',subtitle:'The first threshold of academy life.',description:'Enter the main hallway or pause beneath the chandeliers before the day begins.',art:locationArt.entrance,exits:[{label:'Main Hallway',icon:'git-branch-outline',target:'hallway'},{label:'Courtyard Doors',icon:'sunny-outline',target:'mainCourtyard'}]},
  hallway:{title:'Main Hallway',subtitle:'The academy branches in every direction.',description:'Use the connected doors to reach studios, the library, music wing, theatre, and dormitory.',art:locationArt.hallway,exits:[{label:'Library',icon:'library-outline',target:'library'},{label:'Studios',icon:'musical-notes-outline',target:'primaryStudio'},{label:'Dormitory Hall',icon:'bed-outline',target:'dormHallway'},{label:'Theatre Wing',icon:'ticket-outline',target:'theatreExterior'},{label:'Dining Hall',icon:'cafe-outline',target:'diningHall'},{label:'Academy Grounds',icon:'map-outline',target:'Grounds'}]},
  library:{title:'Academy Library',subtitle:'Study, French, reading, and research.',description:'Choose a focused learning session and your character will work alongside you.',art:locationArt.library,activityId:'a1'},
  primaryStudio:{title:'Primary Ballet Studio',subtitle:'Classes, assessments, and full rehearsals.',description:'Start a real-world practice session and record the work in your student profile.',art:locationArt.primaryStudio,activityId:'a3',exits:[{label:'Practice Studio',icon:'fitness-outline',target:'practiceStudio'},{label:'Main Hallway',icon:'git-branch-outline',target:'hallway'}]},
  practiceStudio:{title:'Practice Studio',subtitle:'A quieter room for personal work.',description:'Use this room for technique drills, physical-therapy exercises, or gentle review.',art:locationArt.practiceStudio,activityId:'a3',exits:[{label:'Primary Studio',icon:'musical-notes-outline',target:'primaryStudio'},{label:'Outdoor Barre',icon:'leaf-outline',target:'practiceGarden'}]},
  musicWing:{title:'Music Wing',subtitle:'Piano, practice rooms, and rehearsal events.',description:'Meet Lucien, follow music-linked story scenes, and continue through the theatre corridor.',art:locationArt.musicWing,exits:[{label:'Theatre Wing',icon:'ticket-outline',target:'theatreExterior'},{label:'Main Hallway',icon:'git-branch-outline',target:'hallway'}]},
  dorm:{title:'Empty Dorm Room',subtitle:'A blank room for furniture customization.',description:'Upload and position furniture or tiny decor through the Wardrobe artwork portal; the room view remains clean until you decorate it.',art:locationArt.dorm,exits:[{label:'Dormitory Hall',icon:'bed-outline',target:'dormHallway'}]},
  dormHallway:{title:'Dormitory Hallway',subtitle:'Your room and common spaces are nearby.',description:'Choose a dorm space without forcing wardrobe controls onto the room view.',art:locationArt.dormHallway,exits:[{label:'Empty Dorm',icon:'home-outline',target:'dorm'},{label:'Common Room',icon:'people-outline',target:'dormCommon'},{label:'Laundry',icon:'refresh-outline',target:'laundry'},{label:'Bathrooms',icon:'water-outline',target:'bathroom'}]},
  dormCommon:{title:'Dormitory Common Room',subtitle:'Letters, tea, and conversations.',description:'A warmer social room for relationship scenes and quiet between-class moments.',art:locationArt.commonRoom,exits:[{label:'Relationships',icon:'people-outline',target:'Relationships'},{label:'Dormitory Hall',icon:'bed-outline',target:'dormHallway'}]},
  conservatory:{title:'The Conservatory',subtitle:'Read, breathe, and focus among the roses.',description:'A quiet place for paper-book sessions, gentle study, and low-pressure resets.',art:locationArt.conservatory,activityId:'a4'},
  headmistress:{title:'Headmistress’s Office',subtitle:'Letters, decisions, and academy milestones.',description:'Story choices, feedback, term reviews, and official academy business gather here.',art:locationArt.headmistress},
  reflection:{title:'Reflection Room',subtitle:'A quiet room for overwhelming days.',description:'Pause here for a short wellbeing reset without losing progress or breaking your streak.',art:locationArt.reflection,activityId:'a5'},
  healthWing:{title:'Health Wing',subtitle:'Rest, recovery, and practical wellbeing tools.',description:'Begin a gentle reset and record recovery honestly without losing progress.',art:locationArt.healthWing,activityId:'a5'},
  bathroom:{title:'Student Bathrooms',subtitle:'A private stop between classes.',description:'A quiet getting-ready location connected to the dormitory corridor.',art:locationArt.bathroom},
  laundry:{title:'Academy Laundry',subtitle:'Care for costumes, uniforms, and dorm items.',description:'A dormitory utility room for clothing-care atmosphere and story visits.',art:locationArt.laundry},
  atelier:{title:'Costume Atelier',subtitle:'Design, fittings, alterations, and fashion quests.',description:'Open the Wardrobe tab or Artwork Portal to create and assign outfit layers.',art:locationArt.atelier},
  diningHall:{title:'Academy Dining Hall',subtitle:'Tea, meals, and conversations between classes.',description:'Relationship scenes, the end-of-year banquet, and between-class conversations take place here.',art:locationArt.diningHall},
  theatreExterior:{title:'Theatre Wing Entrance',subtitle:'Outside the Grand Theatre.',description:'You arrive outside the theatre first, then choose whether to step into the lobby, seats, or backstage route.',art:locationArt.theatre,exits:[{label:'Theatre Lobby',icon:'sparkles-outline',target:'theatreLobby'},{label:'Main Hallway',icon:'git-branch-outline',target:'hallway'}]},
  theatreLobby:{title:'Theatre Lobby',subtitle:'Velvet ropes, programs, and warm lights.',description:'The lobby is a waiting room for auditions, performances, and future examination scenes.',art:locationArt.theatre,exits:[{label:'Audience Seats',icon:'ticket-outline',target:'theatreSeats'},{label:'Backstage Door',icon:'shirt-outline',target:'backstage'},{label:'Outside Theatre',icon:'exit-outline',target:'theatreExterior'}]},
  theatreSeats:{title:'Audience Seats',subtitle:'A view of the stage from the quiet rows.',description:'Sit here for performances, observation tasks, and story scenes from the audience side.',art:locationArt.theatre,exits:[{label:'Theatre Lobby',icon:'sparkles-outline',target:'theatreLobby'},{label:'Backstage',icon:'shirt-outline',target:'backstage'}]},
  backstage:{title:'Backstage',subtitle:'Costumes, wings, nerves, and preparation.',description:'Backstage is ready for auditions, quick changes, exam prep, and future story choices.',art:locationArt.theatre,exits:[{label:'Costume Atelier',icon:'cut-outline',target:'atelier'},{label:'Audience Seats',icon:'ticket-outline',target:'theatreSeats'},{label:'Theatre Lobby',icon:'sparkles-outline',target:'theatreLobby'}]},
  theatre:{title:'Grand Theatre Stage',subtitle:'Performances, auditions, examinations, and story events.',description:'Major academy moments will take place on this stage.',art:locationArt.theatre,exits:[{label:'Audience Seats',icon:'ticket-outline',target:'theatreSeats'},{label:'Backstage',icon:'shirt-outline',target:'backstage'}]},
  exterior:{title:'Academy Exterior',subtitle:'The whole academy opens before you.',description:'Return through the front doors or explore the gates, courtyard, and gardens.',art:locationArt.exterior},
  frontGates:{title:'Front Gates',subtitle:'The formal arrival to academy life.',description:'Follow the path toward the academy or walk deeper into the grounds.',art:locationArt.frontGates,activityId:'a6'},
  mainCourtyard:{title:'Main Courtyard',subtitle:'A bright crossroads between academy wings.',description:'Gatherings, seasonal events, and outdoor story scenes can take place here.',art:locationArt.mainCourtyard},
  roseCourt:{title:'Rose Court',subtitle:'The emotional heart of the academy.',description:'Letters, private conversations, and relationship scenes belong among these roses.',art:locationArt.roseCourt},
  formalGardens:{title:'Formal Gardens',subtitle:'Walk, read, or practice French outside.',description:'Choose a gentle walking session or settle into a garden reading session.',art:locationArt.formalGardens,activityId:'a6'},
  practiceGarden:{title:'Outdoor Practice Garden',subtitle:'A quiet barre beneath the roses.',description:'Begin a real ballet practice session in the open air.',art:locationArt.practiceGarden,activityId:'a3'},
  fountainCourtyard:{title:'Fountain Courtyard',subtitle:'Paths meet beneath the sound of water.',description:'A calm outdoor hub for future events and chance encounters.',art:locationArt.fountainCourtyard},
  conservatoryExterior:{title:'Conservatory Terrace',subtitle:'Glass, roses, and the garden entrance.',description:'Continue indoors to read or use the surrounding paths for a quiet walk.',art:locationArt.conservatoryExterior,activityId:'a4'},
  gardenPaths:{title:'Garden Paths',subtitle:'Choose a direction without leaving the academy.',description:'Use the outdoor walking session to track a gentle real-world walk.',art:locationArt.gardenPaths,activityId:'a6'},
  pathToTown:{title:'Path Toward Town',subtitle:'Academy grounds fade into the wider world.',description:'The route is open for walking, but the town itself awaits a later batch.',art:locationArt.pathToTown,activityId:'a6'},
  townEntrance:{title:'Town Entrance',subtitle:'A sealed Year Two route.',description:'The academy-side path is complete; the town beyond the gate is intentionally reserved for a later story year.',art:locationArt.townEntrance},
  lakeside:{title:'Academy Lakeside',subtitle:'A quiet path under the evening sky.',description:'Read, reflect, or complete a gentle walking session beside the water.',art:locationArt.lakeside,activityId:'a6'},
};

function Page({ children }: { children:React.ReactNode }) {
  return <SafeAreaView style={styles.safe} edges={['top']}><LinearGradient colors={[colors.pale, '#F3E6E3', colors.pale]} style={StyleSheet.absoluteFill}/><ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>{children}</ScrollView></SafeAreaView>;
}

function TopWallet() {
  const student = useAcademyStore((s) => s.student);
  return <View style={styles.wallet}><Pill tone="gold">✦ {student.coins} coins</Pill><Pill tone="rose">Level {student.level} · {student.xp} XP</Pill><Pill tone="sage">♢ {student.streak} days</Pill></View>;
}

function LocationHero({ source, title, subtitle, children }: { source:ImageSourcePropType; title:string; subtitle:string; children?:React.ReactNode }) {
  return <ImageBackground source={source} resizeMode="cover" style={styles.locationHero} imageStyle={styles.locationImage}>
    <LinearGradient colors={['transparent','rgba(44,30,36,.82)']} style={StyleSheet.absoluteFill}/>
    {children}
    <View style={styles.locationCaption}><Text style={styles.locationTitle}>{title}</Text><Text style={styles.locationSubtitle}>{subtitle}</Text></View>
  </ImageBackground>;
}

function HomeScreen({ navigation }: any) {
  const { student, tasks, completeTask, addTask, schedule, selectedPose, customArt,relationships,wardrobe,quests,dailyGiftClaims,dailyBlockCompletions,dailyPreferences,claimDailyGift,completeDailyBlock,setDailyPreferences } = useAcademyStore();
  const [goalTitle,setGoalTitle]=useState('');
  const activeAvatarPose=balletPoses.find(pose=>pose.id===selectedPose) ?? balletPoses[0];
  const avatarLayers=customArt.filter(asset=>asset.category==='avatar'&&asset.targetId==='player'&&(!asset.itemId||wardrobe.some(item=>item.id===asset.itemId&&item.equipped)));
  const dormDecor=customArt.filter(asset=>asset.category==='furniture'&&asset.targetId==='dorm');
  const now=new Date();const todayKey=localDateKey(now);const todaySchedule=dailySchedule(schedule,now);const forecast=academyWeather(now);const gift=giftForDate(now);const moment=academyMoment(relationships,now);const holiday=academyHolidayFor(now);const giftClaimed=dailyGiftClaims.includes(todayKey);const completedBlocks=dailyBlockCompletions[todayKey]??[];const presentNPCs=npcPresence(relationships,now).slice(0,4);const reminderDue=dailyPreferences.remindersEnabled&&(now.getHours()>dailyPreferences.reminderHour||(now.getHours()===dailyPreferences.reminderHour&&now.getMinutes()>=dailyPreferences.reminderMinute))&&completedBlocks.length<todaySchedule.length;
  const incomplete = tasks.filter((t) => !t.completed);
  return <Page><TopWallet/><ScreenTitle eyebrow={isWeekend(now)?'Weekend at the Academy':'Royal Ballet Academy'} title={`Good ${now.getHours() < 12 ? 'morning' : now.getHours() < 18 ? 'afternoon' : 'evening'}, ${student.name}`} subtitle={isWeekend(now)?'A gentler academy day: relationships, gardens, reflection, and anything real on your schedule.':'Your real schedule, daily rewards, and academy events are waiting.'}/><LocationHero source={locationArt.decoratedDorm} title={`Your Room · ${forecast.season[0].toUpperCase()+forecast.season.slice(1)}`} subtitle={`${forecast.label} · ${activeAvatarPose.name}`}><PlacedArt assets={dormDecor}/>{avatarLayers.length?<PlacedArt assets={avatarLayers}/>:<Image source={activeAvatarPose.art} resizeMode="contain" style={styles.todayAvatar}/>}<SeasonalOverlay season={forecast.season}/></LocationHero>
    <View style={styles.dailyTopRow}><PaperCard style={styles.weatherCard}><Ionicons name={forecast.icon as any} size={25} color={colors.gold}/><Text style={styles.itemTitle}>{forecast.label}</Text><Text style={styles.small}>{forecast.note}</Text><Text style={styles.academyForecast}>ACADEMY ATMOSPHERE · NOT LIVE WEATHER</Text></PaperCard><PaperCard style={[styles.giftCard,giftClaimed&&styles.giftClaimed]}><Ionicons name={giftClaimed?'checkmark-circle':gift.icon as any} size={25} color={giftClaimed?colors.sage:colors.rose}/><Text style={styles.itemTitle}>{gift.name}</Text><Text style={styles.small}>{gift.description}</Text><Pressable disabled={giftClaimed} style={[styles.giftButton,giftClaimed&&styles.giftButtonDone]} onPress={()=>claimDailyGift(todayKey,gift)}><Text style={styles.giftButtonText}>{giftClaimed?'Claimed':`Claim · ${gift.coins} coins · ${gift.xp} XP`}</Text></Pressable></PaperCard></View>
    {holiday&&<PaperCard style={styles.holidayCard}><Ionicons name="calendar-outline" size={23} color={colors.gold}/><View style={styles.flex}><Text style={styles.itemTitle}>{holiday.name}</Text><Text style={styles.small}>{holiday.description}</Text></View></PaperCard>}
    <SectionLabel action={`${completedBlocks.length}/${todaySchedule.length}`}>Today’s Real Schedule</SectionLabel>{todaySchedule.length===0?<PaperCard><Text style={styles.itemTitle}>{isWeekend(now)?'Open weekend':'No scheduled commitments today'}</Text><Text style={styles.body}>Nothing has been invented. Add real commitments in Schedule, or choose a Do It With Me session below.</Text></PaperCard>:todaySchedule.map(block=>{const done=completedBlocks.includes(block.id);return <PaperCard key={block.id} style={[styles.dailyBlock,done&&styles.dailyBlockDone]}><View style={styles.row}><View style={[styles.dailyTime,{backgroundColor:done?colors.sage:colors.plum}]}><Text style={styles.dailyTimeText}>{block.start}</Text></View><View style={styles.flex}><Text style={[styles.itemTitle,done&&styles.done]}>{block.title}</Text><Text style={styles.small}>{block.end} · {block.location} · from your editable schedule</Text></View><Pressable disabled={done} style={[styles.dailyCheck,done&&styles.checked]} onPress={()=>completeDailyBlock(todayKey,block.id,block.kind)}><Ionicons name={done?'checkmark':'ellipse-outline'} size={19} color={done?'white':colors.gold}/></Pressable></View></PaperCard>})}
    <SectionLabel>Who’s Around Today</SectionLabel><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presenceRow}>{presentNPCs.map(npc=><Pressable key={npc.id} style={styles.presenceCard} onPress={()=>navigation.navigate('Location',{locationId:npc.dailyLocation})}><View style={[styles.presenceAvatar,{backgroundColor:npc.color}]}><Text style={styles.presenceInitials}>{npc.initials}</Text></View><Text style={styles.presenceName}>{npc.name.split(' ')[0]}</Text><Text style={styles.presencePlace}>{coreLocations[npc.dailyLocation as LocationId]?.title??npc.dailyLocation}</Text><Text style={styles.presenceNote}>{npc.presenceNote}</Text></Pressable>)}</ScrollView>
    <SectionLabel>Academy Moment</SectionLabel><Pressable style={styles.momentCard} onPress={()=>navigation.navigate('Location',{locationId:moment.locationId})}><View style={styles.momentIcon}><Ionicons name={moment.icon as any} size={23} color={colors.gold}/></View><View style={styles.flex}><Text style={styles.script}>{moment.title}</Text><Text style={styles.body}>{moment.text}</Text><Text style={styles.momentAction}>{moment.action} · {coreLocations[moment.locationId as LocationId]?.title??moment.locationId}  ›</Text></View></Pressable>
    <SectionLabel>Mentor Quests</SectionLabel>{quests.map(quest=>{const mentor=relationships.find(relationship=>relationship.id===quest.mentorId);const reward=wardrobe.find(item=>item.id===quest.rewardItemId);return <PaperCard key={quest.id} style={[styles.questCard,quest.completed&&styles.questCardComplete]}><View style={styles.row}><View style={styles.questIcon}><Ionicons name={quest.completed?'checkmark':'ribbon-outline'} size={21} color={quest.completed?colors.sage:colors.gold}/></View><View style={styles.flex}><Text style={styles.itemTitle}>{quest.title}</Text><Text style={styles.small}>{mentor?.name??'Mentor'} · {quest.description}</Text><ProgressBar value={quest.progress} max={quest.goal} color={quest.completed?colors.sage:colors.rose}/><Text style={styles.questProgress}>{quest.completed?`Complete · ${reward?.name??'Reward received'}`:`${quest.progress}/${quest.goal} completed · Reward: ${reward?.name??'mentor gift'}`}</Text></View></View></PaperCard>;})}
    <SectionLabel>Personal Goals</SectionLabel><View style={styles.goalCreate}><TextInput value={goalTitle} onChangeText={setGoalTitle} placeholder="Add a goal for yourself" placeholderTextColor="#A9989A" style={styles.goalInput}/><Pressable accessibilityLabel="Add goal" style={styles.goalAddButton} onPress={()=>{if(!goalTitle.trim())return;addTask({id:`goal-${Date.now()}`,title:goalTitle.trim(),detail:'A goal you chose for yourself.',kind:'personal',minutes:0,xp:0,coins:0,completed:false,dueLabel:'Personal goal'});setGoalTitle('');}}><Ionicons name="add" size={21} color="white"/></Pressable></View>
    <SectionLabel>Daily Reminder</SectionLabel><PaperCard style={[styles.reminderCard,reminderDue&&styles.reminderDue]}><View style={styles.row}><Ionicons name={reminderDue?'notifications':'notifications-outline'} size={24} color={reminderDue?colors.rose:colors.gold}/><View style={styles.flex}><Text style={styles.itemTitle}>{reminderDue?'Your academy plan is waiting':'In-app reminder'}</Text><Text style={styles.small}>{dailyPreferences.remindersEnabled?`Shows after ${String(dailyPreferences.reminderHour).padStart(2,'0')}:${String(dailyPreferences.reminderMinute).padStart(2,'0')} when scheduled items remain.`:'Turn this on for a reminder whenever you open the app after your chosen time.'}</Text></View><Pressable style={[styles.reminderToggle,dailyPreferences.remindersEnabled&&styles.reminderToggleOn]} onPress={()=>setDailyPreferences({remindersEnabled:!dailyPreferences.remindersEnabled})}><Ionicons name={dailyPreferences.remindersEnabled?'checkmark':'close'} size={17} color="white"/></Pressable></View>{dailyPreferences.remindersEnabled&&<View style={styles.reminderTimeRow}><Pressable style={styles.timeAdjust} onPress={()=>setDailyPreferences({reminderHour:(dailyPreferences.reminderHour+23)%24})}><Text style={styles.timeAdjustText}>− hour</Text></Pressable><Text style={styles.reminderTime}>{String(dailyPreferences.reminderHour).padStart(2,'0')}:{String(dailyPreferences.reminderMinute).padStart(2,'0')}</Text><Pressable style={styles.timeAdjust} onPress={()=>setDailyPreferences({reminderHour:(dailyPreferences.reminderHour+1)%24})}><Text style={styles.timeAdjustText}>+ hour</Text></Pressable></View>}</PaperCard>
    <PaperCard style={styles.hero}>
      <Text style={styles.script}>Today at the Academy</Text>
      <Text style={styles.heroTitle}>{todaySchedule[0]?.title ?? 'A Quiet Day for Progress'}</Text>
      <Text style={styles.body}>{todaySchedule[0] ? `${todaySchedule[0].start}–${todaySchedule[0].end} · ${todaySchedule[0].location}` : 'Choose one small thing that would make tonight feel successful.'}</Text>
      <View style={styles.ribbon}><Text style={styles.ribbonText}>THE DAY'S INTENTION</Text></View>
    </PaperCard>
    <SectionLabel action={`${incomplete.length} remaining`}>Today’s Assignments</SectionLabel>
    {tasks.map((task) => <Pressable key={task.id} onPress={() => completeTask(task.id)}><PaperCard style={styles.listCard}><View style={styles.row}>
      <View style={[styles.check, task.completed && styles.checked]}>{task.completed && <Ionicons name="checkmark" size={16} color="white"/>}</View>
      <View style={styles.flex}><Text style={[styles.itemTitle, task.completed && styles.done]}>{task.title}</Text><Text style={styles.small}>{task.minutes} min · +{task.xp} XP · +{task.coins} coins</Text></View><Pill>{task.kind}</Pill>
    </View></PaperCard></Pressable>)}
    <SectionLabel>Do It With Me</SectionLabel>
    <PaperCard><View style={styles.row}><View style={styles.studyIcon}><Ionicons name="book-outline" size={26} color={colors.gold}/></View><View style={styles.flex}><Text style={styles.itemTitle}>Your character works when you do</Text><Text style={styles.body}>Choose a real activity. The room, timer, instructions, rewards, and progress log work together.</Text></View></View>
      <View style={styles.activityGrid}>{learningActivities.map((a) => <Pressable key={a.id} style={styles.activityChip} onPress={() => navigation.navigate('Focus', {activityId:a.id})}><Ionicons name={a.kind === 'study' ? 'school-outline' : a.kind === 'french' ? 'chatbubble-ellipses-outline' : a.kind === 'reading' ? 'library-outline' : a.kind === 'custom' ? 'create-outline' : a.kind === 'wellbeing' ? 'heart-outline' : 'fitness-outline'} size={17} color={colors.plum}/><Text style={styles.activityText}>{a.kind === 'custom' ? 'Custom' : a.title.split(' ')[0]}</Text><Text style={styles.activityTime}>{a.minutes}m</Text></Pressable>)}</View>
    </PaperCard>
    <SectionLabel>Academy Doors</SectionLabel>
    <View style={styles.quickRow}><Quick label="Schedule" icon="calendar-outline" onPress={() => navigation.navigate('Schedule')}/><Quick label="Journal" icon="journal-outline" onPress={() => navigation.navigate('Journal')}/><Quick label="Friends" icon="people-outline" onPress={() => navigation.navigate('Relationships')}/><Quick label="Settings" icon="settings-outline" onPress={() => navigation.navigate('Settings')}/></View>
  </Page>;
}

function Quick({ label, icon, onPress }: { label:string; icon:any; onPress:()=>void }) { return <Pressable style={styles.quick} onPress={onPress}><Ionicons name={icon} size={23} color={colors.rose}/><Text style={styles.quickText}>{label}</Text></Pressable>; }

function StoryScreen({ navigation }: any) {
  const academy = useAcademyStore();
  const {story,storyEventQueue,storyProgress,dismissedStoryEvents,visitedLocations,refreshStoryEvents,dismissStoryEvent,restoreDismissedStoryEvents}=academy;
  useEffect(()=>{refreshStoryEvents();const unsubscribe=useAcademyStore.persist.onFinishHydration(()=>refreshStoryEvents());return unsubscribe;},[refreshStoryEvents]);
  const triggerContext:StoryTriggerContext={now:new Date(),level:academy.student.level,tasks:academy.tasks,schedule:academy.schedule,relationships:academy.relationships,wardrobe:academy.wardrobe,sessions:academy.sessions,visitedLocations,progress:storyProgress,journalEntries:academy.journalEntries,studyNotes:academy.studyNotes,storyFlags:academy.storyFlags};
  const nextScene=story.find(scene=>scene.id===storyEventQueue[0]);
  const chapters = [...new Set(story.map((s) => s.chapter))];
  const chapterLabels:Record<number,string>={1:'The Invitation',2:'Ribbons & Rain',3:'Fault Lines',4:'The Second Envelope',5:'September · First Term',6:'October · Auditions',7:'November · The Archive',8:'December · Winter Performance',9:'January · A Quiet Return',10:'February · Partnerships',11:'March · Assessments',12:'April · Spring Company',13:'May · Final Rehearsals',14:'June · Finale'};
  return <Page><TopWallet/><ScreenTitle eyebrow="Academy Chronicles" title="Your Story" subtitle="Scenes unlock through progress—not energy timers or artificial waiting."/><LocationHero source={locationArt.headmistress} title="The Chronicle Desk" subtitle="Official letters, milestones, and queued academy events gather here."/>
    {nextScene&&<PaperCard style={styles.eventQueueCard}><View style={styles.row}><View style={styles.queueBell}><Ionicons name="notifications" size={21} color={colors.gold}/></View><View style={styles.flex}><Text style={styles.script}>Next academy event</Text><Text style={styles.itemTitle}>{nextScene.title}</Text><Text style={styles.small}>{nextScene.optional?'Optional event':'Story event'} · priority {nextScene.priority??0}</Text></View></View><View style={styles.queueActions}><GoldButton label="Open Event" onPress={()=>navigation.navigate('Scene',{sceneId:nextScene.id})}/>{nextScene.optional&&<Pressable style={styles.dismissButton} onPress={()=>dismissStoryEvent(nextScene.id)}><Text style={styles.dismissButtonText}>Not now</Text></Pressable>}</View></PaperCard>}
    <SectionLabel action={`${storyEventQueue.length} ready`}>Trigger Queue</SectionLabel>
    {dismissedStoryEvents.length>0&&<Pressable style={styles.restoreEvents} onPress={restoreDismissedStoryEvents}><Ionicons name="refresh" size={15} color={colors.rose}/><Text style={styles.restoreEventsText}>Restore {dismissedStoryEvents.length} dismissed event{dismissedStoryEvents.length===1?'':'s'}</Text></Pressable>}
    {chapters.map((chapter) => <View key={chapter}><SectionLabel>{chapterLabels[chapter]??`Chapter ${chapter}`}</SectionLabel>{story.filter(s => s.chapter === chapter).map((scene) => {const result=evaluateStoryScene(scene,triggerContext);const completed=(storyProgress.find(p=>p.sceneId===scene.id)?.completions??0)>0;const sealed=scene.status==='locked'&&!completed;return <Pressable key={scene.id} disabled={sealed} onPress={() => navigation.navigate('Scene',{sceneId:scene.id})}><PaperCard style={[styles.listCard,sealed&&styles.locked]}><View style={styles.row}><View style={styles.chapterSeal}><Text style={styles.sealText}>{completed?'✓':sealed?'✦':chapter}</Text></View><View style={styles.flex}><View style={styles.storyTitleRow}><Text style={styles.itemTitle}>{sealed?'Sealed Academy Event':scene.title}</Text>{!sealed&&scene.optional&&<Pill tone="sage">optional</Pill>}</View><Text style={styles.body}>{sealed?'Its contents remain private until the story reaches this moment.':scene.summary}</Text>{sealed&&result.reasons.length>0?<View style={styles.triggerReasons}>{result.reasons.map(reason=><View key={reason.label} style={styles.triggerReason}><Ionicons name={reason.met?'checkmark-circle':'ellipse-outline'} size={13} color={reason.met?colors.sage:colors.muted}/><Text style={styles.triggerReasonText}>{reason.label}</Text></View>)}</View>:<Text style={styles.small}>{completed?'Read · reward claimed':dismissedStoryEvents.includes(scene.id)?'Dismissed for now':'Available now'}</Text>}</View></View></PaperCard></Pressable>})}</View>)}
  </Page>;
}

function AcademyScreen({ navigation }: any) {
  const rooms = [
    ['Academy Grounds','Gardens and outdoor routes','map-outline','grounds'],['Entrance Hall','Academy threshold','business-outline','entrance'],['Main Hallway','Doors and navigation','git-branch-outline','hallway'],['Library','Books and school study','library-outline','library'],['Primary Studio','Classes and assessment','musical-notes-outline','primaryStudio'],['Practice Studio','Personal technique work','fitness-outline','practiceStudio'],['Music Wing','Music and practice rooms','headset-outline','musicWing'],['Dormitory Hall','Rooms and common spaces','bed-outline','dormHallway'],['Empty Dorm','Blank room view','home-outline','dorm'],['Conservatory','Reading and quiet focus','leaf-outline','conservatory'],['Headmistress','Letters and reviews','ribbon-outline','headmistress'],['Reflection Room','Quiet wellbeing reset','rainy-outline','reflection'],['Health Wing','Rest and recovery','medkit-outline','healthWing'],['Bathrooms','Getting-ready routines','water-outline','bathroom'],['Laundry','Clothing care','refresh-outline','laundry'],['Costume Atelier','Design and fittings','cut-outline','atelier'],['Dining Hall','Meals and conversations','cafe-outline','diningHall'],['Grand Theatre','Lobby, seats, backstage','ticket-outline','theatreExterior'],['Rose Court','Letters and relationships','rose-outline','relationships'],['Wardrobe Tab','Dress and decorate tools','shirt-outline','wardrobe']
  ];
  const openRoom=(target:string)=> target==='grounds'?navigation.navigate('Grounds'):target==='relationships'?navigation.navigate('Relationships'):target==='wardrobe'?navigation.navigate('Wardrobe'):navigation.navigate('Location',{locationId:target});
  return <Page><ScreenTitle eyebrow="Explore" title="The Academy" subtitle="Tap the map or directory to move through the academy."/><LocationHero source={locationArt.campusMap} title="Academy Campus Map" subtitle="Core and supporting locations are connected.">
    <Pressable accessibilityLabel="Enter the academy" style={[styles.hotspot,{left:'42%',top:'29%'}]} onPress={()=>openRoom('entrance')}><Ionicons name="enter-outline" size={20} color="white"/><Text style={styles.hotspotLabel}>Hall</Text></Pressable>
    <Pressable accessibilityLabel="Open the studios" style={[styles.hotspot,{right:'25%',bottom:'35%'}]} onPress={()=>openRoom('primaryStudio')}><Ionicons name="musical-notes" size={20} color="white"/><Text style={styles.hotspotLabel}>Studios</Text></Pressable>
    <Pressable accessibilityLabel="Open the dormitory" style={[styles.hotspot,{right:'19%',top:'22%'}]} onPress={()=>openRoom('dormHallway')}><Ionicons name="bed" size={20} color="white"/><Text style={styles.hotspotLabel}>Dorms</Text></Pressable>
  </LocationHero><View style={styles.mapFrame}><View style={styles.crest}><Text style={styles.crestText}>RBA</Text></View><Text style={styles.mapTitle}>Campus Directory</Text><View style={styles.roomGrid}>{rooms.map((r) => <Pressable key={r[0]} style={styles.room} onPress={()=>openRoom(r[3])}><Ionicons name={r[2] as any} size={28} color={colors.gold}/><Text style={styles.roomTitle}>{r[0]}</Text><Text style={styles.roomSub}>{r[1]}</Text><Ionicons name="chevron-forward" size={16} color={colors.rose} style={styles.roomChevron}/></Pressable>)}</View></View></Page>;
}

function GroundsScreen({navigation}:NativeStackScreenProps<RootStackParamList,'Grounds'>) {
  const grounds:[string,string,string,LocationId][]=[
    ['Academy Exterior','Front façade and entrance','business-outline','exterior'],['Front Gates','Arrival and walking route','enter-outline','frontGates'],['Main Courtyard','Gatherings and events','sunny-outline','mainCourtyard'],['Rose Court','Letters and relationships','rose-outline','roseCourt'],['Formal Gardens','Walking and reading','leaf-outline','formalGardens'],['Practice Garden','Outdoor ballet barre','fitness-outline','practiceGarden'],['Fountain Court','Outdoor crossroads','water-outline','fountainCourtyard'],['Conservatory Terrace','Reading garden entrance','flower-outline','conservatoryExterior'],['Garden Paths','Gentle walking routes','trail-sign-outline','gardenPaths'],['Path to Town','Route beyond the grounds','walk-outline','pathToTown'],['Town Entrance','Locked until town batch','lock-closed-outline','townEntrance'],['Lakeside','Reading and reflection','moon-outline','lakeside']
  ];
  return <Page><View style={styles.readerTop}><Pressable style={styles.paperBack} onPress={()=>navigation.goBack()}><Ionicons name="chevron-back" size={23} color={colors.plum}/></Pressable><Pill tone="sage">OUTDOOR MAP</Pill></View><ScreenTitle eyebrow="Beyond the Doors" title="Academy Grounds" subtitle="Explore the gardens, practice outdoors, or begin a real walking session."/><LocationHero source={locationArt.exterior} title="Royal Ballet Academy" subtitle="The exterior grounds are open."><Pressable accessibilityLabel="Open formal gardens" style={[styles.hotspot,{left:'13%',bottom:'28%'}]} onPress={()=>navigation.navigate('Location',{locationId:'formalGardens'})}><Ionicons name="leaf" size={18} color="white"/></Pressable><Pressable accessibilityLabel="Open front gates" style={[styles.hotspot,{right:'12%',bottom:'31%'}]} onPress={()=>navigation.navigate('Location',{locationId:'frontGates'})}><Ionicons name="enter" size={18} color="white"/></Pressable></LocationHero><View style={styles.roomGrid}>{grounds.map(g=><Pressable key={g[0]} style={[styles.room,g[3]==='townEntrance'&&styles.locked]} onPress={()=>navigation.navigate('Location',{locationId:g[3]})}><Ionicons name={g[2] as any} size={27} color={colors.gold}/><Text style={styles.roomTitle}>{g[0]}</Text><Text style={styles.roomSub}>{g[1]}</Text></Pressable>)}</View></Page>;
}

function RoomNpcSprites({npcs,customArt}:{npcs:any[];customArt:CustomArtAsset[]}) {
  return <View pointerEvents="none" style={styles.roomSpriteLayer}>{npcs.map((npc,index)=>{const portraits=customArt.filter(asset=>asset.category==='npc'&&asset.targetId===npc.id&&asset.enabled&&(asset.layer==='portrait'||asset.variant==='neutral'));return <View key={npc.id} style={[styles.roomNPCSpriteWrap,{left:`${12+index*18}%`,bottom:index%2?31:35}]}><View style={[styles.roomNPCSprite,{backgroundColor:npc.color}]}>{portraits.length?<PlacedArt assets={portraits}/>:<Text style={styles.roomNPCSpriteInitials}>{npc.initials}</Text>}</View><Text style={styles.roomNPCSpriteName}>{npc.name.split(' ')[0]}</Text></View>;})}</View>;
}

function LocationScreen({route,navigation}:NativeStackScreenProps<RootStackParamList,'Location'>) {
  const room=coreLocations[route.params.locationId];
  const recordLocationVisit=useAcademyStore(state=>state.recordLocationVisit);
  const relationships=useAcademyStore(state=>state.relationships);
  const story=useAcademyStore(state=>state.story);
  const customArt=useAcademyStore(state=>state.customArt);
  const locationBackground=customArt.find(asset=>asset.category==='location'&&asset.targetId===route.params.locationId&&asset.layer==='background'&&asset.enabled);
  const roomDecor=route.params.locationId==='dorm'?customArt.filter(asset=>asset.category==='furniture'&&asset.targetId==='dorm'):customArt.filter(asset=>asset.category==='location'&&asset.targetId===route.params.locationId&&asset.layer!=='background');
  const roomNPCs=npcPresence(relationships).filter(npc=>npc.dailyLocation===route.params.locationId);
  const roomEvents=story.filter(scene=>scene.locationId===route.params.locationId&&scene.status==='available');
  useEffect(()=>{recordLocationVisit(route.params.locationId);},[recordLocationVisit,route.params.locationId]);
  const openExit=(target:LocationExit['target'])=>{
    if(target==='Grounds') navigation.navigate('Grounds');
    else if(target==='Wardrobe') navigation.navigate('AcademyTabs',{screen:'Wardrobe'} as any);
    else if(target==='Relationships') navigation.navigate('Relationships');
    else if(target==='BookLibrary') navigation.navigate('BookLibrary');
    else navigation.replace('Location',{locationId:target});
  };
  return <SafeAreaView style={styles.locationPage}><ImageBackground source={locationBackground?{uri:locationBackground.uri}:room.art} style={StyleSheet.absoluteFill} resizeMode="cover"><PlacedArt assets={roomDecor}/><LinearGradient colors={['rgba(34,24,29,.04)','rgba(89,54,71,.18)','rgba(64,34,48,.9)']} style={StyleSheet.absoluteFill}/><View style={styles.locationTop}><Pressable style={styles.roundBack} onPress={()=>navigation.goBack()}><Ionicons name="chevron-back" size={25} color="white"/></Pressable><Pill tone="gold">ROYAL BALLET ACADEMY</Pill></View>
    {(room.exits ?? []).slice(0,4).map((exit,index)=><Pressable key={exit.label} accessibilityLabel={exit.label} style={[styles.hotspot,styles.roomHotspot,index===0&&{left:'16%',top:'34%'},index===1&&{right:'15%',top:'36%'},index===2&&{left:'22%',bottom:'38%'},index===3&&{right:'24%',bottom:'39%'}]} onPress={()=>openExit(exit.target)}><Ionicons name={exit.icon as any} size={17} color="white"/></Pressable>)}
    <RoomNpcSprites npcs={roomNPCs} customArt={customArt}/>
    <View style={styles.locationPanel}><Text style={styles.locationFullTitle}>{room.title}</Text><Text style={styles.locationFullSub}>{room.subtitle}</Text><Text style={styles.locationDescription}>{room.description}</Text>{roomNPCs.length>0&&<View style={styles.roomNPCRow}>{roomNPCs.map(npc=><Pressable key={npc.id} style={styles.roomNPC} onPress={()=>navigation.navigate('Relationships')}><View style={[styles.roomNPCBadge,{backgroundColor:npc.color}]}><Text style={styles.roomNPCInitials}>{npc.initials}</Text></View><Text style={styles.roomNPCName}>{npc.name.split(' ')[0]} is often here</Text></Pressable>)}</View>}{roomEvents.map(scene=><Pressable key={scene.id} style={styles.roomStoryEvent} onPress={()=>navigation.navigate('Scene',{sceneId:scene.id})}><Ionicons name={scene.letterFrom?'mail':'sparkles'} size={17} color={colors.gold}/><Text style={styles.roomStoryText}>{scene.title}</Text><Ionicons name="chevron-forward" size={16} color={colors.rose}/></Pressable>)}<View style={styles.locationActions}>{room.activityId&&<GoldButton label="Start Do It With Me" onPress={()=>navigation.navigate('Focus',{activityId:room.activityId!})}/>} {route.params.locationId==='library'&&<GoldButton label="Open My Book Library" onPress={()=>navigation.navigate('BookLibrary')}/>} {route.params.locationId==='roseCourt'&&<GoldButton label="Open Relationships" onPress={()=>navigation.navigate('Relationships')}/>} {(room.exits ?? []).length>0&&<View style={styles.exitGrid}>{room.exits!.map(exit=><Pressable key={exit.label} style={styles.exitChip} onPress={()=>openExit(exit.target)}><Ionicons name={exit.icon as any} size={17} color={colors.rose}/><Text style={styles.exitText}>{exit.label}</Text></Pressable>)}</View>} {route.params.locationId==='townEntrance'&&<View style={styles.lockNotice}><Ionicons name="lock-closed" size={16} color={colors.gold}/><Text style={styles.lockText}>Town access unlocks in a future batch.</Text></View>}</View></View></ImageBackground></SafeAreaView>;
}

function wardrobeSlotIsVisible(appearance:WardrobeSlotAppearance,date=new Date()) {
  if(appearance==='always')return true;
  const month=date.getMonth()+1;const day=date.getDate();const season=academySeason(date);
  if(appearance==='christmas')return month===12&&day>=15||month===1&&day<=3;
  if(appearance==='halloween')return month===10&&day>=20||month===11&&day<=2;
  if(appearance==='fall')return season==='autumn';
  return appearance===season;
}

function WardrobeScreen({navigation}:any) {
  const { wardrobe,student,selectedPose,selectedAvatarBust,savedLooks,customArt,buyItem,equipItem,setSelectedPose,setSelectedAvatarBust,saveCurrentLook,wearSavedLook,removeSavedLook,updateCustomArt } = useAcademyStore();
  const [editorMode,setEditorMode]=useState<'avatar'|'room'>('avatar');
  const [category,setCategory]=useState<'dress'|'top'|'bottom'|'shoes'|'accessory'>('dress');
  const [selectedDecorId,setSelectedDecorId]=useState<string|null>(null);
  const activePose=balletPoses.find(p=>p.id===selectedPose) ?? balletPoses[0];
  const activeBust=avatarBusts.find(bust=>bust.id===selectedAvatarBust) ?? avatarBusts[0];
  const equipped=wardrobe.filter(item=>item.equipped);
  const avatarLayers=customArt.filter(asset=>asset.category==='avatar'&&asset.targetId==='player'&&asset.enabled&&(!asset.itemId||wardrobe.some(item=>item.id===asset.itemId&&item.equipped)));
  const roomDecor=customArt.filter(asset=>asset.category==='furniture'&&asset.targetId==='dorm');
  const selectedDecor=roomDecor.find(asset=>asset.id===selectedDecorId)??roomDecor[0];
  const categoryItems=wardrobe.filter(item=>item.slot===category);
  const nudgeDecor=(key:'x'|'y'|'scale',amount:number)=>{if(!selectedDecor)return;const next=(selectedDecor[key] as number)+amount;const bounds=key==='scale'?[.2,3]:[-100,100];updateCustomArt(selectedDecor.id,{[key]:Math.round(Math.max(bounds[0],Math.min(bounds[1],next))*100)/100});};
  return <Page><TopWallet/><ScreenTitle eyebrow="Dormitory Dressing Room" title="Avatar & Room Editor" subtitle="Tap what you want and see it immediately."/>
    <View style={styles.editorModeTabs}><Pressable style={[styles.editorModeTab,editorMode==='avatar'&&styles.editorModeTabActive]} onPress={()=>setEditorMode('avatar')}><Ionicons name="person-outline" size={18} color={editorMode==='avatar'?'white':colors.plum}/><Text style={[styles.editorModeText,editorMode==='avatar'&&styles.editorModeTextActive]}>Avatar</Text></Pressable><Pressable style={[styles.editorModeTab,editorMode==='room'&&styles.editorModeTabActive]} onPress={()=>setEditorMode('room')}><Ionicons name="bed-outline" size={18} color={editorMode==='room'?'white':colors.plum}/><Text style={[styles.editorModeText,editorMode==='room'&&styles.editorModeTextActive]}>Room</Text></Pressable></View>
    {editorMode==='avatar'?<>
      <View style={styles.avatarEditorStage}><LinearGradient colors={['#F8E8E5','#F4DDD9','#EAD0CC']} style={StyleSheet.absoluteFill}/><Image source={activePose.art} resizeMode="contain" style={styles.avatarEditorPose}/>{equipped.filter(item=>wardrobeArt[item.id]).map(item=><Image key={item.id} source={wardrobeArt[item.id].source} resizeMode="contain" style={[styles.wearableOverlay,wardrobeArt[item.id].style]}/>)}<PlacedArt assets={avatarLayers}/><View style={styles.editorStageLabel}><Text style={styles.editorStageName}>{activeBust.name} · {activePose.name}</Text><Text style={styles.editorStageSub}>{equipped.map(item=>item.name).join(' · ')||'Choose a piece below'}</Text></View></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.editorCategories}>{(['dress','top','bottom','shoes','accessory'] as const).map(value=><Pressable key={value} style={[styles.editorCategory,category===value&&styles.editorCategoryActive]} onPress={()=>setCategory(value)}><Text style={[styles.editorCategoryText,category===value&&styles.editorCategoryTextActive]}>{value==='dress'?'Clothes':value==='top'?'Layers':value==='bottom'?'Bottoms':value}</Text></Pressable>)}</ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} decelerationRate="fast" contentContainerStyle={styles.itemCarousel}>{categoryItems.map(item=>{const art=wardrobeArt[item.id];return <Pressable key={item.id} style={[styles.clothingCard,item.equipped&&styles.clothingCardActive]} onPress={()=>item.owned?equipItem(item.id):!item.unlock&&student.coins>=item.price?buyItem(item.id):undefined}><View style={styles.clothingThumb}>{art?<Image source={art.source} resizeMode="contain" style={styles.clothingThumbImage}/>:<View style={[styles.clothingSwatch,{backgroundColor:item.color}]}/>}</View><Text numberOfLines={2} style={styles.clothingName}>{item.name}</Text><Text style={styles.clothingMeta}>{item.equipped?'Wearing':item.owned?'Tap to wear':item.unlock?'Locked':`${item.price} coins`}</Text></Pressable>})}</ScrollView>
      <SectionLabel>Face</SectionLabel><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.itemCarousel}>{avatarBusts.map(bust=><Pressable key={bust.id} onPress={()=>setSelectedAvatarBust(bust.id)} style={[styles.facePick,selectedAvatarBust===bust.id&&styles.clothingCardActive]}><Image source={bust.art} resizeMode="contain" style={styles.facePickImage}/><Text style={styles.clothingName}>{bust.name}</Text></Pressable>)}</ScrollView>
      <SectionLabel>Pose</SectionLabel><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.itemCarousel}>{balletPoses.map(pose=><Pressable key={pose.id} onPress={()=>setSelectedPose(pose.id)} style={[styles.posePick,selectedPose===pose.id&&styles.clothingCardActive]}><Image source={pose.art} resizeMode="contain" style={styles.posePickImage}/><Text style={styles.clothingName}>{pose.name}</Text></Pressable>)}</ScrollView>
      <View style={styles.editorActions}><Pressable style={styles.softEditorButton} onPress={()=>navigation.navigate('ArtPortal')}><Ionicons name="add-circle-outline" size={18} color={colors.plum}/><Text style={styles.softEditorButtonText}>Add my own clothing/art</Text></Pressable><Pressable style={styles.softEditorButton} onPress={saveCurrentLook}><Ionicons name="bookmark-outline" size={18} color={colors.plum}/><Text style={styles.softEditorButtonText}>Save this look</Text></Pressable></View>
      {savedLooks.length>0&&<><SectionLabel>Saved Looks</SectionLabel><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.savedLookRow}>{savedLooks.map(look=><Pressable key={look.id} style={styles.savedLookCard} onPress={()=>wearSavedLook(look.id)} onLongPress={()=>removeSavedLook(look.id)}><Ionicons name="sparkles-outline" size={18} color={colors.gold}/><Text style={styles.savedLookName}>{look.name}</Text><Text style={styles.small}>Tap wear · hold delete</Text></Pressable>)}</ScrollView></>}
    </>:<>
      <View style={styles.roomEditorStage}><Image source={locationArt.dorm} resizeMode="cover" style={StyleSheet.absoluteFill}/><PlacedArt assets={roomDecor}/>{roomDecor.length===0&&<View style={styles.roomEditorEmpty}><Ionicons name="bed-outline" size={30} color={colors.gold}/><Text style={styles.body}>Your empty dorm is ready for furniture.</Text></View>}</View>
      <View style={styles.editorActions}><Pressable style={styles.softEditorButton} onPress={()=>navigation.navigate('ArtPortal')}><Ionicons name="add-circle-outline" size={18} color={colors.plum}/><Text style={styles.softEditorButtonText}>Add furniture or tiny object</Text></Pressable></View>
      <SectionLabel action={`${roomDecor.length}`}>My Room Pieces</SectionLabel>{roomDecor.length?<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.itemCarousel}>{roomDecor.map(asset=><Pressable key={asset.id} style={[styles.decorCard,selectedDecor?.id===asset.id&&styles.clothingCardActive]} onPress={()=>setSelectedDecorId(asset.id)}><Image source={{uri:asset.uri}} resizeMode="contain" style={styles.decorThumb}/><Text numberOfLines={2} style={styles.clothingName}>{asset.name}</Text><Pressable style={styles.visibilityTap} onPress={()=>updateCustomArt(asset.id,{enabled:!asset.enabled})}><Ionicons name={asset.enabled?'eye':'eye-off'} size={16} color={asset.enabled?colors.sage:colors.muted}/></Pressable></Pressable>)}</ScrollView>:<PaperCard><Text style={styles.body}>Add your first furniture PNG and it will appear here as a simple tap-to-select object.</Text></PaperCard>}
      {selectedDecor&&<PaperCard style={styles.positionCard}><View style={styles.rowBetween}><View><Text style={styles.itemTitle}>{selectedDecor.name}</Text><Text style={styles.small}>Move and resize the selected piece</Text></View><Pressable onPress={()=>updateCustomArt(selectedDecor.id,{x:0,y:0,scale:1})}><Text style={styles.positionReset}>Reset</Text></Pressable></View><View style={styles.positionControls}><View style={styles.directionPad}><Pressable style={[styles.directionButton,styles.directionUp]} onPress={()=>nudgeDecor('y',-2)}><Ionicons name="chevron-up" size={20} color={colors.plum}/></Pressable><Pressable style={[styles.directionButton,styles.directionLeft]} onPress={()=>nudgeDecor('x',-2)}><Ionicons name="chevron-back" size={20} color={colors.plum}/></Pressable><View style={styles.directionCenter}/><Pressable style={[styles.directionButton,styles.directionRight]} onPress={()=>nudgeDecor('x',2)}><Ionicons name="chevron-forward" size={20} color={colors.plum}/></Pressable><Pressable style={[styles.directionButton,styles.directionDown]} onPress={()=>nudgeDecor('y',2)}><Ionicons name="chevron-down" size={20} color={colors.plum}/></Pressable></View><View style={styles.scaleControls}><Pressable style={styles.scaleButton} onPress={()=>nudgeDecor('scale',-.04)}><Ionicons name="remove" size={22} color={colors.plum}/><Text style={styles.scaleText}>Smaller</Text></Pressable><Pressable style={styles.scaleButton} onPress={()=>nudgeDecor('scale',.04)}><Ionicons name="add" size={22} color={colors.plum}/><Text style={styles.scaleText}>Bigger</Text></Pressable></View></View></PaperCard>}
    </>}
  </Page>;
}
function ProgressScreen() {
  const { student, stats, sessions, tasks } = useAcademyStore();
  const statLabels: Record<string,string> = { ballet:'Ballet Technique', strength:'Strength', flexibility:'Flexibility', academics:'Academics', french:'French', wellbeing:'Wellbeing' };
  return <Page><TopWallet/><ScreenTitle eyebrow="Student Record" title="Your Progress" subtitle="Every activity feeds a visible record; no mysterious points disappearing into the wallpaper."/><LocationHero source={locationArt.studio} title="The Practice Record" subtitle="Your completed work becomes part of the academy record."/>
    <PaperCard><View style={styles.levelRow}><View><Text style={styles.script}>Academy Level</Text><Text style={styles.bigNumber}>{student.level}</Text></View><View style={styles.flex}><Text style={styles.itemTitle}>{student.xp % 150} / 150 XP to next level</Text><ProgressBar value={student.xp % 150} max={150}/><Text style={styles.small}>{tasks.filter(t=>t.completed).length} tasks completed · {sessions.length} focus sessions</Text></View></View></PaperCard>
    <SectionLabel>Development Areas</SectionLabel>
    <PaperCard>{Object.entries(stats).map(([key,value]) => <View key={key} style={styles.stat}><View style={styles.rowBetween}><Text style={styles.statName}>{statLabels[key]}</Text><Text style={styles.statValue}>{value}</Text></View><ProgressBar value={value} color={key==='french'?colors.sage:key==='academics'?'#8B789A':colors.rose}/></View>)}</PaperCard>
    <SectionLabel>Recent Practice Log</SectionLabel>
    {sessions.length === 0 ? <PaperCard><Text style={styles.body}>Finish a “Do It With Me” session and it will appear here with its duration, activity, and XP.</Text></PaperCard> : sessions.slice(0,5).map(s=><PaperCard key={s.id} style={styles.listCard}><Text style={styles.itemTitle}>{s.title}</Text><Text style={styles.small}>{s.minutes} minutes · +{s.xp} XP · {new Date(s.completedAt).toLocaleDateString()}</Text></PaperCard>)}
  </Page>;
}

function FocusScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList,'Focus'>) {
  const activity = learningActivities.find(a=>a.id===route.params.activityId) ?? learningActivities[0];
  const totalSeconds=activity.minutes*60;
  const [seconds, setSeconds] = useState(totalSeconds); const [running,setRunning]=useState(false); const [goal,setGoal]=useState(''); const [customSteps,setCustomSteps]=useState(''); const [reflection,setReflection]=useState('');
  const finishSession=useAcademyStore(s=>s.finishSession);
  const addJournalEntry=useAcademyStore(s=>s.addJournalEntry);
  const selectedPose=useAcademyStore(s=>s.selectedPose);
  const practicePoseId=activity.kind==='practice'?(activity.title.toLowerCase().includes('jump')?'jete':activity.title.toLowerCase().includes('arabesque')?'arabesque':activity.title.toLowerCase().includes('attitude')?'attitude':activity.title.toLowerCase().includes('tendu')?'tendu':'fifth'):selectedPose;
  const practicePose=balletPoses.find(p=>p.id===practicePoseId) ?? balletPoses[0];
  useEffect(()=>{ if(seconds<=0){setRunning(false);return;} if(!running)return; const id=setInterval(()=>setSeconds(v=>Math.max(0,v-1)),1000); return()=>clearInterval(id); },[running,seconds]);
  const complete=()=>{if(seconds>0){Alert.alert('Session still in progress','Finish the timer before claiming your session reward.');return;}const now=new Date();const sessionId=`session-${now.getTime()}`;finishSession({id:sessionId,kind:activity.kind,title:activity.title,minutes:activity.minutes,completedAt:now.toISOString(),xp:activity.minutes,goal:goal.trim()||undefined,customSteps:customSteps.trim()||undefined},activity.stat);if(reflection.trim())addJournalEntry({id:`journal-${now.getTime()}`,title:`${activity.title} Reflection`,content:reflection.trim(),entryDate:dateKey(now),createdAt:now.toISOString(),updatedAt:now.toISOString(),mood:'neutral',template:activity.kind==='practice'?'practice-log':'class-reflection',tags:[activity.kind,'session'],favorite:false,private:true,sessionId});Alert.alert('Session complete',`You earned ${activity.minutes} XP and ${Math.ceil(activity.minutes/2)} coins.${reflection.trim()?' Your reflection was saved.':''}`); navigation.goBack(); };
  const mins=Math.floor(seconds/60).toString().padStart(2,'0'), secs=(seconds%60).toString().padStart(2,'0');
  return <SafeAreaView style={styles.focusSafe}><LinearGradient colors={['#F7DDE6','#E9B9C7','#B97B89']} style={StyleSheet.absoluteFill}/><ScrollView contentContainerStyle={styles.focusPage}><Pressable onPress={()=>navigation.goBack()}><Ionicons name="chevron-back" size={28} color={colors.plum}/></Pressable><Text style={styles.focusEyebrow}>DO IT WITH ME</Text><Text style={styles.focusTitle}>{activity.title}</Text><Text style={styles.focusSub}>{activity.subtitle}</Text>
    {activity.kind === 'practice' ? <ImageBackground source={locationArt.studio} style={styles.characterScene} imageStyle={styles.locationImage}><LinearGradient colors={['transparent','rgba(44,30,36,.7)']} style={StyleSheet.absoluteFill}/><Image source={practicePose.art} resizeMode="contain" style={styles.focusPose}/><View style={styles.practiceCue}><Text style={styles.practiceCueTitle}>{practicePose.name}</Text><Text style={styles.practiceCueText}>Your character practices beside you.</Text></View></ImageBackground> : <View style={styles.characterScene}><View style={styles.window}><Text style={styles.moon}>☾</Text></View><View style={styles.desk}/><Image source={(balletPoses.find(p=>p.id===selectedPose) ?? balletPoses[0]).art} resizeMode="contain" style={styles.studyPose}/><Text style={styles.sceneCaption}>Your character is working beside you.</Text></View>}
    <TextInput value={goal} onChangeText={setGoal} placeholder="What will you finish?" placeholderTextColor="#A9989A" style={styles.goal}/>{activity.kind==='custom'&&<TextInput value={customSteps} onChangeText={setCustomSteps} multiline placeholder="Make your own steps, notes, or tiny checklist." placeholderTextColor="#A9989A" style={[styles.goal,styles.customGoal]}/>}<Text style={styles.timer}>{mins}:{secs}</Text><ProgressBar value={totalSeconds-seconds} max={totalSeconds}/><Text style={styles.timerStatus}>{seconds===0?'Ready to complete':running?'Session in progress':'Press Begin when you are ready'}</Text><Pressable disabled={seconds===0} style={[styles.timerButton,seconds===0&&styles.timerButtonDone]} onPress={()=>setRunning(v=>!v)}><Ionicons name={running?'pause':'play'} size={20} color={colors.plum}/><Text style={styles.timerButtonText}>{running?'Pause':seconds===0?'Finished':'Begin'}</Text></Pressable>
    <PaperCard><Text style={styles.itemTitle}>Session steps</Text>{activity.steps.map((step,i)=><Text key={step} style={styles.step}>{i+1}. {step}</Text>)}{!!customSteps.trim()&&<Text style={styles.step}>Your plan: {customSteps.trim()}</Text>}{activity.resource&&<Pressable onPress={()=>Linking.openURL(activity.resource!.url)}><Text style={styles.link}>{activity.resource.label} ↗</Text></Pressable>}</PaperCard><TextInput value={reflection} onChangeText={setReflection} multiline placeholder="Optional reflection: what felt strong, difficult, or worth remembering?" placeholderTextColor="#A9989A" style={[styles.goal,styles.reflectionInput]}/><GoldButton label="Complete Session" disabled={seconds>0} onPress={complete}/>
  </ScrollView></SafeAreaView>;
}

function SceneScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList,'Scene'>) {
  const scene=useAcademyStore(s=>s.story.find(x=>x.id===route.params.sceneId)) as StoryScene | undefined; const complete=useAcademyStore(s=>s.completeScene); const relationships=useAcademyStore(s=>s.relationships); const wardrobe=useAcademyStore(s=>s.wardrobe); const customArt=useAcademyStore(s=>s.customArt); const [line,setLine]=useState(0); const [choiceId,setChoiceId]=useState<string|null>(null); const [responseLine,setResponseLine]=useState(0);
  if(!scene)return <Page><Text style={styles.itemTitle}>Scene not found.</Text><GoldButton label="Return to Story" onPress={()=>navigation.goBack()}/></Page>;
  const lines=scene.lines.length ? scene.lines : [{speaker:'Narrator',text:scene.summary || 'This chronicle entry is sealed.'}];
  const choice=scene.choices?.find(option=>option.id===choiceId);
  const inResponse=!!choiceId&&!!choice?.response?.length;
  const current=inResponse?choice!.response![Math.min(responseLine,choice!.response!.length-1)]:lines[Math.min(line,lines.length-1)];
  const speakingNPC=relationships.find(npc=>current.speaker.toLowerCase().includes(npc.name.split(' ')[0].toLowerCase()));
  const isPlayer=current.speaker.toLowerCase()==='you'||current.speaker.toLowerCase().includes('grace');
  const expressionArt=customArt.filter(asset=>asset.enabled&&((speakingNPC&&asset.category==='npc'&&asset.targetId===speakingNPC.id)||(isPlayer&&asset.category==='avatar'&&asset.targetId==='player'&&(!asset.itemId||wardrobe.some(item=>item.id===asset.itemId&&item.equipped))))&&(asset.variant===(current.expression??'neutral')||asset.variant==='neutral'||asset.layer==='portrait'||(isPlayer&&!['expression','face'].includes(asset.layer)))).sort((a,b)=>(a.zIndex+artLayerOrder[a.layer])-(b.zIndex+artLayerOrder[b.layer]));
  const finish=()=>{complete(scene.id,choiceId??undefined);navigation.goBack();};
  const advance=()=>{if(inResponse){if(responseLine<(choice?.response?.length??1)-1)setResponseLine(responseLine+1);else finish();}else if(line<lines.length-1)setLine(line+1);else if(!scene.choices?.length)finish();};
  const choosing=!inResponse&&line===lines.length-1&&!!scene.choices?.length;
  return <SafeAreaView style={styles.sceneSafe}><LinearGradient colors={['#ECDAD5','#F8F0E7','#D8C09B']} style={StyleSheet.absoluteFill}/><View style={styles.sceneArt}><Text style={styles.chandelier}>♕</Text><Text style={styles.scenePlace}>{scene.locationId?.replace(/([A-Z])/g,' $1').toUpperCase() ?? 'ROYAL BALLET ACADEMY'}</Text><Text style={styles.sceneTitle}>{scene.title}</Text>{scene.castIds?.length?<Text style={styles.sceneCast}>{scene.castIds.map(id=>relationships.find(r=>r.id===id)?.name).filter(Boolean).join(' · ')}</Text>:null}{expressionArt.length>0&&<View style={styles.scenePortrait}><PlacedArt assets={expressionArt}/></View>}</View><View style={styles.dialogue}><Text style={styles.speaker}>{current.speaker}</Text><Text style={styles.dialogueText}>{current.text}</Text>{choosing?<View style={styles.choiceList}>{scene.choices!.map(option=><Pressable key={option.id} style={styles.storyChoice} onPress={()=>{setChoiceId(option.id);setResponseLine(0);if(!option.response?.length){complete(scene.id,option.id);navigation.goBack();}}}><Ionicons name="rose-outline" size={17} color={colors.gold}/><Text style={styles.storyChoiceText}>{option.label}</Text><Ionicons name="chevron-forward" size={16} color={colors.rose}/></Pressable>)}</View>:<GoldButton label={inResponse&&responseLine===(choice?.response?.length??1)-1?'Complete Scene':line < lines.length-1||inResponse?'Continue':scene.status==='complete'?'Close':'Complete Scene'} onPress={advance}/>}<Text style={styles.lineCount}>{inResponse?'Your choice':`${Math.min(line+1,lines.length)} / ${lines.length}`}</Text></View></SafeAreaView>;
}

function BookLibraryScreen({navigation}:NativeStackScreenProps<RootStackParamList,'BookLibrary'>) {
  const {books,addBook,removeBook}=useAcademyStore();
  const importBook=async()=>{
    try {
      const result=await DocumentPicker.getDocumentAsync({type:['text/plain','text/markdown'],copyToCacheDirectory:true,multiple:false});
      if(result.canceled)return;
      const asset=result.assets[0];
      if((asset.size??0)>1_500_000){Alert.alert('Book too large','For this local version, choose a plain-text or Markdown file under 1.5 MB.');return;}
      const content=await new File(asset.uri).text();
      if(!content.trim()){Alert.alert('Empty book','That file does not contain readable text.');return;}
      const title=asset.name.replace(/\.(txt|md|markdown)$/i,'').replace(/[-_]+/g,' ');
      addBook({id:`book-${Date.now()}`,title,content,importedAt:new Date().toISOString(),lastPosition:0,wordCount:content.trim().split(/\s+/).length});
    } catch(error){Alert.alert('Could not import book',error instanceof Error?error.message:'Try a .txt or .md file.');}
  };
  const confirmRemove=(id:string,title:string)=>Alert.alert('Remove book?',`Remove “${title}” from your academy shelf?`,[{text:'Cancel',style:'cancel'},{text:'Remove',style:'destructive',onPress:()=>removeBook(id)}]);
  return <Page><View style={styles.readerTop}><Pressable style={styles.paperBack} onPress={()=>navigation.goBack()}><Ionicons name="chevron-back" size={23} color={colors.plum}/></Pressable><Pill tone="gold">MY SHELF</Pill></View><ScreenTitle eyebrow="Academy Library" title="My Books" subtitle="Import actual text files and read them inside the academy. Books and reading position stay saved on this device."/><LocationHero source={locationArt.library} title="Your Private Shelf" subtitle="Plain-text and Markdown books are supported."/><GoldButton label="Import a .txt or .md Book" onPress={importBook}/><SectionLabel action={`${books.length} books`}>Saved Books</SectionLabel>{books.length===0?<PaperCard><Text style={styles.itemTitle}>Your shelf is waiting</Text><Text style={styles.body}>Export or save any writing as a .txt or .md file, then import it here. The full text becomes a readable academy book.</Text></PaperCard>:books.map(book=><Pressable key={book.id} onPress={()=>navigation.navigate('BookReader',{bookId:book.id})} onLongPress={()=>confirmRemove(book.id,book.title)}><PaperCard style={styles.listCard}><View style={styles.row}><View style={styles.bookCover}><Ionicons name="book" size={25} color={colors.goldPale}/></View><View style={styles.flex}><Text style={styles.itemTitle}>{book.title}</Text><Text style={styles.small}>{book.wordCount.toLocaleString()} words · imported {new Date(book.importedAt).toLocaleDateString()}</Text><Text style={styles.bookHint}>Tap to read · hold to remove</Text></View><Ionicons name="chevron-forward" size={19} color={colors.rose}/></View></PaperCard></Pressable>)}</Page>;
}

function BookReaderScreen({route,navigation}:NativeStackScreenProps<RootStackParamList,'BookReader'>) {
  const book=useAcademyStore(s=>s.books.find(b=>b.id===route.params.bookId));
  const updatePosition=useAcademyStore(s=>s.updateBookPosition);
  const [fontSize,setFontSize]=useState(18);
  if(!book)return <Page><Text style={styles.itemTitle}>This book is no longer on your shelf.</Text><GoldButton label="Return to Library" onPress={()=>navigation.goBack()}/></Page>;
  return <SafeAreaView style={styles.readerSafe}><View style={styles.readerHeader}><Pressable onPress={()=>navigation.goBack()}><Ionicons name="chevron-back" size={26} color={colors.plum}/></Pressable><View style={styles.readerHeading}><Text numberOfLines={1} style={styles.readerTitle}>{book.title}</Text><Text style={styles.readerMeta}>{book.wordCount.toLocaleString()} words</Text></View><View style={styles.fontButtons}><Pressable onPress={()=>setFontSize(v=>Math.max(14,v-2))}><Text style={styles.fontSmall}>A</Text></Pressable><Pressable onPress={()=>setFontSize(v=>Math.min(28,v+2))}><Text style={styles.fontLarge}>A</Text></Pressable></View></View><ScrollView contentOffset={{x:0,y:book.lastPosition}} onScroll={e=>updatePosition(book.id,e.nativeEvent.contentOffset.y)} scrollEventThrottle={1000} contentContainerStyle={styles.bookPage}><Text style={styles.bookOrnament}>❦</Text><Text style={[styles.bookText,{fontSize,lineHeight:fontSize*1.62}]}>{book.content}</Text><Text style={styles.bookOrnament}>❦</Text></ScrollView></SafeAreaView>;
}

function KnownNpcFacts({npc,knowledge}:{npc:Relationship;knowledge:string[]}) {
  const todayKey=localDateKey();
  const scheduleKnown=knowledge.includes(`schedule:${todayKey}`);
  const favoritesKnown=knowledge.includes('favorites');
  return <>{scheduleKnown&&<View style={styles.knownFacts}><Text style={styles.knownFactsTitle}>Today’s known schedule</Text>{npcScheduleFor(npc.id,new Date()).map(block=><Text key={`${block.start}-${block.locationId}`} style={styles.knownFactText}>{String(block.start).padStart(2,'0')}:00–{String(block.end).padStart(2,'0')}:00 · {coreLocations[block.locationId as LocationId]?.title??block.locationId}</Text>)}</View>}{favoritesKnown&&<View style={styles.knownFacts}><Text style={styles.knownFactsTitle}>Favorite things they mentioned</Text><Text style={styles.knownFactText}>{npc.likes?.join(' · ')??'They have not listed any favorites yet.'}</Text></View>}</>;
}

function RelationshipsScreen({navigation}:any) { const relationships=useAcademyStore(s=>s.relationships); const story=useAcademyStore(s=>s.story); const customArt=useAcademyStore(s=>s.customArt); const npcKnowledge=useAcademyStore(s=>s.npcKnowledge); return <Page><ScreenTitle eyebrow="Letters & Company" title="Academy Cast" subtitle="NPCs follow their own routines, appear in location-triggered scenes, and remember important choices."/><LocationHero source={locationArt.commonRoom} title="Dormitory Common Room" subtitle="Friendships, rivalries, letters, and quiet conversations gather here."/><GoldButton label="Open Artwork Assignment Portal" onPress={()=>navigation.navigate('ArtPortal')}/>{relationships.map(r=>{const available=story.filter(scene=>scene.castIds?.includes(r.id)&&scene.status==='available');const portraits=customArt.filter(asset=>asset.category==='npc'&&asset.targetId===r.id&&asset.enabled&&(asset.layer==='portrait'||asset.variant==='neutral'));return <PaperCard key={r.id} style={[styles.npcCard,{borderLeftColor:r.color}]}><View style={styles.row}><View style={[styles.portrait,{backgroundColor:r.color}]}>{portraits.length?<PlacedArt assets={portraits}/>:<Text style={styles.portraitText}>{r.initials??r.name.split(' ').map(part=>part[0]).slice(0,2).join('')}</Text>}</View><View style={styles.flex}><View style={styles.storyTitleRow}><Text style={styles.itemTitle}>{r.name}</Text>{available.length>0&&<Pill tone="gold">{available.length} event{available.length===1?'':'s'}</Pill>}</View><Text style={styles.small}>{r.role}{r.year?` · ${r.year}`:''} · Level {r.level}</Text><ProgressBar value={r.points%100} color={r.color}/></View></View><Text style={styles.npcPersonality}>{r.personality}</Text><Text style={styles.body}>{r.note}</Text><View style={styles.npcLocation}><Ionicons name="location-outline" size={15} color={r.color}/><Text style={styles.npcLocationText}>{r.scheduleHint}</Text></View><KnownNpcFacts npc={r} knowledge={npcKnowledge[r.id]??[]}/><Pressable style={styles.npcTalkButton} onPress={()=>navigation.navigate('Conversation',{npcId:r.id})}><Ionicons name="chatbubble-ellipses-outline" size={17} color={colors.rose}/><Text style={styles.npcTalkText}>Talk to {r.name.split(' ')[0]}</Text></Pressable>{available.map(scene=><Pressable key={scene.id} style={styles.npcEvent} onPress={()=>navigation.navigate('Scene',{sceneId:scene.id})}><Ionicons name={scene.letterFrom?'mail-outline':'sparkles-outline'} size={16} color={colors.gold}/><View style={styles.flex}><Text style={styles.npcEventTitle}>{scene.title}</Text><Text style={styles.small}>{scene.locationId?.replace(/([A-Z])/g,' $1') ?? 'Academy'}</Text></View><Ionicons name="chevron-forward" size={16} color={colors.rose}/></Pressable>)}</PaperCard>})}</Page>; }

function ConversationScreen({route,navigation}:NativeStackScreenProps<RootStackParamList,'Conversation'>) {
  const npc=useAcademyStore(state=>state.relationships.find(relationship=>relationship.id===route.params.npcId));
  const dailyNpcSceneHistory=useAcademyStore(state=>state.dailyNpcSceneHistory);
  const recordDailyNpcScene=useAcademyStore(state=>state.recordDailyNpcScene);
  const recordDailyNpcChoice=useAcademyStore(state=>state.recordDailyNpcChoice);
  const npcKnowledge=useAcademyStore(state=>state.npcKnowledge);
  const unlockNpcKnowledge=useAcademyStore(state=>state.unlockNpcKnowledge);
  const [topic,setTopic]=useState<ConversationTopic>('academy');
  const [lines,setLines]=useState<string[]>([]);
  const [sceneResponse,setSceneResponse]=useState<string|null>(null);
  const todayKey=localDateKey();
  const dailyScene=useMemo(()=>npc?dailyNpcScene(npc,new Date(),dailyNpcSceneHistory[npc.id]??[]):null,[npc,dailyNpcSceneHistory,todayKey]);
  useEffect(()=>{if(npc&&dailyScene)recordDailyNpcScene(npc.id,todayKey,dailyScene.id);},[npc,dailyScene,recordDailyNpcScene,todayKey]);
  if(!npc||!dailyScene)return <Page><Text style={styles.itemTitle}>That conversation could not be found.</Text><GoldButton label="Return to Cast" onPress={()=>navigation.goBack()}/></Page>;
  const topics:[ConversationTopic,string,string][]=[['academy','Academy life','Ask what they have noticed today.'],['practice','Practice','Talk about the work without opening a formal scene.'],['personal','Something personal','Make room for a quieter answer.']];
  const chosenLabel=dailyNpcSceneHistory[npc.id]?.find(entry=>entry.date===todayKey&&entry.sceneId===dailyScene.id)?.choiceLabel;
  const chosenChoice=dailyScene.choices.find(choice=>choice.label===chosenLabel);
  const chooseDailyScene=(choice:{label:string;response:string})=>{setSceneResponse(choice.response);recordDailyNpcChoice(npc.id,todayKey,dailyScene.id,choice.label,6);};
  const scheduleKnowledgeKey=`schedule:${todayKey}`;
  const scheduleKnown=npcKnowledge[npc.id]?.includes(scheduleKnowledgeKey);
  const favoritesKnown=npcKnowledge[npc.id]?.includes('favorites');
  const askSchedule=()=>{unlockNpcKnowledge(npc.id,scheduleKnowledgeKey);setSceneResponse(`${npc.name.split(' ')[0]}: Today I am around ${npcScheduleFor(npc.id,new Date()).map(block=>coreLocations[block.locationId as LocationId]?.title??block.locationId).join(', ')}.`);};
  const askFavorites=()=>{unlockNpcKnowledge(npc.id,'favorites');setSceneResponse(`${npc.name.split(' ')[0]}: I keep returning to ${(npc.likes??['quiet corners and good questions']).join(', ')}.`);};
  const previousChoiceHistory=dailyNpcSceneHistory[npc.id]?.filter(entry=>entry.date!==todayKey&&entry.choiceLabel).slice(-1)[0]?.choiceLabel;
  const speak=()=>setLines(current=>[...current,generateNpcLine(npc,topic,current.length,new Date(),{favoritesKnown,previousChoice:previousChoiceHistory})]);
  const source=coreLocations[npc.homeLocation as LocationId]?.art??locationArt.commonRoom;
  return <SafeAreaView style={styles.conversationSafe}><ImageBackground source={source} style={StyleSheet.absoluteFill} resizeMode="cover"><LinearGradient colors={['rgba(34,24,29,.08)','rgba(64,34,48,.92)']} style={StyleSheet.absoluteFill}/><View style={styles.conversationTop}><Pressable style={styles.roundBack} onPress={()=>navigation.goBack()}><Ionicons name="chevron-back" size={25} color="white"/></Pressable><Pill tone="gold">FREE CONVERSATION</Pill></View><View style={styles.conversationPanel}><Text style={styles.conversationEyebrow}>{npc.role}</Text><Text style={styles.conversationTitle}>{npc.name}</Text><Text style={styles.conversationSub}>{npc.personality??'A familiar face around the academy.'}</Text><View style={styles.dailySceneCard}><View style={styles.rowBetween}><Text style={styles.dailySceneTitle}>{dailyScene.title}</Text><Pill tone="sage">{dailyScene.fullBeat?'STORY BEAT':'TODAY'}</Pill></View>{dailyScene.lines.map((line,index)=><Text key={`${dailyScene.title}-${index}`} style={styles.dailySceneLine}>{line}</Text>)}{sceneResponse||chosenChoice?<View style={styles.dailySceneResponse}><Text style={styles.dailySceneResponseText}>{sceneResponse??chosenChoice?.response}</Text></View>:<View style={styles.dailySceneChoices}>{dailyScene.choices.map(choice=><Pressable key={choice.label} style={styles.dailySceneChoice} onPress={()=>chooseDailyScene(choice)}><Text style={styles.dailySceneChoiceText}>{choice.label}</Text><Ionicons name="chevron-forward" size={15} color={colors.rose}/></Pressable>)}</View>}</View><View style={styles.npcQuestions}><Text style={styles.npcQuestionsLabel}>Learn about {npc.name.split(' ')[0]}</Text><View style={styles.npcQuestionRow}>{!scheduleKnown&&<Pressable style={styles.npcQuestion} onPress={askSchedule}><Ionicons name="calendar-outline" size={16} color={colors.rose}/><Text style={styles.npcQuestionText}>When are your classes today?</Text></Pressable>}{!favoritesKnown&&<Pressable style={styles.npcQuestion} onPress={askFavorites}><Ionicons name="heart-outline" size={16} color={colors.rose}/><Text style={styles.npcQuestionText}>What is your favorite thing?</Text></Pressable>}</View></View><ScrollView style={styles.conversationLines} contentContainerStyle={styles.conversationLinesContent}>{lines.length===0?<Text style={styles.conversationEmpty}>Choose a topic below for an open conversation after today’s moment.</Text>:lines.map((line,index)=><View key={`${line}-${index}`} style={styles.conversationLine}><Text style={styles.conversationLineText}>{line}</Text></View>)}</ScrollView><View style={styles.conversationTopics}>{topics.map(([value,label,description])=><Pressable key={value} accessibilityRole="button" accessibilityState={{selected:topic===value}} style={[styles.conversationTopic,topic===value&&styles.conversationTopicActive]} onPress={()=>setTopic(value)}><Text style={[styles.conversationTopicLabel,topic===value&&styles.conversationTopicLabelActive]}>{label}</Text><Text style={[styles.conversationTopicDescription,topic===value&&styles.conversationTopicDescriptionActive]}>{description}</Text></Pressable>)}</View><GoldButton label="Say something" onPress={speak}/><Text style={styles.conversationNote}>Daily scenes and free conversation now affect relationship memory once per day.</Text></View></ImageBackground></SafeAreaView>;
}

function ArtPortalScreen({navigation}:NativeStackScreenProps<RootStackParamList,'ArtPortal'>) {
  const {customArt,relationships,wardrobe,addCustomArt,updateCustomArt,deleteCustomArt}=useAcademyStore();
  const [category,setCategory]=useState<ArtCategory>('npc');
  const [targetId,setTargetId]=useState('r1');
  const [variant,setVariant]=useState('neutral');
  const [layer,setLayer]=useState<ArtLayer>('portrait');
  const [name,setName]=useState('');
  const [itemId,setItemId]=useState('');
  const targets=category==='npc'?relationships.map(r=>({id:r.id,label:r.name})):category==='avatar'?[{id:'player',label:'Player Avatar'}]:category==='furniture'?[{id:'dorm',label:'Dorm Room'}]:Object.keys(coreLocations).map(id=>({id,label:coreLocations[id as LocationId].title}));
  useEffect(()=>{const first=targets[0]?.id;if(first&&!targets.some(target=>target.id===targetId))setTargetId(first);const layers=artLayersByCategory[category];if(!layers.includes(layer))setLayer(layers[0]);if(category!=='avatar'||(itemId&&(!wardrobe.find(item=>item.id===itemId)?.owned)))setItemId('');},[category]);
  const upload=async()=>{
    try{
      const result=await DocumentPicker.getDocumentAsync({type:'image/*',copyToCacheDirectory:true,multiple:false});
      if(result.canceled)return;
      const picked=result.assets[0];
      const directory=new Directory(Paths.document,'rba-custom-art');directory.create({idempotent:true,intermediates:true});
      const extension=(picked.name.match(/\.[a-zA-Z0-9]+$/)?.[0]??'.png').toLowerCase();
      const destination=new File(directory,`${Date.now()}-${Math.random().toString(36).slice(2,7)}${extension}`);
      await new File(picked.uri).copy(destination,{overwrite:true});
      addCustomArt({id:`art-${Date.now()}`,name:name.trim()||picked.name.replace(/\.[^.]+$/,''),uri:destination.uri,category,targetId,itemId:category==='avatar'?itemId||undefined:undefined,variant:variant.trim().toLowerCase()||'neutral',layer,zIndex:0,x:0,y:0,scale:1,opacity:1,enabled:true,createdAt:new Date().toISOString()});
      setName('');Alert.alert('Artwork assigned',`Saved as ${targets.find(target=>target.id===targetId)?.label ?? targetId} · ${variant || 'neutral'} · ${layer}.`);
    }catch(error){Alert.alert('Could not import artwork',error instanceof Error?error.message:'Choose a PNG, JPEG, or WebP image.');}
  };
  const shown=customArt.filter(asset=>asset.category===category);
  const preview=customArt.filter(asset=>asset.category===category&&asset.targetId===targetId);
  const nudge=(asset:CustomArtAsset,key:'x'|'y'|'scale'|'zIndex'|'opacity',amount:number)=>{
    const next=(asset[key] as number)+amount;
    const limits:{[key in typeof key]:[number,number]}={x:[-100,100],y:[-100,100],scale:[.1,3],zIndex:[-100,100],opacity:[0,1]};
    const [minimum,maximum]=limits[key];
    updateCustomArt(asset.id,{[key]:Math.round(Math.max(minimum,Math.min(maximum,next))*100)/100});
  };
  const decorIdeas=['Tiny Mirror','Ornate Hairbrush','Sealed Letter','Ribbon Scrap','Perfume Bottle','Tea Cup','Stack of Books','Jewellery Dish','Ballet Shoes','Pressed Rose'];
  return <Page><View style={styles.readerTop}><Pressable style={styles.paperBack} onPress={()=>navigation.goBack()}><Ionicons name="chevron-back" size={23} color={colors.plum}/></Pressable><Pill tone="gold">EDITABLE ART</Pill></View><ScreenTitle eyebrow="Final Art Workshop" title="Artwork Assignment Portal" subtitle="Import transparent PNGs or other images, describe exactly what they are, and assign them to working renderer layers."/>
    <PaperCard style={styles.artHelp}><Text style={styles.itemTitle}>How naming works</Text><Text style={styles.body}>Choose a category and character or room, then type a state such as “mad”, “worried”, “winter”, or “reading”. Dialogue searches for matching NPC expressions; avatar and room art stack in layer order.</Text></PaperCard>
    <SectionLabel>1 · Artwork Type</SectionLabel><View style={styles.choiceWrap}>{(['npc','avatar','furniture','location'] as ArtCategory[]).map(value=><Pressable key={value} style={[styles.choiceChip,category===value&&styles.choiceChipActive]} onPress={()=>setCategory(value)}><Text style={[styles.choiceText,category===value&&styles.choiceTextActive]}>{value}</Text></Pressable>)}</View>
    <SectionLabel>2 · Assign To</SectionLabel><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.artTargetRow}>{targets.map(target=><Pressable key={target.id} style={[styles.artTarget,targetId===target.id&&styles.artTargetActive]} onPress={()=>setTargetId(target.id)}><Text style={[styles.artTargetText,targetId===target.id&&styles.choiceTextActive]}>{target.label}</Text></Pressable>)}</ScrollView>
    {category==='avatar'&&<><SectionLabel>Avatar item (optional)</SectionLabel><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.artTargetRow}><Pressable style={[styles.artTarget,!itemId&&styles.artTargetActive]} onPress={()=>setItemId('')}><Text style={[styles.artTargetText,!itemId&&styles.choiceTextActive]}>General avatar</Text></Pressable>{wardrobe.filter(item=>item.owned).map(item=><Pressable key={item.id} style={[styles.artTarget,itemId===item.id&&styles.artTargetActive]} onPress={()=>setItemId(item.id)}><Text style={[styles.artTargetText,itemId===item.id&&styles.choiceTextActive]}>{item.name}</Text></Pressable>)}</ScrollView></>}
    <SectionLabel>3 · Meaning & Layer</SectionLabel><TextInput value={name} onChangeText={setName} placeholder="Artwork name, e.g. Clara Mad Portrait" placeholderTextColor="#A9989A" style={styles.scheduleInput}/><TextInput value={variant} onChangeText={setVariant} autoCapitalize="none" placeholder="State: neutral, mad, worried, winter…" placeholderTextColor="#A9989A" style={styles.scheduleInput}/><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.artTargetRow}>{artLayersByCategory[category].map(value=><Pressable key={value} style={[styles.artTarget,layer===value&&styles.artTargetActive]} onPress={()=>setLayer(value)}><Text style={[styles.artTargetText,layer===value&&styles.choiceTextActive]}>{value}</Text></Pressable>)}</ScrollView>
    {category==='furniture'&&<><SectionLabel>Tiny Dorm Object Ideas</SectionLabel><View style={styles.choiceWrap}>{decorIdeas.map(idea=><Pressable key={idea} style={styles.decorIdea} onPress={()=>{setName(idea);setVariant(idea.toLowerCase().replace(/\s+/g,'-'));setLayer('foreground');}}><Text style={styles.decorIdeaText}>{idea}</Text></Pressable>)}</View></>}
    <GoldButton label="Choose Image & Assign" onPress={upload}/>
    <SectionLabel action={`${preview.length} layers`}>Live Layer Preview</SectionLabel><View style={styles.artPreview}>{category==='furniture'&&<Image source={locationArt.dorm} resizeMode="cover" style={StyleSheet.absoluteFill}/>}<PlacedArt assets={preview}/>{preview.length===0&&<View style={styles.artEmpty}><Ionicons name="images-outline" size={34} color={colors.gold}/><Text style={styles.body}>Assigned artwork will stack here.</Text></View>}</View>
    <SectionLabel action={`${shown.length} total`}>Manage Uploaded Artwork</SectionLabel>{shown.length===0?<PaperCard><Text style={styles.body}>No {category} art has been uploaded yet.</Text></PaperCard>:shown.map(asset=><PaperCard key={asset.id} style={styles.artAssetCard}><View style={styles.row}><Image source={{uri:asset.uri}} resizeMode="contain" style={styles.artAssetThumb}/><View style={styles.flex}><TextInput value={asset.name} onChangeText={text=>updateCustomArt(asset.id,{name:text})} style={styles.artInlineName}/><Text style={styles.small}>{targets.find(target=>target.id===asset.targetId)?.label??asset.targetId} · {asset.itemId?wardrobe.find(item=>item.id===asset.itemId)?.name??asset.itemId:'General avatar'} · {asset.variant} · {asset.layer}</Text></View><Pressable onPress={()=>updateCustomArt(asset.id,{enabled:!asset.enabled})}><Ionicons name={asset.enabled?'eye':'eye-off'} size={20} color={asset.enabled?colors.sage:colors.muted}/></Pressable></View><View style={styles.artControls}><View style={styles.artControlGroup}><Text style={styles.artControlLabel}>Horizontal {asset.x}</Text><View style={styles.artButtons}><Pressable style={styles.artMiniButton} onPress={()=>nudge(asset,'x',-2)}><Text>−</Text></Pressable><Pressable style={styles.artMiniButton} onPress={()=>nudge(asset,'x',2)}><Text>+</Text></Pressable></View></View><View style={styles.artControlGroup}><Text style={styles.artControlLabel}>Vertical {asset.y}</Text><View style={styles.artButtons}><Pressable style={styles.artMiniButton} onPress={()=>nudge(asset,'y',-2)}><Text>−</Text></Pressable><Pressable style={styles.artMiniButton} onPress={()=>nudge(asset,'y',2)}><Text>+</Text></Pressable></View></View><View style={styles.artControlGroup}><Text style={styles.artControlLabel}>Scale {asset.scale}</Text><View style={styles.artButtons}><Pressable style={styles.artMiniButton} onPress={()=>nudge(asset,'scale',-.02)}><Text>−</Text></Pressable><Pressable style={styles.artMiniButton} onPress={()=>nudge(asset,'scale',.02)}><Text>+</Text></Pressable></View></View><View style={styles.artControlGroup}><Text style={styles.artControlLabel}>Depth {asset.zIndex}</Text><View style={styles.artButtons}><Pressable style={styles.artMiniButton} onPress={()=>nudge(asset,'zIndex',-1)}><Text>−</Text></Pressable><Pressable style={styles.artMiniButton} onPress={()=>nudge(asset,'zIndex',1)}><Text>+</Text></Pressable></View></View></View><View style={styles.artUtilityRow}><Pressable style={styles.artReset} onPress={()=>updateCustomArt(asset.id,{x:0,y:0,scale:1,zIndex:0,opacity:1})}><Ionicons name="locate-outline" size={16} color={colors.plum}/><Text style={styles.artResetText}>Center & reset size</Text></Pressable></View><Pressable style={styles.artDelete} onPress={()=>Alert.alert('Remove artwork?',`Remove ${asset.name} from the app?`,[{text:'Cancel',style:'cancel'},{text:'Remove',style:'destructive',onPress:()=>deleteCustomArt(asset.id)}])}><Ionicons name="trash-outline" size={16} color={colors.rose}/><Text style={styles.artDeleteText}>Remove assignment</Text></Pressable></PaperCard>)}
  </Page>;
}

const journalTemplates:{id:JournalTemplate;label:string;prompt:string}[]=[
  {id:'free',label:'Free Writing',prompt:'Write whatever belongs on this page.'},
  {id:'class-reflection',label:'Class Reflection',prompt:'What happened, what felt strong, and what needs attention?'},
  {id:'practice-log',label:'Practice Log',prompt:'Record the work honestly: exercises, effort, discoveries, and limits.'},
  {id:'story-reflection',label:'Story Reflection',prompt:'What changed, and how did this academy moment feel?'},
  {id:'gratitude',label:'Gratitude Page',prompt:'Record a few specific things worth keeping from today.'},
  {id:'weekly-review',label:'Weekly Review',prompt:'What moved forward this week, and what matters next?'},
  {id:'french-vocabulary',label:'French Vocabulary',prompt:'Collect words, meanings, examples, and questions.'},
  {id:'dream-idea',label:'Dream or Idea',prompt:'Capture the idea before it escapes.'},
];
const journalMoods:JournalMood[]=['calm','proud','tired','hopeful','frustrated','excited','neutral'];
const noteHighlights=['#FFFDF8','#F8DCE5','#F5E8B8','#DCEBD9','#DDE5F3','#E8DDF1'];

function JournalScreen() {
  const {journalEntries,notebooks,studyNotes,addJournalEntry,updateJournalEntry,deleteJournalEntry,addNotebook,deleteNotebook,addStudyNote,updateStudyNote,deleteStudyNote}=useAcademyStore();
  const [section,setSection]=useState<'journal'|'notes'>('journal');
  const [search,setSearch]=useState('');
  const [journalEditor,setJournalEditor]=useState(false); const [journalId,setJournalId]=useState<string|null>(null);
  const [journalTitle,setJournalTitle]=useState(''); const [journalContent,setJournalContent]=useState(''); const [journalDate,setJournalDate]=useState(dateKey(new Date()));
  const [journalMood,setJournalMood]=useState<JournalMood>('neutral'); const [journalTemplate,setJournalTemplate]=useState<JournalTemplate>('free'); const [journalTags,setJournalTags]=useState('');
  const [journalFavorite,setJournalFavorite]=useState(false); const [journalPrivate,setJournalPrivate]=useState(true);
  const [selectedNotebook,setSelectedNotebook]=useState(notebooks[0]?.id??''); const [newNotebookName,setNewNotebookName]=useState('');
  const [noteEditor,setNoteEditor]=useState(false); const [noteId,setNoteId]=useState<string|null>(null); const [noteTitle,setNoteTitle]=useState(''); const [noteContent,setNoteContent]=useState('');
  const [noteTags,setNoteTags]=useState(''); const [notePinned,setNotePinned]=useState(false); const [noteHighlight,setNoteHighlight]=useState(noteHighlights[0]); const [checklist,setChecklist]=useState<{id:string;text:string;completed:boolean}[]>([]);
  useEffect(()=>{if(!notebooks.length){if(selectedNotebook)setSelectedNotebook('');return;}if(!notebooks.some(notebook=>notebook.id===selectedNotebook))setSelectedNotebook(notebooks[0].id);},[notebooks,selectedNotebook]);
  const matchingJournal=journalEntries.filter(entry=>`${entry.title} ${entry.content} ${entry.tags.join(' ')}`.toLowerCase().includes(search.toLowerCase())).sort((a,b)=>b.entryDate.localeCompare(a.entryDate));
  const matchingNotes=studyNotes.filter(note=>(!selectedNotebook||note.notebookId===selectedNotebook)&&`${note.title} ${note.content} ${note.tags.join(' ')}`.toLowerCase().includes(search.toLowerCase())).sort((a,b)=>Number(b.pinned)-Number(a.pinned)||b.updatedAt.localeCompare(a.updatedAt));
  const resetJournal=()=>{setJournalId(null);setJournalTitle('');setJournalContent('');setJournalDate(dateKey(new Date()));setJournalMood('neutral');setJournalTemplate('free');setJournalTags('');setJournalFavorite(false);setJournalPrivate(true);setJournalEditor(true);};
  const editJournal=(entry:(typeof journalEntries)[number])=>{setJournalId(entry.id);setJournalTitle(entry.title);setJournalContent(entry.content);setJournalDate(entry.entryDate);setJournalMood(entry.mood);setJournalTemplate(entry.template);setJournalTags(entry.tags.join(', '));setJournalFavorite(entry.favorite);setJournalPrivate(entry.private);setJournalEditor(true);};
  const saveJournal=()=>{if(!journalTitle.trim()&&!journalContent.trim())return Alert.alert('Blank page','Add a title or write something before saving.');if(!validDate(journalDate))return Alert.alert('Check the date','Use YYYY-MM-DD.');const now=new Date().toISOString();const values={title:journalTitle.trim()||'Untitled Page',content:journalContent.trim(),entryDate:journalDate,mood:journalMood,template:journalTemplate,tags:journalTags.split(',').map(tag=>tag.trim()).filter(Boolean),favorite:journalFavorite,private:journalPrivate};if(journalId)updateJournalEntry(journalId,values);else addJournalEntry({...values,id:`journal-${Date.now()}`,createdAt:now,updatedAt:now});setJournalEditor(false);};
  const resetNote=()=>{if(!selectedNotebook&&notebooks[0])setSelectedNotebook(notebooks[0].id);setNoteId(null);setNoteTitle('');setNoteContent('');setNoteTags('');setNotePinned(false);setNoteHighlight(noteHighlights[0]);setChecklist([]);setNoteEditor(true);};
  const editNote=(note:(typeof studyNotes)[number])=>{setSelectedNotebook(note.notebookId);setNoteId(note.id);setNoteTitle(note.title);setNoteContent(note.content);setNoteTags(note.tags.join(', '));setNotePinned(note.pinned);setNoteHighlight(note.highlightColor??noteHighlights[0]);setChecklist(note.checklist??[]);setNoteEditor(true);};
  const saveNote=()=>{if(!selectedNotebook)return Alert.alert('Choose a notebook','Create or choose a notebook first.');if(!noteTitle.trim()&&!noteContent.trim()&&!checklist.length)return Alert.alert('Blank note','Add a title, text, or checklist item.');const now=new Date().toISOString();const values={notebookId:selectedNotebook,title:noteTitle.trim()||'Untitled Note',content:noteContent.trim(),tags:noteTags.split(',').map(tag=>tag.trim()).filter(Boolean),pinned:notePinned,highlightColor:noteHighlight,checklist};if(noteId)updateStudyNote(noteId,values);else addStudyNote({...values,id:`note-${Date.now()}`,createdAt:now,updatedAt:now});setNoteEditor(false);};
  const createNotebook=()=>{if(!newNotebookName.trim())return;const id=`notebook-${Date.now()}`;addNotebook({id,name:newNotebookName.trim(),color:noteHighlights[notebooks.length%noteHighlights.length],createdAt:new Date().toISOString()});setSelectedNotebook(id);setNewNotebookName('');};
  const confirmDeleteJournal=(id:string)=>Alert.alert('Delete journal page?','This cannot be undone.',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>deleteJournalEntry(id)}]);
  const confirmDeleteNote=(id:string)=>Alert.alert('Delete note?','This cannot be undone.',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>deleteStudyNote(id)}]);
  return <Page><ScreenTitle eyebrow="Private Academy Desk" title="Journal & Notebooks" subtitle="Write, reflect, organize real notes, and keep every page editable."/><LocationHero source={section==='journal'?locationArt.decoratedDorm:locationArt.library} title={section==='journal'?'Your Writing Room':'The Study Library'} subtitle={section==='journal'?'A private, furnished room for reflection.':'Organize subjects, notes, highlights, and checklists.'}/>
    <View style={styles.journalTabs}><Pressable style={[styles.journalTab,section==='journal'&&styles.journalTabActive]} onPress={()=>setSection('journal')}><Ionicons name="journal-outline" size={18} color={section==='journal'?'white':colors.plum}/><Text style={[styles.journalTabText,section==='journal'&&styles.journalTabTextActive]}>Journal</Text></Pressable><Pressable style={[styles.journalTab,section==='notes'&&styles.journalTabActive]} onPress={()=>setSection('notes')}><Ionicons name="document-text-outline" size={18} color={section==='notes'?'white':colors.plum}/><Text style={[styles.journalTabText,section==='notes'&&styles.journalTabTextActive]}>Study Notes</Text></Pressable></View>
    <TextInput value={search} onChangeText={setSearch} placeholder="Search titles, writing, or tags…" placeholderTextColor="#A9989A" style={styles.searchInput}/>
    {section==='journal'?<>{!journalEditor&&<GoldButton label="Write a New Page" onPress={resetJournal}/>} {journalEditor&&<PaperCard style={styles.journalEditor}><View style={styles.rowBetween}><Text style={styles.script}>{journalId?'Edit journal page':'New journal page'}</Text><Pressable onPress={()=>setJournalEditor(false)}><Ionicons name="close" size={24} color={colors.muted}/></Pressable></View><Text style={styles.fieldLabel}>Template</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.templateRow}>{journalTemplates.map(template=><Pressable key={template.id} style={[styles.templateChip,journalTemplate===template.id&&styles.templateChipActive]} onPress={()=>setJournalTemplate(template.id)}><Text style={[styles.templateText,journalTemplate===template.id&&styles.templateTextActive]}>{template.label}</Text></Pressable>)}</ScrollView><Text style={styles.templatePrompt}>{journalTemplates.find(template=>template.id===journalTemplate)?.prompt}</Text><TextInput value={journalTitle} onChangeText={setJournalTitle} placeholder="Page title" placeholderTextColor="#A9989A" style={styles.journalTitleInput}/><TextInput value={journalDate} onChangeText={setJournalDate} placeholder="YYYY-MM-DD" style={styles.scheduleInput}/><TextInput value={journalContent} onChangeText={setJournalContent} multiline placeholder="Begin writing here…" placeholderTextColor="#A9989A" style={styles.journalPaper}/><Text style={styles.fieldLabel}>Mood</Text><View style={styles.choiceWrap}>{journalMoods.map(mood=><Pressable key={mood} style={[styles.choiceChip,journalMood===mood&&styles.choiceChipActive]} onPress={()=>setJournalMood(mood)}><Text style={[styles.choiceText,journalMood===mood&&styles.choiceTextActive]}>{mood}</Text></Pressable>)}</View><TextInput value={journalTags} onChangeText={setJournalTags} placeholder="Tags, separated by commas" placeholderTextColor="#A9989A" style={styles.scheduleInput}/><View style={styles.toggleRows}><Pressable style={[styles.toggleRow,journalFavorite&&styles.favoriteToggle]} onPress={()=>setJournalFavorite(value=>!value)}><Ionicons name={journalFavorite?'star':'star-outline'} size={20} color={colors.gold}/><Text style={styles.itemTitle}>{journalFavorite?'Favorite page':'Add to favorites'}</Text></Pressable><Pressable style={[styles.toggleRow,journalPrivate&&styles.toggleRowActive]} onPress={()=>setJournalPrivate(value=>!value)}><Ionicons name={journalPrivate?'lock-closed':'lock-open-outline'} size={20} color={colors.sage}/><Text style={styles.itemTitle}>{journalPrivate?'Private entry':'Story-linkable entry'}</Text></Pressable></View><GoldButton label="Save Journal Page" onPress={saveJournal}/></PaperCard>}
      <SectionLabel action={`${matchingJournal.length} pages`}>Journal Pages</SectionLabel>{matchingJournal.length===0?<PaperCard><Text style={styles.body}>Your journal is waiting for its first page.</Text></PaperCard>:matchingJournal.map(entry=><PaperCard key={entry.id} style={[styles.journalPageCard,entry.favorite&&styles.favoritePage]}><Pressable onPress={()=>editJournal(entry)}><View style={styles.rowBetween}><View style={styles.flex}><Text style={styles.script}>{entry.entryDate} · {entry.mood}</Text><Text style={styles.itemTitle}>{entry.title}</Text></View><View style={styles.row}>{entry.private&&<Ionicons name="lock-closed" size={14} color={colors.sage}/>} {entry.favorite&&<Ionicons name="star" size={16} color={colors.gold}/>}</View></View><Text style={styles.journalExcerpt} numberOfLines={4}>{entry.content||journalTemplates.find(template=>template.id===entry.template)?.prompt}</Text><Text style={styles.small}>{entry.tags.map(tag=>`#${tag}`).join(' ')}</Text></Pressable><Pressable style={styles.deleteCorner} onPress={()=>confirmDeleteJournal(entry.id)}><Ionicons name="trash-outline" size={17} color={colors.muted}/></Pressable></PaperCard>)}</>:<>
      <SectionLabel action={`${notebooks.length} notebooks`}>Notebooks</SectionLabel><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.notebookRow}>{notebooks.map(notebook=><Pressable key={notebook.id} onPress={()=>setSelectedNotebook(notebook.id)} onLongPress={()=>Alert.alert('Delete notebook?',`This also deletes its notes from ${notebook.name}.`,[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>deleteNotebook(notebook.id)}])} style={[styles.notebookChip,selectedNotebook===notebook.id&&styles.notebookChipActive,{borderColor:notebook.color}]}><View style={[styles.notebookDot,{backgroundColor:notebook.color}]}/><Text style={styles.notebookText}>{notebook.name}</Text></Pressable>)}</ScrollView><View style={styles.addNotebook}><TextInput value={newNotebookName} onChangeText={setNewNotebookName} placeholder="New notebook name" placeholderTextColor="#A9989A" style={[styles.scheduleInput,styles.flex]}/><Pressable style={styles.addNotebookButton} onPress={createNotebook}><Ionicons name="add" size={21} color="white"/></Pressable></View>{!noteEditor&&<GoldButton label="Create Study Note" onPress={resetNote}/>} {noteEditor&&<PaperCard style={[styles.noteEditor,{backgroundColor:noteHighlight}]}><View style={styles.rowBetween}><Text style={styles.script}>{noteId?'Edit note':'New study note'}</Text><Pressable onPress={()=>setNoteEditor(false)}><Ionicons name="close" size={24} color={colors.muted}/></Pressable></View><TextInput value={noteTitle} onChangeText={setNoteTitle} placeholder="Note title" placeholderTextColor="#A9989A" style={styles.journalTitleInput}/><TextInput value={noteContent} onChangeText={setNoteContent} multiline placeholder="Write your actual notes here…" placeholderTextColor="#A9989A" style={styles.notePaper}/><Text style={styles.fieldLabel}>Paper highlight</Text><View style={styles.highlightRow}>{noteHighlights.map(color=><Pressable key={color} onPress={()=>setNoteHighlight(color)} style={[styles.highlightDot,{backgroundColor:color},noteHighlight===color&&styles.highlightDotActive]}/>)}</View><TextInput value={noteTags} onChangeText={setNoteTags} placeholder="Tags, separated by commas" placeholderTextColor="#A9989A" style={styles.scheduleInput}/><Pressable style={[styles.toggleRow,notePinned&&styles.favoriteToggle]} onPress={()=>setNotePinned(value=>!value)}><Ionicons name={notePinned?'pin':'pin-outline'} size={20} color={colors.rose}/><Text style={styles.itemTitle}>{notePinned?'Pinned note':'Pin this note'}</Text></Pressable><Text style={styles.fieldLabel}>Checklist</Text>{checklist.map((item,index)=><View key={item.id} style={styles.checklistEditorRow}><Pressable onPress={()=>setChecklist(items=>items.map(value=>value.id===item.id?{...value,completed:!value.completed}:value))}><Ionicons name={item.completed?'checkbox':'square-outline'} size={21} color={colors.sage}/></Pressable><TextInput value={item.text} onChangeText={text=>setChecklist(items=>items.map(value=>value.id===item.id?{...value,text}:value))} placeholder={`Item ${index+1}`} style={[styles.scheduleInput,styles.flex]}/><Pressable onPress={()=>setChecklist(items=>items.filter(value=>value.id!==item.id))}><Ionicons name="close-circle" size={19} color={colors.muted}/></Pressable></View>)}<Pressable style={styles.addChecklist} onPress={()=>setChecklist(items=>[...items,{id:`check-${Date.now()}`,text:'',completed:false}])}><Ionicons name="add-circle-outline" size={18} color={colors.rose}/><Text style={styles.addChecklistText}>Add checklist item</Text></Pressable><GoldButton label="Save Study Note" onPress={saveNote}/></PaperCard>}
      <SectionLabel action={`${matchingNotes.length} notes`}>Study Notes</SectionLabel>{matchingNotes.length===0?<PaperCard><Text style={styles.body}>This notebook has no notes yet.</Text></PaperCard>:matchingNotes.map(note=><PaperCard key={note.id} style={[styles.noteCard,{backgroundColor:note.highlightColor??colors.paper}]}><Pressable onPress={()=>editNote(note)}><View style={styles.rowBetween}><Text style={styles.itemTitle}>{note.title}</Text>{note.pinned&&<Ionicons name="pin" size={16} color={colors.rose}/>}</View><Text style={styles.journalExcerpt} numberOfLines={4}>{note.content}</Text>{note.checklist?.map(item=><View key={item.id} style={styles.noteCheckRow}><Ionicons name={item.completed?'checkbox':'square-outline'} size={14} color={colors.sage}/><Text style={[styles.small,item.completed&&styles.done]}>{item.text||'Untitled item'}</Text></View>)}<Text style={styles.small}>{note.tags.map(tag=>`#${tag}`).join(' ')}</Text></Pressable><Pressable style={styles.deleteCorner} onPress={()=>confirmDeleteNote(note.id)}><Ionicons name="trash-outline" size={17} color={colors.muted}/></Pressable></PaperCard>)}</>}
  </Page>;
}

function parseCsvRow(line:string):string[] {
  const values:string[]=[];let value='';let quoted=false;
  for(let index=0;index<line.length;index+=1){const character=line[index];if(character==='"'&&line[index+1]==='"'){value+='"';index+=1;}else if(character==='"'){quoted=!quoted;}else if(character===','&&!quoted){values.push(value.trim());value='';}else value+=character;}
  values.push(value.trim());return values;
}
function parseImportedSchedule(content:string):ScheduleBlock[] {
  let rows:Record<string,any>[]=[];
  try {
    const parsed=JSON.parse(content);
    if(Array.isArray(parsed))rows=parsed;
  } catch {
    const lines=content.split(/\r?\n/).map(line=>line.trim()).filter(Boolean);
    if(lines.length>1){const headers=parseCsvRow(lines[0]).map(header=>header.toLowerCase());rows=lines.slice(1).map(line=>{const values=parseCsvRow(line);return Object.fromEntries(headers.map((header,index)=>[header,values[index]??'']));});}
  }
  const dayIndex:Record<string,number>={monday:0,tue:1,tuesday:1,wed:2,wednesday:2,thu:3,thursday:3,fri:4,friday:4,sat:5,saturday:5,sun:6,sunday:6};
  const kinds:TaskKind[]=['ballet','school','french','wellbeing','personal'];
  return rows.map((row,index)=>{
    const dayValue=String(row.days??row.day??'').split(/[|,;]/).map(value=>value.trim().toLowerCase()).filter(Boolean);
    const days=dayValue.map(value=>dayIndex[value]??Number(value)).filter(value=>Number.isInteger(value)&&value>=0&&value<=6);
    const recurrence:'weekly'|'once'=row.recurrence==='once'||row.date?'once':'weekly';
    const kindValue=String(row.kind??row.type??'personal').toLowerCase() as TaskKind;
    return {id:`imported-${Date.now()}-${index}`,title:String(row.title??row.name??'Imported commitment').trim(),location:String(row.location??'School').trim(),start:String(row.start??row.startTime??'09:00').trim(),end:String(row.end??row.endTime??'10:00').trim(),day:days[0]??0,days:days.length?days:[0],kind:kinds.includes(kindValue)?kindValue:'personal',notes:row.notes?String(row.notes):undefined,recurrence,date:row.date?String(row.date):undefined,startsOn:row.startsOn?String(row.startsOn):undefined,endsOn:row.endsOn?String(row.endsOn):undefined,paused:false,affectsStory:row.affectsStory!==false,createdAt:new Date().toISOString()};
  }).filter(block=>!!block.title&&validTime(block.start)&&validTime(block.end)&&block.start<block.end&&(block.recurrence==='weekly'||!!block.date&&validDate(block.date)));
}
type ScheduleDraft={title:string;location:string;start:string;end:string;days:number[];kind:TaskKind;notes:string;recurrence:'weekly'|'once';date:string;startsOn:string;endsOn:string;paused:boolean;affectsStory:boolean};
const freshScheduleDraft=():ScheduleDraft=>({title:'',location:'',start:'09:00',end:'10:00',days:[0],kind:'personal',notes:'',recurrence:'weekly',date:'',startsOn:'',endsOn:'',paused:false,affectsStory:true});

function SettingsScreen({navigation}:NativeStackScreenProps<RootStackParamList,'Settings'>) {
  const state=useAcademyStore();
  const exportBackup=async()=>{try{const directory=new Directory(Paths.document,'rba-backups');directory.create({idempotent:true,intermediates:true});const file=new File(directory,`rba-backup-${localDateKey()}.json`);const current=useAcademyStore.getState();const customArt=await Promise.all(current.customArt.map(async asset=>{try{return {...asset,backupData:await new File(asset.uri).base64()};}catch{return asset;}}));file.write(JSON.stringify({format:'rba-backup',version:2,exportedAt:new Date().toISOString(),note:'Custom artwork is embedded in this backup when its local file is readable.',state:{...current,customArt}},null,2),{encoding:'utf8'});await Share.share({title:'Royal Ballet Academy Backup',message:'Royal Ballet Academy backup with artwork',url:file.uri});}catch(error){Alert.alert('Could not export backup',error instanceof Error?error.message:'Please try again.');}};
  const importBackup=async()=>{try{const result=await DocumentPicker.getDocumentAsync({type:'application/json',copyToCacheDirectory:true,multiple:false});if(result.canceled)return;const payload=JSON.parse(await new File(result.assets[0].uri).text());if(payload?.format!=='rba-backup'||!payload?.state)throw new Error('This is not a Royal Ballet Academy backup.');Alert.alert('Restore this backup?','Current local progress will be replaced. Embedded artwork will be restored to this device.',[{text:'Cancel',style:'cancel'},{text:'Restore',style:'default',onPress:async()=>{const directory=new Directory(Paths.document,'rba-custom-art');directory.create({idempotent:true,intermediates:true});const customArt=await Promise.all((payload.state.customArt??[]).map(async(asset:any)=>{if(!asset.backupData)return asset;const extension=(asset.uri?.match(/\.[a-zA-Z0-9]+$/)?.[0]??'.png').toLowerCase();const destination=new File(directory,`restored-${asset.id}${extension}`);destination.write(asset.backupData,{encoding:'base64'});const {backupData,...restored}=asset;return {...restored,uri:destination.uri};}));state.restoreBackup({...payload.state,customArt});Alert.alert('Backup restored','Your academy data and embedded artwork have been restored.');}}]);}catch(error){Alert.alert('Could not import backup',error instanceof Error?error.message:'Choose a valid RBA JSON backup.');}};
  const confirmReset=()=>Alert.alert('Reset the entire academy?','This removes local story progress, schedule, journals, rewards, relationships, and artwork assignments. Export a backup first.',[{text:'Cancel',style:'cancel'},{text:'Reset everything',style:'destructive',onPress:()=>Alert.alert('Final confirmation','This cannot be undone without a backup.',[{text:'Keep my data',style:'cancel'},{text:'Reset',style:'destructive',onPress:()=>{state.resetDemo();navigation.goBack();}}])}]);
  const diagnostics=[['Story scenes',state.story.length],['Completed scenes',state.storyProgress.filter(progress=>progress.completions>0).length],['Schedule blocks',state.schedule.length],['Journal entries',state.journalEntries.length],['Study notes',state.studyNotes.length],['Imported books',state.books.length],['Artwork layers',state.customArt.length],['Focus sessions',state.sessions.length]];
  return <Page><View style={styles.readerTop}><Pressable style={styles.paperBack} onPress={()=>navigation.goBack()}><Ionicons name="chevron-back" size={23} color={colors.plum}/></Pressable><Pill tone="gold">VERSION 1.0</Pill></View><ScreenTitle eyebrow="Release Settings" title="Your Academy Data" subtitle="Back up progress, inspect local records, or perform a protected reset."/><PaperCard style={styles.releaseCard}><Text style={styles.itemTitle}>Royal Ballet Academy 1.0</Text><Text style={styles.body}>School-year story, daily life, editable schedule, journals, study tools, relationships, avatar layers, dorm decor, locations, and imported artwork are installed.</Text></PaperCard><SectionLabel>Backup & Restore</SectionLabel><GoldButton label="Export JSON Backup" onPress={exportBackup}/><GoldButton label="Import JSON Backup" onPress={importBackup}/><PaperCard><Text style={styles.small}>Backups now embed readable custom artwork files, so NPC portraits, room art, and avatar layers can move with your save. Very large or unavailable source files still need to be re-imported.</Text></PaperCard><SectionLabel>Local Diagnostics</SectionLabel><PaperCard>{diagnostics.map(([label,value])=><View key={label} style={styles.diagnosticRow}><Text style={styles.diagnosticLabel}>{label}</Text><Text style={styles.diagnosticValue}>{value}</Text></View>)}</PaperCard><SectionLabel>Reminder Status</SectionLabel><PaperCard><View style={styles.row}><Ionicons name="notifications-outline" size={23} color={colors.gold}/><View style={styles.flex}><Text style={styles.itemTitle}>{state.dailyPreferences.remindersEnabled?'In-app reminder enabled':'In-app reminder disabled'}</Text><Text style={styles.body}>Native push reminders remain off until the compatible Expo notification dependency is installed during device setup.</Text></View></View></PaperCard><SectionLabel>Danger Zone</SectionLabel><Pressable style={styles.resetButton} onPress={confirmReset}><Ionicons name="warning-outline" size={19} color="white"/><Text style={styles.resetButtonText}>Reset Entire Academy</Text></Pressable></Page>;
}

function ScheduleScreen() {
  const {schedule,addScheduleBlock,addScheduleBlocks,updateScheduleBlock,deleteScheduleBlock,duplicateScheduleBlock}=useAcademyStore();
  const days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const kinds:TaskKind[]=['ballet','school','french','wellbeing','personal'];
  const [editingId,setEditingId]=useState<string|null>(null);
  const [editorOpen,setEditorOpen]=useState(false);
  const [picker,setPicker]=useState<'start'|'end'|'date'|null>(null);
  const [draft,setDraft]=useState<ScheduleDraft>(freshScheduleDraft());
  const openNew=()=>{setEditingId(null);setDraft(freshScheduleDraft());setEditorOpen(true);};
  const importSchoolSchedule=async()=>{try{const result=await DocumentPicker.getDocumentAsync({type:['text/csv','application/json','text/plain'],copyToCacheDirectory:true,multiple:false});if(result.canceled)return;const blocks=parseImportedSchedule(await new File(result.assets[0].uri).text());if(!blocks.length){Alert.alert('No schedule found','Use JSON or CSV with title, location, start, end, and day columns.');return;}const conflict=blocks.find(block=>schedule.some(existing=>scheduleBlocksOverlap(existing,block))||blocks.some(other=>other.id!==block.id&&scheduleBlocksOverlap(other,block)));if(conflict){Alert.alert('Schedule conflict',`The imported schedule overlaps with “${conflict.title}”. Resolve the conflict before importing.`);return;}addScheduleBlocks(blocks);Alert.alert('Schedule imported',`${blocks.length} commitment${blocks.length===1?'':'s'} added to your academy schedule.`);}catch(error){Alert.alert('Could not import schedule',error instanceof Error?error.message:'Use a valid JSON or CSV schedule file.');}};
  const openEdit=(block:(typeof schedule)[number])=>{setEditingId(block.id);setDraft({title:block.title,location:block.location,start:block.start,end:block.end,days:blockDays(block),kind:block.kind,notes:block.notes??'',recurrence:block.recurrence??'weekly',date:block.date??'',startsOn:block.startsOn??'',endsOn:block.endsOn??'',paused:!!block.paused,affectsStory:block.affectsStory!==false});setEditorOpen(true);};
  const toggleDay=(day:number)=>setDraft(current=>({...current,days:current.days.includes(day)?current.days.filter(value=>value!==day):[...current.days,day].sort()}));
  const pickerDate=(value:string,mode:'time'|'date')=>{
    const date=new Date();
    if(mode==='time'&&validTime(value)){const [hours,minutes]=value.split(':').map(Number);date.setHours(hours,minutes,0,0);}
    if(mode==='date'&&validDate(value)){const [year,month,day]=value.split('-').map(Number);date.setFullYear(year,month-1,day);}
    return date;
  };
  const applyPickerValue=(value:Date)=>{
    if(picker==='start'||picker==='end'){const time=`${String(value.getHours()).padStart(2,'0')}:${String(value.getMinutes()).padStart(2,'0')}`;setDraft(current=>({...current,[picker]:time}));}
    if(picker==='date')setDraft(current=>({...current,date:dateKey(value)}));
    setPicker(null);
  };
  const save=()=>{
    if(!draft.title.trim()||!draft.location.trim()) return Alert.alert('Missing information','Add a title and location.');
    if(!validTime(draft.start)||!validTime(draft.end)||draft.end<=draft.start) return Alert.alert('Check the time','Use 24-hour HH:MM times, with the end after the start.');
    if(draft.recurrence==='weekly'&&draft.days.length===0) return Alert.alert('Choose a day','Weekly blocks need at least one weekday.');
    if(draft.recurrence==='once'&&!validDate(draft.date)||draft.recurrence==='once'&&!draft.date) return Alert.alert('Check the date','One-time events need a YYYY-MM-DD date.');
    if(!validDate(draft.startsOn)||!validDate(draft.endsOn)) return Alert.alert('Check date limits','Date limits use YYYY-MM-DD.');
    const block={id:editingId??'',title:draft.title.trim(),location:draft.location.trim(),start:draft.start,end:draft.end,day:draft.days[0]??0,days:draft.days,kind:draft.kind,notes:draft.notes.trim()||undefined,recurrence:draft.recurrence,date:draft.recurrence==='once'?draft.date:undefined,startsOn:draft.recurrence==='weekly'&&draft.startsOn?draft.startsOn:undefined,endsOn:draft.recurrence==='weekly'&&draft.endsOn?draft.endsOn:undefined,paused:draft.paused,affectsStory:draft.affectsStory};
    const conflict=schedule.find(existing=>existing.id!==editingId&&scheduleBlocksOverlap(existing,block));
    if(conflict)return Alert.alert('Schedule conflict',`This overlaps with “${conflict.title}”. Adjust the time, day, or date before saving.`);
    if(editingId) updateScheduleBlock(editingId,block); else addScheduleBlock({...block,id:`schedule-${Date.now()}`,createdAt:new Date().toISOString()});
    setEditorOpen(false);
  };
  const confirmDelete=(id:string,title:string)=>Alert.alert('Delete schedule block?',title,[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>deleteScheduleBlock(id)}]);
  return <Page><ScreenTitle eyebrow="Planner" title="Weekly Schedule" subtitle="Build your real schedule here. Only blocks marked for story can unlock schedule-based events."/><LocationHero source={locationArt.hallway} title="The Academy Notice Hall" subtitle="Your real commitments determine what happens throughout the academy."/>
    {!editorOpen&&<><GoldButton label="Add Schedule Block" onPress={openNew}/><Pressable style={styles.scheduleImportButton} onPress={importSchoolSchedule}><Ionicons name="download-outline" size={17} color={colors.rose}/><Text style={styles.scheduleImportText}>Import School Schedule (JSON/CSV)</Text></Pressable></>}
    {editorOpen&&<PaperCard style={styles.scheduleEditor}><View style={styles.rowBetween}><View><Text style={styles.script}>{editingId?'Edit commitment':'New commitment'}</Text><Text style={styles.itemTitle}>{editingId?'Update this schedule block':'Add something real'}</Text></View><Pressable onPress={()=>setEditorOpen(false)}><Ionicons name="close" size={25} color={colors.muted}/></Pressable></View>
      <Text style={styles.fieldLabel}>Title</Text><TextInput value={draft.title} onChangeText={title=>setDraft(current=>({...current,title}))} placeholder="Ballet Class" placeholderTextColor="#A9989A" style={styles.scheduleInput}/>
      <Text style={styles.fieldLabel}>Location</Text><TextInput value={draft.location} onChangeText={location=>setDraft(current=>({...current,location}))} placeholder="Studio" placeholderTextColor="#A9989A" style={styles.scheduleInput}/>
      <View style={styles.timeInputs}><View style={styles.flex}><Text style={styles.fieldLabel}>Start</Text><TextInput value={draft.start} onChangeText={start=>setDraft(current=>({...current,start}))} placeholder="19:00" keyboardType="numbers-and-punctuation" style={styles.scheduleInput}/><Pressable style={styles.schedulePickerButton} onPress={()=>setPicker('start')}><Text style={styles.schedulePickerText}>Pick time</Text></Pressable></View><View style={styles.flex}><Text style={styles.fieldLabel}>End</Text><TextInput value={draft.end} onChangeText={end=>setDraft(current=>({...current,end}))} placeholder="20:30" keyboardType="numbers-and-punctuation" style={styles.scheduleInput}/><Pressable style={styles.schedulePickerButton} onPress={()=>setPicker('end')}><Text style={styles.schedulePickerText}>Pick time</Text></Pressable></View></View>
      <Text style={styles.fieldLabel}>Type</Text><View style={styles.choiceWrap}>{kinds.map(kind=><Pressable key={kind} style={[styles.choiceChip,draft.kind===kind&&styles.choiceChipActive]} onPress={()=>setDraft(current=>({...current,kind}))}><Text style={[styles.choiceText,draft.kind===kind&&styles.choiceTextActive]}>{kind}</Text></Pressable>)}</View>
      <Text style={styles.fieldLabel}>Repeats</Text><View style={styles.choiceWrap}>{(['weekly','once'] as const).map(recurrence=><Pressable key={recurrence} style={[styles.choiceChip,draft.recurrence===recurrence&&styles.choiceChipActive]} onPress={()=>setDraft(current=>({...current,recurrence}))}><Text style={[styles.choiceText,draft.recurrence===recurrence&&styles.choiceTextActive]}>{recurrence==='weekly'?'Every week':'One date'}</Text></Pressable>)}</View>
      {draft.recurrence==='weekly'?<><Text style={styles.fieldLabel}>Weekdays</Text><View style={styles.dayPicker}>{days.map((day,index)=><Pressable key={day} accessibilityLabel={day} style={[styles.dayChip,draft.days.includes(index)&&styles.dayChipActive]} onPress={()=>toggleDay(index)}><Text style={[styles.dayChipText,draft.days.includes(index)&&styles.dayChipTextActive]}>{day.slice(0,2)}</Text></Pressable>)}</View><Text style={styles.fieldLabel}>Date limits (optional)</Text><View style={styles.timeInputs}><TextInput value={draft.startsOn} onChangeText={startsOn=>setDraft(current=>({...current,startsOn}))} placeholder="Starts YYYY-MM-DD" placeholderTextColor="#A9989A" style={[styles.scheduleInput,styles.flex]}/><TextInput value={draft.endsOn} onChangeText={endsOn=>setDraft(current=>({...current,endsOn}))} placeholder="Ends YYYY-MM-DD" placeholderTextColor="#A9989A" style={[styles.scheduleInput,styles.flex]}/></View></>:<><Text style={styles.fieldLabel}>Event date</Text><TextInput value={draft.date} onChangeText={date=>setDraft(current=>({...current,date}))} placeholder="YYYY-MM-DD" placeholderTextColor="#A9989A" style={styles.scheduleInput}/><Pressable style={styles.schedulePickerButton} onPress={()=>setPicker('date')}><Text style={styles.schedulePickerText}>Pick date</Text></Pressable></>}
      {picker&&Platform.OS!=='web'&&<DateTimePicker value={pickerDate(picker==='date'?draft.date:picker==='start'?draft.start:draft.end,picker==='date'?'date':'time')} mode={picker==='date'?'date':'time'} onChange={(_event,value)=>{if(value)applyPickerValue(value);else setPicker(null);}} />}
      <Text style={styles.fieldLabel}>Notes</Text><TextInput value={draft.notes} onChangeText={notes=>setDraft(current=>({...current,notes}))} multiline placeholder="Teacher, supplies, preparation…" placeholderTextColor="#A9989A" style={[styles.scheduleInput,styles.scheduleNotes]}/>
      <View style={styles.toggleRows}><Pressable style={[styles.toggleRow,draft.affectsStory&&styles.toggleRowActive]} onPress={()=>setDraft(current=>({...current,affectsStory:!current.affectsStory}))}><Ionicons name={draft.affectsStory?'checkmark-circle':'ellipse-outline'} size={20} color={draft.affectsStory?colors.sage:colors.muted}/><View style={styles.flex}><Text style={styles.itemTitle}>Affects story</Text><Text style={styles.small}>Allow this block to satisfy schedule triggers.</Text></View></Pressable><Pressable style={[styles.toggleRow,draft.paused&&styles.toggleRowPaused]} onPress={()=>setDraft(current=>({...current,paused:!current.paused}))}><Ionicons name={draft.paused?'pause-circle':'play-circle-outline'} size={20} color={draft.paused?colors.rose:colors.sage}/><View style={styles.flex}><Text style={styles.itemTitle}>{draft.paused?'Paused':'Active'}</Text><Text style={styles.small}>Paused blocks remain saved but disappear from Today.</Text></View></Pressable></View>
      <GoldButton label={editingId?'Save Changes':'Create Schedule Block'} onPress={save}/>
    </PaperCard>}
    {days.map((day,index)=>{const blocks=schedule.filter(block=>(block.recurrence??'weekly')==='weekly'&&blockDays(block).includes(index)).sort(sortSchedule);return <View key={day}><SectionLabel action={`${blocks.length}`}>{day}</SectionLabel>{blocks.length?blocks.map(block=><PaperCard key={`${day}-${block.id}`} style={[styles.listCard,block.paused&&styles.pausedCard]}><View style={styles.row}><Text style={styles.time}>{block.start}</Text><View style={styles.flex}><View style={styles.storyTitleRow}><Text style={styles.itemTitle}>{block.title}</Text>{block.paused&&<Pill>paused</Pill>}</View><Text style={styles.small}>{block.end} · {block.location} · {block.kind}</Text>{block.notes&&<Text style={styles.body}>{block.notes}</Text>}<Text style={styles.scheduleMeta}>{block.affectsStory===false?'Private schedule only':'Story triggers enabled'}</Text></View></View><View style={styles.blockActions}><Pressable style={styles.blockAction} onPress={()=>openEdit(block)}><Ionicons name="create-outline" size={16} color={colors.rose}/><Text style={styles.blockActionText}>Edit</Text></Pressable><Pressable style={styles.blockAction} onPress={()=>duplicateScheduleBlock(block.id)}><Ionicons name="copy-outline" size={16} color={colors.rose}/><Text style={styles.blockActionText}>Copy</Text></Pressable><Pressable style={styles.blockAction} onPress={()=>confirmDelete(block.id,block.title)}><Ionicons name="trash-outline" size={16} color={colors.danger}/><Text style={[styles.blockActionText,{color:colors.danger}]}>Delete</Text></Pressable></View></PaperCard>):<Text style={styles.empty}>No recurring commitments</Text>}</View>})}
    <SectionLabel>One-time Events</SectionLabel>{schedule.filter(block=>block.recurrence==='once').sort((a,b)=>(a.date??'').localeCompare(b.date??'')).map(block=><PaperCard key={block.id} style={[styles.listCard,block.paused&&styles.pausedCard]}><View style={styles.row}><View style={styles.oneDate}><Text style={styles.oneDateMonth}>{block.date?.slice(5,7)??'--'}</Text><Text style={styles.oneDateDay}>{block.date?.slice(8,10)??'--'}</Text></View><View style={styles.flex}><Text style={styles.itemTitle}>{block.title}</Text><Text style={styles.small}>{block.start}–{block.end} · {block.location}</Text></View></View><View style={styles.blockActions}><Pressable style={styles.blockAction} onPress={()=>openEdit(block)}><Text style={styles.blockActionText}>Edit</Text></Pressable><Pressable style={styles.blockAction} onPress={()=>confirmDelete(block.id,block.title)}><Text style={[styles.blockActionText,{color:colors.danger}]}>Delete</Text></Pressable></View></PaperCard>)}
  </Page>;
}

function TabNavigator() { const icons:Record<string,any>={Today:'home-outline',Story:'book-outline',Academy:'business-outline',Wardrobe:'shirt-outline',Progress:'stats-chart-outline'}; return <Tabs.Navigator screenOptions={({route})=>({headerShown:false,tabBarIcon:({color,size})=><Ionicons name={icons[route.name]} color={color} size={size}/>,tabBarActiveTintColor:colors.rose,tabBarInactiveTintColor:colors.muted,tabBarStyle:styles.tabBar,tabBarLabelStyle:styles.tabLabel})}><Tabs.Screen name="Today" component={HomeScreen}/><Tabs.Screen name="Story" component={StoryScreen}/><Tabs.Screen name="Academy" component={AcademyScreen}/><Tabs.Screen name="Wardrobe" component={WardrobeScreen}/><Tabs.Screen name="Progress" component={ProgressScreen}/></Tabs.Navigator>; }

function OnboardingScreen() {
  const completeOnboarding=useAcademyStore(state=>state.completeOnboarding);
  const [name,setName]=useState('');
  const [remindersEnabled,setRemindersEnabled]=useState(false);
  const submit=()=>{if(!name.trim())return Alert.alert('Add your name','Your academy record needs a name before you begin.');completeOnboarding(name.trim(),remindersEnabled);};
  return <SafeAreaView style={styles.onboardingSafe}><LinearGradient colors={[colors.pale,'#F1D9D8','#E8C5B8']} style={StyleSheet.absoluteFill}/><ScrollView contentContainerStyle={styles.onboardingPage}><Text style={styles.onboardingMark}>RBA</Text><Text style={styles.onboardingEyebrow}>ROYAL BALLET ACADEMY</Text><Text style={styles.onboardingTitle}>Your year begins here.</Text><Text style={styles.onboardingSubtitle}>A quiet, editable academy for real practice, thoughtful progress, and a story that responds to what you do.</Text><Text style={styles.onboardingLabel}>What should the academy call you?</Text><TextInput autoFocus value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor="#A9989A" returnKeyType="done" onSubmitEditing={submit} style={styles.onboardingInput}/><Pressable style={[styles.onboardingToggle,remindersEnabled&&styles.onboardingToggleActive]} onPress={()=>setRemindersEnabled(value=>!value)}><Ionicons name={remindersEnabled?'notifications':'notifications-off-outline'} size={21} color={remindersEnabled?colors.sage:colors.muted}/><View style={styles.flex}><Text style={styles.itemTitle}>{remindersEnabled?'Daily reminders enabled':'Enable daily reminders'}</Text><Text style={styles.small}>You will see an in-app reminder when scheduled commitments remain.</Text></View><Ionicons name={remindersEnabled?'checkmark-circle':'ellipse-outline'} size={20} color={remindersEnabled?colors.sage:colors.muted}/></Pressable><View style={styles.onboardingFeatures}><View style={styles.onboardingFeature}><Ionicons name="calendar-outline" size={22} color={colors.gold}/><Text style={styles.onboardingFeatureTitle}>Plan</Text><Text style={styles.onboardingFeatureText}>Build a real schedule.</Text></View><View style={styles.onboardingFeature}><Ionicons name="book-outline" size={22} color={colors.gold}/><Text style={styles.onboardingFeatureTitle}>Play</Text><Text style={styles.onboardingFeatureText}>Unlock story scenes.</Text></View><View style={styles.onboardingFeature}><Ionicons name="sparkles-outline" size={22} color={colors.gold}/><Text style={styles.onboardingFeatureTitle}>Grow</Text><Text style={styles.onboardingFeatureText}>Keep your progress.</Text></View></View><GoldButton label="Enter the Academy" onPress={submit}/><Text style={styles.onboardingFootnote}>Your data stays on this device unless you export a backup.</Text></ScrollView></SafeAreaView>;
}

export default function App() {
  const [hydrated,setHydrated]=useState(useAcademyStore.persist.hasHydrated());
  const hasCompletedOnboarding=useAcademyStore(state=>state.hasCompletedOnboarding);
  useEffect(()=>useAcademyStore.persist.onFinishHydration(()=>setHydrated(true)),[]);
  if(!hydrated)return <SafeAreaProvider><StatusBar style="dark"/><SafeAreaView style={styles.loadingSafe}><Text style={styles.onboardingMark}>RBA</Text><Text style={styles.loadingText}>Preparing your academy...</Text></SafeAreaView></SafeAreaProvider>;
  if(!hasCompletedOnboarding)return <SafeAreaProvider><StatusBar style="dark"/><OnboardingScreen/></SafeAreaProvider>;
  return <SafeAreaProvider><NavigationContainer><StatusBar style="dark"/><Stack.Navigator screenOptions={{headerShown:false}}><Stack.Screen name="AcademyTabs" component={TabNavigator}/><Stack.Screen name="Grounds" component={GroundsScreen}/><Stack.Screen name="Focus" component={FocusScreen}/><Stack.Screen name="Scene" component={SceneScreen}/><Stack.Screen name="Location" component={LocationScreen}/><Stack.Screen name="BookLibrary" component={BookLibraryScreen}/><Stack.Screen name="BookReader" component={BookReaderScreen}/><Stack.Screen name="Relationships" component={RelationshipsScreen}/><Stack.Screen name="Conversation" component={ConversationScreen}/><Stack.Screen name="Schedule" component={ScheduleScreen}/><Stack.Screen name="Journal" component={JournalScreen}/><Stack.Screen name="ArtPortal" component={ArtPortalScreen}/><Stack.Screen name="Settings" component={SettingsScreen}/></Stack.Navigator></NavigationContainer></SafeAreaProvider>;
}

const styles=StyleSheet.create({
  loadingSafe:{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:colors.pale},
  loadingText:{marginTop:10,color:colors.muted,fontFamily:'Georgia',fontSize:16},
  onboardingSafe:{flex:1,backgroundColor:colors.pale},
  onboardingPage:{padding:spacing.lg,paddingTop:spacing.xl,alignItems:'stretch',gap:16},
  onboardingMark:{alignSelf:'center',fontFamily:'Georgia',fontSize:28,fontWeight:'800',letterSpacing:5,color:colors.gold},
  onboardingEyebrow:{textAlign:'center',fontSize:10,fontWeight:'800',letterSpacing:2,color:colors.rose},
  onboardingTitle:{fontFamily:'Georgia',fontSize:34,lineHeight:40,textAlign:'center',color:colors.plum,marginTop:8},
  onboardingSubtitle:{fontFamily:'Georgia',fontSize:16,lineHeight:24,textAlign:'center',color:colors.ink,marginBottom:12},
  onboardingLabel:{fontSize:12,fontWeight:'800',color:colors.plum},
  onboardingInput:{backgroundColor:colors.paper,borderWidth:1,borderColor:colors.goldPale,borderRadius:radius.md,paddingHorizontal:14,paddingVertical:13,color:colors.ink,fontSize:16},
  onboardingToggle:{flexDirection:'row',alignItems:'center',gap:10,borderWidth:1,borderColor:colors.goldPale,borderRadius:radius.md,backgroundColor:'rgba(255,253,248,.72)',padding:14},
  onboardingToggleActive:{borderColor:colors.sage,backgroundColor:'#F1F6EE'},
  onboardingFeatures:{flexDirection:'row',gap:8,marginTop:4},
  onboardingFeature:{flex:1,alignItems:'center',backgroundColor:'rgba(255,253,248,.7)',borderRadius:radius.md,padding:12,minHeight:112},
  onboardingFeatureTitle:{fontFamily:'Georgia',fontSize:15,fontWeight:'700',color:colors.plum,marginTop:7},
  onboardingFeatureText:{fontSize:10,lineHeight:14,color:colors.muted,textAlign:'center',marginTop:4},
  onboardingFootnote:{fontSize:10,lineHeight:15,color:colors.muted,textAlign:'center'},
  safe:{flex:1,backgroundColor:colors.pale},
  page:{paddingHorizontal:spacing.md,paddingBottom:110},
  wallet:{flexDirection:'row',justifyContent:'center',gap:6,flexWrap:'wrap',paddingTop:4},
  seasonOverlay:{position:'absolute',left:0,right:0,top:0,bottom:0,overflow:'hidden'},
  seasonMark:{position:'absolute',fontSize:18,opacity:.72,textShadowColor:'rgba(255,255,255,.7)',textShadowRadius:4},
  dailyTopRow:{flexDirection:'row',gap:9},
  weatherCard:{flex:1,minHeight:165},
  giftCard:{flex:1,minHeight:165,borderColor:colors.gold,borderWidth:2},
  giftClaimed:{backgroundColor:'#EDF3EA',borderColor:'#AFC1AB'},
  academyForecast:{fontSize:7,lineHeight:10,fontWeight:'800',color:colors.muted,letterSpacing:.5,marginTop:8},
  giftButton:{marginTop:10,borderRadius:radius.pill,backgroundColor:colors.rose,paddingHorizontal:8,paddingVertical:8},
  giftButtonDone:{backgroundColor:colors.sage},
  giftButtonText:{fontSize:8,fontWeight:'800',color:'white',textAlign:'center'},
  holidayCard:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:'#F1F6EE',borderColor:colors.sage,borderWidth:1,marginTop:9},
  dailyBlock:{marginBottom:8},
  dailyBlockDone:{backgroundColor:'#F0F5ED',opacity:.82},
  dailyTime:{width:48,height:48,borderRadius:15,alignItems:'center',justifyContent:'center'},
  dailyTimeText:{fontFamily:'Georgia',fontSize:11,fontWeight:'700',color:'white'},
  dailyCheck:{width:35,height:35,borderRadius:18,borderWidth:1,borderColor:colors.gold,alignItems:'center',justifyContent:'center'},
  presenceRow:{gap:8,paddingBottom:3},
  presenceCard:{width:125,minHeight:155,borderRadius:radius.md,backgroundColor:colors.paper,borderWidth:1,borderColor:colors.goldPale,padding:10,alignItems:'center'},
  presenceAvatar:{width:48,height:55,borderRadius:23,alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:colors.goldPale},
  presenceInitials:{fontFamily:'Georgia',fontSize:16,fontWeight:'800',color:'white'},
  presenceName:{fontFamily:'Georgia',fontSize:12,fontWeight:'700',color:colors.plum,marginTop:7},
  presencePlace:{fontSize:9,fontWeight:'800',color:colors.rose,textAlign:'center',marginTop:4},
  presenceNote:{fontSize:8,lineHeight:11,color:colors.muted,textAlign:'center',marginTop:4},
  momentCard:{flexDirection:'row',alignItems:'center',gap:12,borderWidth:1,borderColor:colors.goldPale,borderRadius:radius.md,backgroundColor:'#FFF9F3',padding:14},
  momentIcon:{width:44,height:44,borderRadius:22,alignItems:'center',justifyContent:'center',backgroundColor:'#F5E8C9'},
  momentAction:{fontSize:10,fontWeight:'800',color:colors.rose,marginTop:7},
  questCard:{marginBottom:8,borderLeftWidth:4,borderLeftColor:colors.rose},
  questCardComplete:{borderLeftColor:colors.sage,backgroundColor:'#F1F6EE'},
  questIcon:{width:40,height:40,borderRadius:20,alignItems:'center',justifyContent:'center',backgroundColor:'#F5E8C9',marginRight:10},
  questProgress:{fontSize:10,fontWeight:'800',color:colors.rose,marginTop:6},
  goalCreate:{flexDirection:'row',alignItems:'center',gap:8},
  goalInput:{flex:1,backgroundColor:colors.paper,borderWidth:1,borderColor:colors.goldPale,borderRadius:radius.md,paddingHorizontal:12,paddingVertical:11,color:colors.ink,fontSize:13},
  goalAddButton:{width:42,height:42,borderRadius:21,backgroundColor:colors.rose,alignItems:'center',justifyContent:'center'},
  reminderCard:{marginBottom:4},
  reminderDue:{borderWidth:2,borderColor:colors.rose,backgroundColor:'#FFF0F4'},
  reminderToggle:{width:34,height:34,borderRadius:17,backgroundColor:colors.muted,alignItems:'center',justifyContent:'center'},
  reminderToggleOn:{backgroundColor:colors.sage},
  reminderTimeRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:13,marginTop:12,paddingTop:10,borderTopWidth:1,borderTopColor:colors.goldPale},
  reminderTime:{fontFamily:'Georgia',fontSize:19,fontWeight:'700',color:colors.plum},
  timeAdjust:{borderRadius:radius.pill,backgroundColor:'#F8E4EA',borderWidth:1,borderColor:colors.goldPale,paddingHorizontal:11,paddingVertical:7},
  timeAdjustText:{fontSize:9,fontWeight:'800',color:colors.plum},
  releaseCard:{borderWidth:2,borderColor:colors.gold,backgroundColor:'#FFF7ED'},
  diagnosticRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:9,borderBottomWidth:1,borderBottomColor:'#EFE0D1'},
  diagnosticLabel:{fontSize:12,color:colors.muted},
  diagnosticValue:{fontFamily:'Georgia',fontSize:15,fontWeight:'700',color:colors.plum},
  resetButton:{borderRadius:radius.md,backgroundColor:colors.danger,padding:14,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8},
  resetButtonText:{fontSize:11,fontWeight:'800',color:'white'},
  locationHero:{height:330,borderRadius:radius.lg,overflow:'hidden',justifyContent:'flex-end',marginBottom:spacing.md,borderWidth:1,borderColor:colors.gold},
  locationImage:{borderRadius:radius.lg},
  locationCaption:{padding:spacing.md},
  locationTitle:{fontFamily:'Georgia',fontSize:23,color:'white',fontWeight:'700'},
  locationSubtitle:{fontSize:11,color:'#F2E4E4',marginTop:3},
  hotspot:{position:'absolute',width:62,height:62,borderRadius:31,backgroundColor:'rgba(105,73,84,.82)',borderWidth:1,borderColor:colors.gold,alignItems:'center',justifyContent:'center'},
  roomHotspot:{backgroundColor:'rgba(185,123,137,.9)',shadowColor:colors.shadow,shadowOpacity:.28,shadowRadius:8,elevation:4},
  locationPage:{flex:1,backgroundColor:colors.plum},
  locationTop:{position:'absolute',left:20,right:20,top:55,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  roundBack:{width:42,height:42,borderRadius:21,backgroundColor:'rgba(45,31,37,.62)',borderWidth:1,borderColor:colors.gold,alignItems:'center',justifyContent:'center'},
  locationPanel:{position:'absolute',left:20,right:20,bottom:35,backgroundColor:'rgba(255,253,248,.96)',borderRadius:radius.lg,borderWidth:2,borderColor:colors.gold,padding:spacing.lg,shadowColor:colors.shadow,shadowOpacity:.2,shadowRadius:18,elevation:6},
  locationFullTitle:{fontFamily:'Georgia',fontSize:29,color:colors.plum,fontWeight:'700'},
  locationFullSub:{fontFamily:'Georgia',fontStyle:'italic',fontSize:15,color:colors.rose,marginTop:4},
  locationDescription:{fontSize:13,lineHeight:20,color:colors.muted,marginTop:10},
  roomNPCRow:{flexDirection:'row',flexWrap:'wrap',gap:7,marginTop:10},
  roomNPC:{flexDirection:'row',alignItems:'center',gap:6,borderRadius:radius.pill,backgroundColor:'#F8EEE4',borderWidth:1,borderColor:colors.goldPale,paddingHorizontal:8,paddingVertical:6},
  roomNPCBadge:{width:24,height:24,borderRadius:12,alignItems:'center',justifyContent:'center'},
  roomNPCInitials:{fontFamily:'Georgia',fontSize:8,fontWeight:'800',color:'white'},
  roomNPCName:{fontSize:9,fontWeight:'800',color:colors.plum},
  roomSpriteLayer:{position:'absolute',left:0,right:0,top:0,bottom:0,zIndex:1},
  roomNPCSpriteWrap:{position:'absolute',width:72,alignItems:'center'},
  roomNPCSprite:{width:58,height:92,borderRadius:29,alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:colors.goldPale,overflow:'hidden'},
  roomNPCSpriteInitials:{fontFamily:'Georgia',fontSize:17,fontWeight:'800',color:'white'},
  roomNPCSpriteName:{marginTop:4,paddingHorizontal:5,borderRadius:radius.pill,backgroundColor:'rgba(255,253,248,.9)',fontSize:9,fontWeight:'800',color:colors.plum},
  roomStoryEvent:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#F7E1E7',borderWidth:1,borderColor:colors.gold,borderRadius:radius.md,padding:10,marginTop:8},
  roomStoryText:{flex:1,fontFamily:'Georgia',fontSize:11,fontWeight:'700',color:colors.plum},
  locationActions:{marginTop:16,gap:8},
  exitGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},
  exitChip:{width:'48%',minHeight:45,borderRadius:radius.md,borderWidth:1,borderColor:colors.goldPale,backgroundColor:'#F9EEF1',paddingHorizontal:10,paddingVertical:9,flexDirection:'row',alignItems:'center',gap:6},
  exitText:{fontSize:11,fontWeight:'800',color:colors.plum,flex:1},
  lockNotice:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,borderWidth:1,borderColor:colors.goldPale,backgroundColor:'#F4E9D6',borderRadius:radius.pill,padding:12},
  lockText:{fontSize:12,color:colors.plum,fontWeight:'700'},
  avatarOnRoom:{position:'absolute',right:34,bottom:36,alignItems:'center',transform:[{scale:.55}]},
  poseInRoom:{position:'absolute',right:8,bottom:0,width:138,height:215},
  todayAvatar:{position:'absolute',right:2,bottom:0,width:142,height:218},
  bustStudio:{overflow:'hidden'},
  bustHero:{height:410,borderRadius:radius.md,overflow:'hidden',alignItems:'center',justifyContent:'flex-end',borderWidth:1,borderColor:colors.goldPale},
  bustFlourish:{position:'absolute',top:13,fontFamily:'Georgia',fontSize:24,color:'rgba(154,118,67,.48)'},
  bustHeroImage:{width:'86%',height:'88%'},
  bustNameplate:{position:'absolute',left:10,right:10,bottom:10,backgroundColor:'rgba(255,253,248,.92)',borderRadius:radius.md,borderWidth:1,borderColor:colors.goldPale,paddingHorizontal:13,paddingVertical:9},
  bustName:{fontFamily:'Georgia',fontSize:18,fontWeight:'700',color:colors.plum,textAlign:'center'},
  bustDetails:{fontSize:10,lineHeight:14,color:colors.muted,textAlign:'center',marginTop:2},
  bustGrid:{gap:10,marginTop:12,paddingRight:8},
  bustChoice:{width:132,height:158,borderRadius:radius.md,borderWidth:1,borderColor:colors.goldPale,backgroundColor:'#F8ECED',alignItems:'center',padding:5},
  bustChoiceActive:{backgroundColor:'#E7BEC8',borderColor:colors.rose,borderWidth:2},
  bustThumb:{width:'100%',height:122},
  bustChoiceName:{fontFamily:'Georgia',fontSize:10,fontWeight:'700',color:colors.plum,marginTop:2},
  bustNote:{fontSize:10,lineHeight:15,color:colors.muted,textAlign:'center',fontStyle:'italic',marginTop:11},
  posePreviewCard:{overflow:'hidden'},
  posePreviewStage:{height:430,borderRadius:radius.md,backgroundColor:'#281E22',borderWidth:1,borderColor:colors.goldPale,alignItems:'center',justifyContent:'center',overflow:'hidden'},
  posePreview:{width:'100%',height:'100%'},
  outfitRibbon:{position:'absolute',left:10,right:10,bottom:10,minHeight:36,borderRadius:radius.pill,backgroundColor:'rgba(255,253,248,.9)',borderWidth:1,borderColor:colors.goldPale,paddingHorizontal:12,flexDirection:'row',alignItems:'center',gap:7},
  outfitDot:{width:13,height:13,borderRadius:7,borderWidth:1,borderColor:colors.gold},
  outfitRibbonText:{flex:1,fontSize:10,fontWeight:'700',color:colors.plum},
  poseName:{fontFamily:'Georgia',fontSize:21,fontWeight:'700',color:colors.plum,textAlign:'center',marginTop:14},
  poseNote:{fontSize:12,lineHeight:18,color:colors.muted,textAlign:'center',marginTop:5,marginHorizontal:10},
  poseSelector:{gap:10,marginTop:15,paddingRight:8},
  poseOption:{width:142,minHeight:166,borderRadius:radius.md,backgroundColor:'#F8ECED',borderWidth:1,borderColor:colors.goldPale,padding:6,alignItems:'center'},
  poseOptionActive:{backgroundColor:'#E7BEC8',borderColor:colors.rose,borderWidth:2},
  poseThumb:{width:'100%',height:124},
  poseOptionText:{fontSize:11,lineHeight:14,fontWeight:'800',color:colors.plum,textAlign:'center'},
  poseOptionTextActive:{color:'#56313D'},
  savedLook:{marginTop:9,flexDirection:'row',alignItems:'center',gap:9},
  lookAction:{borderRadius:radius.pill,backgroundColor:'#F7E3E8',borderWidth:1,borderColor:colors.goldPale,paddingHorizontal:11,paddingVertical:8,flexDirection:'row',alignItems:'center',gap:5},
  lookActionText:{fontSize:10,fontWeight:'800',color:colors.plum},
  hero:{marginBottom:3},
  script:{fontFamily:'Georgia',fontStyle:'italic',color:colors.rose,fontSize:16},
  heroTitle:{fontFamily:'Georgia',fontSize:24,color:colors.plum,marginTop:8},
  body:{fontSize:13,color:colors.muted,lineHeight:19,marginTop:5},
  ribbon:{position:'absolute',right:-25,top:18,backgroundColor:colors.rose,transform:[{rotate:'3deg'}],paddingVertical:5,paddingHorizontal:28},
  ribbonText:{fontSize:8,letterSpacing:1.2,color:'white',fontWeight:'800'},
  listCard:{marginBottom:9},
  row:{flexDirection:'row',alignItems:'center',gap:12},
  flex:{flex:1},
  check:{width:27,height:27,borderRadius:14,borderWidth:1.5,borderColor:colors.gold,alignItems:'center',justifyContent:'center'},
  checked:{backgroundColor:colors.sage,borderColor:colors.sage},
  itemTitle:{fontFamily:'Georgia',fontWeight:'700',fontSize:15,color:colors.ink},
  small:{fontSize:11,color:colors.muted,marginTop:4,lineHeight:15},
  done:{textDecorationLine:'line-through',color:colors.muted},
  studyIcon:{width:46,height:46,borderRadius:23,backgroundColor:'#F4E9D6',alignItems:'center',justifyContent:'center'},
  activityGrid:{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:14},
  activityChip:{width:'48%',backgroundColor:'#F9DEE7',borderRadius:12,padding:10,flexDirection:'row',alignItems:'center',gap:5,borderWidth:1,borderColor:'#E7B6C1'},
  activityText:{fontSize:12,fontWeight:'700',color:colors.ink,flex:1},
  activityTime:{fontSize:10,color:colors.muted},
  quickRow:{flexDirection:'row',gap:9},
  quick:{flex:1,alignItems:'center',padding:13,backgroundColor:colors.paper,borderWidth:1,borderColor:colors.goldPale,borderRadius:radius.md},
  quickText:{fontSize:11,fontWeight:'700',color:colors.ink,marginTop:5},
  chapterSeal:{width:42,height:42,borderRadius:21,backgroundColor:colors.goldPale,borderWidth:1,borderColor:colors.gold,alignItems:'center',justifyContent:'center'},
  sealText:{fontFamily:'Georgia',fontSize:18,color:colors.plum},
  eventQueueCard:{marginBottom:10,borderColor:colors.gold,borderWidth:2},
  queueBell:{width:43,height:43,borderRadius:22,backgroundColor:'#F4E9D6',alignItems:'center',justifyContent:'center'},
  queueActions:{marginTop:13,gap:8},
  dismissButton:{alignItems:'center',paddingVertical:9},
  dismissButtonText:{fontSize:11,fontWeight:'800',color:colors.muted},
  restoreEvents:{alignSelf:'flex-start',marginBottom:9,borderRadius:radius.pill,borderWidth:1,borderColor:colors.goldPale,backgroundColor:'#F9EEF1',paddingHorizontal:12,paddingVertical:8,flexDirection:'row',alignItems:'center',gap:6},
  restoreEventsText:{fontSize:10,fontWeight:'800',color:colors.plum},
  storyTitleRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:8},
  triggerReasons:{marginTop:8,gap:4},
  triggerReason:{flexDirection:'row',alignItems:'center',gap:5},
  triggerReasonText:{fontSize:10,color:colors.muted,flex:1},
  locked:{opacity:.5},
  mapFrame:{backgroundColor:'#FFF5E8',borderWidth:2,borderColor:colors.gold,borderRadius:radius.lg,padding:spacing.md,shadowColor:colors.shadow,shadowOpacity:.15,shadowRadius:15,elevation:4},
  crest:{alignSelf:'center',width:58,height:70,borderTopLeftRadius:30,borderTopRightRadius:30,borderBottomLeftRadius:17,borderBottomRightRadius:17,backgroundColor:colors.plum,borderWidth:2,borderColor:colors.gold,alignItems:'center',justifyContent:'center'},
  crestText:{fontFamily:'Georgia',fontWeight:'800',color:colors.goldPale},
  mapTitle:{fontFamily:'Georgia',textAlign:'center',fontSize:22,color:colors.plum,marginVertical:12},
  roomGrid:{flexDirection:'row',flexWrap:'wrap',gap:10},
  room:{width:'48%',minHeight:142,backgroundColor:'rgba(255,255,255,.62)',borderWidth:1,borderColor:colors.goldPale,borderRadius:radius.md,padding:13,justifyContent:'center'},
  roomTitle:{fontFamily:'Georgia',color:colors.plum,fontWeight:'700',fontSize:14,marginTop:7},
  roomSub:{fontSize:10,color:colors.muted,marginTop:3},
  avatarStage:{height:260,alignItems:'center',justifyContent:'center',backgroundColor:'#F2E6E1',borderRadius:radius.md},
  avatarHead:{width:66,height:75,borderRadius:34,backgroundColor:'#E7BFA6',zIndex:2},
  avatarBody:{width:125,height:145,borderTopLeftRadius:50,borderTopRightRadius:50,borderBottomLeftRadius:20,borderBottomRightRadius:20,marginTop:-5},
  avatarLabel:{position:'absolute',bottom:8,alignItems:'center'},
  shopGrid:{flexDirection:'row',flexWrap:'wrap',gap:10},
  shopItem:{width:'48%',gap:8},
  swatch:{height:72,borderRadius:12,borderWidth:1,borderColor:colors.goldPale},
  levelRow:{flexDirection:'row',alignItems:'center',gap:20},
  bigNumber:{fontFamily:'Georgia',fontSize:52,color:colors.gold,textAlign:'center'},
  stat:{marginBottom:16},
  rowBetween:{flexDirection:'row',justifyContent:'space-between',marginBottom:6},
  statName:{fontSize:13,fontWeight:'700',color:colors.ink},
  statValue:{fontSize:12,color:colors.muted},
  portrait:{width:62,height:72,borderRadius:28,alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:colors.goldPale,overflow:'hidden'},
  portraitText:{fontFamily:'Georgia',fontSize:28,color:'white'},
  time:{fontFamily:'Georgia',fontSize:17,color:colors.gold,width:50},
  empty:{color:colors.muted,fontStyle:'italic',fontSize:12,marginBottom:8,marginLeft:4},
  scheduleEditor:{marginTop:12,marginBottom:15,gap:5,borderWidth:2,borderColor:colors.gold},
  fieldLabel:{fontSize:10,fontWeight:'800',letterSpacing:.8,color:colors.plum,marginTop:9,marginBottom:3,textTransform:'uppercase'},
  scheduleInput:{backgroundColor:'#FFF9F3',borderWidth:1,borderColor:colors.goldPale,borderRadius:radius.md,paddingHorizontal:12,paddingVertical:11,color:colors.ink,fontSize:13},
  schedulePickerButton:{alignSelf:'flex-start',marginTop:5,borderRadius:radius.pill,backgroundColor:'#F9EEF1',paddingHorizontal:10,paddingVertical:6},
  schedulePickerText:{fontSize:10,fontWeight:'800',color:colors.plum},
  scheduleImportButton:{alignSelf:'center',flexDirection:'row',alignItems:'center',gap:6,borderRadius:radius.pill,backgroundColor:'#F9EEF1',paddingHorizontal:12,paddingVertical:8,marginTop:8},
  scheduleImportText:{fontSize:10,fontWeight:'800',color:colors.rose},
  scheduleNotes:{minHeight:78,textAlignVertical:'top'},
  slotList:{flexDirection:'row',flexWrap:'wrap',gap:7},
  newSlotRow:{flexDirection:'row',alignItems:'center',gap:8,marginTop:9},
  newSlotButton:{width:42,height:42,borderRadius:21,backgroundColor:colors.rose,alignItems:'center',justifyContent:'center'},
  timeInputs:{flexDirection:'row',gap:9},
  choiceWrap:{flexDirection:'row',flexWrap:'wrap',gap:7},
  choiceChip:{borderRadius:radius.pill,borderWidth:1,borderColor:colors.goldPale,backgroundColor:'#FFF9F3',paddingHorizontal:12,paddingVertical:8},
  choiceChipActive:{backgroundColor:colors.plum,borderColor:colors.gold},
  choiceText:{fontSize:10,fontWeight:'800',color:colors.plum,textTransform:'capitalize'},
  choiceTextActive:{color:'white'},
  dayPicker:{flexDirection:'row',justifyContent:'space-between',gap:4},
  dayChip:{width:38,height:38,borderRadius:19,borderWidth:1,borderColor:colors.goldPale,backgroundColor:'#FFF9F3',alignItems:'center',justifyContent:'center'},
  dayChipActive:{backgroundColor:colors.rose,borderColor:colors.gold},
  dayChipText:{fontSize:10,fontWeight:'800',color:colors.plum},
  dayChipTextActive:{color:'white'},
  toggleRows:{gap:7,marginVertical:10},
  toggleRow:{borderWidth:1,borderColor:colors.goldPale,borderRadius:radius.md,padding:10,flexDirection:'row',alignItems:'center',gap:9,backgroundColor:'#FFF9F3'},
  toggleRowActive:{backgroundColor:'#EDF2EA',borderColor:'#B8C7B4'},
  toggleRowPaused:{backgroundColor:'#F8E5E9',borderColor:'#D9A9B4'},
  pausedCard:{opacity:.62},
  scheduleMeta:{fontSize:9,color:colors.sage,fontWeight:'800',marginTop:6},
  blockActions:{flexDirection:'row',justifyContent:'flex-end',gap:7,marginTop:10,paddingTop:9,borderTopWidth:1,borderTopColor:'#EFE0D1'},
  blockAction:{flexDirection:'row',alignItems:'center',gap:4,borderRadius:radius.pill,backgroundColor:'#F9EEF1',paddingHorizontal:10,paddingVertical:7},
  blockActionText:{fontSize:9,fontWeight:'800',color:colors.plum},
  oneDate:{width:45,height:53,borderRadius:12,backgroundColor:colors.plum,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:colors.gold},
  oneDateMonth:{fontSize:9,color:colors.goldPale,fontWeight:'800'},
  oneDateDay:{fontFamily:'Georgia',fontSize:18,color:'white',fontWeight:'700'},
  journalTabs:{flexDirection:'row',gap:8,marginBottom:10},
  journalTab:{flex:1,borderRadius:radius.pill,borderWidth:1,borderColor:colors.goldPale,backgroundColor:colors.paper,paddingVertical:11,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:7},
  journalTabActive:{backgroundColor:colors.plum,borderColor:colors.gold},
  journalTabText:{fontSize:11,fontWeight:'800',color:colors.plum},
  journalTabTextActive:{color:'white'},
  searchInput:{backgroundColor:'rgba(255,253,248,.9)',borderRadius:radius.pill,borderWidth:1,borderColor:colors.goldPale,paddingHorizontal:16,paddingVertical:11,color:colors.ink,marginBottom:12},
  journalEditor:{marginTop:10,borderWidth:2,borderColor:colors.gold,gap:6},
  templateRow:{gap:7,paddingVertical:3},
  templateChip:{borderRadius:radius.pill,borderWidth:1,borderColor:colors.goldPale,backgroundColor:'#FFF9F3',paddingHorizontal:12,paddingVertical:8},
  templateChipActive:{backgroundColor:colors.rose,borderColor:colors.gold},
  templateText:{fontSize:10,fontWeight:'800',color:colors.plum},
  templateTextActive:{color:'white'},
  templatePrompt:{fontFamily:'Georgia',fontStyle:'italic',fontSize:12,lineHeight:18,color:colors.muted,backgroundColor:'#F8EEE4',padding:10,borderRadius:radius.md},
  journalTitleInput:{fontFamily:'Georgia',fontSize:20,color:colors.plum,borderBottomWidth:1,borderBottomColor:colors.goldPale,paddingVertical:10},
  journalPaper:{minHeight:230,textAlignVertical:'top',fontFamily:'Georgia',fontSize:15,lineHeight:25,color:colors.ink,backgroundColor:'#FFFDF8',borderRadius:radius.md,borderWidth:1,borderColor:colors.goldPale,padding:15},
  favoriteToggle:{backgroundColor:'#FFF5D9',borderColor:'#DCC78A'},
  journalPageCard:{marginBottom:9,position:'relative',borderLeftWidth:4,borderLeftColor:colors.rose},
  favoritePage:{borderColor:colors.gold,backgroundColor:'#FFF9E9'},
  journalExcerpt:{fontFamily:'Georgia',fontSize:13,lineHeight:20,color:colors.ink,marginTop:9},
  deleteCorner:{position:'absolute',right:8,bottom:7,padding:7},
  notebookRow:{gap:8,paddingBottom:9},
  notebookChip:{minWidth:105,borderRadius:radius.md,borderWidth:2,backgroundColor:colors.paper,paddingHorizontal:12,paddingVertical:11,flexDirection:'row',alignItems:'center',gap:7},
  notebookChipActive:{backgroundColor:'#F6E7E8'},
  notebookDot:{width:13,height:13,borderRadius:7},
  notebookText:{fontSize:11,fontWeight:'800',color:colors.plum},
  addNotebook:{flexDirection:'row',gap:8,marginBottom:12},
  addNotebookButton:{width:45,borderRadius:15,backgroundColor:colors.rose,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:colors.gold},
  noteEditor:{marginTop:10,borderWidth:2,borderColor:colors.gold,gap:7},
  notePaper:{minHeight:170,textAlignVertical:'top',fontSize:14,lineHeight:22,color:colors.ink,backgroundColor:'rgba(255,255,255,.55)',borderRadius:radius.md,borderWidth:1,borderColor:colors.goldPale,padding:13},
  highlightRow:{flexDirection:'row',gap:10},
  highlightDot:{width:31,height:31,borderRadius:16,borderWidth:1,borderColor:colors.goldPale},
  highlightDotActive:{borderWidth:3,borderColor:colors.rose},
  checklistEditorRow:{flexDirection:'row',alignItems:'center',gap:7},
  addChecklist:{flexDirection:'row',alignItems:'center',gap:6,alignSelf:'flex-start',paddingVertical:7},
  addChecklistText:{fontSize:10,fontWeight:'800',color:colors.plum},
  noteCard:{marginBottom:9,position:'relative',borderLeftWidth:4,borderLeftColor:colors.gold},
  noteCheckRow:{flexDirection:'row',alignItems:'center',gap:5,marginTop:4},
  focusSafe:{flex:1,backgroundColor:'#F7DDE6'},
  focusPage:{padding:spacing.lg,paddingBottom:50,gap:16},
  focusEyebrow:{color:colors.plum,fontSize:11,letterSpacing:2.5,fontWeight:'800',textAlign:'center'},
  focusTitle:{fontFamily:'Georgia',fontSize:31,color:colors.plum,textAlign:'center'},
  focusSub:{color:colors.ink,fontSize:13,textAlign:'center',lineHeight:19},
  characterScene:{height:205,backgroundColor:'#8B6471',borderRadius:radius.lg,borderWidth:1,borderColor:colors.gold,overflow:'hidden'},
  window:{position:'absolute',width:110,height:145,right:18,top:15,backgroundColor:'#F3DCE4',borderTopLeftRadius:55,borderTopRightRadius:55,borderWidth:5,borderColor:'#C68E9C'},
  moon:{color:'#B97B89',fontSize:37,textAlign:'center',marginTop:19},
  desk:{position:'absolute',width:210,height:50,left:15,bottom:18,backgroundColor:'#B88491',borderRadius:5},
  focusCharacter:{position:'absolute',left:63,bottom:52,alignItems:'center'},
  focusHead:{width:45,height:48,borderRadius:24,backgroundColor:'#DCAD96'},
  focusDress:{width:70,height:85,borderTopLeftRadius:25,borderTopRightRadius:25,backgroundColor:colors.rose},
  focusPose:{position:'absolute',left:18,bottom:0,width:150,height:200},
  studyPose:{position:'absolute',left:25,bottom:-32,width:118,height:205,opacity:.9},
  practiceCue:{position:'absolute',left:158,right:12,bottom:15,backgroundColor:'rgba(255,246,244,.9)',borderRadius:radius.md,borderWidth:1,borderColor:colors.goldPale,padding:10},
  practiceCueTitle:{fontFamily:'Georgia',fontSize:14,fontWeight:'700',color:colors.plum},
  practiceCueText:{fontSize:9,color:colors.muted,marginTop:3},
  sceneCaption:{position:'absolute',color:'#FFF5F6',bottom:5,right:12,fontSize:10,fontStyle:'italic'},
  goal:{backgroundColor:colors.paper,borderRadius:radius.md,padding:14,color:colors.ink,borderWidth:1,borderColor:colors.goldPale},
  customGoal:{minHeight:92,textAlignVertical:'top'},
  reflectionInput:{minHeight:105,textAlignVertical:'top'},
  timer:{fontFamily:'Georgia',fontSize:58,color:colors.plum,textAlign:'center',fontVariant:['tabular-nums']},
  timerButton:{alignSelf:'center',backgroundColor:colors.goldPale,borderRadius:radius.pill,paddingHorizontal:25,paddingVertical:11,flexDirection:'row',alignItems:'center',gap:7},
  timerButtonDone:{opacity:.65},
  timerButtonText:{color:colors.plum,fontWeight:'800'},
  timerStatus:{fontSize:12,color:colors.muted,textAlign:'center',fontWeight:'700'},
  step:{fontSize:13,color:colors.ink,lineHeight:25},
  link:{color:colors.rose,fontWeight:'800',marginTop:7},
  sceneSafe:{flex:1},
  sceneArt:{flex:1,alignItems:'center',justifyContent:'center',padding:30},
  chandelier:{fontSize:80,color:colors.gold},
  scenePlace:{letterSpacing:3,color:colors.gold,fontWeight:'700',fontSize:10,marginTop:15},
  sceneTitle:{fontFamily:'Georgia',fontSize:29,color:colors.plum,textAlign:'center',marginTop:8},
  sceneCast:{fontFamily:'Georgia',fontStyle:'italic',fontSize:12,color:colors.rose,textAlign:'center',marginTop:8},
  scenePortrait:{position:'absolute',right:12,bottom:0,width:145,height:175,overflow:'hidden'},
  dialogue:{backgroundColor:colors.paper,padding:spacing.lg,borderTopLeftRadius:radius.lg,borderTopRightRadius:radius.lg,borderTopWidth:2,borderColor:colors.gold,minHeight:250,gap:12},
  speaker:{fontFamily:'Georgia',fontSize:16,color:colors.rose,fontWeight:'700'},
  dialogueText:{fontFamily:'Georgia',fontSize:18,lineHeight:28,color:colors.ink,flex:1},
  lineCount:{textAlign:'center',fontSize:10,color:colors.muted},
  choiceList:{gap:9,marginTop:3},
  storyChoice:{minHeight:54,borderRadius:radius.md,borderWidth:1,borderColor:colors.gold,backgroundColor:'#F8E4EA',paddingHorizontal:13,paddingVertical:11,flexDirection:'row',alignItems:'center',gap:10},
  storyChoiceText:{flex:1,fontFamily:'Georgia',fontSize:13,fontWeight:'700',color:colors.plum},
  npcCard:{marginBottom:11,borderLeftWidth:5},
  npcPersonality:{fontFamily:'Georgia',fontStyle:'italic',fontSize:12,color:colors.plum,marginTop:12},
  npcLocation:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:'#F8EEE4',borderRadius:radius.md,padding:9,marginTop:10},
  npcLocationText:{flex:1,fontSize:10,lineHeight:14,color:colors.muted,fontWeight:'700'},
  npcTalkButton:{alignSelf:'flex-start',flexDirection:'row',alignItems:'center',gap:6,borderRadius:radius.pill,backgroundColor:'#F7E3E8',borderWidth:1,borderColor:colors.goldPale,paddingHorizontal:11,paddingVertical:8,marginTop:10},
  npcTalkText:{fontSize:10,fontWeight:'800',color:colors.plum},
  npcEvent:{flexDirection:'row',alignItems:'center',gap:9,borderTopWidth:1,borderTopColor:colors.goldPale,paddingTop:11,marginTop:11},
  npcEventTitle:{fontFamily:'Georgia',fontSize:12,fontWeight:'700',color:colors.plum},
  knownFacts:{backgroundColor:'#F8EEE4',borderRadius:radius.md,padding:9,marginTop:9,gap:3},
  knownFactsTitle:{fontFamily:'Georgia',fontSize:12,fontWeight:'700',color:colors.plum},
  knownFactText:{fontSize:10,lineHeight:15,color:colors.muted},
  conversationSafe:{flex:1,backgroundColor:colors.plum},
  conversationTop:{position:'absolute',left:16,right:16,top:18,zIndex:2,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  conversationPanel:{marginTop:'auto',maxHeight:'82%',backgroundColor:colors.paper,borderTopWidth:2,borderColor:colors.gold,borderTopLeftRadius:radius.lg,borderTopRightRadius:radius.lg,padding:spacing.lg,gap:10},
  conversationEyebrow:{fontSize:10,fontWeight:'800',letterSpacing:1.5,color:colors.gold},
  conversationTitle:{fontFamily:'Georgia',fontSize:27,color:colors.plum},
  conversationSub:{fontFamily:'Georgia',fontStyle:'italic',fontSize:12,lineHeight:18,color:colors.muted},
  dailySceneCard:{backgroundColor:'#FFF9F3',borderWidth:1,borderColor:colors.gold,padding:12,borderRadius:radius.md,gap:8},
  dailySceneTitle:{flex:1,fontFamily:'Georgia',fontSize:16,fontWeight:'700',color:colors.plum},
  dailySceneLine:{fontFamily:'Georgia',fontSize:13,lineHeight:20,color:colors.ink},
  dailySceneChoices:{gap:6,marginTop:3},
  dailySceneChoice:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderTopWidth:1,borderTopColor:colors.goldPale,paddingTop:8},
  dailySceneChoiceText:{flex:1,fontSize:11,fontWeight:'800',color:colors.plum},
  dailySceneResponse:{backgroundColor:'#F1F6EE',borderRadius:radius.md,padding:10,borderLeftWidth:3,borderLeftColor:colors.sage},
  dailySceneResponseText:{fontFamily:'Georgia',fontSize:13,lineHeight:20,color:colors.ink},
  npcQuestions:{borderTopWidth:1,borderTopColor:colors.goldPale,paddingTop:9,gap:6},
  npcQuestionsLabel:{fontSize:10,fontWeight:'800',color:colors.muted},
  npcQuestionRow:{gap:6},
  npcQuestion:{flexDirection:'row',alignItems:'center',gap:7,borderRadius:radius.pill,backgroundColor:'#F8E4EA',paddingHorizontal:10,paddingVertical:7},
  npcQuestionText:{fontSize:10,fontWeight:'800',color:colors.plum},
  conversationLines:{minHeight:120,maxHeight:230},
  conversationLinesContent:{gap:8,paddingVertical:5},
  conversationEmpty:{fontFamily:'Georgia',fontSize:15,lineHeight:23,color:colors.muted,paddingVertical:16},
  conversationLine:{backgroundColor:'#F8EEE4',borderRadius:radius.md,padding:12,borderLeftWidth:3,borderLeftColor:colors.rose},
  conversationLineText:{fontFamily:'Georgia',fontSize:15,lineHeight:23,color:colors.ink},
  conversationTopics:{gap:7},
  conversationTopic:{borderWidth:1,borderColor:colors.goldPale,borderRadius:radius.md,paddingHorizontal:11,paddingVertical:9,backgroundColor:'#FFF9F3'},
  conversationTopicActive:{borderColor:colors.rose,backgroundColor:'#F8E4EA'},
  conversationTopicLabel:{fontFamily:'Georgia',fontSize:13,fontWeight:'700',color:colors.plum},
  conversationTopicLabelActive:{color:colors.plum},
  conversationTopicDescription:{fontSize:10,color:colors.muted,marginTop:2},
  conversationTopicDescriptionActive:{color:colors.ink},
  conversationNote:{fontSize:9,lineHeight:14,color:colors.muted,textAlign:'center'},
  artHelp:{borderWidth:2,borderColor:colors.gold,backgroundColor:'#FFF7ED'},
  artTargetRow:{gap:7,paddingVertical:5},
  artTarget:{borderRadius:radius.pill,borderWidth:1,borderColor:colors.goldPale,backgroundColor:'#FFF9F3',paddingHorizontal:12,paddingVertical:9},
  artTargetActive:{backgroundColor:colors.plum,borderColor:colors.gold},
  artTargetText:{fontSize:10,fontWeight:'800',color:colors.plum,textTransform:'capitalize'},
  decorIdea:{borderRadius:radius.pill,borderWidth:1,borderColor:'#DDB5BE',backgroundColor:'#F9E2E8',paddingHorizontal:11,paddingVertical:8},
  decorIdeaText:{fontSize:9,fontWeight:'800',color:colors.plum},
  artPreview:{height:470,borderRadius:radius.lg,overflow:'hidden',backgroundColor:'#EFDCE1',borderWidth:2,borderColor:colors.gold,alignItems:'center',justifyContent:'center'},
  artEmpty:{alignItems:'center',justifyContent:'center',backgroundColor:'rgba(255,253,248,.86)',borderRadius:radius.md,padding:18},
  artAssetCard:{marginBottom:10,borderLeftWidth:4,borderLeftColor:colors.rose},
  artAssetThumb:{width:70,height:82,borderRadius:radius.md,backgroundColor:'#F3E2E5'},
  artInlineName:{fontFamily:'Georgia',fontSize:14,fontWeight:'700',color:colors.ink,borderBottomWidth:1,borderBottomColor:colors.goldPale,paddingVertical:5},
  artControls:{flexDirection:'row',flexWrap:'wrap',gap:7,marginTop:11},
  artControlGroup:{width:'48%',borderRadius:radius.md,backgroundColor:'#F8EEE4',padding:8},
  artControlLabel:{fontSize:9,fontWeight:'800',color:colors.muted,textAlign:'center'},
  artButtons:{flexDirection:'row',justifyContent:'center',gap:8,marginTop:6},
  artMiniButton:{width:35,height:30,borderRadius:10,backgroundColor:colors.paper,borderWidth:1,borderColor:colors.goldPale,alignItems:'center',justifyContent:'center'},
  artDelete:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6,paddingTop:10,marginTop:9,borderTopWidth:1,borderTopColor:colors.goldPale},
  artDeleteText:{fontSize:9,fontWeight:'800',color:colors.rose},
  hotspotLabel:{fontSize:8,fontWeight:'900',color:'white',marginTop:2,textShadowColor:'rgba(0,0,0,.35)',textShadowRadius:2},
  roomChevron:{position:'absolute',right:9,top:9},
  artUtilityRow:{marginTop:8,flexDirection:'row',justifyContent:'flex-end'},
  artReset:{flexDirection:'row',alignItems:'center',gap:6,borderWidth:1,borderColor:colors.goldPale,backgroundColor:'#FFF8F3',paddingHorizontal:11,paddingVertical:8,borderRadius:radius.pill},
  artResetText:{fontSize:10,fontWeight:'800',color:colors.plum},
  readerTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingTop:4},
  paperBack:{width:40,height:40,borderRadius:20,backgroundColor:colors.paper,borderWidth:1,borderColor:colors.goldPale,alignItems:'center',justifyContent:'center'},
  bookCover:{width:48,height:62,borderRadius:5,backgroundColor:colors.plum,borderWidth:2,borderColor:colors.gold,alignItems:'center',justifyContent:'center'},
  bookHint:{fontSize:10,color:colors.rose,fontWeight:'700',marginTop:5},
  readerSafe:{flex:1,backgroundColor:'#F7EFDF'},
  readerHeader:{height:70,paddingHorizontal:16,flexDirection:'row',alignItems:'center',gap:12,borderBottomWidth:1,borderColor:colors.goldPale,backgroundColor:colors.paper},
  readerHeading:{flex:1},
  readerTitle:{fontFamily:'Georgia',fontSize:16,fontWeight:'700',color:colors.plum},
  readerMeta:{fontSize:10,color:colors.muted,marginTop:2},
  fontButtons:{flexDirection:'row',alignItems:'baseline',gap:14},
  fontSmall:{fontFamily:'Georgia',fontSize:14,color:colors.plum,fontWeight:'700'},
  fontLarge:{fontFamily:'Georgia',fontSize:22,color:colors.plum,fontWeight:'700'},
  bookPage:{paddingHorizontal:27,paddingVertical:32},
  bookText:{fontFamily:'Georgia',color:'#3F3434'},
  bookOrnament:{fontFamily:'Georgia',fontSize:24,textAlign:'center',color:colors.gold,marginVertical:18},
  editorModeTabs:{flexDirection:'row',gap:8,marginBottom:12,backgroundColor:'#F7EDE7',padding:5,borderRadius:radius.pill,borderWidth:1,borderColor:colors.goldPale},
  editorModeTab:{flex:1,minHeight:46,borderRadius:radius.pill,alignItems:'center',justifyContent:'center',flexDirection:'row',gap:7},
  editorModeTabActive:{backgroundColor:colors.plum},
  editorModeText:{fontSize:12,fontWeight:'800',color:colors.plum},
  editorModeTextActive:{color:'white'},
  avatarEditorStage:{height:440,borderRadius:radius.lg,overflow:'hidden',borderWidth:2,borderColor:colors.gold,alignItems:'center',justifyContent:'center',marginBottom:12},
  avatarEditorPose:{position:'absolute',width:'82%',height:'92%',bottom:18},
  wearableOverlay:{position:'absolute'},
  editorStageLabel:{position:'absolute',left:12,right:12,bottom:10,backgroundColor:'rgba(255,253,248,.92)',borderRadius:radius.md,paddingHorizontal:12,paddingVertical:9,borderWidth:1,borderColor:colors.goldPale},
  editorStageName:{fontFamily:'Georgia',fontSize:14,fontWeight:'700',color:colors.plum,textAlign:'center'},
  editorStageSub:{fontSize:9,color:colors.muted,textAlign:'center',marginTop:3},
  editorCategories:{gap:7,paddingBottom:10},
  editorCategory:{minWidth:88,paddingHorizontal:15,paddingVertical:10,borderRadius:radius.pill,borderWidth:1,borderColor:colors.goldPale,backgroundColor:colors.paper,alignItems:'center'},
  editorCategoryActive:{backgroundColor:colors.rose,borderColor:colors.gold},
  editorCategoryText:{fontSize:11,fontWeight:'800',color:colors.plum,textTransform:'capitalize'},
  editorCategoryTextActive:{color:'white'},
  itemCarousel:{gap:9,paddingVertical:5,paddingRight:12},
  clothingCard:{width:108,minHeight:150,borderRadius:radius.md,borderWidth:1,borderColor:colors.goldPale,backgroundColor:'#FFF9F3',padding:7},
  clothingCardActive:{borderWidth:2,borderColor:colors.rose,backgroundColor:'#FCE9ED'},
  clothingThumb:{height:92,borderRadius:11,backgroundColor:'#F1E1DD',alignItems:'center',justifyContent:'center',overflow:'hidden'},
  clothingThumbImage:{width:'94%',height:'94%'},
  clothingSwatch:{width:54,height:68,borderRadius:16,borderWidth:1,borderColor:colors.goldPale},
  clothingName:{fontFamily:'Georgia',fontSize:10,fontWeight:'700',color:colors.plum,textAlign:'center',marginTop:6},
  clothingMeta:{fontSize:8,color:colors.muted,textAlign:'center',marginTop:3},
  facePick:{width:112,height:145,borderRadius:radius.md,borderWidth:1,borderColor:colors.goldPale,backgroundColor:'#FFF9F3',padding:7},
  facePickImage:{width:'100%',height:108},
  posePick:{width:112,height:168,borderRadius:radius.md,borderWidth:1,borderColor:colors.goldPale,backgroundColor:'#FFF9F3',padding:7},
  posePickImage:{width:'100%',height:128},
  editorActions:{flexDirection:'row',gap:8,marginTop:12,flexWrap:'wrap'},
  softEditorButton:{flexGrow:1,minWidth:'46%',borderRadius:radius.md,borderWidth:1,borderColor:colors.goldPale,backgroundColor:'#F9EEF1',paddingHorizontal:12,paddingVertical:11,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6},
  softEditorButtonText:{fontSize:10,fontWeight:'800',color:colors.plum,textAlign:'center'},
  savedLookRow:{gap:8,paddingBottom:8},
  savedLookCard:{width:132,borderRadius:radius.md,borderWidth:1,borderColor:colors.goldPale,backgroundColor:'#FFF9F3',padding:11,alignItems:'center'},
  savedLookName:{fontFamily:'Georgia',fontSize:11,fontWeight:'700',color:colors.plum,textAlign:'center',marginTop:5},
  roomEditorStage:{height:430,borderRadius:radius.lg,overflow:'hidden',borderWidth:2,borderColor:colors.gold,alignItems:'center',justifyContent:'center',marginBottom:4,backgroundColor:'#E8D9CF'},
  roomEditorEmpty:{backgroundColor:'rgba(255,253,248,.88)',borderRadius:radius.md,padding:16,alignItems:'center',gap:7},
  decorCard:{width:112,minHeight:145,borderRadius:radius.md,borderWidth:1,borderColor:colors.goldPale,backgroundColor:'#FFF9F3',padding:7,position:'relative'},
  decorThumb:{width:'100%',height:96,borderRadius:10,backgroundColor:'#F1E1DD'},
  visibilityTap:{position:'absolute',right:6,top:6,width:28,height:28,borderRadius:14,backgroundColor:'rgba(255,253,248,.9)',alignItems:'center',justifyContent:'center'},
  positionCard:{marginTop:10,borderWidth:2,borderColor:colors.gold},
  positionReset:{fontSize:10,fontWeight:'800',color:colors.rose},
  positionControls:{flexDirection:'row',alignItems:'center',justifyContent:'space-around',marginTop:10,gap:16},
  directionPad:{width:132,height:132,position:'relative'},
  directionButton:{position:'absolute',width:42,height:42,borderRadius:21,backgroundColor:'#F9EEF1',borderWidth:1,borderColor:colors.goldPale,alignItems:'center',justifyContent:'center'},
  directionUp:{top:0,left:45},directionDown:{bottom:0,left:45},directionLeft:{left:0,top:45},directionRight:{right:0,top:45},
  directionCenter:{position:'absolute',left:52,top:52,width:28,height:28,borderRadius:14,backgroundColor:colors.goldPale},
  scaleControls:{gap:9},
  scaleButton:{minWidth:92,borderRadius:radius.md,borderWidth:1,borderColor:colors.goldPale,backgroundColor:'#FFF9F3',paddingHorizontal:12,paddingVertical:10,alignItems:'center'},
  scaleText:{fontSize:9,fontWeight:'800',color:colors.plum,marginTop:2},
  tabBar:{height:82,paddingTop:8,paddingBottom:20,backgroundColor:colors.paper,borderTopColor:colors.goldPale},
  tabLabel:{fontSize:10,fontWeight:'700'},
});
