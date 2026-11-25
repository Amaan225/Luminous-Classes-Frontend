import React from 'react';
import {Link} from 'react-router-dom';
import {LogOut} from 'lucide-react';
import {useLearnerAccount} from '../learner-session';
const initial=n=>(String(n||'').trim()[0]||'?').toUpperCase();
export function LearnHeader({acct,onSignIn}){const inn=acct?.status==='in';return <header className="learn-header"><Link className="learn-logo" to="/">TUTO₹<span>49</span></Link><nav aria-label="Learn navigation">{inn&&<><Link to="/learn/dashboard">My dashboard</Link>{acct.picture?<img className="learn-avatar" src={acct.picture} alt="" referrerPolicy="no-referrer"/>:<span className="learn-avatar learn-avatar-fallback" aria-hidden="true">{initial(acct.name)}</span>}<button type="button" className="learn-icon-btn" onClick={acct.signOut} aria-label="Sign out" title="Sign out"><LogOut size={19} aria-hidden="true"/></button></>}{acct?.status==='out'&&onSignIn&&<button type="button" className="learn-text-button" onClick={onSignIn}>Sign in</button>}</nav></header>}
export default function LearnHeaderAuto(){const acct=useLearnerAccount();return <LearnHeader acct={acct}/>}
