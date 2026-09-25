"""Seed listings for West Herts Kids. Facts taken from each provider's public pages on 25 Sep 2026.
Run: python3 data/seed.py  -> writes src/content/listings/*.md (skips files that already exist unless --force)."""
import os, sys, yaml

CHECKED = '2026-09-25'
OUT = os.path.join(os.path.dirname(__file__), '..', 'src', 'content', 'listings')
FORCE = '--force' in sys.argv

L = []
def add(id, body, **fm):
    fm.setdefault('verified', CHECKED)
    fm.setdefault('claimed', False)
    L.append((id, fm, body.strip()))

# ---------- Baby & toddler ----------
add('hartbeeps-rickmansworth-chorleywood-croxley',
    name='Hartbeeps (Rickmansworth, Chorleywood & Croxley)',
    summary='Multi-sensory music and play classes for babies, toddlers and pre-schoolers, running across the Three Rivers area most weekdays.',
    categories=['baby-toddler', 'music'], towns=['rickmansworth', 'chorleywood', 'croxley-green', 'abbots-langley', 'kings-langley'],
    ageMin=0, ageMax=5, season=['term-time'],
    schedule=[{'day': 'mon', 'note': 'Chorleywood'}, {'day': 'tue', 'note': 'Abbots Langley'}, {'day': 'thu', 'note': 'Rickmansworth'}, {'day': 'fri', 'note': 'Kings Langley and Croxley Green'}],
    website='https://www.hartbeeps.com/rickmansworth-northwood-chorleywood-croxley', instagram='hartbeeps_with_vikki', source='provider website',
    body="""
Hartbeeps runs themed music-and-play sessions with three class types: **Baby Bells** for newborns, **Baby Beeps** for babies, and **Happy House** for toddlers and pre-schoolers.

The local franchise covers Chorleywood, Rickmansworth, Croxley Green, Abbots Langley and Kings Langley (plus Northwood), so there's usually a session within a short drive on most weekdays.

**Good to know:** exact venues and times are published on the Hartbeeps booking page, so check there for this term's timetable.
""")

add('monkey-music-rickmansworth-kings-langley',
    name='Monkey Music (Rickmansworth & Kings Langley)',
    summary='Award-winning music classes from newborn to pre-school, with Friday sessions at Mill End Community Centre. First class free.',
    categories=['baby-toddler', 'music'], towns=['rickmansworth', 'kings-langley'],
    ageMin=0, ageMax=4, season=['term-time'], freeTrial=True,
    schedule=[{'day': 'mon', 'start': '10:00', 'end': '12:20', 'note': 'Kings Langley Methodist Church'},
              {'day': 'wed', 'start': '10:00', 'end': '11:30', 'note': 'Kings Langley Methodist Church'},
              {'day': 'fri', 'start': '10:15', 'end': '11:45', 'note': 'Mill End Community Centre, Rickmansworth'}],
    venue={'name': 'Mill End Community Centre', 'address': 'Church Lane, Mill End, Rickmansworth', 'postcode': 'WD3 8HD'},
    phone='01753 889481', email='berkhamsted.rickmansworth@monkeymusic.co.uk',
    website='https://www.monkeymusic.co.uk/area/berkhamsted-chesham-hemel-hempstead-kings-langley-rickmansworth', source='provider website',
    body="""
Monkey Music groups children by age, so every class is pitched at the right stage:

- **Beautiful Noise:** newborn to 16 weeks
- **Rock'n'Roll:** from 3 months
- **Heigh-Ho:** 12 months to 2 years
- **Jiggety-Jig:** 2 to 3 years
- **Ding-Dong:** 3 years and up

Rickmansworth classes run on Friday mornings at Mill End Community Centre. Kings Langley has Monday and Wednesday sessions. **Your first class is free.**
""")

add('baby-sensory-rickmansworth',
    name='Baby Sensory (Rickmansworth & Bushey)',
    summary='The original baby development class for 0–13 months: signing, music, light shows, bubbles and puppets.',
    categories=['baby-toddler'], towns=['rickmansworth', 'bushey'],
    ageMin=0, ageMax=1, season=['term-time'],
    website='https://www.babysensory.com/north-harrow/', source='provider website',
    body="""
Baby Sensory classes are built around early development for babies aged **0 to 13 months**. Each session mixes baby signing, songs, light shows, bubbles, puppets and sensory play, and is designed to follow your baby's rhythm.

The North Harrow franchise runs weekly classes in Rickmansworth and Bushey, as well as Northwood, Harrow and Stanmore. Book through the Baby Sensory site to see this term's venues and times.
""")

