import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Context, demoSeats, Icon, readStore, storageKey } from './core';
import type { Booking, Locale, Trip } from './core';
import source from './content.json';
import Home from './Home';
import { Contact, Detail, Listing, Terms } from './Pages';
import { BookingPage, Confirmation } from './Booking';
import Admin from './Admin';
import { variant } from './variant';

export default function App() {
  const [locale, setLocale] = useState<Locale>(() => readStore('locale', 'cs'));
  const [route, setRoute] = useState(window.location.hash.slice(1) || '/');
  const [trips, setTrips] = useState<Trip[]>(() => readStore('trips', source.trips as Trip[]));
  const [bookings, setBookings] = useState<Booking[]>(() => readStore('bookings', []));
  const text = (czech: string, english: string) => locale === 'cs' ? czech : english;
  const categoryName = (category: string) => ({ advent: text('Advent', 'Advent'), culture: text('Muzikál a divadla', 'Musicals and theatre'), spa: text('Jednodenní', 'Day trips'), greece: text('Vícedenní', 'Multi-day trips') }[category] || category);
  const price = (value: number) => `${new Intl.NumberFormat(locale === 'cs' ? 'cs-CZ' : 'en-GB').format(value)} ${text('Kč', 'CZK')}`;
  const date = (value: string, options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) => new Intl.DateTimeFormat(locale === 'cs' ? 'cs-CZ' : 'en-GB', options).format(new Date(`${value}T12:00:00`));
  const saveTrips = (value: Trip[]) => { setTrips(value); localStorage.setItem(`${storageKey}-trips`, JSON.stringify(value)); };
  const saveBookings = (value: Booking[]) => { setBookings(value); localStorage.setItem(`${storageKey}-bookings`, JSON.stringify(value)); };
  const takenSeats = (trip: Trip, departureDate = trip.date) => [...new Set([...demoSeats.filter(seat => seat <= trip.seatCount), ...bookings.filter(booking => booking.tripId === trip.id && booking.date === departureDate).flatMap(booking => booking.seats)])];
  const isSoldOut = (trip: Trip) => trip.soldOut || takenSeats(trip).length >= trip.seatCount;
  const segments = route.split('?')[0].split('/').filter(Boolean);
  const currentTrip = trips.find(trip => trip.id === segments[1]);
  useEffect(() => {
    const change = () => { setRoute(window.location.hash.slice(1) || '/'); window.scrollTo({ top: 0, behavior: 'instant' }); };
    const sync = (event: StorageEvent) => { if (event.key === `${storageKey}-bookings`) setBookings(readStore('bookings', [])); if (event.key === `${storageKey}-trips`) setTrips(readStore('trips', source.trips as Trip[])); };
    window.addEventListener('hashchange', change); window.addEventListener('storage', sync);
    return () => { window.removeEventListener('hashchange', change); window.removeEventListener('storage', sync); };
  }, []);
  useEffect(() => {
    localStorage.setItem(`${storageKey}-locale`, JSON.stringify(locale)); document.documentElement.lang = locale;
    const pageTitle = currentTrip && ['trip', 'booking'].includes(segments[0]) ? currentTrip[locale].title : ({ trips: text('Zájezdy', 'Trips'), contact: text('Kontakt', 'Contact'), terms: text('Storno podmínky', 'Cancellation terms'), admin: text('Administrace', 'Administration'), confirmation: text('Rezervace uložena', 'Booking saved') }[segments[0]] || text('Zážitky začínají cestou', 'Good days start with a trip')); document.title = `${pageTitle} | trio`; document.querySelector('meta[name=description]')?.setAttribute('content', currentTrip && segments[0] === 'trip' ? currentTrip[locale].description.slice(0, 160) : text('Adventní zájezdy, muzikály, termální lázně a dovolená v Řecku s CA Trio v Moravských Budějovicích.', 'Advent trips, musicals, thermal spas and Greek holidays with CA Trio in Moravské Budějovice.')); document.querySelector('main')?.setAttribute('tabindex', '-1');
  }, [locale, route]);
  let page: ReactNode;
  if (!segments.length) page = <Home />;
  else if (segments[0] === 'trips') page = <Listing key={route} />;
  else if (segments[0] === 'trip' && currentTrip?.published) page = <Detail trip={currentTrip} />;
  else if (segments[0] === 'booking' && currentTrip?.published) page = <BookingPage key={currentTrip.id} trip={currentTrip} />;
  else if (segments[0] === 'confirmation') page = <Confirmation id={segments[1]} />;
  else if (segments[0] === 'contact') page = <Contact />;
  else if (segments[0] === 'terms') page = <Terms />;
  else if (segments[0] === 'admin') page = <Admin />;
  else page = <main className="container page-content empty"><h1>{text('Tady cesta nevede.', 'This road leads nowhere.')}</h1><a className="button primary" href="#/">{text('Zpět na začátek', 'Back to the start')}<Icon name="arrow" /></a></main>;
  return <Context.Provider value={{ locale, setLocale, route, trips, bookings, saveTrips, saveBookings, text, categoryName, price, date, takenSeats, isSoldOut }}><div className={`site variant-${variant}`}><a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); document.querySelector('main')?.focus(); document.querySelector('main')?.scrollIntoView(); }}>{text('Přeskočit na obsah', 'Skip to content')}</a><header className="site-header container"><a href="#/" className="brand" aria-label={text('trio, úvodní stránka', 'trio, home')}><span className="wordmark">trio<span className="brand-period">.</span></span><span className="brand-description">{text('cestovní', 'travel')}<br />{text('agentura', 'agency')}</span></a><nav aria-label={text('Hlavní navigace', 'Main navigation')}><a className={segments.length === 0 || segments[0] === '' ? 'active' : ''} href="#/">{text('Trio', 'Trio')}</a><a className={segments[0] === 'trips' || segments[0] === 'trip' ? 'active' : ''} href="#/trips">{text('Zájezdy', 'Trips')}</a><a className={segments[0] === 'contact' ? 'active' : ''} href="#/contact">{text('Kontakt', 'Contact')}</a></nav><div className="header-actions"><div className="language-switch" aria-label={text('Jazyk', 'Language')}><button className={locale === 'cs' ? 'active' : ''} onClick={() => setLocale('cs')} aria-pressed={locale === 'cs'}>CZ</button><span>/</span><button className={locale === 'en' ? 'active' : ''} onClick={() => setLocale('en')} aria-pressed={locale === 'en'}>EN</button></div><a className="header-phone" href="tel:+420737102348"><Icon name="phone" size={17} />737 102 348</a></div></header><div id="main-content">{page}</div><footer className="site-footer container"><div className="footer-line"><a className="wordmark" href="#/">trio.</a><a href="mailto:info@ca-trio.cz">info@ca-trio.cz</a><a href="https://www.facebook.com/TRIOcestovniagentura" target="_blank" rel="noreferrer">Facebook</a><span>© 2026 CA TRIO · Ludmila Přikrylová · IČ 12152854</span><a href="#/terms">{text('Storno podmínky', 'Cancellation terms')}</a></div></footer></div></Context.Provider>;
}
