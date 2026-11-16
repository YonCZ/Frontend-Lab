"""Build content.md for the ca-trio.cz rebuild from the saved crawl."""
import html
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent
raw = root / 'raw'
pages = json.loads((raw / 'pages.json').read_text())

NAV = {'NABÍDKA ZÁJEZDŮ', 'LAST MINUTE', 'SMLUVNÍ CK', 'STORNO PODMÍNKY',
       'HISTORIE', 'KONTAKT', 'ZÁJEZDY', 'ONLINE REZERVACE',
       'Adventní zájezdy', 'Muzikály, koncerty, divadla',
       'Pobytový Řecko 2027', 'Termální lázně'}


def lines_of(path):
    text = path.read_text(encoding='utf-8', errors='replace')
    text = re.sub(r'<script.*?</script>|<style.*?</style>', ' ', text, flags=re.S | re.I)
    text = re.sub(r'<br\s*/?>', '\n', text, flags=re.I)
    text = re.sub(r'</(p|div|li|h[1-6]|td|tr)>', '\n', text, flags=re.I)
    text = re.sub(r'<[^>]+>', ' ', text)
    out = []
    for line in html.unescape(text).splitlines():
        line = re.sub(r'\s+', ' ', line).strip().replace('\ufeff', '').strip()
        if line and line not in ('-->', '<!--', "'"):
            out.append(line)
    return out


def page_lines(pattern):
    entry = next((e for e in pages if re.search(pattern, e['file'])), None)
    return lines_of(raw / entry['file']) if entry else []


def block(lines, label, stops):
    for i, line in enumerate(lines):
        if line.startswith(label):
            rest = line[len(label):].strip(' :')
            got = [rest] if rest else []
            for nxt in lines[i + 1:]:
                if any(nxt.startswith(s) for s in stops) or nxt in NAV:
                    break
                got.append(nxt)
            return got
    return []


STOPS = ['TERMÍN ZÁJEZDU', 'CENA', 'POZNÁMKA K CENĚ', 'Cena zahrnuje', 'Cena nezahrnuje',
         'NÁSTUPNÍ MÍSTA', 'Program', 'ONLINE REZERVACE', 'ZÁJEZDY',
         'CA TRIO LUDMILA', 'Podnikatel evidován']

CATEGORIES = ['Adventní zájezdy', 'Muzikály, koncerty, divadla',
              'Pobytový Řecko 2027', 'Termální lázně']


def clean_item(item):
    return re.sub(r'^[*\-\s]+', '', item).strip()


def trip_from(entry):
    path = raw / entry['file']
    source = path.read_text(encoding='utf-8', errors='replace')
    lines = lines_of(path)
    name = ''
    sold_out = False
    for i, line in enumerate(lines):
        if line.startswith('CA TRIO -'):
            name = line.replace('CA TRIO -', '').strip()
            break
    if not name:
        for i, line in enumerate(lines):
            if line.startswith('vyprodáno') and i:
                name = lines[i - 1]
                sold_out = True
                break
    title = next((l for l in lines if l.startswith('CA TRIO -')), '')
    date = re.search(r'(\d{2}\.\d{2}\.\d{4})', title) or re.search(r'(\d{2}\.\d{2}\.\d{4})', ' '.join(lines[:40]))
    date = date.group(1) if date else ''
    name = re.sub(r'\s+\d{2}\.\d{2}\.\d{4}.*$', '', name).replace('vyprodáno', '').strip(' -')
    category = title.split('/')[-1].strip() if '/' in title else ''
    if not category:
        category = next((l for l in lines[:40] if l in CATEGORIES), '')
    body = []
    started = False
    for line in lines:
        if line == name:
            started = True
            continue
        if not started:
            continue
        if line == 'ONLINE REZERVACE' or line.startswith('Objednávám tento zájezd'):
            break
        if line in NAV or line in ('vyprodáno',) or re.fullmatch(r'\d{2}\.\d{2}\.', line) or re.fullmatch(r'20\d\d', line):
            continue
        if line.endswith("'>") or line in ('Rakousko, Slovensko',):
            continue
        body.append(line)
    if sold_out:
        body = [b for b in body if b != sold_out]
    while body and (len(body[0]) < 36 or re.fullmatch(r'[\d. ]+', body[0])):
        body.pop(0)
    fields = {k: block(lines, label, STOPS) for k, label in {
        'term': 'TERMÍN ZÁJEZDU', 'price': 'CENA', 'price_note': 'POZNÁMKA K CENĚ',
        'includes': 'Cena zahrnuje', 'excludes': 'Cena nezahrnuje',
        'departures': 'NÁSTUPNÍ MÍSTA', 'program': 'Program'}.items()}
    images = re.findall(r'(?:src|href)="((?:img|images)/[^"]+\.(?:jpg|jpeg|png|webp))"', source, re.I)
    images = [i for i in images if 'logo' not in i]
    return {'id': re.search(r'id_(\d+)', entry['file']).group(1), 'name': name,
            'date': date, 'category': category, 'sold_out': sold_out, 'body': body,
            'fields': fields, 'image': images[0] if images else '', 'url': entry['url']}


def partners():
    lines = page_lines(r'page_ck')
    try:
        start = next(i for i, l in enumerate(lines) if l.startswith('Smluvní cestovní kanceláře')) + 1
    except StopIteration:
        return []
    out, current = [], None
    for line in lines[start:]:
        if line in NAV or line.startswith('CA TRIO LUDMILA'):
            break
        if line.startswith('-'):
            if current:
                current['about'].append(line.lstrip('- ').strip())
            continue
        if re.match(r'^[A-Z0-9ČÁĎÉĚÍŇÓŘŠŤÚŮÝŽ +.]+ - ', line) or ' - ' in line:
            if current:
                out.append(current)
            name, _, about = line.partition(' - ')
            current = {'name': name.strip(), 'about': [about.strip()] if about.strip() else []}
            continue
        if current:
            current['about'].append(line)
        else:
            current = {'name': line, 'about': []}
    if current:
        out.append(current)
    return [p for p in out if p['name'] and not p['name'].startswith('informace')]