add('noise-makers-croxley',
    name='Noise Makers Croxley',
    summary='Baby and toddler music classes on Tuesday mornings at The Hub, Croxley Green.',
    categories=['baby-toddler', 'music'], towns=['croxley-green'],
    ageMin=0, ageMax=3, season=['term-time'],
    schedule=[{'day': 'tue', 'note': 'Morning classes: babies (0–13 months) and toddlers (13 months–3 years)'}],
    venue={'name': 'The Hub Croxley', 'postcode': 'WD3 3PJ'},
    website='https://www.noise-makers.co.uk/croxley-rickmansworth/', source='provider website',
    body="""
Noise Makers runs lively music sessions in two age groups: **babies (0–13 months)** and **toddlers (13 months–3 years)**.

The Croxley classes are on Tuesday mornings at The Hub, which is handy for Croxley Green, Rickmansworth and Watford West.
""")

add('little-kickers-watford-rickmansworth',
    name='Little Kickers (Watford & Rickmansworth)',
    summary='Pre-school football classes from 18 months to 5 years, including sessions at William Penn Leisure Centre. Free trial.',
    categories=['football-sport', 'baby-toddler'], towns=['rickmansworth', 'watford'],
    ageMin=1.5, ageMax=5, season=['term-time'], freeTrial=True,
    venue={'name': 'William Penn Leisure Centre', 'address': 'Rickmansworth', 'postcode': 'WD3 8JN'},
    website='https://www.littlekickers.co.uk/en-gb/locations/harrow-pinner-watford-rickmansworth/', source='provider website',
    body="""
Little Kickers teaches football to pre-schoolers through play, with age-based programmes:

- **18 months to 2½ years**
- **2½ to 3½ years**
- **3½ to 5 years**

Locally, there are indoor sessions at **William Penn Leisure Centre** in Rickmansworth and weekend sessions in Watford. Classes are term time only, and you can **book a free trial** online.
""")

add('parents-paradise-bushey',
    name='Parents Paradise',
    summary='Soft play and education centre for children up to 11, with baby and toddler classes, maths and English tuition, and party packages.',
    categories=['play-parties', 'baby-toddler', 'tuition'], towns=['bushey', 'watford'],
    ageMin=0, ageMax=11, season=['year-round'],
    schedule=[{'day': d, 'start': '09:30'} for d in ['tue', 'wed', 'thu', 'fri', 'sat', 'sun']],
    venue={'name': 'Parents Paradise', 'address': 'Unit C, Greatham Road Industrial Estate, Greatham Road, Bushey', 'postcode': 'WD23 2NZ'},
    phone='01923 248747', website='https://parentsparadise.co.uk/', source='provider website',
    body="""
Parents Paradise is an indoor soft play centre with climbing frames, slides, tunnels, go-karts and a baby sensory area. Play sessions are usually two hours and **must be booked in advance**.

As well as play, it runs **baby and toddler classes** (Tuesday to Friday, term time) and **maths and English tuition for ages 3 to 16**. There's free parking and Wi-Fi, and it hosts birthday parties.
""")

# ---------- Swimming ----------
add('aqua-swim-school-watford',
    name='Aqua Swim School',
    summary="Long-running Watford swim school (since 1990) based at Watford Grammar School for Girls. Lessons from 3½ years.",
    categories=['swimming'], towns=['watford'],
    ageMin=3.5, ageMax=18, season=['term-time', 'holidays'],
    priceFrom=143, priceUnit='term', priceNote='Per child for an 11-week term',
    schedule=[{'day': d, 'start': '16:15'} for d in ['mon', 'tue', 'wed', 'thu', 'fri']] + [{'day': 'sat', 'note': 'Mornings'}],
    venue={'name': 'Watford Grammar School for Girls', 'address': 'Watford'},
    website='https://theaquaswimschool.co.uk/', source='provider website',
    body="""
Aqua Swim School has been teaching in Hertfordshire since 1990. Lessons run **Monday to Friday from 4:15pm** and on **Saturday mornings** during term time, with extra courses in the holidays.

Beginners start from **3½ years**. All teachers are Level 2 qualified swimming teachers, qualified lifeguards or hold the National Rescue Test for Swimming Teachers, and all are DBS checked.
""")

add('swimfitz-home-swimming-lessons',
    name='SwimFitz Home Swimming Lessons',
    summary='One-to-one swimming lessons in your own pool, covering Rickmansworth, Chorleywood, Croxley and Watford. Babies from 6 months.',
    categories=['swimming'], towns=['rickmansworth', 'chorleywood', 'croxley-green', 'watford'],
    ageMin=0.5, ageMax=18, season=['year-round'],
    website='https://swimfitz.com/home-swimming-lessons-rickmansworth', source='provider website',
    body="""
If you have a private pool, SwimFitz comes to you. The coach has more than 30 years' experience.

- **Baby swimming** from 6 months, with a parent in the water
- **Children's lessons** from age 3, following the STA Learn to Swim programme
- Lessons run **seven days a week**

It covers the WD3, WD18 and HA6 postcodes, including Rickmansworth, Chorleywood, Loudwater, Croxley Green, Moor Park and Watford.
""")

