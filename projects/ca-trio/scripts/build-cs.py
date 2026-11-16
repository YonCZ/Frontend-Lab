"""Write the Czech content file, parallel in structure to content/en.md."""
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent
trips = json.loads((root / 'raw' / 'trips.json').read_text())

CATS = [
    ('Adventní zájezdy', 'Adventní zájezdy'),
    ('Muzikály, koncerty, divadla', 'Muzikály, koncerty, divadla'),
    ('Pobytový Řecko 2027', 'Pobytový Řecko 2027'),
    ('Termální lázně', 'Termální lázně'),
]


def clean(item):
    return re.sub(r'\*\*\*.*$', '', re.sub(r'^[*\-\s]+', '', item)).strip()


groups = {}
for t in trips:
    groups.setdefault(t['category'] or 'Ostatní', []).append(t)

md = []
md.append('# CA TRIO: obsah webu\n')
md.append('Pouze obsah, podklad pro nový web. Fakta zachovat. Rozvržení, barvy, písmo, práce s obrázky '
          'a struktura stránek jsou otevřené.\n')
md.append('Anglická verze: `content/en.md`. Tento soubor je česká předloha pro překlad.\n')
md.append('Cesty k obrázkům jsou zástupné, převzaté ze starého webu. Jde o malé náhledy ze seznamu, '
          'ne finální podklady.\n')
md.append('Zdroj: https://www.ca-trio.cz/, zachyceno 14. listopadu 2026.\n')

md.append('## Jazyk\n')
md.append('Web poběží v češtině a angličtině. Čeština je hlavní jazyk trhu, angličtina druhý. '
          'Dvojjazyčné musí být všechny texty: navigace, názvy kategorií, názvy zájezdů, popisy, '
          'formulář, chybové hlášky, právní texty i prázdné stavy.\n')

md.append('## Agentura\n')
for line in [
    'Název: CA TRIO, cestovní agentura',
    'Majitelka: Ludmila Přikrylová',
    'Sídlo: Šafaříkova 1304, 676 02 Moravské Budějovice',
    'IČ: 12152854',
    'Podnikatel evidován v Živnostenském rejstříku vedeném Městským úřadem v Moravských Budějovicích',
    'Telefon: +420 737 102 348',
    'E-mail: info@ca-trio.cz',
    'Facebook: https://www.facebook.com/TRIOcestovniagentura',
    'Otevírací doba: úterý a čtvrtek, 10:00 až 16:30',
    'Přijímané poukázky: PLUXEE, EDENRED, BENEFITY',
    'Cestovní pojištění: AXA, 35 Kč na osobu a den, sjednání v CA',
]:
    md.append(f'- {line}')
md.append('')
md.append('Vlastní shrnutí nabídky: poznávací zájezdy, muzikály, termálky, pobytové zájezdy.\n')

md.append('## Co nabízejí\n')
md.append('Čtyři vlastní kategorie a partnerské kanceláře pro delší pobyty.\n')
for name in CATS:
    count = len(groups.get(name[0], []))
    if count:
        md.append(f'- {name[1]}: {count} zájezd{"y" if 2 <= count <= 4 else "ů" if count else ""}')
md.append('')

md.append('## Zájezdy\n')
for cid, label in CATS + [('Ostatní', 'Ostatní')]:
    group = groups.get(cid)
    if not group:
        continue
    md.append(f'### {label}\n')
    for t in group:
        md.append(f'#### {t["name"]}\n')
        if t['date']:
            md.append(f'- Termín: {t["date"]}')
        if t['fields']['price']:
            md.append(f'- Cena: {t["fields"]["price"][0]}')
        if t['fields']['price_note']:
            md.append(f'- Poznámka k ceně: {clean(" ".join(t["fields"]["price_note"]))}')
        if t['sold_out']:
            md.append('- Stav: vyprodáno')
        if t['image']:
            md.append(f'- Zástupný obrázek: `raw/assets/img/{t["image"]}`')
        md.append(f'- Zdrojová stránka: {t["url"]}')
        md.append('')
        if t['body']:
            md.append(' '.join(t['body']) + '\n')
        for key, lab in (('program', 'Program'), ('includes', 'Cena zahrnuje'),
                         ('excludes', 'Cena nezahrnuje'), ('departures', 'Nástupní místa')):
            items = [clean(i) for i in t['fields'][key] if i and clean(i)]
            if items:
                md.append(f'**{lab}**\n')
                md.extend(f'- {i}' for i in items)
                md.append('')

