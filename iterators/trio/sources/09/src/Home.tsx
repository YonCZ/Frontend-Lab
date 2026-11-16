import { categories, Icon, Tag, TripCard, useTrio } from './core';
import type { IconName } from './core';
import { variant } from './variant';


function Stub({ trip }: { trip: any }) {
  const { locale, text, date, price, categoryName, takenSeats } = useTrio();
  const free = trip.seatCount - takenSeats(trip).length;
  return <a className={`stub${trip.soldOut ? ' is-soldout' : ''}`} href={`#/trip/${trip.id}`}>
    <div className="stub-head">
      <span className={`stub-cat cat-${trip.category}`}><i />{categoryName(trip.category)}</span>
      <span className="stub-price">{price(trip.price)}<small>{text('cena za osobu', 'per person')}</small></span>
    </div>
    <h3 className="stub-title">{trip[locale].title}</h3>
    <p className="stub-summary">{trip[locale].description.slice(0, 120)}</p>
    <div className="stub-perf"><span className="notch notch-l" aria-hidden="true"><i /></span><span className="notch notch-r" aria-hidden="true"><i /></span></div>
    <div className="stub-foot">
      <span className="stub-date">{date(trip.date)}</span>
      <span className="stub-seats">{trip.soldOut ? <em className="sold">{text('Vyprodáno', 'Sold out')}</em> : `${free} / ${trip.seatCount}`}</span>
      <span className="stub-cta">{text('Zobrazit zájezd', 'View trip')}</span>
    </div>
  </a>;
}

export default function Home() {
  const { trips, locale, text, date, price, categoryName } = useTrio();
  const visibleTrips = trips.filter(trip => trip.published);
  const featured = visibleTrips.find(trip => trip.id === (variant === 8 ? '10244' : '10292')) || visibleTrips[0];
  const upcomingTrips = [...visibleTrips].filter(trip => trip.date >= '2026-11-15').sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);
  return <main>
    <section className="hero container"><div className="hero-copy"><h1>{variant === 8 ? <>{text('Malý výlet.', 'A little trip.')}<br />{text('Velké', 'A big')}<br />{text('zážitky.', 'experience.')}</> : <>{text('Nasedat,', 'All aboard,')}<br />{text('jedeme!', 'let’s go!')}</>}</h1><p className="hero-description">{variant === 8 ? text('Za vánoční atmosférou, do divadla nebo jen tak do termálů. Vy si vyberete zážitek. My se postaráme o cestu.', 'Christmas markets, a night at the theatre or a day at the spa. You choose the experience. We take care of the journey.') : text('Někdy stačí změnit místo. Vyberte si den v termálech, večer v divadle nebo týden u moře. S triem máte cestu vyřešenou.', 'Sometimes a change of place is all you need. Pick a spa day, a night at the theatre or a week by the sea. Trio takes care of the journey.')}</p><div className="hero-actions"><a className="button primary" href="#/trips">{text('Kam vyrazíme?', 'Find your next trip')}<Icon name="arrow" /></a><a className="text-link" href="#/contact">{text('Poznejte trio', 'Meet trio')}<Icon name="arrow-up" size={17} /></a></div></div>
    {featured ? <div className="hero-visual"><div className="feature-frame"><a className="feature-image" href={`#/trip/${featured.id}`} aria-label={featured[locale].title}><img fetchPriority="high" src={`assets/${variant === 8 ? 'vienna-christmas-market.jpg' : 'hotel-sissy.jpg'}`} alt={text(variant === 8 ? 'Vánoční trh před vídeňskou radnicí' : 'Hotel Sissy u moře v Řecku', variant === 8 ? 'Christmas market outside Vienna City Hall' : 'Hotel Sissy on the Greek coast')} /><span className="photo-label"><Icon name={variant === 8 ? 'spark' : 'sun'} size={16} />{variant === 8 ? text('Advent je za rohem', 'Advent is almost here') : text('V létě k moři', 'Summer by the sea')}</span></a><a className="feature-ticket" href={`#/trip/${featured.id}`}><div><h2>{featured[locale].title}</h2><span className="feature-date">{date(featured.date)}{featured.endDate ? ` → ${date(featured.endDate)}` : ''}</span></div><div className="feature-price"><strong>{price(featured.price)}</strong><span>{text('za osobu', 'per person')}</span></div></a></div></div> : <div className="empty">{text('Právě připravujeme další zájezdy.', 'New trips are being prepared.')}</div>}</section>
    {variant === 8 && <div className="departure-strip container"><span className="strip-title"><Icon name="pin" />{text('Na cestu rovnou od vás', 'Your journey starts nearby')}</span><span>Moravské Budějovice</span><span>Třebíč</span><span>Jaroměřice nad Rokytnou</span><span>Znojmo</span><a href="#/trips" aria-label={text('Zobrazit zájezdy', 'View trips')}><Icon name="arrow" /></a></div>}
    <section className="home-trips container"><div className="section-heading"><div><h2>{text('Nejbližší odjezdy', 'Next departures')}</h2></div><a className="button section-cta" href="#/trips">{text('Všechny zájezdy', 'All trips')}<Icon name="arrow" size={18} /></a></div><div className="stub-grid">{upcomingTrips.slice(0,4).map(trip => <Stub trip={trip} key={trip.id} />)}</div></section>
    <div className="closing-band container"><section className="how-section"><div><h2>{text('Vy dovolenou, my cestu', 'You the holiday, we the journey')}</h2></div><div className="how-steps">{[[text('Vyberte si, co vás láká', 'Find something you love'), text('Program, cenu i nástupní místa najdete u každého zájezdu.', 'Every trip has its programme, price and departure points.')], [text('Najděte si své místo', 'Choose your seat'), text('Vyberte nástupní místo a sedadlo přímo v autobuse.', 'Pick a departure point and a seat on the bus.')], [text('A můžete se těšit', 'Look forward to your trip'), text('Vyplňte údaje a odešlete objednávku.', 'Fill in your details and send your booking request.')]].map((step, index) => <div key={index}><span className="step-number">0{index + 1}</span><div><h3>{step[0]}</h3><p>{step[1]}</p></div></div>)}</div></section>
    <section className="contact-banner"><div><span className="small-label">{text('Raději to proberete osobně?', 'Prefer to talk it through?')}</span><h2>{text('Od toho jsme tady', 'That is what we are here for')}</h2></div><a className="button primary" href="tel:+420737102348"><Icon name="phone" />+420 737 102 348</a></section></div>
  </main>;
}