add('watford-swim-school',
    name='Watford Swim School',
    summary='Private swimming lessons for babies, children and adults in Watford, with weekly term-time lessons and holiday crash courses.',
    categories=['swimming'], towns=['watford'],
    ageMin=0, ageMax=18, season=['term-time', 'holidays'],
    website='https://watfordswimschool.com/', source='provider website',
    body="""
Watford Swim School offers private lessons for babies, children and adults across Watford and Hemel Hempstead.

Lessons run **weekly in line with school terms**, with **crash courses in the school holidays**, which suit children who need a confidence boost before a holiday or school swimming.
""")

add('william-penn-leisure-centre',
    name='William Penn Leisure Centre',
    summary="Rickmansworth's leisure centre, with children's swimming lessons, junior gym sessions and a pool for family swims.",
    categories=['swimming', 'football-sport'], towns=['rickmansworth', 'croxley-green'],
    ageMin=0, ageMax=18, season=['year-round'],
    venue={'name': 'William Penn Leisure Centre', 'address': 'Mill End, Rickmansworth', 'postcode': 'WD3 8JN'},
    website='https://www.everyoneactive.com/centre/william-penn-leisure-centre/', source='provider website; OpenStreetMap',
    body="""
Run by Everyone Active, William Penn is the main public pool for Rickmansworth, Croxley Green and Mill End.

- **Children's swimming lessons** for all abilities
- **Junior gym** sessions for older children
- **Junior membership** available

It's also the local venue for Little Kickers football. Lesson levels and prices are on the Everyone Active app and website.
""")

add('watford-leisure-centre-central',
    name='Watford Leisure Centre Central',
    summary="Town-centre leisure centre with children's swimming lessons, inflatable fun sessions, a climbing wall and a sports hall.",
    categories=['swimming', 'football-sport'], towns=['watford'],
    ageMin=0, ageMax=18, season=['year-round'],
    website='https://www.everyoneactive.com/centre/watford-leisure-centre-central/', source='provider website; OpenStreetMap',
    body="""
Watford Central (Everyone Active) offers **children's swimming lessons**, family swims including **inflatable sessions**, climbing, and sports-hall activities such as badminton, table tennis and five-a-side.

It opens 06:30–21:45 on weekdays and 08:00–15:45 at weekends. Check the timetable for inflatable and family swim times, which change during the school holidays.
""")

# ---------- Gymnastics ----------
add('airies-gymnastics-abbots-langley',
    name='Airies Gymnastics Club',
    summary='Gymnastics for 0–13 year olds in Abbots Langley: stay and play, pre-school classes, general gym and holiday crash courses. Free taster.',
    categories=['gymnastics-trampolining', 'baby-toddler'], towns=['abbots-langley'],
    ageMin=0, ageMax=13, season=['term-time', 'holidays'], freeTrial=True,
    website='https://www.airiesgymnastics.co.uk/', source='provider website',
    body="""
Airies is a dedicated gymnastics club in Abbots Langley for children of all abilities:

- **Stay & Play:** 0–4 years
- **Pre-school gym:** 2½–4 years
- **General gym:** 4–13 years
- **Private lessons** and **holiday crash courses**

You can **book a free taster lesson** before signing up.
""")

add('dolphina-gymnastics-watford',
    name='Dolphina Gymnastics Club',
    summary='Afterschool and weekend gymnastics in Garston, Watford, grouped by ability, with dedicated SEND sessions.',
    categories=['gymnastics-trampolining'], towns=['watford', 'abbots-langley'],
    ageMin=4, ageMax=18, season=['term-time'],
    priceFrom=11.90, priceUnit='session', priceNote='Paid termly, plus joining fee and British Gymnastics insurance',
    send='yes', sendNotes='Dedicated SEND sessions are listed on the club website.',
    venue={'name': 'YMCA Orbital Community Hub', 'address': 'Haines Way, Watford', 'postcode': 'WD25 7QU'},
    website='https://dolphinagymnastics.com/', source='provider website',
    body="""
Dolphina groups gymnasts by **ability rather than age**, working through badge levels 8 to 1 (aiming for about one level a term):

- **Novice:** usually 4 (must be in Reception) to 7 years
- **Intermediate:** usually 8 years and up
- **Advanced:** usually 11 and up

Recreational classes start from **£11.90 a session**, paid termly, plus a joining fee and British Gymnastics insurance. The club also runs **SEND sessions** and allows up to three catch-up classes a term.
""")

