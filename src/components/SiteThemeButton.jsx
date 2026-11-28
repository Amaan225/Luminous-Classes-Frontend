import React from 'react';
import {Sun,Moon,Monitor} from 'lucide-react';
import {useSiteTheme,THEME_LABEL} from '../site-theme';
const ICON={light:Sun,dark:Moon,auto:Monitor};
export const themeButtonProps=t=>({onClick:t.toggle,'aria-label':'Appearance: '+THEME_LABEL[t.mode]+'. Switch to '+THEME_LABEL[t.next],title:t.mode==='auto'?'Auto: dark 6pm to 6am in your device time. Click for Light.':THEME_LABEL[t.mode]+'. Click for '+THEME_LABEL[t.next]+'.'});
export default function SiteThemeButton({inline=false}){const t=useSiteTheme();const Icon=ICON[t.mode]||Sun;
 return <button type="button" className={inline?'site-theme-btn':'site-theme-btn site-theme-fab'} {...themeButtonProps(t)}><Icon size={19} aria-hidden="true"/></button>}
