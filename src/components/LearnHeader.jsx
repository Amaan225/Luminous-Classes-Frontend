import React from 'react';
import {Link} from 'react-router-dom';
import {LogOut,Sun,Moon,Monitor} from 'lucide-react';
import {useSiteTheme} from '../site-theme';
import {themeButtonProps} from './SiteThemeButton';
import {useLearnerAccount} from '../learner-session';
const initial=n=>(String(n||'').trim()[0]||'?').toUpperCase();
const TABS=[['dashboard','Dashboard','/learn/dashboard'],['test','Test','/learn?view=quizzes'],['notes','Notes','/learn?view=notes']];
export function LearnHeader({acct,onSignIn,current}){const inn=acct?.status==='in';const theme=useSiteTheme();const ThemeIcon={light:Sun,dark:Moon,auto:Monitor}[theme.mode]||Sun;return <header className="learn-header"><Link className="learn-logo" to="/">TUTO₹<span>49</span></Link>{inn&&<nav className="learn-tabs-nav" aria-label="Learn sections">{TABS.map(([id,label,to])=><Link key={id} to={to} aria-current={current===id?'page':undefined}>{label}</Link>)}</nav>}<nav aria-label="Account" className="learn-account-nav"><button type="button" className="learn-icon-btn learn-theme-btn" {...themeButtonProps(theme)}><ThemeIcon size={19} aria-hidden="true"/></button>{inn&&<>{acct.picture?<img className="learn-avatar" src={acct.picture} alt="" referrerPolicy="no-referrer"/>:<span className="learn-avatar learn-avatar-fallback" aria-hidden="true">{initial(acct.name)}</span>}<button type="button" className="learn-icon-btn" onClick={acct.signOut} aria-label="Sign out" title="Sign out"><LogOut size={19} aria-hidden="true"/></button></>}{acct?.status==='out'&&onSignIn&&<button type="button" className="learn-text-button" onClick={onSignIn}>Sign in</button>}</nav></header>}
export default function LearnHeaderAuto({current}){const acct=useLearnerAccount();return <LearnHeader acct={acct} current={current}/>}