add('rickmansworth-gymnastics-club',
    name='Rickmansworth Gymnastics Club',
    summary='Gymnastics classes for 5–14s, a mini gym for under-4s, and half-term and holiday camps for 4–14s.',
    categories=['gymnastics-trampolining', 'holiday-camps'], towns=['rickmansworth', 'croxley-green'],
    ageMin=0, ageMax=14, season=['term-time', 'holidays'],
    venue={'name': 'The Reach (sports hall)', 'address': 'Rickmansworth', 'postcode': 'WD3 8AB'},
    website='https://rickmansworth-gymnastics.classforkids.io/', source='provider booking site',
    body="""
Rickmansworth Gymnastics Club (RGC) runs:

- **Gymnastics classes** for children aged 5–14
- **RGC Mini Gym** for 0–4 year olds (booked separately)
- **Holiday camps** for 4–14 year olds at The Reach sports hall, with badge testing and themed days such as a Halloween party

Bookings are made through the club's ClassForKids page.
""")

add('watford-gymnastics-club',
    name='Watford Gymnastics Club',
    summary='Inclusive gymnastics and ballet across Watford, Croxley and South Oxhey, with pre-school sessions and holiday camps.',
    categories=['gymnastics-trampolining', 'dance-drama', 'holiday-camps'], towns=['watford', 'croxley-green', 'south-oxhey'],
    ageMin=0, ageMax=18, season=['term-time', 'holidays'],
    schedule=[{'day': 'tue', 'start': '10:30', 'end': '12:00', 'note': 'Daytime session, term time only'}],
    website='https://www.watfordgymnastics.co.uk/', source='provider website',
    body="""
Watford Gymnastics Club describes itself as an all-inclusive club with gymnastics for all ages and abilities. Classes run across **Watford, Croxley and South Oxhey**, and it also offers **ballet**.

There's a Tuesday daytime session in term time, and **holiday camps** in half terms and the school holidays.
""")

# ---------- Martial arts ----------
add('freestyle-martial-arts-watford',
    name='Freestyle Martial Arts Watford',
    summary='Taekwondo, karate, kickboxing and kung fu for ages 7 and up. Free taster class, then £40 for a beginner month including uniform.',
    categories=['martial-arts'], towns=['watford'],
    ageMin=7, ageMax=18, season=['term-time'], freeTrial=True,
    priceFrom=40, priceUnit='month', priceNote="Beginner's month including a free uniform, after a free taster",
    schedule=[{'day': 'fri', 'start': '18:00', 'end': '18:40'}],
    venue={'postcode': 'WD18 6NS'},
    website='https://www.freestylemartialarts.com/watford', source='provider website',
    body="""
Freestyle Martial Arts blends Taekwondo, Karate, Kickboxing and Kung Fu, with a focus on personal safety and self-defence to help children resist bullying and peer pressure.

Classes are for **ages 7 and up** and run on **Friday evenings (6:00–6:40pm)**. Try a **free taster class**, then sign up for a beginner's month for **£40, including a free uniform**.
""")

# ---------- Dance & drama ----------
add('stagecoach-rickmansworth',
    name='Stagecoach Rickmansworth',
    summary='Singing, dancing and acting classes for ages 4–18 on Fridays at Little Green School, Croxley Green.',
    categories=['dance-drama'], towns=['croxley-green', 'rickmansworth'],
    ageMin=4, ageMax=18, season=['term-time', 'holidays'],
    schedule=[{'day': 'fri', 'note': 'At Little Green School, Croxley Green'}],
    venue={'name': 'Little Green School', 'address': 'Croxley Green'},
    website='https://www.stagecoach.co.uk/rickmansworth', source='provider website',
    body="""
Stagecoach runs performing arts classes in three stages:

- **Early Stages:** 4–6 years
- **Main Stages:** 6–18 years
- **Further Stages:** 15+ years

The Rickmansworth school meets on **Fridays at Little Green School in Croxley Green**. There are also holiday workshops, and its sister school runs Saturday classes. No experience is needed.
""")

add('stagecoach-watford',
    name='Stagecoach Watford',
    summary="Ofsted-registered performing arts school for ages 4–18 at Parmiter's School, with Friday, Saturday and Sunday classes.",
    categories=['dance-drama'], towns=['watford', 'abbots-langley'],
    ageMin=4, ageMax=18, season=['term-time', 'holidays'],
    schedule=[{'day': 'fri', 'note': 'Afternoons'}, {'day': 'sat', 'note': 'Mornings'}, {'day': 'sun', 'note': 'Mornings'}],
    venue={'name': "Parmiter's School", 'address': 'Watford'},
    website='https://www.stagecoach.co.uk/watford', source='provider website',
    body="""
Stagecoach Watford has taught singing, acting and dance to 4–18 year olds for more than 25 years. Classes are held at **Parmiter's School** on Friday afternoons and Saturday and Sunday mornings.

It's **Ofsted approved**, runs holiday workshops, and has a Performance Troupe that performs at large venues. You can book a **two-week trial**.
""")

