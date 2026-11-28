import React from 'react';
import {Sun,Moon,Monitor} from 'lucide-react';
import {useSiteTheme,THEME_LABEL} from '../site-theme';
export {isDarkNow as isTutorDark} from '../site-theme';
// The tutor board uses the same shared Light/Dark/Auto choice as the rest of the site.
export function useTutorAppearance(){const t=useSiteTheme();return {mode:t.mode,setMode:t.setMode,dark:t.dark};}
const ORDER=['light','dark','auto'];const ICON={light:Sun,dark:Moon,auto:Monitor};
export default function TutorAppearance({appearance,inline=false}){const next=ORDER[(ORDER.indexOf(appearance.mode)+1)%3];const Icon=ICON[appearance.mode]||Monitor;return <button type="button" className={inline?"tutor-theme-btn":"tutor-theme-fab"} onClick={()=>appearance.setMode(next)} aria-label={'Appearance: '+THEME_LABEL[appearance.mode]+'. Switch to '+THEME_LABEL[next]} title={appearance.mode==='auto'?'Auto: dark 6pm to 6am in your device time. Click for Light.':THEME_LABEL[appearance.mode]+'. Click for '+THEME_LABEL[next]+'.'}><Icon size={20} aria-hidden="true"/></button>}
