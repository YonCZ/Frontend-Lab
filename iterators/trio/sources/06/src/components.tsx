import type { ReactNode } from 'react';
import { categories, useApp, type Trip, type Language } from './context';
export function Icon({ name = 'arrow', size = 22 }: { name?: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    diagonal: <path d="M6 18 18 6M6 6h12v12" />,
    back: <path d="m14 5-7 7 7 7M7 12h14" />,
    pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    phone: <path d="m8 3-4 2c-2 6 9 17 15 15l2-4-5-3-2 2c-3-1-5-3-5-5l2-2-3-5Z" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 6 9 7 9-7" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M7 3v4m10-4v4M3 11h18m-13 4h2m4 0h2" /></>,
    spark: <><path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z" /><path d="m20 2 .5 1.5L22 4l-1.5.5L20 6l-.5-1.5L18 4l1.5-.5L20 2Z" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>,
    ticket: <><path d="m4 6 15-3 2 7c-3 1-2 4 1 4l-1 6-16 1-1-6c3-1 2-4-1-4l1-5Z" /><path d="m15 6 2 11" strokeDasharray="2 3" /></>,
    water: <path d="M2 14c3-4 4 4 8 0s5 4 9 0m-17 5c3-4 4 4 8 0s5 4 9 0M8 3c-5 6 5 6 0 10m8-10c-5 6 5 6 0 10" />,
    bus: <><rect x="4" y="3" width="16" height="16" rx="4" /><path d="M4 12h16M8 19v2m8-2v2M8 15h1m6 0h1M8 7h8" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    plus: <path d="M5 12h14M12 5v14" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 6v6l4 2" /></>,
    people: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3m1-16a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5v2" /></>,
    search: <><circle cx="10" cy="10" r="6" /><path d="m15 15 6 6" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.arrow}</svg>;
}
export function Link({ to, children, className = '', ...props }: { to: string; children: ReactNode; className?: string; [key: string]: any }) { return <a href={`#${to}`} className={className} {...props}>{children}</a>; }
export function Wordmark({ footer = false }: { footer?: boolean }) { const { t } = useApp(); return <Link to="/" className={`wordmark ${footer ? 'footer-wordmark' : ''}`} aria-label={t('Trio, úvodní stránka', 'Trio, home')}><span>trio<span className="logo-dot">.</span></span>{!footer && <small>{t('cestovní agentura', 'travel agency')}</small>}</Link>; }
export function CategoryName({ id }: { id: string }) { const { lang } = useApp(); return <>{categories.find(category => category.id === id)?.[lang] || id}</>; }
export function TripImage({ trip, large = false }: { trip: Trip; large?: boolean }) {
  const { lang } = useApp();
  const file = trip.image === '10244l.jpg' && large ? 'vienna-christmas-market.jpg' : trip.image === '10292l.jpg' && large ? 'hotel-sissy.jpg' : trip.image;
  return <img src={`assets/${file}`} alt={trip[lang].title} loading={large ? 'eager' : 'lazy'} />;
}
export function Header({ path, lang, setLang }: { path: string; lang: Language; setLang: (lang: Language) => void }) {
  const { t } = useApp();
  return <><a className="skip-link" href="#main" onClick={event => {event.preventDefault();document.getElementById('main')?.focus();document.getElementById('main')?.scrollIntoView();}}>{t('Přeskočit na obsah', 'Skip to content')}</a><div className="topline"><span><Icon name="pin" size={13} />{t('Z Moravských Budějovic za zážitky', 'From Moravské Budějovice to new experiences')}</span><a href="tel:+420737102348"><Icon name="phone" size={13} /> +420 737 102 348</a></div><header className="site-header"><Wordmark /><nav aria-label={t('Hlavní navigace', 'Main navigation')}><Link to="/trips" className={path === '/trips' ? 'nav-active' : ''}>{t('Naše zájezdy', 'Our trips')}</Link><Link to="/trips?category=greece">{t('Léto v Řecku', 'Summer in Greece')}<span className="nav-year">2027</span></Link><Link to="/about">{t('O nás', 'About us')}</Link><Link to="/contact">{t('Kontakt', 'Contact')}</Link></nav><div className="header-actions"><button className="language" onClick={() => setLang(lang === 'cs' ? 'en' : 'cs')} aria-label={t('Switch to English', 'Přepnout do češtiny')}><span className={lang === 'cs' ? 'selected-language' : ''}>CZ</span><span className="language-divider">/</span><span className={lang === 'en' ? 'selected-language' : ''}>EN</span></button><Link to="/trips" className="button small">{t('Vybrat zájezd', 'Find a trip')}<Icon size={17} /></Link></div></header></>;
}
export function Footer() {
  const { t } = useApp();
  return <footer className="site-footer"><div className="footer-top"><div><Wordmark footer /><p>{t('Malé výlety. Velké vzpomínky.', 'Little trips. Lasting memories.')}</p></div><div><h3>{t('Vyrazte s námi', 'Travel with us')}</h3>{categories.map(category => <Link key={category.id} to={`/trips?category=${category.id}`}><CategoryName id={category.id} /></Link>)}</div><div><h3>{t('Jsme tu pro vás', 'Here to help')}</h3><a href="tel:+420737102348">+420 737 102 348</a><a href="mailto:info@ca-trio.cz">info@ca-trio.cz</a><p>Šafaříkova 1304<br />676 02 Moravské Budějovice</p></div><div><h3>{t('Zastavte se u nás', 'Visit our office')}</h3><p>{t('Úterý a čtvrtek', 'Tuesday and Thursday')}<br />10:00 {t('až', 'to')} 16:30</p><a href="https://www.facebook.com/TRIOcestovniagentura" target="_blank" rel="noreferrer">Facebook<Icon name="diagonal" size={14} /></a><Link to="/terms">{t('Storno podmínky', 'Cancellation terms')}</Link></div></div><div className="footer-bottom"><span>© 2026 CA TRIO. Ludmila Přikrylová. IČ 12152854</span><span>{t('Přijímáme poukázky', 'Vouchers welcome')}<b>PLUXEE</b><b>EDENRED</b><b>BENEFITY</b></span></div></footer>;
}
export function TripCard({ trip, large = false }: { trip: Trip; large?: boolean }) {
  const { lang, t, money, date } = useApp();
  return <article className="trip-card"><Link to={`/trip/${trip.id}`} className="trip-card-photo"><TripImage trip={trip} large={large} /><span className="photo-category"><CategoryName id={trip.category} /></span>{trip.soldOut && <span className="sold-out-label">{t('Vyprodáno', 'Sold out')}</span>}<span className="photo-arrow"><Icon name="diagonal" size={21} /></span></Link><div className="trip-card-body"><div className="trip-meta"><span><Icon name="calendar" size={15} />{date(trip.date)}</span><span>{trip.category === 'greece' ? t('Pobyt u moře', 'Seaside stay') : t('Jednodenní výlet', 'Day trip')}</span></div><h3><Link to={`/trip/${trip.id}`}>{trip[lang].title}</Link></h3><div className="trip-card-bottom"><span className="trip-price">{money(trip.price)}<small> / {t(trip.category === 'culture' ? 'doprava' : 'osoba', trip.category === 'culture' ? 'transport' : 'person')}</small></span><span className={`availability ${trip.soldOut ? 'unavailable' : ''}`}><i />{trip.soldOut ? t('Vyprodáno', 'Sold out') : t('Volná místa', 'Places available')}</span></div></div></article>;
}
export function CategoryLinks() {
  const { lang, trips, t } = useApp();
  return <div className="category-links">{categories.map(category => {const count=trips.filter(trip => trip.category === category.id && trip.published).length;return <Link to={`/trips?category=${category.id}`} key={category.id}><span className="category-icon"><Icon name={category.icon} size={29} /></span><span><strong>{category[lang]}</strong><small>{count} {t(count === 1 ? 'zájezd' : count < 5 ? 'zájezdy' : 'zájezdů', count === 1 ? 'trip' : 'trips')}</small></span><Icon name="diagonal" size={18} /></Link>;})}</div>;
}
export function Breadcrumb({ items }: { items: {label: string; to?: string}[] }) { const { t } = useApp(); return <nav className="breadcrumb" aria-label={t('Drobečková navigace', 'Breadcrumb')}><Link to="/">{t('Úvod', 'Home')}</Link>{items.map((item,index) => <span key={index}><span aria-hidden="true">/</span>{item.to ? <Link to={item.to}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</span>)}</nav>; }
export function NotFound({ soldOut = false }: { soldOut?: boolean }) { const { t } = useApp(); return <div className="wrap page empty-state"><Icon name="search" size={40} /><h1>{soldOut ? t('Tento zájezd už je plný.', 'This trip is sold out.') : t('Tahle cesta tu není.', "This page isn't here.")}</h1><p>{t('Vyberte si z aktuální nabídky zájezdů.', 'Choose a trip from our current selection.')}</p><Link to="/trips" className="button">{t('Zpět k zájezdům', 'Back to trips')}<Icon /></Link></div>; }