add('perform-rickmansworth',
    name='Perform Rickmansworth',
    summary='Drama, dance and singing classes for 4–7s and 7–12s, built around confidence and communication. Free trial class.',
    categories=['dance-drama'], towns=['rickmansworth'],
    ageMin=4, ageMax=12, season=['term-time', 'holidays'], freeTrial=True,
    website='https://perform.org.uk/free-drama-class/rickmansworth', source='provider website',
    body="""
Perform's curriculum is based on **"The 4 Cs": Confidence, Concentration, Communication and Coordination**, taught through drama, dance and singing.

There are classes for **4–7s and 7–12s** at venues in Rickmansworth, plus **half-term holiday courses**. Every child can have a **free trial session** first.
""")

add('rise-studios-rickmansworth',
    name='Rise Studios',
    summary='Dance and drama school in Rickmansworth: ballet, street, jazz, tap, contemporary and musical theatre from age 3. £7.50 trial.',
    categories=['dance-drama', 'holiday-camps'], towns=['rickmansworth', 'watford'],
    ageMin=3, ageMax=18, season=['term-time', 'holidays'],
    email='hello@rise-studios.com', phone='07979 644331',
    website='https://www.rise-studios.com/', source='provider website',
    body="""
Rise Studios teaches **ballet, street dance, jazz, tap, contemporary and musical theatre** in age groups:

- **Minis:** 3–5 years
- **Juniors:** 6–8 years
- **Intermediates:** 9–11 years
- **Seniors:** 12+ years
- **Advanced:** 15+ years

Teachers are DBS checked. There's an annual pantomime, half-term workshops, holiday camps and a summer school. **Try any class for £7.50** before committing to a term.
""")

add('watford-palace-young-company',
    name='Watford Palace Theatre Young Company',
    summary="Watford Palace Theatre's youth theatre for ages 7–18, meeting on Saturdays and Tuesdays in term time. £110 per term.",
    categories=['dance-drama'], towns=['watford'],
    ageMin=7, ageMax=18, season=['term-time'],
    priceFrom=110, priceUnit='term', priceNote='£100 per term for each additional sibling',
    schedule=[{'day': 'sat', 'note': 'Term time'}, {'day': 'tue', 'note': 'Term time'}],
    venue={'name': 'Watford Palace Theatre', 'address': 'Clarendon Road, Watford', 'postcode': 'WD17 1JZ'},
    website='https://watfordpalacetheatre.co.uk/take-part/young-company/', source='provider website',
    body="""
The Watford Palace Young Company (WPYC) is the theatre's own youth programme for **7–18 year olds**, grouped by age. It includes behind-the-scenes access and an **end-of-term performance** for family and friends.

Groups meet on **Saturdays and Tuesdays in term time**. It costs **£110 per term** (£100 for each additional sibling), and you can book a **taster session** before paying. Popular groups have waiting lists.
""")

# ---------- Music ----------
add('colours-in-music-watford',
    name='Colours in Music',
    summary='Private music school in Watford: kindergarten music from 17 months, plus piano, violin, flute and guitar tuition. First lesson free.',
    categories=['music', 'baby-toddler'], towns=['watford', 'rickmansworth', 'bushey'],
    ageMin=1, ageMax=18, season=['term-time'], freeTrial=True,
    website='https://www.coloursinmusic.co.uk/', source='provider website',
    body="""
Colours in Music offers **individual tuition** in instruments including piano, flute, violin and guitar, in styles from classical to jazz and contemporary.

Its **Kindergarten** music programme is for children from **17 months to 6 years** and develops pitch, rhythm and inner-ear training. The **first lesson is free** as a trial. It serves Watford, Rickmansworth, Bushey and St Albans.
""")

add('watford-school-of-music',
    name='Watford School of Music (Herts Music Service)',
    summary='Hertfordshire Music Service centre for West Herts, with instrumental lessons, Saturday ensembles and instrument hire.',
    categories=['music'], towns=['watford'],
    ageMin=4, ageMax=18, season=['term-time'],
    priceFrom=65, priceUnit='term', priceNote='One ensemble from £65 per term; unlimited ensembles £115 per term; instrument hire £30 per term',
    schedule=[{'day': 'sat', 'note': 'Saturday ensembles'}],
    website='https://www.hertsmusicservice.org.uk/music-centres-in-hertfordshire/watford-school-of-music.aspx', source='provider website',
    body="""
Watford School of Music (WSM) is part of Hertfordshire Music Service. It offers instrumental lessons and a wide range of **Saturday ensembles**, with showcase concerts each term.

- **Ensembles** from £65 per term, or £115 for unlimited access across West Herts music centres
- **Instrument hire** from £30 per term (subject to availability)

It follows the West Herts term calendar, with a closure each half term.
""")