md.append('## Objednávka\n')
md.append('Objednávka probíhá formulářem na stránce zájezdu. Pole: jméno, e-mail, telefon, počet '
          'a jména účastníků, nepovinná poznámka. V poznámce zákazník žádá cestovní pojištění a uvádí '
          'jména účastníků.\n')
md.append('Formulář má skryté pole proti spamu a Google reCAPTCHA. Nový web potřebuje funkční cestu '
          'pro odeslání nebo zdokumentovanou atrapu, ne mrtvý formulář.\n')

md.append('## Storno podmínky\n')
md.append('Zruší-li zákazník objednané služby, zaplatí CA TRIO storno poplatek:\n')
md.append('- 15 procent z ceny objednaných služeb, dříve než 30 dnů před termínem')
md.append('- 30 procent z ceny objednaných služeb, dříve než 14 dnů před termínem')
md.append('- 60 procent z ceny objednaných služeb, dříve než 3 dny před termínem')
md.append('- 100 procent z ceny objednaných služeb, později než 3 dny před termínem\n')
md.append('Storno se neplatí při úmrtí v rodině, vážném onemocnění, pobytu v nemocnici, živelné '
          'katastrofě, havárii a další nepředvídaně závažné okolnosti.\n')

md.append('## Smluvní cestovní kanceláře\n')
md.append('CA TRIO prodává pobyty prostřednictvím smluvních kanceláří. Seznam zachovat, pokud nový '
          'web má sekci partnerů.\n')
for line in [
    '**EXIM + Fischer**: letecké pobyty v Egyptě, Tunisku, Turecku, Bulharsku, Řecku, Španělsku, na Kypru a exotika',
    '**ATIS**: pobyty v Česku a na Slovensku, lázně, hory, chaty, chalupy, tábory pro děti, zimní pobyty',
    '**AUTOTURIST**: pobyty v Česku, na Slovensku, v Itálii, Rakousku, Maďarsku, Španělsku, Francii, Slovinsku a Řecku, tranzitní ubytování, zimní pobyty',
    '**BONTON**: pobyty v Řecku, Chorvatsku, Bulharsku, Itálii, Španělsku a Maďarsku, poznávací zájezdy do celého světa',
    '**AZZURRO**: pobyty v Itálii a na italských ostrovech',
    '**LUDOR**: Itálie, celé pobřeží včetně ostrovů, Čechy, Morava, Slovensko',
    '**KOMPASTOUR**: pobyty v Itálii, Caorle',
    '**SIAM**: pobyty a poznávací zájezdy, exotika',
    '**ESO**: exotika, cesty za poznáním, Karibik, Indický oceán, Thajsko, Vietnam, Kambodža',
    '**REDOK**: pobyty v Itálii, Chorvatsku, Egyptě, Karibiku, Libyi a Maroku, poznávací zájezdy po Evropě, cykloturistika',
    '**TRAVEL 2002**: pobyty ve Španělsku, na řeckých ostrovech, v Bulharsku, Turecku a Chorvatsku',
    '**HUNGARIA**: pobyty v Maďarsku',
    '**KRASIM**: pobyty v Bulharsku',
    '**ČEDOK**: letecké pobytové zájezdy v Bulharsku, Černé Hoře, Chorvatsku, Itálii, na Kypru, Madeiře, Maltě, v Maroku, Řecku, Španělsku, Tunisku a Turecku, poznávací zájezdy po severní Evropě a Rusku, klasické Evropě, Alpách, Středomoří a Balkánu, Egyptě a blízkém východě, Latinské Americe, jižní a východní Asii, Americe, zimní pobyty u nás i v zahraničí',
    '**ALEXANDRIA**: Bulharsko, Řecko, Tunisko, Itálie, Chorvatsko, Španělsko, Kypr, exotika, informace v CA TRIO',
]:
    md.append(f'- {line}')
md.append('')

md.append('## Zdroje\n')
md.append('- Zachycené stránky: 23')
md.append('- Plný text: `raw/content.md`')
md.append('- Metadata stránek: `raw/pages.json`')
md.append('- Strukturované zájezdy: `raw/trips.json`')
md.append('- Zrcadlo HTML: `raw/site/`')
md.append('- Obrázky a assety: `raw/assets/`')

(root / 'content' / 'cs.md').write_text('\n'.join(md) + '\n')
print('wrote', root / 'content' / 'cs.md')
