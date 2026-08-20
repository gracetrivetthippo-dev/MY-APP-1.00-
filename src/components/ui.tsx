import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing } from '../theme';

export function ScreenTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return <View style={styles.titleWrap}>
    {eyebrow && <Text style={styles.eyebrow}>{eyebrow.toUpperCase()}</Text>}
    <Text style={styles.title}>{title}</Text>
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    <View style={styles.flourish}><View style={styles.line}/><Text style={styles.diamond}>◆</Text><View style={styles.line}/></View>
  </View>;
}

export function PaperCard({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.cardShadow, style]}><View style={styles.card}><View style={styles.cornerTL}/><View style={styles.cornerBR}/>{children}</View></View>;
}

export function Pill({ children, tone='rose' }: { children: ReactNode; tone?: 'rose' | 'gold' | 'sage' }) {
  const bg = tone === 'gold' ? colors.goldPale : tone === 'sage' ? '#DDE5D9' : '#F2DADD';
  return <View style={[styles.pill, { backgroundColor:bg }]}><Text style={styles.pillText}>{children}</Text></View>;
}

export function GoldButton({ label, onPress, disabled=false }: { label: string; onPress: () => void; disabled?: boolean }) {
  return <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.button, (pressed || disabled) && { opacity:.55 }]}>
    <LinearGradient colors={[colors.gold, '#8E6B36']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.buttonGradient}><Text style={styles.buttonText}>{label}</Text></LinearGradient>
  </Pressable>;
}

export function SectionLabel({ children, action }: { children: ReactNode; action?: string }) {
  return <View style={styles.sectionRow}><Text style={styles.section}>{children}</Text>{action && <Text style={styles.action}>{action}</Text>}</View>;
}

export function ProgressBar({ value, max=100, color=colors.rose }: { value:number; max?:number; color?:string }) {
  return <View style={styles.track}><View style={[styles.fill, { width:`${Math.min(100, value/max*100)}%`, backgroundColor:color }]}/></View>;
}

const styles = StyleSheet.create({
  titleWrap:{ alignItems:'center', paddingTop:spacing.md, paddingBottom:spacing.lg },
  eyebrow:{ color:colors.gold, fontSize:11, letterSpacing:2.2, fontWeight:'800' },
  title:{ color:colors.plum, fontFamily:'Georgia', fontSize:31, textAlign:'center', marginTop:4 },
  subtitle:{ color:colors.muted, fontSize:14, textAlign:'center', lineHeight:20, marginTop:5, maxWidth:330 },
  flourish:{ flexDirection:'row', alignItems:'center', width:110, gap:7, marginTop:12 }, line:{ height:1, backgroundColor:colors.goldPale, flex:1 }, diamond:{ color:colors.gold, fontSize:8 },
  cardShadow:{ shadowColor:colors.shadow, shadowOpacity:.1, shadowRadius:12, shadowOffset:{width:0,height:5}, elevation:3 },
  card:{ backgroundColor:colors.paper, borderWidth:1, borderColor:colors.goldPale, borderRadius:radius.md, padding:spacing.md, overflow:'hidden' },
  cornerTL:{ position:'absolute', width:24, height:24, borderLeftWidth:2, borderTopWidth:2, borderColor:colors.gold, left:5, top:5, borderTopLeftRadius:8 },
  cornerBR:{ position:'absolute', width:24, height:24, borderRightWidth:2, borderBottomWidth:2, borderColor:colors.gold, right:5, bottom:5, borderBottomRightRadius:8 },
  pill:{ paddingHorizontal:10, paddingVertical:5, borderRadius:radius.pill, alignSelf:'flex-start' }, pillText:{ color:colors.ink, fontSize:11, fontWeight:'700' },
  button:{ borderRadius:radius.pill, overflow:'hidden', alignSelf:'stretch' }, buttonGradient:{ paddingVertical:12, paddingHorizontal:18, alignItems:'center' }, buttonText:{ color:colors.white, fontSize:13, fontWeight:'800', letterSpacing:.5 },
  sectionRow:{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginTop:spacing.lg, marginBottom:10 }, section:{ color:colors.plum, fontFamily:'Georgia', fontWeight:'700', fontSize:19 }, action:{ color:colors.rose, fontSize:12, fontWeight:'700' },
  track:{ height:7, backgroundColor:'#EEE4DD', borderRadius:8, overflow:'hidden' }, fill:{ height:'100%', borderRadius:8 },
});