# ---------- Arts & crafts ----------
add('art-k-croxley-green',
    name='art-K Croxley Green',
    summary='Ofsted-registered art studio for ages 5–18 on Watford Road, with weekly classes, GCSE/A-level support and holiday workshops.',
    categories=['arts-crafts', 'holiday-camps'], towns=['croxley-green', 'rickmansworth', 'watford'],
    ageMin=5, ageMax=18, season=['term-time', 'holidays'],
    venue={'name': 'art-K Croxley Green', 'address': '160–162 Watford Road, Croxley Green', 'postcode': 'WD3 3BZ'},
    phone='020 8149 5898', email='croxleygreen@art-k.co.uk',
    website='https://www.art-k.co.uk/class-croxley-green/', source='provider website',
    body="""
art-K runs a dedicated art studio on Watford Road with:

- **Young Artist classes:** ages 5–6
- **Weekly classes:** ages 6–18, which you can join at any point in the term
- **Advanced classes** for GCSE and A-level students
- **Holiday and half-term workshops**

The studio is **Ofsted registered** and accepts childcare vouchers and Tax-Free Childcare.
""")

add('cygnets-art-school-chorleywood',
    name='Cygnets Art School (Chorleywood)',
    summary='Weekly art classes for 5–12 year olds on Wednesdays at Chorleywood Community Arts Centre, plus summer workshops.',
    categories=['arts-crafts', 'holiday-camps'], towns=['chorleywood', 'rickmansworth'],
    ageMin=5, ageMax=12, season=['term-time', 'holidays'],
    priceFrom=55, priceUnit='month', priceNote='Trial class £22',
    schedule=[{'day': 'wed', 'start': '16:00', 'end': '17:00', 'note': 'All abilities, ages 5–12'}],
    venue={'name': 'Chorleywood Community Arts Centre', 'address': 'Colley Land, Chorleywood', 'postcode': 'WD3 5LL'},
    phone='07392 847325', email='rickmansworth@cygnetsartschool.com',
    website='https://cygnetsartschool.com/branch/rickmansworth/', source='provider website',
    body="""
Cygnets runs an all-abilities art class for **5–12 year olds** on **Wednesdays, 4–5pm**, at Chorleywood Community Arts Centre.

It costs **£55 a month**, with a **£22 trial class**. In August there are themed **summer holiday workshops**, for example exploring cities around the world.
""")

# ---------- STEM ----------
add('code-ninjas-watford',
    name='Code Ninjas Watford',
    summary='Coding, robotics and AI centre for ages 5–14, with a Junior programme for 5–7s and holiday coding camps.',
    categories=['stem-coding', 'holiday-camps'], towns=['watford'],
    ageMin=5, ageMax=14, season=['year-round', 'holidays'],
    website='https://www.codeninjas.co.uk/watford-uk-ldn', source='provider website',
    body="""
Code Ninjas teaches coding through a game-based curriculum, guided by "Code Senseis":

- **JR:** ages 5–7
- **Main programme:** ages 8–14
- **Holiday camps:** ages 5–14, covering coding, robotics and AI
""")

add('robolabx-after-school-robotics',
    name='RoboLab X After-School Robotics',
    summary='Weekly after-school robotics and coding clubs for ages 5–14, run at schools in Watford and Croxley Green.',
    categories=['stem-coding'], towns=['watford', 'croxley-green'],
    ageMin=5, ageMax=14, season=['term-time'],
    website='https://www.robolabx.com/afterschoolclub', source='provider website',
    body="""
RoboLab X runs weekly **term-time robotics clubs** where children design, build and code projects using motors, LEDs and sensors.

Clubs run **inside partner schools**, including several in Watford and Croxley Green, so availability depends on your child's school. Get in touch with RoboLab X to find the right sign-up page.
""")

# ---------- Holiday camps & sport ----------
add('barracudas-watford',
    name='Barracudas Holiday Camp Watford',
    summary='Ofsted-registered multi-activity holiday camp for 4–14s at Watford Grammar School for Girls, including swimming.',
    categories=['holiday-camps'], towns=['watford'],
    ageMin=4, ageMax=14, season=['holidays'],
    venue={'name': 'Watford Grammar School for Girls', 'address': 'Watford'},
    website='https://www.barracudas.co.uk/camps/watford', source='provider website',
    body="""
Barracudas runs its Watford camp in the **Easter and summer holidays** for **4–14 year olds**. The venue has an **indoor swimming pool**, so the full activity programme is on offer, including sports and arts.

It's inspected by Ofsted, offers flexible payment options, and has a **sibling discount** when you book 10 or more days.
""")

