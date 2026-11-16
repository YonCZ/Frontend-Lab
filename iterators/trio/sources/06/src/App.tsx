import { useEffect, useMemo, useState, type ReactNode } from 'react';
import content from './content.json';
import { Context, VARIANT, STORE, readStore, writeStore, type AppContext, type Trip, type Language, type BookingRecord } from './context';
import { Header, Footer, NotFound } from './components';
import Home from './home';
import { Listing, Detail, Contact, Terms } from './pages';
import { Booking, Confirmation } from './booking';
import Admin from './admin';
import { localizeValidation, clearValidation } from './validation';

export default function App() {
  const [hash,setHash] = useState(window.location.hash.slice(1) || '/');
  const [lang,setLang] = useState<Language>(() => readStore('language','cs'));
  const [trips,setTrips] = useState<Trip[]>(() => readStore('trips',content.trips));
  const [bookings,setBookings] = useState<BookingRecord[]>(() => readStore('bookings',[]));
  const [path,search = ''] = hash.split('?');
  useEffect(() => { const update=() => setHash(window.location.hash.slice(1) || '/');window.addEventListener('hashchange',update);return () => window.removeEventListener('hashchange',update); },[]);
  useEffect(() => {window.scrollTo(0,0);},[path]);
  useEffect(() => {document.documentElement.lang=lang;document.title=lang === 'cs' ? 'Trio | Malé výlety. Velké vzpomínky.' : 'Trio | Little trips. Lasting memories.';writeStore('language',lang);},[lang]);
  useEffect(() => {const sync=(event: StorageEvent) => {if(event.key === `${STORE}-bookings`)setBookings(readStore('bookings',[]));if(event.key === `${STORE}-trips`)setTrips(readStore('trips',content.trips));};window.addEventListener('storage',sync);return () => window.removeEventListener('storage',sync);},[]);
  const displayTrips = useMemo(() => trips.map(trip => ({...trip,soldOut:trip.soldOut || new Set([...trip.occupied,...bookings.filter(booking => booking.tripId === trip.id).flatMap(booking => booking.seats)]).size >= trip.seatCount})),[trips,bookings]);
  const value = useMemo<AppContext>(() => ({lang,t:(cs,en) => lang === 'cs' ? cs : en,trips:displayTrips,bookings,saveTrips:updated => {writeStore('trips',updated);setTrips(updated);},saveBooking:booking => {const current=readStore<BookingRecord[]>('bookings',[]);if(current.some(item => item.tripId === booking.tripId && item.seats.some(seat => booking.seats.includes(seat))))throw new Error('Seat unavailable');const updated=[...current,booking];writeStore('bookings',updated);setBookings(updated);},money:amount => `${new Intl.NumberFormat(lang === 'cs' ? 'cs-CZ' : 'en-GB').format(amount)} ${lang === 'cs' ? 'Kč' : 'CZK'}`,date:date => new Date(`${date}T12:00:00`).toLocaleDateString(lang === 'cs' ? 'cs-CZ' : 'en-GB',{day:'numeric',month:'long',year:'numeric'})}),[lang,trips,bookings,displayTrips]);
  const tripId=path.split('/')[2];
  const trip=displayTrips.find(item => item.id === tripId && item.published);
  let page: ReactNode;
  if(path === '/') page=<Home />;
  else if(path === '/trips') page=<Listing search={search} />;
  else if(path.startsWith('/trip/') && trip) page=<Detail trip={trip} />;
  else if(path.startsWith('/booking/') && trip) page=<Booking key={trip.id} trip={trip} />;
  else if(path.startsWith('/confirmation/')) page=<Confirmation id={tripId} />;
  else if(path === '/contact') page=<Contact />;
  else if(path === '/about') page=<Contact about />;
  else if(path === '/terms') page=<Terms />;
  else if(path === '/admin') page=<Admin />;
  else page=<NotFound />;
  return <Context.Provider value={value}><div className={`app variant-${VARIANT} ${path === '/' ? 'is-home' : ''}`}><Header path={path} lang={lang} setLang={setLang} /><main id="main" tabIndex={-1} onInvalidCapture={event => localizeValidation(event,value.t)} onInputCapture={clearValidation}>{page}</main><Footer /></div></Context.Provider>;
}
