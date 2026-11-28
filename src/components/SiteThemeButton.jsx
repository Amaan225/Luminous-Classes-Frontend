import React from 'react';
import {Sun,Moon} from 'lucide-react';
import {useSiteTheme} from '../site-theme';
export default function SiteThemeButton({inline=false}){const t=useSiteTheme();const dark=t.mode==='dark';
 return <button type="button" onClick={t.toggle} className={inline?'site-theme-btn':'site-theme-btn site-theme-fab'} aria-label={dark?'Switch to light mode':'Switch to dark mode'} title={dark?'Light mode':'Dark mode'}>{dark?<Sun size={19} aria-hidden="true"/>:<Moon size={19} aria-hidden="true"/>}</button>}