add('we-make-footballers-watford',
    name='We Make Footballers Watford',
    summary='High-energy football holiday camps for 4–12 year olds of all abilities, with skills sessions and mini-matches.',
    categories=['football-sport', 'holiday-camps'], towns=['watford'],
    ageMin=4, ageMax=12, season=['holidays'],
    website='https://wemakefootballers.com/watford/holiday-camps', source='provider website',
    body="""
We Make Footballers runs school-holiday football camps for **4–12 year olds**, from complete beginners to confident players.

Children are grouped by age and ability for skills sessions, then play mini-matches (1v1 up to 5v5) with different teams each day. Days start around 10am. New dates are added each term.
""")

add('xtra-time-watford',
    name='Xtra Time Holiday Camps Watford',
    summary='Multi-activity holiday camps in Watford for children aged 4 and up: sports, games and creative sessions.',
    categories=['holiday-camps'], towns=['watford'],
    ageMin=4, ageMax=18, season=['holidays'],
    website='https://www.xtratime.co.uk/holiday-camps-watford/', source='provider website',
    body="""
Xtra Time runs holiday childcare camps in Watford for **children aged 4 and up**. The days mix sport, games and creative activities, and children can try new things at their own pace.

Booking is online, and summer places fill up quickly.
""")

# ---------- Outdoor ----------
add('batchworth-sea-scouts',
    name='Batchworth Sea Scouts',
    summary='Scout group in Rickmansworth with Beavers, Cubs, Scouts and Explorers (ages 6–18) and a riverside HQ.',
    categories=['outdoor-nature'], towns=['rickmansworth', 'croxley-green'],
    ageMin=6, ageMax=18, season=['term-time'],
    venue={'name': 'Batchworth Sea Scouts HQ', 'address': 'Riverside Drive, Rickmansworth', 'postcode': 'WD3 1FS'},
    website='https://www.batchworth.org/', source='provider website; OpenStreetMap',
    body="""
Batchworth Sea Scouts is part of The Scout Association, with active **Beavers, Cubs, Scouts and Explorers** sections for ages **6 to 18**.

All sections meet regularly at the group's HQ on Riverside Drive, Rickmansworth. Being a *sea* scout group, there's a strong focus on water activities. Popular sections often have waiting lists, so register early.
""")

add('rickmansworth-aquadrome',
    name='Rickmansworth Aquadrome',
    summary='Local nature reserve of lakes, woodland and riverside paths. Great for walks, bikes, nature spotting and picnics.',
    categories=['days-out', 'outdoor-nature'], towns=['rickmansworth', 'croxley-green'],
    ageMin=0, ageMax=18, season=['year-round'],
    venue={'name': 'Rickmansworth Aquadrome', 'address': 'Frogmore Lane, Rickmansworth', 'postcode': 'WD3 1RL'},
    website='https://www.threerivers.gov.uk/egcl-page/rickmansworth-aquadrome', source='Three Rivers District Council; OpenStreetMap',
    body="""
The Aquadrome is a **local nature reserve** run by Three Rivers District Council, with lakes, woodland and paths along the River Colne and the Grand Union Canal.

It's a good free option for a family walk, a scoot or bike ride, or spotting wildlife. Paths can get muddy after rain, so wellies are a good idea.
""")

# ---------- Days out ----------
add('cassiobury-park',
    name='Cassiobury Park',
    summary="Watford's biggest park, with a water play area, playgrounds, a miniature railway, a café and woodland walks.",
    categories=['days-out', 'outdoor-nature'], towns=['watford', 'croxley-green'],
    ageMin=0, ageMax=18, season=['year-round'],
    website='https://www.watford.gov.uk/cassiobury-park-3/cassiobury-park-activities/3', source='Watford Borough Council',
    body="""
Cassiobury Park is a Green Flag park on the edge of Watford with plenty for families:

- **Water play park:** two splash pools, splash pads, water jets and fountains, suitable for all ages and abilities, with changing facilities and toilets
- **Playgrounds**, and the **Watford Miniature Railway** next to the paddling pools
- **The Hub** café, plus woodland and canal-side walks

Water play is seasonal, so check the council's page for opening dates.
""")

add('watford-miniature-railway',
    name='Watford Miniature Railway',
    summary='Miniature train rides in Cassiobury Park, next to the paddling pools and playground. £2 per ride; under-2s free.',
    categories=['days-out'], towns=['watford'],
    ageMin=0, ageMax=18, season=['year-round'],
    priceFrom=2, priceUnit='entry', priceNote='Per ride, adult or child. Under-2s travel free',
    venue={'name': 'Cassiobury Park', 'address': 'Watford'},
    website='https://abbeylinecommunityrail.org.uk/days-out/watford-miniature-railway/', source='Abbey Line Community Rail',
    body="""
A Cassiobury Park favourite, the miniature railway runs next to the paddling pools, playground and Hub café, and operates **all year round**, subject to its opening times.

Rides are **£2 each for adults and children**, and **under-2s travel free**. It pairs nicely with the water play area on a summer day.
""")

