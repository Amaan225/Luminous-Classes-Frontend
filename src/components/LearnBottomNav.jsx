import React from 'react';
import {Link} from 'react-router-dom';
import {Home,FileText,ClipboardList,BarChart3} from 'lucide-react';
const ITEMS=[['home','Home',Home,'/learn'],['notes','Notes',FileText,'/learn?view=notes'],['tests','Tests',ClipboardList,'/learn?view=quizzes'],['progress','Progress',BarChart3,'/learn/dashboard']];
export default function LearnBottomNav({current}){return <nav className="learn-bottom-nav" aria-label="Learn sections">{ITEMS.map(([id,label,Icon,to])=><Link key={id} to={to} aria-current={current===id?'page':undefined}><Icon size={21} aria-hidden="true"/><span>{label}</span></Link>)}</nav>}