def bullet(items, prefix='- '):
    return '\n'.join(f'{prefix}{i}' for i in items)


trips = [trip_from(e) for e in pages if re.search(r'id_(\d+)', e['file'])]
(trips_out := raw / 'trips.json').write_text(json.dumps(trips, ensure_ascii=False, indent=2) + '\n')

cats = {}
for trip in trips:
    cats.setdefault(trip['category'] or 'Ostatní', []).append(trip)

md = []
md.append('# CA Trio: website content\n')
md.append('Content only, for a rebuild. Keep the facts. Layout, colour, type, imagery treatment and '
          'page structure are open. Nothing here describes how the old site looked.\n')
md.append('Image paths are placeholders captured from the old site. They are small listing thumbnails, '
          'not final art. Replace them, or keep the same subject.\n')
md.append('Captured from https://www.ca-trio.cz/ on 14 November 2026.\n')

md.append('## The agency\n')
md.append('- Name: CA TRIO, cestovní agentura')
md.append('- Owner: Ludmila Přikrylová')
md.append('- Address: Šafaříkova 1304, 676 02 Moravské Budějovice')
md.append('- Company ID (IČ): 12152854')
md.append('- Registered in the trade register kept by the Municipal Authority in Moravské Budějovice')
md.append('- Phone: +420 737 102 348')
md.append('- Email: info@ca-trio.cz')
md.append('- Facebook: https://www.facebook.com/TRIOcestovniagentura')
md.append('- Office hours: Tuesday and Thursday, 10:00 to 16:30')
md.append('- Vouchers accepted: PLUXEE, EDENRED, BENEFITY')
md.append('- Travel insurance: AXA, 35 CZK per person per day, arranged at the office\n')
md.append('Positioning in their own words: poznávací zájezdy, muzikály, termálky, pobytové zájezdy.\n')

md.append('## What they sell\n')
md.append('Four own-product categories, plus partner agencies for longer stays.\n')
for name in CATEGORIES:
    count = len(cats.get(name, []))
    if count:
        md.append(f'- {name}: {count} trip{"s" if count != 1 else ""}')
md.append('')

md.append('## Trips\n')
for category in ['Adventní zájezdy', 'Muzikály, koncerty, divadla', 'Pobytový Řecko 2027', 'Termální lázně', 'Ostatní']:
    group = cats.get(category)
    if not group:
        continue
    md.append(f'### {category}\n')
    for t in group:
        md.append(f'#### {t["name"]}\n')
        facts = []
        if t['date']:
            facts.append(f'- Date: {t["date"]}')
        if t['fields']['price']:
            facts.append(f'- Price: {t["fields"]["price"][0]}')
        if t['fields']['price_note']:
            facts.append(f'- Price note: {clean_item(" ".join(t["fields"]["price_note"]))}')
        if t['sold_out']:
            facts.append('- Status: sold out')
        if t['image']:
            facts.append(f'- Image placeholder: `raw/assets/img/{t["image"]}`')
        facts.append(f'- Source page: {t["url"]}')
        md.extend(facts)
        md.append('')
        if t['body']:
            md.append(' '.join(t['body']) + '\n')
        for key, label in (('program', 'Program'), ('includes', 'Price includes'),
                           ('excludes', 'Price excludes'), ('departures', 'Departure points')):
            items = [clean_item(i) for i in t['fields'][key] if i]
            if items:
                md.append(f'**{label}**\n')
                md.extend(f'- {i}' for i in items)
                md.append('')

md.append('## Booking\n')
md.append('Orders are placed through a form on each trip page. Fields: name, email, phone, '
          'number and names of participants, optional note. The note is where the customer asks for '
          'travel insurance and supplies participant names.\n')
md.append('The form sits behind a spam trap field and Google reCAPTCHA. A rebuild should keep a '
          'real submission path or a documented mock, not a dead form.\n')

md.append('## Cancellation terms\n')
md.append('The customer pays a cancellation fee on the ordered services:\n')
md.append('- 15 percent when cancelled more than 30 days before departure')
md.append('- 30 percent when cancelled more than 14 days before departure')
md.append('- 60 percent when cancelled more than 3 days before departure')
md.append('- 100 percent when cancelled later than 3 days before departure\n')
md.append('No fee applies for a death in the family, serious illness, hospital stay, natural '
          'disaster, accident, or another unforeseeably serious reason. The site states this without '
          'a full legal clause.\n')

md.append('## Partner agencies\n')
md.append('CA Trio resells stays through contracted agencies. Keep this list if the rebuild has a '
          'partners section.\n')
for p in partners():
    about = ' '.join(p['about']).strip()
    md.append(f'- **{p["name"]}**: {about}')
md.append('')

md.append('## Sources\n')
md.append(f'- Pages captured: {len(pages)}')
md.append('- Full text: `raw/content.md`')
md.append('- Per-page metadata: `raw/pages.json`')
md.append('- Structured trips: `raw/trips.json`')
md.append('- Mirrored HTML: `raw/site/`')
md.append('- Images and assets: `raw/assets/`')

(root / 'content.md').write_text('\n'.join(md) + '\n')
print('wrote', root / 'content.md')
print('trips', len(trips), 'partners', len(partners()), 'words', len(' '.join(md).split()))