add('museum-of-watford',
    name='Museum of Watford',
    summary="Local history museum in central Watford exploring the town's heritage, art and community stories.",
    categories=['days-out'], towns=['watford'],
    ageMin=0, ageMax=18, season=['year-round'],
    venue={'name': 'Museum of Watford', 'address': 'Watford', 'postcode': 'WD17 2DT'},
    website='https://www.watfordmuseum.org.uk/', source='provider website; OpenStreetMap',
    body="""
The Museum of Watford celebrates the town's history, art and culture, with changing exhibitions and community projects.

It's a good rainy-day option in central Watford. Check the website for current exhibitions, opening days and family activities in the school holidays.
""")

add('langleybury-childrens-farm',
    name="Langleybury Children's Farm",
    summary='Small family farm near Sarratt and Kings Langley, open daily in the summer holidays. Animals, outdoor play and learning.',
    categories=['days-out', 'outdoor-nature'], towns=['kings-langley', 'abbots-langley'],
    ageMin=0, ageMax=12, season=['holidays'],
    website='https://www.langleyburychildrensfarm.org.uk/', source='provider website; OpenStreetMap',
    body="""
Langleybury Children's Farm is a family destination for fun and learning with animals, between Sarratt, Kings Langley and Abbots Langley.

It opens **every day during the summer holidays**. Check the website for dates in the rest of the year, as it doesn't open daily outside the summer.
""")

add('warner-bros-studio-tour-london',
    name='Warner Bros. Studio Tour London',
    summary='The Making of Harry Potter at Leavesden: original sets, props and costumes from the films. Pre-booking essential.',
    categories=['days-out'], towns=['watford', 'abbots-langley'],
    ageMin=0, ageMax=18, season=['year-round'],
    venue={'name': 'Warner Bros. Studio Tour London', 'address': 'Studio Tour Drive, Leavesden', 'postcode': 'WD25 7LR'},
    website='https://www.wbstudiotour.co.uk/', source='provider website; OpenStreetMap',
    body="""
Right on the doorstep in Leavesden, the Studio Tour lets you walk through **authentic sets** from the Harry Potter films, including the Great Hall, Diagon Alley and Platform 9¾, and see props, costumes and the creature workshop.

Tickets must be **booked in advance** and sell out in the school holidays. Allow at least 3–4 hours.
""")

# ---------- Soft play ----------
add('flip-out-watford',
    name='Flip Out Watford',
    summary='Indoor adventure park near Watford town centre: trampolines, dodgems and more, with toddler sessions and parties.',
    categories=['play-parties', 'gymnastics-trampolining'], towns=['watford'],
    ageMin=0, ageMax=18, season=['year-round'],
    priceFrom=3.50, priceUnit='entry', priceNote='Price varies by session; toddler sessions for 5 and under; parties from £21.99 per child',
    venue={'name': 'Flip Out Watford', 'postcode': 'WD17 2UB'},
    website='https://www.flipout.co.uk/locations/watford', source='provider website',
    body="""
Flip Out is an indoor adventure park with trampolines, dodgems and other activities for all ages.

- **Toddler sessions** for children aged 5 and under
- **Weekend and holiday sessions** for all ages
- **Birthday parties** from £21.99
- **Premium membership** for regular visitors

Check session types and prices when booking, as they vary by day.
""")

add('gambado-watford',
    name='Gambado Watford',
    summary='Indoor play and party centre at Woodside Leisure Park with giant play frames, dodgems, a carousel and an under-3s area.',
    categories=['play-parties'], towns=['watford', 'abbots-langley'],
    ageMin=0, ageMax=12, season=['year-round'],
    venue={'name': 'Woodside Leisure Park', 'address': 'North Orbital Road, Watford', 'postcode': 'WD25 7JZ'},
    website='https://www.gambado.com/', source='TripAdvisor listing (to verify with provider)', draft=True,
    body="""
Gambado is a large indoor play centre with **giant play frames and slides, ball pits, dodgems and a carousel**. There's a **sensory play area and space for under-3s**, a role-play village, and party packages.

It's at Woodside Leisure Park in Garston, with plenty of parking.
""")

# ---------- write ----------
os.makedirs(OUT, exist_ok=True)
written = 0
for id, fm, body in L:
    p = os.path.join(OUT, f'{id}.md')
    if os.path.exists(p) and not FORCE:
        continue
    with open(p, 'w') as f:
        f.write('---\n' + yaml.safe_dump(fm, sort_keys=False, allow_unicode=True) + '---\n\n' + body + '\n')
    written += 1
print(f'{len(L)} listings defined, {written} written')
