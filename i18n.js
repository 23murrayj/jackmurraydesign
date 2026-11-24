/* ==========================================================================
   i18n.js — language switching for the portfolio.

   Loaded BEFORE script.js so window.I18N exists by the time script.js
   builds the typewriter and the magnetic headline.

   Two things a language switcher has to do, and only one of them is
   about text:
     1. swap the copy
     2. set <html lang> — screen readers pick their pronunciation engine
        from that attribute, so leaving it at "en" makes a Spanish page
        read aloud in a mangled English accent. That's the whole reason
        this is an accessibility feature and not just a nicety.

   WHAT DELIBERATELY DOESN'T TRANSLATE:
     - project titles (EASTER AT RIVERSIDE, SANDCASTLES...) — these are
       the names of actual works, not descriptions of them
     - the artwork baked into the card SVGs, for the same reason
     - tool and brand names (FIGMA, BLENDER, GITHUB, HTML, INSTAGRAM...)
     - "JACK MURRAY" / "JM"
   ========================================================================== */
(function () {
  'use strict';

  var DICT = {

    /* ---------------------------------------------------------------- EN */
    en: {
      'a11y.skip': 'Skip to main content',
      // {n} = image number, {title} = project title. Fallback only — real
      // per-image alt text belongs in proj.<id>.alt.<n>
      'a11y.photoAlt': 'Photo {n} from {title}',
      'a11y.videoLabel': 'Project film',
      'a11y.playFilm': 'Play the film',
      'a11y.lightbox': 'Enlarged image',
      'a11y.close': 'Close',
      'a11y.zoomHint': 'Click to enlarge',
      'a11y.prevImage': 'Previous image',
      'a11y.nextImage': 'Next image',
      'a11y.modelViewer': "Rotatable 3D model of the pot clip — drag, or use the arrow keys",
      'a11y.eggTrigger': 'Hidden extras',
      'html.title': "Jack Murray · UX Designer",
      'html.description': "UX design portfolio by Jack Murray: websites, visual systems, branding, photography, motion, and digital experiments.",

      'nav.projects': 'PROJECTS',
      'nav.about': 'ABOUT',
      'nav.contact': 'CONTACT',
      'nav.aria.theme': 'Dark / light mode',
      'nav.aria.menu': 'menu',
      'nav.aria.language': 'Choose language',


      'hero.badge': "LET'S MAKE SOMETHING",
      'hero.cta': 'VIEW PROJECTS',
      'hero.role': 'UX DESIGNER &<br>DIGITAL CREATIVE',

      'work.title': 'SELECTED PROJECTS',
      'filter.ALL': 'ALL',
      'e404.heading': "This page doesn't exist.",
      'e404.body': 'The link may be out of date, or the address might have a typo in it.',
      'e404.home': 'BACK TO THE PORTFOLIO',
      'e404.title': 'Page not found — Jack Murray',
      'filter.aria': 'Filter projects by category',
      'filter.count.one': '1 project',
      'filter.count.many': '{n} projects',
      'footer.built': 'Four languages  ·  Dark & light  ·  AA contrast  ·  Keyboard navigation  ·  Reduced motion',
      'card.cta': 'View case study',
      'filter.UX/UI': 'UX/UI',
      'filter.PRODUCT': 'PRODUCT',
      'filter.GRAPHICS': 'GRAPHICS',
      'filter.PHOTOGRAPHY': 'PHOTOGRAPHY',
      'filter.MOTION': 'MOTION / 3D',
      'skill.ux-design': "UX Design",
      'skill.interaction-design': "Interaction Design",
      'skill.user-research': "User Research",
      'skill.user-flows': "User Flows",
      'skill.prototyping': "Prototyping",
      'skill.usability-testing': "Usability Testing",
      'skill.product-design': "Product Design",
      'skill.3d-modeling': "3D Modeling",
      'skill.photography': "Photography",
      'skill.graphic-design': "Graphic Design",
      'skill.brand-identity': "Brand Identity",
      'skill.typography': "Typography",
      'skill.print-design': "Print Design",
      'skill.ui-design': "UI Design",
      'skill.motion-design': "Motion Design",
      'skill.visual-effects': "Visual Effects",
      'skill.color-grading': "Color Grading",
      'skill.3d-animation': "3D Animation",

      'cat.UX/UI': 'UX/UI',
      'cat.PRODUCT': 'PRODUCT',
      'cat.GRAPHICS': 'GRAPHICS',
      'cat.PHOTOGRAPHY': 'PHOTOGRAPHY',
      'cat.MOTION': 'MOTION / 3D',

      'proj.cat-coaching.desc': "Adaptive coaching interface for heavy equipment operators, designed with Caterpillar.",
      'proj.cat-coaching.type': 'Bradley University × Caterpillar',
      'proj.cat-coaching.role': 'UX Research & Design',
      'proj.cat-coaching.body': "Best Research Award winner. In my Advanced Interaction Design course at Bradley, I worked in a three-person team partnered with Caterpillar to design an adaptive coaching interface for heavy equipment operators.\n\nI got my hands on every part of the process: research, user flows, wireframes, Figma prototypes, and usability testing with 5 participants. We met with Caterpillar's UX team for 7 weeks, went through 2 rounds of iteration based on their feedback and our testing, and wrapped up with an on-site visit to Caterpillar in Peoria.",
      'proj.cat-coaching.alt.1': "Three students working at a conference table at Caterpillar, laptops open to design files, with project notes filling the whiteboard behind them.",
      'proj.cat-coaching.alt.2': "The three-person project team in front of a Caterpillar wall graphic reading 'One Team, with a Common Goal'.",
      'proj.pot-clip.desc': "Designed, hand-sculpted, digitally modeled, and tested.",
      'proj.pot-clip.type': "Product Design",
      'proj.pot-clip.role': "Design & Fabrication",
      'proj.pot-clip.body': "The brief was a ten-centimetre cube: design a piece of kitchenware in the spirit of Alessi, close enough that you could believe you'd found it in a shop. I started at the Alessi store in Milan, looking at what they actually make — small silver objects, simple, almost always some everyday ritual made slightly better. Then I cooked more than usual and waited for something to annoy me.\n\nWhat annoyed me was the spoon. There's no clean place to put it down: the counter gets messy, and balancing it on the rim means it slides or drops in. Rests for this exist, but most clip in one spot and hold one thing. Mine is two independent supports that sit on the rim and slide along it, so the gap sets itself to whatever you're holding — a wide wooden spoon or a thin metal fork. The best part came out of where it sits rather than what it looks like: resting above the pot means the drips go back into the pot, and there's no second object taking up counter space and needing washing afterwards.\n\nThe shape came off a page of \"how might we\" questions — how to grip several pot sizes snugly, how to keep the top usable when the whole thing sits at an angle. From there: paper profiles cut and held against a pot, then the physical one, sculpted from dense modelling foam in the shop, built up with coats and sprayed to read as metal. It's an appearance model, not a working part. The digital model came last, built from the finished object rather than ahead of it, and it's what the posters are rendered from.\n\nIt isn't resolved, and most of what's wrong with it is physical. In real metal, clipped to a hot pot, these would get too hot to move with bare hands. Pot rims aren't standardised — thin, thick, rolled, flared, some with pouring lips — so one clip profile won't grip them all, and the grip is friction only. The top is flat enough that a round handle could still roll. And it's two objects where the thing already on the market is one. Knowing that list is most of what the project gave me; a next version would start from the heat and the rim profile rather than from the shape.\n\nThis was a student project at NABA in Milan. It is not affiliated with Alessi and was not commissioned or reviewed by the company. Alessi served as the reference brand for the assignment, and the posters are an original concept campaign developed for this project.",
      'proj.pot-clip.cs.disclaimer': "This was a student project at NABA in Milan. It is not affiliated with Alessi and was not commissioned or reviewed by the company. Alessi served as the reference brand for the assignment, and the posters are an original concept campaign developed for this project.",
      'proj.pot-clip.alt.14': "A render of the finished clip on a plain background, showing its curved top and two legs.",
      'proj.pot-clip.cs.eyebrow': "A product concept developed in Alessi’s style, NABA Milan 2026",
      'proj.pot-clip.cs.lede': "Designed, hand-sculpted, digitally modeled, and tested.",
      'proj.pot-clip.cs.toc': "On this page",
      'proj.pot-clip.cs.meta.context': "Context",
      'proj.pot-clip.cs.meta.contextV': "Product Design course, student project",
      'proj.pot-clip.cs.meta.duration': "Duration",
      'proj.pot-clip.cs.meta.durationV': "8 weeks",
      'proj.pot-clip.cs.meta.role': "Role",
      'proj.pot-clip.cs.meta.roleV': "Research, concept, physical and digital modeling, art direction",
      'proj.pot-clip.cs.meta.tools': "Digital Tools",
      'proj.pot-clip.cs.meta.toolsV': "Blender, Illustrator, Canva",
      'proj.pot-clip.cs.card1.t': "Problem",
      'proj.pot-clip.cs.card1.b': "While cooking in a small kitchen, there's nowhere clean and secure to rest a utensil.",
      'proj.pot-clip.cs.card2.t': "Solution",
      'proj.pot-clip.cs.card2.b': "Two clips that slide along the pot rim and hold the utensil above the food, so drips fall back in.",
      'proj.pot-clip.cs.card3.t': "Outcome",
      'proj.pot-clip.cs.card3.b': "A sculpted appearance model, an interactive 3D model, and a three-poster campaign, with the core idea working on thin-rimmed pots.",
      'proj.pot-clip.cs.brief.t': "The brief",
      'proj.pot-clip.cs.brief.b': "Design a piece of kitchenware that fits within a 10 cm cube and could pass for an Alessi product on a store shelf.",
      'proj.pot-clip.cs.research.t': "Research",
      'proj.pot-clip.cs.research.grid': "<dl class=\"cs-defs\"><dt>Brand research</dt><dd>I visited the Alessi store in Milan and reviewed the brand’s website and catalog. Most pieces are small, simple metal objects that make everyday tasks a more pleasant experience. Alessi’s own cutlery rests are curved, polished steel pieces that are designed to sit on a counter.</dd><dt>User observation</dt><dd>I studied my own cooking routine as a user. I cook alone, with very little counter space between my stove and sink. I tracked where my utensils ended up, where messes originated, and how I worked around\u00A0the\u00A0lack\u00A0of\u00A0space.</dd><dt>Competitor review</dt><dd>Pot-rim spoon clips already exist. They’re cheap and often charming, but most clip in one fixed spot and hold one utensil.</dd></dl>",
      'proj.pot-clip.cs.problem.t': "The problem",
      'proj.pot-clip.cs.problem.b': "<ul><li><strong>Instability.</strong> Utensils balanced on a pot rim can roll, slide, or fall in.</li><li><strong>Dripping.</strong> Moving a utensil to a counter rest drips food along the way.</li><li><strong>Space.</strong> A separate spoon rest takes up work surface that small kitchens don’t have.</li></ul>",
      'proj.pot-clip.cs.problem.hmw': "How might we: create a stable, adjustable place to rest utensils directly above the pot, keeping both the utensil and the counter clean?",
      'proj.pot-clip.cs.design.t': "The design",
      'proj.pot-clip.cs.design.b': "<p>Two independent supports sit on the rim and slide along it. You set the gap by moving them, so the same pair holds a wide wooden spoon or a thin metal fork.</p><p>Because the utensil rests above the pot, drips fall back into the food. It also means no separate spoon rest taking up counter space or adding to the dishes.</p>",
      'proj.pot-clip.cs.design.hint': "Drag to rotate",
      'proj.pot-clip.cs.process.t': "Process",
      'proj.pot-clip.cs.process.1': "Sketches and paper profiles",
      'proj.pot-clip.cs.process.1b': "I sketched several designs, then turned the strongest into full-scale paper profiles and tried them against actual pots.",
      'proj.pot-clip.cs.process.2': "Sculpting",
      'proj.pot-clip.cs.process.2b': "I carved the form by hand from high-density foam.",
      'proj.pot-clip.cs.process.3': "Finishing",
      'proj.pot-clip.cs.process.3b': "Built up with coats and spray-finished to read as metal. I built one clip of the pair to test its form and fit.",
      'proj.pot-clip.cs.process.4': "Digital model",
      'proj.pot-clip.cs.process.4b': "I scanned the finished piece and rebuilt it in Blender. That model powers the interactive 3D viewer on this page.",
      'proj.pot-clip.cs.testing.t': "Testing",
      'proj.pot-clip.cs.testing.b': "<ul><li><strong>Method.</strong> I tested the prototype on pots of different sizes to find where it holds and where it fails.</li><li><strong>Finding.</strong> The clip held on smaller pots with thin rims, even through a full product shoot. On larger pots with thicker rims, it didn’t fit.</li><li><strong>Implication.</strong> One fixed clip opening can’t fit every rim, so rim fit is the top priority for the next version.</li></ul>",
      'proj.pot-clip.cs.posters.t': "Posters",
      'proj.pot-clip.cs.posters.b': "<p>I developed a poster series to show how Pot Clip could launch as an Alessi product. The line <em>Il buon design vive nei dettagli</em> (<strong>“Good design lives in the details”</strong>) connects to what I saw in my research. Alessi makes small objects that improve everyday routines. I wrote the copy in Italian to place the series in Alessi’s world, and drew on the brand’s existing posters.</p>",
      'proj.pot-clip.cs.limits.t': "Limitations and next steps",
      'proj.pot-clip.cs.limits.b': "<p>There are still real problems with the concept, and some of them need more research before this could become a viable product.</p><dl class=\"cs-defs cs-defs-row\"><dt>Rim fit</dt><dd>Testing showed one clip opening fits only about half of pots. Next step: a spring-tension clip or a lined inner surface, plus a larger size for bigger pots.</dd><dt>Heat</dt><dd>In real metal on a hot pot, the clips would get too hot to adjust by hand. Next step: a low-conductivity material where fingers would touch.</dd><dt>Stability</dt><dd>I kept the top flat on purpose so it could hold more kinds of utensils, but a round handle can still roll. Next step: add a shallow cradle for grip, without trying to limit what it holds.</dd><dt>Limited testing</dt><dd>So far, all of the usage research is my own, on a small set of pots. Next step: develop more concepts, test them on a wider range of pots, and refine the strongest one.</dd></dl>",
      'proj.pot-clip.alt.thumb': "The rest in polished silver on a deep red ground, with a spoon, a fork and two spatulas drawn in line around it.",
      'proj.pot-clip.cs.alt.hero': "A poster headed “Il buon design vive nei dettagli”, with the silver clip hooked over a steel bowl rim holding a slim wooden spoon, and the Alessi mark below.",
      'proj.pot-clip.cs.alt.store': "The Alessi store in Milan seen from across the street, its arched window full of small metal pieces on open wooden shelves.",
      'proj.pot-clip.cs.alt.profiles': "Three paper profile studies of the clip, cut out and laid on a green cutting mat with pencil dimensions.",
      'proj.pot-clip.cs.alt.foam': "The sculpted foam model held in one hand, with an offcut on the bench behind.",
      'proj.pot-clip.cs.alt.finished': "The finished clip standing on a spray board in the workshop, its silver surface catching the light.",
      'proj.pot-clip.cs.alt.painted': "The finished model hanging from a wire in the spray booth, its silver surface against a perforated white wall.",
      'proj.pot-clip.cs.alt.blender': "The scanned model open in Blender, shown as a dense triangle mesh with its outline selected.",
      'proj.pot-clip.cs.alt.rim': "The clip on a steel bowl rim holding a thin wooden spoon above the bowl, seen from the side.",
      'proj.pot-clip.cs.alt.poster1': "A poster with the clip cropped large on a pale ground, beside the Italian line “Il buon design vive nei dettagli”.",
      'proj.pot-clip.cs.alt.poster2': "A poster on a deep red ground with the clip centered above the Alessi and NABA marks.",
      'proj.pot-clip.cs.alt.poster3': "A poster of the clip on a bowl rim holding a wooden spoon, under the line “Il buon design vive nei dettagli”.",
      'proj.fuse-partners-in-crime.desc': "Asymmetric VR and PC co-op heist, shown at the Peoria Riverfront Museum.",
      'proj.fuse-partners-in-crime.type': 'Bradley FUSE · VR Game',
      'proj.fuse-partners-in-crime.role': 'VR Interface & VFX',
      'proj.fuse-partners-in-crime.body': "A two-player co-op experience played across VR and PC, built by a 17-person team for Bradley's FUSE program and showcased publicly at the Peoria Riverfront Museum.\n\nThe two players never see the same thing: one is inside the manor in VR, while the other reads the floor plan and camera feeds on PC.\n\nI was part of the small group that came up with the original idea before it grew into a full team project. From there I focused on the VR side: I designed the VR interface and built particle and visual effects in Unity to help players understand what was happening in the game. I also advised on the PC menus and worked with game designers, programmers, and artists to take it from concept to a playable game.",
      'proj.fuse-partners-in-crime.alt.1': "The Partners in Crime title banner: thick white lettering with a gold dollar sign and gem, over a purple mansion silhouette.",
      'proj.fuse-partners-in-crime.alt.2': "A child at the museum playing the PC side of the game, the green floor-plan interface on the laptop and the VR player's view on the monitor behind.",
      'proj.fuse-partners-in-crime.alt.3': "The exhibit setup at the Peoria Riverfront Museum, one player in a VR headset and another at a PC.",
      'proj.fuse-partners-in-crime.alt.4': "The exhibition standup banner: the Partners in Crime title above the full project crew listed by department, with the in-game scanner and laptop below.",
      'proj.easter-riverside.desc': "One identity across two services, from invitation cards to a banner on the side of the building.",
      'proj.easter-riverside.type': 'Event Identity',
      'proj.easter-riverside.role': 'Graphic Designer',
      'proj.easter-riverside.body': "Easter at Riverside is the identity for one weekend and two services: Good Friday on the 18th, Easter Sunday on the 20th. An open sky, an orange sun coming up through the clouds, and a serif with enough weight to hold a scripture line above it. The blue is the exact color we painted the church's worship piano.\n\nTwo services with opposite feelings, one construction. Good Friday is the same wordmark and the same circle turned down into black and white, storm clouds instead of open sky and the sun gone cold behind the type. They run side by side on a single banner on the wall outside, so you read the turn from one to the other on your way in. That pairing is the piece I would keep.\n\nThen it had to survive the surfaces. The banner is read from across a parking lot. The invitation card is held in one hand. The photo wall was the one that changed how I thought about it: its whole job is to be stood in front of, so everything came off it except the lockup, set high enough that a dozen people shoulder to shoulder still leave it readable. A graphic designed to be half covered.",
      'proj.easter-riverside.alt.1': "The Easter at Riverside graphic: a tall serif 'Easter' over a blue sky, with an orange sun and a pale ring breaking through the clouds.",
      'proj.easter-riverside.alt.2': "The outdoor banner on the church's red brick wall: Good Friday in black and white on the left half, Easter in blue sky on the right.",
      'proj.easter-riverside.alt.3': "The church team standing shoulder to shoulder in front of the pale blue Easter at Riverside photo wall, the lockup visible above them.",
      'proj.easter-riverside.alt.4': "A stack of printed Easter at Riverside invitation cards on a small round table.",
      'proj.monmouth-retreat.desc': "Candid photography from a worship team's retreat in Monmouth.",
      'proj.monmouth-retreat.type': 'Photography Collection',
      'proj.monmouth-retreat.role': 'Photographer',
      'proj.monmouth-retreat.body': "I got an opportunity to photograph a musical retreat for a worship team over in Monmouth, IL. This retreat was full of life and deep emotion, and I aimed to capture that energy through candid moments, both individual and group interactions.\n\nThe changing light was the editing problem. Frame by frame the set would not have held together, so I graded the whole gallery toward one feel rather than letting each image be its own best version.",
      'proj.monmouth-retreat.alt.1': "A singer on the floor with a mic, the band on the couch behind her.",
      'proj.monmouth-retreat.alt.2': "The Rivoli theatre in Monmouth, snow along the sidewalk.",
      'proj.monmouth-retreat.alt.3': "The team standing together in the loft, facing the windows.",
      'proj.monmouth-retreat.alt.4': "Three musicians sitting on the floor with a ukulele and a guitar.",
      'proj.monmouth-retreat.alt.5': "A man on the couch playing a small stringed instrument.",
      'proj.monmouth-retreat.alt.6': "A singer laughing into a mic, wearing headphones.",
      'proj.monmouth-retreat.alt.7': "Two singers on the couch sharing a mic, someone lying upside down beside them.",
      'proj.monmouth-retreat.alt.8': "The drummer at his kit, seen between a cymbal and a tom.",
      'proj.monmouth-retreat.alt.9': "A guitarist playing in a bright doorway, two blurred figures in the foreground.",
      'proj.monmouth-retreat.alt.10': "Two guitarists standing close, working out a part.",
      'proj.monmouth-retreat.alt.11': "Singers at mic stands with music in front of them.",
      'proj.monmouth-retreat.alt.12': "Someone upside down on the couch, holding a mic above their face.",
      'proj.monmouth-retreat.alt.13': "The worship leader looking through a stack of charts, a keyboard player behind him.",
      'proj.monmouth-retreat.alt.14': "A singer in profile holding an open folder of music.",
      'proj.monmouth-retreat.alt.15': "A guitarist in a black turtleneck playing an acoustic.",
      'proj.monmouth-retreat.alt.16': "A guitarist with a pale blue electric, a friend looking up at him.",
      'proj.monmouth-retreat.alt.17': "A man looking up during a song, two people blurred in the foreground.",
      'proj.monmouth-retreat.alt.18': "A singer with one hand raised, eyes closed, another laughing behind her.",
      'proj.sandcastles.desc': 'Sermon series identity applied across stage screens, social, and print.',
      'proj.sandcastles.type': 'Sermon Series Identity',
      'proj.sandcastles.role': 'Graphic Designer',
      'proj.sandcastles.body': "Sandcastles is the identity for a summer in the Psalms: all 150, ten a week for fifteen weeks. The brief arrived as just a couple of sentences for me to build off of.\n\nSandcastles is a word about kids at a beach, and the Psalms are not light reading. The job was a playfulness that still held the weight: a sandcastle under a low sun, built on the one thing everybody knows the tide is coming for. It took many collage versions and more typefaces than I'd like to admit, narrowed as often by commercial licensing as by tone. The wordmark changed before it shipped: the creative director swapped the brush script for serif capitals.\n\nFrom there it had to hold everywhere it went: a stage screen above a full auditorium, thumbnails and social posts, printed posters and handouts, a bookmark two inches wide. How much each one says depends on how long anyone actually looks at it. On the screen it's the wordmark and not much else. On the bookmark, the one piece someone would open every day for three months, it's the whole fifteen-week schedule.",
      'proj.sandcastles.alt.1': "The Sandcastles graphic: a sandcastle collage under an orange sun on teal, with 'Sandcastles' in a white brush script and three Psalms set around it.",
      'proj.sandcastles.alt.2': "The printed Summer Reading Plan bookmark, using the same artwork, resting in an open Bible beside a coffee mug and a candle.",
      'proj.sandcastles.alt.3': "The Sandcastles artwork on the church auditorium's main screen during a service, with the congregation seated in front of it.",
      'proj.oasis-journey.desc': '3D animated short created as an early motion and storytelling project.',
      'proj.oasis-journey.type': 'Otis College · 3D Animation',
      'proj.oasis-journey.role': 'Animator / Director',
      'proj.oasis-journey.body': "Journey to the Oasis is a 3D animated short made for a 3D animation course at Otis College of Art and Design. A lone alien, Leedo, tears through desert ruins in a low-slung ship, clears a wide gap in slow motion, and steps out in front of a gleaming city, the film ends panning off him into the sun. There's no dialogue, just wind and a short score.\n\nIt was built across Maya, Blender and ZBrush. The call that set the schedule was rendering in Cycles rather than Eevee, for the quality it gave this piece: the final pass took three full days. It closed out the course as my final project.",
      'proj.oasis-journey.alt.1': "A 3D desert city of white marble rings, columns and wide bowl-topped towers, with a pale green ship hovering above and dunes rising behind.",
      'proj.oasis-journey.alt.2': "The Journey to the Oasis poster art: a 3D desert scene with marble arches and towers, low ships in the foreground and a small alien figure standing on one of them.",
      'proj.bradley-redesign.desc': "Case study coming soon.",
      'proj.bradley-redesign.type': "Case Study",
      'proj.bradley-redesign.role': "UX Designer",
      'proj.bradley-redesign.body': "Case study coming soon.",
      'proj.bradley-redesign.alt.1': "Placeholder image for the Bradley Redesign project.",

      'project.back': '← ALL PROJECTS',
      'project.next': 'NEXT PROJECT',
      'project.selected': 'Selected photographs',
      'project.type': 'TYPE',
      'project.year': 'YEAR',
      'project.role': 'ROLE',

      'about.title': 'ABOUT',
      'about.statement': "I'm a UX designer studying at Bradley University. The goal is making things <b>for others</b>. It's not about being ostentatious, it's about using <b>research</b> to create <b>verifiably successful designs</b>.",
      'about.hook': "I’ve lived on three continents.<br>So I learned that perspective and culture are crucial for design.",
      'about.stat.nowValue': "Milan",
      'about.portraitLink': "More about Jack",
      'about.portraitAlt': "Jack on a platform at Milano Centrale, a red high-speed train beside him and a duffel bag held in both hands, the station's arched roof overhead.",
      'about.stat.years': 'Years of UX',
      'about.stat.projects': 'Projects',
      'about.stat.countries': "Countries visited",
      'about.stat.now': "Where I am right now",
      'about.readmore': "HOW I GOT HERE",
      'about.resume': 'VIEW MY OFFICIAL RESUME ↗︎',

      'aboutpage.back': '← BACK',
      'aboutpage.photoAlt': 'Jack with a camera in a Milan palazzo courtyard, red threads strung between the arches behind him.',
      'aboutpage.bandAlt': 'Jack on a grassy ridge in the Dolomites with jagged peaks behind him.',
      'aboutpage.teamAlt': 'Jack and the Riverside creative team in front of the printed Easter at Riverside photo wall.',
      'aboutpage.heading': "HI, I'M JACK.",
      'aboutpage.p1': "I’ve been the outsider trying to figure out how things work many times. Five years at an international school in Yokohama, where I picked up Japanese, and now I’m in Milan for a semester. It taught me that if something only makes sense to me, it’s not done yet. So I do the research, make every choice on purpose, and <a class='prose-link' href='#work' data-open-project='cat-coaching'>test with real people</a> before I call anything finished.",
      'aboutpage.p2': "I started with Cool Math Games, making logos on whatever free site let me export, and building Wix websites for school projects even when nobody asked. Now, I’m doing user research, brand systems, and prototyping. Same instincts, just with better tools.",
      'aboutpage.p3': "Away from the screen, you’ll find me on a hiking trail, basketball court, or playing a card game with my friends.",
      'aboutpage.p4': "Faith is also a big part of who I am. Easter at Riverside is one of my favorite projects, mostly because of the team: kind, incredibly knowledgeable people who let me soak up everything they knew about their field when they absolutely didn’t have to.",
      'aboutpage.timeline': 'TIMELINE',
      'aboutpage.skills': 'SKILLS',
      'skills.design': 'DESIGN',
      'skills.research': 'RESEARCH',
      'skills.build': 'BUILD',
      'skills.tools': 'TOOLS',

      'tl.1.year': 'AUG – DEC 2026',
      'tl.1.role': 'Study abroad at NABA, Milan',
      'tl.1.desc': 'UX and product design at Nuova Accademia di Belle Arti.',
      'tl.2.year': '2025 – NOW',
      'tl.2.role': 'Real estate photographer at Jubilee Media',
      'tl.2.desc': 'Shooting residential listings on location, handling lighting, composition, and framing for each property.',
      'tl.3.year': '2024 – 2026',
      'tl.3.role': 'Tech and Creative Team at Riverside Community Church',
      'tl.3.desc': 'Live production for weekly services: sound, lighting, cameras, livestream, and slides. Plus design, branding, and photography for events.',
      'tl.4.year': '2023 – 2027',
      'tl.4.role': 'UX Design at Bradley University',
      'tl.4.desc': "BS in User Experience Design, GPA 3.6. Dean's List.",
      'tl.5.year': '2022',
      'tl.5.role': 'Summer program at Otis College',
      'tl.5.desc': '3D design and animation, which is where Journey to the Oasis came from.',
      'tl.6.year': 'NEXT',
      'tl.6.role': 'Final year at Bradley!',
      'tl.6.desc': 'Back from Milan in December, finishing the degree in May 2027, then grad school. Open to freelance now, and to internships or full-time work along the way.',

      'magnetic.rows': ["LET'S MAKE", 'SOMETHING.'],
      'magnetic.aria': "Let's make something.",

      'contact.title': 'CONTACT',
      'contact.statement': 'Say Hello!',
      'contact.copy': 'COPY',
      'contact.resume': 'RESUME',
      'contact.copied': 'COPIED ✓',

      'form.name': 'NAME',
      'form.email': 'EMAIL',
      'form.message': 'MESSAGE',
      'form.name.ph': 'Your name',
      'form.email.ph': 'you@email.com',
      'form.message.ph': "Tell me what you're working on...",
      'form.submit': 'SEND MESSAGE →',
      'form.status.sending': "Sending...",
      'form.status.thanks': "Thanks, I'll get back to you soon.",
      'form.status.mailto': "Opening your email app, send it over and I'll get back to you.",

      'footer.backtotop': 'BACK TO TOP ↑',

      'egg.stickers': 'STICKERS',
      'egg.chaos': 'CHAOS MODE',
      'egg.chaosWarn': 'EPILEPSY WARNING',
      'egg.dragsticker': 'DRAG A STICKER ANYWHERE →',
      'egg.close': 'CLOSE ✕',
      'egg.stopchaos': 'STOP CHAOS ✕',
      'egg.playpong': '▶ PLAY PONG',
      'pong.title': 'PONG.EXE, GLITCH EDITION',
      'pong.win': 'YOU WIN',
      'pong.lose': 'CPU WINS',
      'pong.rematch': 'REMATCH ▶',
      'pong.controls': '↑/↓ OR W/S TO MOVE, FIRST TO 5',
      // shown instead on a touch device, where the other one names two
      // inputs the visitor does not have - see the pointer control in script.js
      'pong.controlsTouch': 'DRAG TO MOVE, FIRST TO 5'
    },

    /* ---------------------------------------------------------------- ES */
    es: {
      'a11y.skip': 'Saltar al contenido principal',
      'a11y.photoAlt': 'Foto {n} de {title}',
      'a11y.videoLabel': 'Película del proyecto',
      'a11y.playFilm': 'Reproducir la película',
      'a11y.lightbox': 'Imagen ampliada',
      'a11y.close': 'Cerrar',
      'a11y.zoomHint': 'Clic para ampliar',
      'a11y.prevImage': 'Imagen anterior',
      'a11y.nextImage': 'Imagen siguiente',
      'a11y.modelViewer': "Modelo 3D giratorio del soporte: arrastra o usa las flechas del teclado",
      'a11y.eggTrigger': 'Extras ocultos',
      'html.title': "Jack Murray · Diseñador UX",
      'html.description': "Portafolio de diseño UX de Jack Murray: sitios web, sistemas visuales, branding, fotografía, motion y experimentos digitales.",

      'nav.projects': 'PROYECTOS',
      'nav.about': 'SOBRE MÍ',
      'nav.contact': 'CONTACTO',
      'nav.aria.theme': 'Modo oscuro / claro',
      'nav.aria.menu': 'menú',
      'nav.aria.language': 'Elegir idioma',


      'hero.badge': 'HAGAMOS ALGO JUNTOS',
      'hero.cta': 'VER PROYECTOS',
      'hero.role': 'DISEÑADOR UX &<br>CREATIVO DIGITAL',

      'work.title': 'PROYECTOS SELECCIONADOS',
      'filter.ALL': 'TODOS',
      'e404.heading': 'Esta página no existe.',
      'e404.body': 'El enlace puede estar desactualizado, o la dirección puede tener un error.',
      'e404.home': 'VOLVER AL PORTAFOLIO',
      'e404.title': 'Página no encontrada — Jack Murray',
      'filter.aria': 'Filtrar proyectos por categoría',
      'filter.count.one': '1 proyecto',
      'filter.count.many': '{n} proyectos',
      'footer.built': 'Cuatro idiomas  ·  Modo oscuro y claro  ·  Contraste AA  ·  Navegación por teclado  ·  Movimiento reducido',
      'card.cta': 'Ver proyecto',
      'filter.UX/UI': 'UX/UI',
      'filter.PRODUCT': 'PRODUCTO',
      'filter.GRAPHICS': 'GRÁFICOS',
      'filter.PHOTOGRAPHY': 'FOTOGRAFÍA',
      'filter.MOTION': 'MOTION / 3D',
      'skill.ux-design': "Diseño UX",
      'skill.interaction-design': "Diseño de interacción",
      'skill.user-research': "Investigación de usuarios",
      'skill.user-flows': "Flujos de usuario",
      'skill.prototyping': "Prototipado",
      'skill.usability-testing': "Pruebas de usabilidad",
      'skill.product-design': "Diseño de producto",
      'skill.3d-modeling': "Modelado 3D",
      'skill.photography': "Fotografía",
      'skill.graphic-design': "Diseño gráfico",
      'skill.brand-identity': "Identidad de marca",
      'skill.typography': "Tipografía",
      'skill.print-design': "Diseño impreso",
      'skill.ui-design': "Diseño de interfaz",
      'skill.motion-design': "Diseño de movimiento",
      'skill.visual-effects': "Efectos visuales",
      'skill.color-grading': "Corrección de color",
      'skill.3d-animation': "Animación 3D",

      'cat.UX/UI': 'UX/UI',
      'cat.PRODUCT': 'PRODUCTO',
      'cat.GRAPHICS': 'GRÁFICOS',
      'cat.PHOTOGRAPHY': 'FOTOGRAFÍA',
      'cat.MOTION': 'MOTION / 3D',

      'proj.cat-coaching.desc': "Interfaz de coaching adaptativo para operadores de maquinaria pesada, diseñada con Caterpillar.",
      'proj.cat-coaching.type': 'Bradley University × Caterpillar',
      'proj.cat-coaching.role': 'Investigación y diseño UX',
      'proj.cat-coaching.body': "Premio a la Mejor Investigación. En mi curso de Diseño de Interacción Avanzado en Bradley trabajé en un equipo de tres personas junto a Caterpillar para diseñar una interfaz de coaching adaptativo para operadores de maquinaria pesada.\n\nParticipé en todas las partes del proceso: investigación, flujos de usuario, wireframes, prototipos en Figma y pruebas de usabilidad con 5 participantes. Nos reunimos con el equipo de UX de Caterpillar durante 7 semanas, pasamos por 2 rondas de iteración a partir de sus comentarios y de nuestras pruebas, y terminamos con una visita presencial a Caterpillar en Peoria.",
      'proj.cat-coaching.alt.1': "Tres estudiantes trabajando en una mesa de reuniones en Caterpillar, con portátiles abiertos en archivos de diseño y notas del proyecto cubriendo la pizarra detrás.",
      'proj.cat-coaching.alt.2': "El equipo de tres personas frente a un gráfico mural de Caterpillar que dice 'One Team, with a Common Goal'.",
      'proj.pot-clip.desc': "Diseñado, esculpido a mano, modelado en digital y probado.",
      'proj.pot-clip.type': "Diseño de Producto",
      'proj.pot-clip.role': "Diseño y Fabricación",
      'proj.pot-clip.body': "El encargo era un cubo de diez centímetros: diseñar un objeto de cocina en el espíritu de Alessi, lo bastante creíble como para pensar que lo habías encontrado en una tienda. Empecé en la tienda de Alessi en Milán, mirando lo que realmente hacen: objetos pequeños de plata, simples, casi siempre algún ritual cotidiano hecho un poco mejor. Después cociné más de lo habitual y esperé a que algo me molestara.\n\nLo que me molestaba era la cuchara. No hay un sitio limpio donde dejarla: la encimera se ensucia, y apoyarla en el borde hace que resbale o se caiga dentro. Ya existen soportes para esto, pero la mayoría se fijan en un punto y sujetan una sola cosa. El mío son dos apoyos independientes que se sitúan en el borde y se deslizan por él, así que la separación se ajusta a lo que tengas en la mano: una cuchara de madera ancha o un tenedor metálico fino. Lo mejor salió de dónde se coloca, no de su aspecto: al apoyarse sobre la olla, las gotas vuelven a caer dentro, y no hay un segundo objeto ocupando encimera y pendiente de fregar.\n\nLa forma salió de una página de preguntas \"¿cómo podríamos…?\": cómo agarrar bien varios tamaños de olla, cómo mantener útil la parte superior cuando el conjunto queda inclinado. A partir de ahí: perfiles de papel recortados y probados contra una olla, y después el físico, esculpido en espuma de modelado densa en el taller, tratado con capas y pintado para que leyera como metal. Es un modelo de apariencia, no una pieza funcional. El modelo digital llegó al final, construido a partir del objeto terminado y no antes, y es de donde salen los renders de los carteles.\n\nNo está resuelto, y casi todo lo que falla es físico. En metal real, enganchados a una olla caliente, se calentarían demasiado para moverlos con las manos desnudas. Los bordes de las ollas no están estandarizados — finos, gruesos, enrollados, abocinados, algunos con pico — así que un solo perfil no los agarra todos, y el agarre es solo por fricción. La parte superior es lo bastante plana como para que un mango redondo ruede. Y son dos objetos donde lo que ya existe en el mercado es uno. Conocer esa lista es lo que más me dio el proyecto; una versión siguiente partiría del calor y del perfil del borde, no de la forma.\n\nFue un proyecto académico en NABA, en Milán. No está afiliado a Alessi y no fue encargado ni revisado por la empresa. Alessi fue la marca de referencia del encargo, y los carteles son una campaña conceptual original desarrollada para este proyecto.",
      'proj.pot-clip.cs.disclaimer': "Fue un proyecto académico en NABA, en Milán. No está afiliado a Alessi y no fue encargado ni revisado por la empresa. Alessi fue la marca de referencia del encargo, y los carteles son una campaña conceptual original desarrollada para este proyecto.",
      'proj.pot-clip.alt.14': "Un render del soporte terminado sobre fondo liso, mostrando su parte superior curva y sus dos patas.",
      'proj.pot-clip.cs.eyebrow': "Un concepto de producto desarrollado al estilo de Alessi, NABA Milán 2026",
      'proj.pot-clip.cs.lede': "Diseñado, esculpido a mano, modelado en digital y probado.",
      'proj.pot-clip.cs.toc': "En esta página",
      'proj.pot-clip.cs.meta.context': "Contexto",
      'proj.pot-clip.cs.meta.contextV': "Curso de Diseño de Producto, proyecto académico",
      'proj.pot-clip.cs.meta.duration': "Duración",
      'proj.pot-clip.cs.meta.durationV': "8 semanas",
      'proj.pot-clip.cs.meta.role': "Rol",
      'proj.pot-clip.cs.meta.roleV': "Investigación, concepto, modelado físico y digital, dirección de arte",
      'proj.pot-clip.cs.meta.tools': "Herramientas digitales",
      'proj.pot-clip.cs.meta.toolsV': "Blender, Illustrator, Canva",
      'proj.pot-clip.cs.card1.t': "Problema",
      'proj.pot-clip.cs.card1.b': "Al cocinar en una cocina pequeña, no hay ningún sitio limpio y seguro donde apoyar un utensilio.",
      'proj.pot-clip.cs.card2.t': "Solución",
      'proj.pot-clip.cs.card2.b': "Dos soportes que se deslizan por el borde de la olla y sostienen el utensilio sobre la comida, para que las gotas caigan dentro.",
      'proj.pot-clip.cs.card3.t': "Resultado",
      'proj.pot-clip.cs.card3.b': "Un modelo de apariencia esculpido, un modelo 3D interactivo y una campaña de tres carteles, con la idea central funcionando en ollas de borde fino.",
      'proj.pot-clip.cs.brief.t': "El encargo",
      'proj.pot-clip.cs.brief.b': "Diseñar un utensilio de cocina que quepa en un cubo de 10 cm y que pudiera pasar por un producto de Alessi en una tienda.",
      'proj.pot-clip.cs.research.t': "Investigación",
      'proj.pot-clip.cs.research.grid': "<dl class=\"cs-defs\"><dt>Investigación de marca</dt><dd>Visité la tienda de Alessi en Milán y revisé la web y el catálogo de la marca. La mayoría son objetos pequeños y sencillos de metal que hacen más agradables las tareas cotidianas. Los reposacubiertos de Alessi son piezas curvas de acero pulido, pensadas para apoyarse en la encimera.</dd><dt>Observación de usuario</dt><dd>Estudié mi propia rutina de cocina como usuario. Cocino solo, con muy poco espacio de encimera entre los fogones y el fregadero. Anoté dónde acababan los utensilios, dónde se originaba la suciedad y cómo sorteaba\u00A0la\u00A0falta\u00A0de\u00A0espacio.</dd><dt>Revisión de competencia</dt><dd>Los soportes de cuchara para el borde de la olla ya existen. Son baratos y a menudo simpáticos, pero casi todos se fijan en un punto y sostienen un solo utensilio.</dd></dl>",
      'proj.pot-clip.cs.problem.t': "El problema",
      'proj.pot-clip.cs.problem.b': "<ul><li><strong>Inestabilidad.</strong> Un utensilio apoyado en el borde de la olla puede rodar, resbalar o caer dentro.</li><li><strong>Goteo.</strong> Llevar el utensilio a un reposacucharas deja gotas por el camino.</li><li><strong>Espacio.</strong> Un reposacucharas aparte ocupa una encimera que las cocinas pequeñas no tienen.</li></ul>",
      'proj.pot-clip.cs.problem.hmw': "¿Cómo podríamos: crear un lugar estable y ajustable para apoyar utensilios justo encima de la olla, manteniendo limpios tanto el utensilio como la encimera?",
      'proj.pot-clip.cs.design.t': "El diseño",
      'proj.pot-clip.cs.design.b': "<p>Dos soportes independientes se apoyan en el borde y se deslizan por él. Tú fijas la separación moviéndolos, así que el mismo par sostiene una cuchara ancha de madera o un tenedor fino de metal.</p><p>Como el utensilio queda sobre la olla, las gotas caen de nuevo en la comida. También significa que no hace falta un reposacucharas aparte que ocupe encimera o se sume a la vajilla.</p>",
      'proj.pot-clip.cs.design.hint': "Arrastra para girar",
      'proj.pot-clip.cs.process.t': "Proceso",
      'proj.pot-clip.cs.process.1': "Bocetos y perfiles de papel",
      'proj.pot-clip.cs.process.1b': "Dibujé varios diseños, convertí los más sólidos en perfiles de papel a escala real y los probé en ollas reales.",
      'proj.pot-clip.cs.process.2': "Tallado",
      'proj.pot-clip.cs.process.2b': "Tallé la forma a mano en espuma de alta densidad.",
      'proj.pot-clip.cs.process.3': "Acabado",
      'proj.pot-clip.cs.process.3b': "Recubierto con capas y pintado con spray para leerse como metal. Construí uno de los dos soportes para probar su forma y ajuste.",
      'proj.pot-clip.cs.process.4': "Modelo digital",
      'proj.pot-clip.cs.process.4b': "Escaneé la pieza terminada y la reconstruí en Blender. Ese modelo alimenta el visor 3D interactivo de esta página.",
      'proj.pot-clip.cs.testing.t': "Pruebas",
      'proj.pot-clip.cs.testing.b': "<ul><li><strong>Método.</strong> Probé el prototipo en ollas de distintos tamaños para ver dónde sujeta y dónde falla.</li><li><strong>Hallazgo.</strong> El soporte sujetó en ollas pequeñas de borde fino, incluso durante una sesión de producto completa. En ollas grandes de borde grueso no encajaba.</li><li><strong>Implicación.</strong> Una sola abertura fija no puede encajar en todos los bordes, así que el ajuste al borde es la prioridad de la siguiente versión.</li></ul>",
      'proj.pot-clip.cs.posters.t': "Carteles",
      'proj.pot-clip.cs.posters.b': "<p>Desarrollé una serie de carteles para mostrar cómo Pot Clip podría lanzarse como producto de Alessi. La frase <em>Il buon design vive nei dettagli</em> (<strong>«el buen diseño vive en los detalles»</strong>) conecta con lo que vi en mi investigación. Alessi hace objetos pequeños que mejoran las rutinas cotidianas. Escribí los textos en italiano para situar la serie en el mundo de Alessi, y partí de los carteles existentes de la marca.</p>",
      'proj.pot-clip.cs.limits.t': "Limitaciones y próximos pasos",
      'proj.pot-clip.cs.limits.b': "<p>Sigue habiendo problemas reales en el concepto, y algunos necesitan más investigación antes de que esto pudiera ser un producto viable.</p><dl class=\"cs-defs cs-defs-row\"><dt>Ajuste al borde</dt><dd>Las pruebas mostraron que una sola abertura encaja en cerca de la mitad de las ollas. Siguiente paso: un soporte con tensión de muelle o una superficie interior forrada, más una talla mayor para ollas grandes.</dd><dt>Calor</dt><dd>En metal real sobre una olla caliente, los soportes estarían demasiado calientes para ajustarlos con la mano. Siguiente paso: un material de baja conductividad donde tocan los dedos.</dd><dt>Estabilidad</dt><dd>Dejé la parte superior plana a propósito para que sostuviera más tipos de utensilios, pero un mango redondo aún puede rodar. Siguiente paso: añadir una cuna poco profunda para el agarre, sin limitar lo que puede sostener.</dd><dt>Pruebas limitadas</dt><dd>Hasta ahora toda la investigación de uso es mía, sobre pocas ollas. Siguiente paso: desarrollar más conceptos, probarlos en más ollas y refinar el más sólido.</dd></dl>",
      'proj.pot-clip.alt.thumb': "El soporte en plata pulida sobre fondo rojo oscuro, con una cuchara, un tenedor y dos espátulas dibujadas a línea alrededor.",
      'proj.pot-clip.cs.alt.hero': "Un cartel encabezado «Il buon design vive nei dettagli», con el soporte plateado enganchado al borde de un bol de acero sosteniendo una fina cuchara de madera, y la marca Alessi debajo.",
      'proj.pot-clip.cs.alt.store': "La tienda de Alessi en Milán vista desde la acera de enfrente, con su escaparate en arco lleno de pequeñas piezas de metal en estantes de madera.",
      'proj.pot-clip.cs.alt.profiles': "Tres estudios de perfil en papel del soporte, recortados sobre una base de corte verde con cotas a lápiz.",
      'proj.pot-clip.cs.alt.foam': "El modelo de espuma tallado sostenido en una mano, con un recorte en la mesa al fondo.",
      'proj.pot-clip.cs.alt.finished': "El soporte terminado de pie sobre un panel de pintura en el taller, con su superficie plateada captando la luz.",
      'proj.pot-clip.cs.alt.painted': "El modelo terminado colgado de un alambre en la cabina de pintura, su superficie plateada sobre una pared blanca perforada.",
      'proj.pot-clip.cs.alt.blender': "El modelo escaneado abierto en Blender, mostrado como una malla densa de triángulos con el contorno seleccionado.",
      'proj.pot-clip.cs.alt.rim': "El soporte en el borde de un bol de acero sosteniendo una cuchara fina de madera sobre el bol, visto de lado.",
      'proj.pot-clip.cs.alt.poster1': "Un cartel con el soporte recortado en grande sobre fondo claro, junto a la frase italiana “Il buon design vive nei dettagli”.",
      'proj.pot-clip.cs.alt.poster2': "Un cartel sobre fondo rojo oscuro con el soporte centrado sobre las marcas de Alessi y NABA.",
      'proj.pot-clip.cs.alt.poster3': "Un cartel del soporte en el borde de un bol sosteniendo una cuchara de madera, bajo la frase “Il buon design vive nei dettagli”.",
      'proj.fuse-partners-in-crime.desc': "Atraco cooperativo asimétrico entre VR y PC, expuesto en el Peoria Riverfront Museum.",
      'proj.fuse-partners-in-crime.type': 'Bradley FUSE · Videojuego VR',
      'proj.fuse-partners-in-crime.role': 'Interfaz VR y efectos visuales',
      'proj.fuse-partners-in-crime.body': "Una experiencia cooperativa para dos jugadores entre VR y PC, creada por un equipo de 17 personas para el programa FUSE de Bradley y expuesta al público en el Peoria Riverfront Museum.\n\nLos dos jugadores nunca ven lo mismo: uno está dentro de la mansión en VR, mientras el otro lee el plano y las cámaras desde el PC.\n\nFormé parte del pequeño grupo que tuvo la idea original antes de que creciera hasta convertirse en un proyecto de equipo completo. A partir de ahí me centré en la parte de VR: diseñé la interfaz de VR y creé partículas y efectos visuales en Unity para ayudar a los jugadores a entender lo que ocurría en el juego. También asesoré sobre los menús de PC y trabajé con diseñadores de juego, programadores y artistas para llevarlo del concepto a un juego jugable.",
      'proj.fuse-partners-in-crime.alt.1': "El banner del título de Partners in Crime: letras blancas gruesas con un signo de dólar y una gema dorados, sobre la silueta morada de una mansión.",
      'proj.fuse-partners-in-crime.alt.2': "Una niña en el museo jugando la parte de PC, con la interfaz verde del plano en el portátil y la vista del jugador de VR en el monitor de atrás.",
      'proj.fuse-partners-in-crime.alt.3': "El montaje de la exposición en el Peoria Riverfront Museum, con un jugador con casco de VR y otro en un PC.",
      'proj.fuse-partners-in-crime.alt.4': "El banner vertical de la exposición: el título de Partners in Crime sobre el equipo completo del proyecto listado por departamento, con el escáner y el portátil del juego debajo.",
      'proj.easter-riverside.desc': "Una identidad para dos servicios, desde las tarjetas de invitación hasta una pancarta en la fachada.",
      'proj.easter-riverside.type': 'Identidad de evento',
      'proj.easter-riverside.role': 'Diseñador gráfico',
      'proj.easter-riverside.body': "Easter at Riverside es la identidad de un mismo fin de semana con dos servicios: Viernes Santo el 18 y Domingo de Pascua el 20. Un cielo abierto, un sol naranja que asoma entre las nubes y una serif con el peso suficiente para sostener un versículo encima. El azul es exactamente el color con el que pintamos el piano de alabanza de la iglesia.\n\nDos servicios con emociones opuestas y una sola construcción. El Viernes Santo usa el mismo logotipo y el mismo círculo, bajados a blanco y negro: nubes de tormenta en lugar de cielo abierto y el sol apagado detrás de la tipografía. Van uno al lado del otro en una única pancarta en el muro exterior, así que el paso de uno a otro se lee al entrar. Esa pareja es la pieza que me quedaría.\n\nDespués tenía que aguantar los soportes. La pancarta se lee desde el otro extremo del aparcamiento. La tarjeta de invitación se sostiene con una mano. El panel fotográfico fue el que me hizo pensar distinto: su función es que la gente se ponga delante, así que le quité todo menos el logotipo y lo coloqué lo bastante alto como para que una docena de personas hombro con hombro lo dejen legible. Una gráfica diseñada para quedar medio tapada.",
      'proj.easter-riverside.alt.1': "La gráfica de Easter at Riverside: «Easter» en una serif alta sobre un cielo azul, con un sol naranja y un aro pálido entre las nubes.",
      'proj.easter-riverside.alt.2': "La pancarta exterior en el muro de ladrillo rojo de la iglesia: Viernes Santo en blanco y negro a la izquierda y Pascua con cielo azul a la derecha.",
      'proj.easter-riverside.alt.3': "El equipo de la iglesia hombro con hombro delante del panel fotográfico azul claro de Easter at Riverside, con el logotipo visible por encima.",
      'proj.easter-riverside.alt.4': "Una pila de tarjetas de invitación impresas de Easter at Riverside sobre una mesita redonda.",
      'proj.monmouth-retreat.desc': 'Fotografías espontáneas del retiro de un equipo de alabanza en Monmouth.',
      'proj.monmouth-retreat.type': 'Colección fotográfica',
      'proj.monmouth-retreat.role': 'Fotógrafo',
      'proj.monmouth-retreat.body': "Tuve la oportunidad de fotografiar un retiro musical de un equipo de alabanza en Monmouth, Illinois. El retiro estaba lleno de vida y de emoción profunda, y busqué capturar esa energía en momentos espontáneos, tanto individuales como de grupo.\n\nLa luz cambiante fue el problema de la edición. Imagen a imagen el conjunto no habría tenido unidad, así que llevé toda la galería hacia un mismo tono en lugar de dejar que cada foto fuera su mejor versión por separado.",
      'proj.monmouth-retreat.alt.1': "Una cantante en el suelo con un micrófono y la banda en el sofá detrás.",
      'proj.monmouth-retreat.alt.2': "El teatro Rivoli de Monmouth, con nieve en la acera.",
      'proj.monmouth-retreat.alt.3': "El equipo de pie en el loft, mirando hacia las ventanas.",
      'proj.monmouth-retreat.alt.4': "Tres músicos sentados en el suelo con un ukelele y una guitarra.",
      'proj.monmouth-retreat.alt.5': "Un hombre en el sofá tocando un pequeño instrumento de cuerda.",
      'proj.monmouth-retreat.alt.6': "Una cantante riendo ante un micrófono, con auriculares.",
      'proj.monmouth-retreat.alt.7': "Dos cantantes en el sofá comparten un micrófono; a su lado alguien tumbado al revés.",
      'proj.monmouth-retreat.alt.8': "El baterista en su batería, visto entre un platillo y un tom.",
      'proj.monmouth-retreat.alt.9': "Un guitarrista toca en un vano de puerta iluminado, con dos figuras desenfocadas delante.",
      'proj.monmouth-retreat.alt.10': "Dos guitarristas de pie muy juntos, resolviendo una parte.",
      'proj.monmouth-retreat.alt.11': "Cantantes ante los micrófonos con las partituras delante.",
      'proj.monmouth-retreat.alt.12': "Alguien al revés en el sofá, con un micrófono sobre la cara.",
      'proj.monmouth-retreat.alt.13': "El líder de alabanza revisa un montón de partituras; detrás, un teclista.",
      'proj.monmouth-retreat.alt.14': "Una cantante de perfil con una carpeta de partituras abierta.",
      'proj.monmouth-retreat.alt.15': "Un guitarrista con jersey negro de cuello alto toca una acústica.",
      'proj.monmouth-retreat.alt.16': "Un guitarrista con una eléctrica azul claro y un amigo que lo mira.",
      'proj.monmouth-retreat.alt.17': "Un hombre mira hacia arriba durante una canción, con dos personas desenfocadas delante.",
      'proj.monmouth-retreat.alt.18': "Una cantante con una mano levantada y los ojos cerrados; detrás, otra riendo.",
      'proj.sandcastles.desc': 'Identidad de serie aplicada a pantallas de escenario, redes e impresos.',
      'proj.sandcastles.type': 'Identidad de serie de sermones',
      'proj.sandcastles.role': 'Diseñador gráfico',
      'proj.sandcastles.body': "Sandcastles es la identidad de un verano en los Salmos: los 150, diez por semana durante quince semanas. El encargo llegó como apenas un par de frases a partir de las cuales construir.\n\nSandcastles es una palabra de niños en la playa, y los Salmos no son lectura ligera. El trabajo era un juego que sostuviera el peso: un castillo de arena bajo un sol bajo, levantado sobre lo único que todos sabemos que la marea se va a llevar. Costó muchas versiones del collage y más tipografías de las que me gustaría reconocer, descartadas tanto por la licencia comercial como por el tono. El logotipo cambió antes de salir: el director creativo sustituyó la letra de pincel por mayúsculas serif.\n\nA partir de ahí tenía que aguantar allí donde fuera: una pantalla de escenario sobre un auditorio lleno, miniaturas y publicaciones en redes, carteles y folletos impresos, un marcapáginas de cinco centímetros. Cuánto dice cada uno depende del tiempo que alguien vaya a mirarlo. En pantalla es el logotipo y poco más. En el marcapáginas, lo único que alguien iba a abrir cada día durante tres meses, es el calendario entero de quince semanas.",
      'proj.sandcastles.alt.1': 'La gráfica de Sandcastles: un collage de castillo de arena bajo un sol naranja sobre turquesa, con «Sandcastles» en letra de pincel blanca y tres Salmos alrededor.',
      'proj.sandcastles.alt.2': 'El marcapáginas impreso del plan de lectura de verano, con la misma obra, sobre una Biblia abierta junto a una taza de café y una vela.',
      'proj.sandcastles.alt.3': 'La obra de Sandcastles en la pantalla principal del auditorio de la iglesia durante un servicio, con la congregación sentada delante.',
      'proj.oasis-journey.desc': 'Cortometraje animado en 3D creado como primer proyecto de motion y narrativa.',
      'proj.oasis-journey.type': 'Otis College · Animación 3D',
      'proj.oasis-journey.role': 'Animador / Director',
      'proj.oasis-journey.body': "Journey to the Oasis es un corto de animación 3D hecho para una asignatura de animación 3D en Otis College of Art and Design. Un alien solitario, Leedo, cruza a toda velocidad unas ruinas en el desierto con una nave baja, salva un abismo ancho a cámara lenta y baja frente a una ciudad reluciente; el corto termina alejándose de él hacia el sol. No hay diálogo, solo viento y una pieza musical breve.\n\nEstá hecho entre Maya, Blender y ZBrush. La decisión que marcó el calendario fue renderizar en Cycles y no en Eevee, por la calidad que le daba a esta pieza: la pasada final tardó tres días completos. Cerró la asignatura como mi proyecto final.",
      'proj.oasis-journey.alt.1': "Una ciudad desértica en 3D de anillos, columnas y torres de mármol blanco rematadas en forma de cuenco, con una nave verde pálido suspendida encima y dunas al fondo.",
      'proj.oasis-journey.alt.2': "La ilustración del póster de Journey to the Oasis: una escena desértica en 3D con arcos y torres de mármol, naves bajas en primer plano y una pequeña figura alienígena de pie sobre una de ellas.",
      'proj.bradley-redesign.desc': "Estudio de caso próximamente.",
      'proj.bradley-redesign.type': "Estudio de caso",
      'proj.bradley-redesign.role': "Diseñador UX",
      'proj.bradley-redesign.body': "Estudio de caso próximamente.",
      'proj.bradley-redesign.alt.1': "Imagen provisional del proyecto Bradley Redesign.",

      'project.back': '← TODOS LOS PROYECTOS',
      'project.next': 'SIGUIENTE PROYECTO',
      'project.selected': 'Fotografías seleccionadas',
      'project.type': 'TIPO',
      'project.year': 'AÑO',
      'project.role': 'ROL',

      'about.title': 'SOBRE MÍ',
      'about.statement': "Soy diseñador UX y estudio en Bradley University. El objetivo es hacer cosas <b>para otros</b>. No se trata de ser ostentoso, sino de usar la <b>investigación</b> para crear <b>diseños verificablemente exitosos</b>.",
      'about.hook': "He vivido en tres continentes.<br>Así que aprendí que la perspectiva y la cultura son cruciales para el diseño.",
      'about.stat.nowValue': "Milán",
      'about.portraitLink': "Más sobre Jack",
      'about.portraitAlt': "Jack en un andén de Milano Centrale, con un tren de alta velocidad rojo a su lado y una bolsa de viaje en las manos, bajo la bóveda de la estación.",
      'about.stat.years': 'Años de UX',
      'about.stat.projects': 'Proyectos',
      'about.stat.countries': "Países visitados",
      'about.stat.now': "Dónde estoy ahora mismo",
      'about.readmore': "CÓMO LLEGUÉ AQUÍ",
      'about.resume': 'VER MI CV OFICIAL ↗︎',

      'aboutpage.back': '← VOLVER',
      'aboutpage.photoAlt': 'Jack con una cámara en el patio de un palacio de Milán, con hilos rojos tendidos entre los arcos.',
      'aboutpage.bandAlt': 'Jack en una ladera de los Dolomitas con picos escarpados detrás.',
      'aboutpage.teamAlt': 'Jack y el equipo creativo de Riverside ante el panel fotográfico impreso de Easter at Riverside.',
      'aboutpage.heading': 'HOLA, SOY JACK.',
      'aboutpage.p1': "He sido muchas veces el de fuera intentando entender cómo funcionan las cosas. Cinco años en un colegio internacional en Yokohama, de donde me viene el japonés, y ahora un semestre en Milán. Me enseñó que si algo solo tiene sentido para mí, todavía no está terminado. Así que investigo, tomo cada decisión a propósito y <a class='prose-link' href='#work' data-open-project='cat-coaching'>lo pruebo con gente real</a> antes de dar nada por acabado.",
      'aboutpage.p2': "Empecé con Cool Math Games, haciendo logos en cualquier web gratis que me dejara exportar y montando webs en Wix para trabajos de clase aunque nadie me lo pidiera. Ahora hago investigación con usuarios, sistemas de marca y prototipos. Los mismos instintos, solo con mejores herramientas.",
      'aboutpage.p3': "Lejos de la pantalla, me vas a encontrar en una ruta de montaña, en una cancha de baloncesto o jugando a las cartas con mis amigos.",
      'aboutpage.p4': "La fe también es una parte importante de quién soy. Easter at Riverside es uno de mis proyectos favoritos, sobre todo por el equipo: gente amable y con un conocimiento enorme que me dejó absorber todo lo que sabían de su campo cuando no tenían ninguna obligación de hacerlo.",
      'aboutpage.timeline': 'TRAYECTORIA',
      'aboutpage.skills': 'HABILIDADES',
      'skills.design': 'DISEÑO',
      'skills.research': 'INVESTIGACIÓN',
      'skills.build': 'DESARROLLO',
      'skills.tools': 'HERRAMIENTAS',

      'tl.1.year': 'AGO – DIC 2026',
      'tl.1.role': 'Intercambio en NABA, Milán',
      'tl.1.desc': 'Diseño UX y de producto en la Nuova Accademia di Belle Arti.',
      'tl.2.year': '2025 – AHORA',
      'tl.2.role': 'Fotógrafo inmobiliario en Jubilee Media',
      'tl.2.desc': 'Fotografío viviendas en venta, cuidando la luz, la composición y el encuadre de cada propiedad.',
      'tl.3.year': '2024 – 2026',
      'tl.3.role': 'Equipo técnico y creativo en Riverside Community Church',
      'tl.3.desc': 'Producción en directo de los servicios semanales: sonido, luces, cámaras, streaming y proyecciones. Además de diseño, branding y fotografía para eventos.',
      'tl.4.year': '2023 – 2027',
      'tl.4.role': 'Diseño UX en Bradley University',
      'tl.4.desc': 'Grado en Diseño de Experiencia de Usuario, nota media 3.6. Cuadro de honor.',
      'tl.5.year': '2022',
      'tl.5.role': 'Programa de verano en Otis College',
      'tl.5.desc': 'Diseño 3D y animación, de donde salió Journey to the Oasis.',
      'tl.6.year': 'SIGUIENTE',
      'tl.6.role': '¡Último curso en Bradley!',
      'tl.6.desc': 'Vuelta de Milán en diciembre, fin de carrera en mayo de 2027 y después un máster. Disponible para freelance ahora, y para prácticas o jornada completa por el camino.',

      'magnetic.rows': ['HAGAMOS', 'ALGO JUNTOS.'],
      'magnetic.aria': 'Hagamos algo juntos.',

      'contact.title': 'CONTACTO',
      'contact.statement': '¡Saluda!',
      'contact.copy': 'COPIAR',
      'contact.resume': 'CV',
      'contact.copied': 'COPIADO ✓',

      'form.name': 'NOMBRE',
      'form.email': 'CORREO',
      'form.message': 'MENSAJE',
      'form.name.ph': 'Tu nombre',
      'form.email.ph': 'tu@correo.com',
      'form.message.ph': 'Cuéntame en qué estás trabajando...',
      'form.submit': 'ENVIAR MENSAJE →',
      'form.status.sending': "Enviando...",
      'form.status.thanks': 'Gracias, te responderé pronto.',
      'form.status.mailto': 'Abriendo tu app de correo, envíamelo y te respondo pronto.',

      'footer.backtotop': 'VOLVER ARRIBA ↑',

      'egg.stickers': 'PEGATINAS',
      'egg.chaos': 'MODO CAOS',
      'egg.chaosWarn': 'AVISO DE EPILEPSIA',
      'egg.dragsticker': 'ARRASTRA UNA PEGATINA →',
      'egg.close': 'CERRAR ✕',
      'egg.stopchaos': 'PARAR EL CAOS ✕',
      'egg.playpong': '▶ JUGAR PONG',
      'pong.title': 'PONG.EXE, EDICIÓN GLITCH',
      'pong.win': 'GANASTE',
      'pong.lose': 'GANA LA CPU',
      'pong.rematch': 'REVANCHA ▶',
      'pong.controls': '↑/↓ O W/S PARA MOVER, PRIMERO A 5',
      'pong.controlsTouch': 'ARRASTRA PARA MOVER, PRIMERO A 5'
    },

    /* ---------------------------------------------------------------- JA */
    ja: {
      'a11y.skip': '本文へスキップ',
      'a11y.photoAlt': '「{title}」の写真 {n}枚目',
      'a11y.videoLabel': 'プロジェクトの映像',
      'a11y.playFilm': '映像を再生',
      'a11y.lightbox': '拡大画像',
      'a11y.close': '閉じる',
      'a11y.zoomHint': 'クリックで拡大',
      'a11y.prevImage': '前の画像',
      'a11y.nextImage': '次の画像',
      'a11y.modelViewer': "回転できるレストの3Dモデル。ドラッグするか矢印キーで操作できます",
      'a11y.eggTrigger': '隠れたおまけ',
      'html.title': "Jack Murray · UXデザイナー",
      'html.description': "Jack MurrayのUXデザインポートフォリオ。ウェブサイト、ビジュアルシステム、ブランディング、写真、モーション、デジタル実験。",

      'nav.projects': 'プロジェクト',
      'nav.about': 'プロフィール',
      'nav.contact': 'お問い合わせ',
      'nav.aria.theme': 'ダーク / ライトモード',
      'nav.aria.menu': 'メニュー',
      'nav.aria.language': '言語を選択',


      'hero.badge': 'なにかつくろう',
      'hero.cta': 'プロジェクトを見る',
      'hero.role': 'UXデザイナー &<br>デジタルクリエイティブ',

      'work.title': '選りすぐりのプロジェクト',
      'filter.ALL': 'すべて',
      'e404.heading': 'このページは存在しません。',
      'e404.body': 'リンクが古いか、アドレスに誤りがあるかもしれません。',
      'e404.home': 'ポートフォリオに戻る',
      'e404.title': 'ページが見つかりません — Jack Murray',
      'filter.aria': 'カテゴリーでプロジェクトを絞り込む',
      'filter.count.one': 'プロジェクト 1 件',
      'filter.count.many': 'プロジェクト {n} 件',
      'footer.built': '4言語対応  ·  ダーク/ライトモード  ·  AAコントラスト  ·  キーボード操作  ·  モーション軽減',
      'card.cta': 'プロジェクトを見る',
      'filter.UX/UI': 'UX/UI',
      'filter.PRODUCT': 'プロダクト',
      'filter.GRAPHICS': 'グラフィック',
      'filter.PHOTOGRAPHY': '写真',
      'filter.MOTION': 'モーション / 3D',
      'skill.ux-design': "UXデザイン",
      'skill.interaction-design': "インタラクションデザイン",
      'skill.user-research': "ユーザーリサーチ",
      'skill.user-flows': "ユーザーフロー",
      'skill.prototyping': "プロトタイピング",
      'skill.usability-testing': "ユーザビリティテスト",
      'skill.product-design': "プロダクトデザイン",
      'skill.3d-modeling': "3Dモデリング",
      'skill.photography': "写真撮影",
      'skill.graphic-design': "グラフィックデザイン",
      'skill.brand-identity': "ブランドアイデンティティ",
      'skill.typography': "タイポグラフィ",
      'skill.print-design': "印刷デザイン",
      'skill.ui-design': "UIデザイン",
      'skill.motion-design': "モーションデザイン",
      'skill.visual-effects': "ビジュアルエフェクト",
      'skill.color-grading': "カラーグレーディング",
      'skill.3d-animation': "3Dアニメーション",

      'cat.UX/UI': 'UX/UI',
      'cat.PRODUCT': 'プロダクト',
      'cat.GRAPHICS': 'グラフィック',
      'cat.PHOTOGRAPHY': '写真',
      'cat.MOTION': 'モーション / 3D',

      'proj.cat-coaching.desc': '建設機械オペレーター向けのアダプティブなコーチングUIを、キャタピラーと共同で設計。',
      'proj.cat-coaching.type': 'ブラッドリー大学 × キャタピラー',
      'proj.cat-coaching.role': 'UXリサーチ / デザイン',
      'proj.cat-coaching.body': "ベストリサーチ賞受賞。ブラッドリー大学の上級インタラクションデザインの講座で、3人チームとしてキャタピラーと組み、建設機械オペレーター向けのアダプティブなコーチングUIを設計しました。\n\nリサーチ、ユーザーフロー、ワイヤーフレーム、Figmaプロトタイプ、5名を対象としたユーザビリティテストまで、プロセスのすべてに関わりました。キャタピラーのUXチームとは7週間にわたって打ち合わせを重ね、そのフィードバックと自分たちのテスト結果をもとに2回のイテレーションを行い、最後はピオリアのキャタピラーを訪問して締めくくりました。",
      'proj.cat-coaching.alt.1': "キャタピラーの会議室で作業する3人の学生。ノートパソコンにはデザインファイルが開かれ、背後のホワイトボードはプロジェクトのメモで埋まっている。",
      'proj.cat-coaching.alt.2': "「One Team, with a Common Goal」と書かれたキャタピラーの壁面グラフィックの前に立つ3人のチーム。",
      'proj.pot-clip.desc': "設計から手作業での造形、デジタルモデリング、テストまで。",
      'proj.pot-clip.type': "プロダクトデザイン",
      'proj.pot-clip.role': "デザイン・制作",
      'proj.pot-clip.body': "課題は10センチ四方の立方体に収まるキッチン用品を、アレッシィらしさをもって設計すること。店で見かけても不思議ではない完成度が条件でした。まずミラノのアレッシィの店に行き、実際に作られているものを見ました。小さな銀色の道具、簡潔な形、そしてたいていは日常のささやかな所作を少しだけよくするもの。それから普段より多く料理をして、自分が不便だと感じる瞬間を待ちました。\n\n気になったのはスプーンでした。置き場所がない。調理台に置けば汚れ、鍋のふちに掛ければ滑って中に落ちる。同じ用途の道具はすでにありますが、多くは一箇所に固定され、一種類しか支えられません。これは独立した2つの支点が鍋のふちに載り、ふちに沿って動きます。だから間隔が、手に持っているもの——幅のある木べらでも、細い金属のフォークでも——に合わせて決まります。いちばんよかったのは見た目ではなく位置でした。鍋の上で支えるので、落ちた滴は鍋に戻る。調理台を占領して後で洗う必要のある道具が増えることもありません。\n\n形は「どうすれば〜できるか」を並べた一枚のページから出てきました。複数の鍋のサイズをしっかり掴むには。全体が傾いたときも上面を使えるようにするには。そこから、紙で切り出した断面を鍋に当て、次に実物を——工房で密度の高いモデリングフォームを削り出し、下地を重ね、金属に見えるよう塗装しました。これは外観モデルであり、実用品ではありません。3Dモデルは最後です。先につくるのではなく、完成した実物から起こしたもので、ポスターのレンダリングはこれを使っています。\n\n完成とは言えず、問題のほとんどは物理的なものです。本当に金属で作り、熱い鍋に取り付ければ、素手で動かせないほど熱くなるでしょう。鍋のふちには規格がありません。薄いもの、厚いもの、巻き込んだもの、広がったもの、注ぎ口のあるもの。ひとつの断面ですべてを掴むことはできず、しかも保持は摩擦だけに頼っています。上面は平らなので、丸い柄なら転がる余地があります。そして既製品がひとつで済むところを、これは2つ必要です。その一覧を得られたことが、この課題のいちばんの収穫でした。次に作るなら、形からではなく、熱とふちの断面から始めます。\n\nこれはミラノのNABAでの学内プロジェクトです。アレッシィとの提携はなく、同社からの依頼も監修も受けていません。アレッシィは課題の参照ブランドであり、ポスターはこのプロジェクトのために制作したオリジナルのコンセプトキャンペーンです。",
      'proj.pot-clip.cs.disclaimer': "これはミラノのNABAでの学内プロジェクトです。アレッシィとの提携はなく、同社からの依頼も監修も受けていません。アレッシィは課題の参照ブランドであり、ポスターはこのプロジェクトのために制作したオリジナルのコンセプトキャンペーンです。",
      'proj.pot-clip.alt.14': "完成したレストのレンダリング。無地の背景に、曲面の上部と2本の脚が見える。",
      'proj.pot-clip.cs.eyebrow': "Alessiのスタイルで開発したプロダクトコンセプト、NABAミラノ 2026",
      'proj.pot-clip.cs.lede': "設計から手作業での造形、デジタルモデリング、テストまで。",
      'proj.pot-clip.cs.toc': "このページの内容",
      'proj.pot-clip.cs.meta.context': "位置づけ",
      'proj.pot-clip.cs.meta.contextV': "プロダクトデザインの授業、学生プロジェクト",
      'proj.pot-clip.cs.meta.duration': "期間",
      'proj.pot-clip.cs.meta.durationV': "8週間",
      'proj.pot-clip.cs.meta.role': "担当",
      'proj.pot-clip.cs.meta.roleV': "リサーチ、コンセプト、実物・デジタルモデリング、アートディレクション",
      'proj.pot-clip.cs.meta.tools': "デジタルツール",
      'proj.pot-clip.cs.meta.toolsV': "Blender、Illustrator、Canva",
      'proj.pot-clip.cs.card1.t': "課題",
      'proj.pot-clip.cs.card1.b': "狭いキッチンで調理していると、調理器具を置ける清潔で安定した場所がない。",
      'proj.pot-clip.cs.card2.t': "解決",
      'proj.pot-clip.cs.card2.b': "鍋のふちに沿ってスライドする2つのクリップが、調理器具を料理の上に保持する。したたりは鍋に戻る。",
      'proj.pot-clip.cs.card3.t': "結果",
      'proj.pot-clip.cs.card3.b': "削り出した外観モデル、操作できる3Dモデル、3点組のポスターキャンペーン。中心となる考えは、ふちの薄い鍋で機能した。",
      'proj.pot-clip.cs.brief.t': "課題設定",
      'proj.pot-clip.cs.brief.b': "10cmの立方体に収まり、店頭でAlessi製品として通用するキッチン用品をデザインすること。",
      'proj.pot-clip.cs.research.t': "リサーチ",
      'proj.pot-clip.cs.research.grid': "<dl class=\"cs-defs\"><dt>ブランド調査</dt><dd>ミラノのAlessi店舗を訪れ、ブランドのウェブサイトとカタログも調べた。多くは小さくシンプルな金属製品で、日常の作業をより心地よいものにする。Alessi自身のカトラリーレストは、曲面のある磨かれたスチール製で、調理台に置いて使うことを前提にしている。</dd><dt>ユーザー観察</dt><dd>自分自身の調理の習慣をユーザーとして観察した。一人で料理をし、コンロとシンクの間の作業スペースはごくわずかだ。調理器具がどこに置かれ、どこで汚れが生じ、狭さをどう回避しているかを記録した。</dd><dt>競合調査</dt><dd>鍋のふちに掛けるスプーンクリップは既にある。安価で愛嬌のあるものも多いが、ほとんどは一か所に固定され、器具を1本しか支えられない。</dd></dl>",
      'proj.pot-clip.cs.problem.t': "課題",
      'proj.pot-clip.cs.problem.b': "<ul><li><strong>不安定。</strong> 鍋のふちに載せた器具は、転がったり、滑ったり、落ちたりすることがある。</li><li><strong>したたり。</strong> 調理台のレストまで運ぶ間に食材が垂れる。</li><li><strong>場所。</strong> 独立したスプーンレストは、狭い台所にはない作業面を占有する。</li></ul>",
      'proj.pot-clip.cs.problem.hmw': "調理器具と調理台の両方を清潔に保ったまま、鍋の真上に安定して位置を調整できる置き場所をつくるには、どうすればよいか。",
      'proj.pot-clip.cs.design.t': "デザイン",
      'proj.pot-clip.cs.design.b': "<p>2つの独立した支持部がふちに載り、ふちに沿ってスライドする。間隔は動かして決めるので、同じ一組で幅広の木べらも細い金属フォークも支えられる。</p><p>器具が鍋の上にあるため、したたりは料理に戻る。別途スプーンレストを置いて調理台を占有したり、洗い物を増やしたりする必要もない。</p>",
      'proj.pot-clip.cs.design.hint': "ドラッグで回転",
      'proj.pot-clip.cs.process.t': "プロセス",
      'proj.pot-clip.cs.process.1': "スケッチと紙の断面",
      'proj.pot-clip.cs.process.1b': "いくつものデザインをスケッチし、最も良いものを実寸の紙の断面に起こして、実際の鍋で試した。",
      'proj.pot-clip.cs.process.2': "削り出し",
      'proj.pot-clip.cs.process.2b': "高密度フォームから手作業で形を削り出した。",
      'proj.pot-clip.cs.process.3': "仕上げ",
      'proj.pot-clip.cs.process.3b': "塗りを重ね、金属に見えるようスプレーで仕上げた。その形と嵌合を確かめるため、対になるクリップの片方を作った。",
      'proj.pot-clip.cs.process.4': "デジタルモデル",
      'proj.pot-clip.cs.process.4b': "完成した実物をスキャンし、Blenderで作り直した。そのモデルがこのページのインタラクティブな3Dビューアーを動かしている。",
      'proj.pot-clip.cs.testing.t': "テスト",
      'proj.pot-clip.cs.testing.b': "<ul><li><strong>方法。</strong> 大きさの異なる鍋でプロトタイプを試し、どこで留まり、どこで外れるかを確かめた。</li><li><strong>わかったこと。</strong> ふちの薄い小さめの鍋では、製品撮影を通してもしっかり保持できた。ふちの厚い大きな鍋では合わなかった。</li><li><strong>意味すること。</strong> 開口部が固定では、すべてのふちには合わない。そのため次の版ではふちへの適合が最優先だ。</li></ul>",
      'proj.pot-clip.cs.posters.t': "ポスター",
      'proj.pot-clip.cs.posters.b': "<p>Pot ClipがAlessiの製品として発売されるとしたらどう見えるかを示すため、ポスターシリーズを制作した。コピーの<em>Il buon design vive nei dettagli</em>（<strong>「良いデザインはディテールに宿る」</strong>）は、リサーチで見たことにつながっている。Alessiは日常の習慣をより良くする小さな道具をつくっている。シリーズをAlessiの世界に置くためコピーはイタリア語で書き、ブランドの既存のポスターを参考にした。</p>",
      'proj.pot-clip.cs.limits.t': "限界と次のステップ",
      'proj.pot-clip.cs.limits.b': "<p>コンセプトには依然として実際の問題がある。実用的な製品にするには、さらに調査が必要なものもある。</p><dl class=\"cs-defs cs-defs-row\"><dt>ふちへの適合</dt><dd>ひとつの開口部では鍋の約半数にしか合わないことが分かった。次の一手：ばね張力式のクリップ、または内面にライニングを施すこと。加えて大きな鍋向けの大きいサイズ。</dd><dt>熱</dt><dd>実際の金属で熱い鍋に掛ければ、手で位置を直せないほど熱くなる。次の一手：指が触れる部分に熱伝導率の低い素材を使うこと。</dd><dt>安定性</dt><dd>多様な器具を支えられるよう、上面はあえて平らにした。しかし丸い柄は転がりうる。支える対象を狭めない範囲で、浅い窪みを加えるのが次の一手。</dd><dt>限られたテスト</dt><dd>現時点で使用に関する調査はすべて自分自身、しかも少数の鍋によるものだ。次の一手：案をさらに展開し、より広い範囲の鍋で試し、最も強い案を磨くこと。</dd></dl>",
      'proj.pot-clip.alt.thumb': "深い赤を背景にした、磨かれた銀色のクリップ。まわりにスプーン、フォーク、ヘラが線画で描かれている。",
      'proj.pot-clip.cs.alt.hero': "「Il buon design vive nei dettagli」と題したポスター。ステンレスボウルのふちに掛けた銀色のクリップが木のスプーンを支え、下にAlessiのマークが入る。",
      'proj.pot-clip.cs.alt.store': "通りの向かいから見たミラノのAlessi店舗。アーチ型の窓の奥、木の棚に小さな金属製品が並ぶ。",
      'proj.pot-clip.cs.alt.profiles': "クリップの断面を紙で切り出した3つの検討。緑のカッティングマットの上に、鉛筆の寸法とともに並ぶ。",
      'proj.pot-clip.cs.alt.foam': "削り出したフォームモデルを片手で持つ。奥の作業台には切り落としが置かれている。",
      'proj.pot-clip.cs.alt.finished': "工房の塗装板の上に立つ完成したクリップ。銀色の表面が光を受けている。",
      'proj.pot-clip.cs.alt.painted': "塗装ブースでワイヤーに吊るされた完成モデル。銀色の表面が、穴の開いた白い壁を背にしている。",
      'proj.pot-clip.cs.alt.blender': "Blenderで開いたスキャンモデル。細かい三角形のメッシュとして表示され、輪郭が選択されている。",
      'proj.pot-clip.cs.alt.rim': "ステンレスボウルのふちに掛けたクリップが、木のスプーンをボウルの上に支えている。側面から見たところ。",
      'proj.pot-clip.cs.alt.poster1': "淡い地にクリップを大きくトリミングしたポスター。イタリア語の一文「Il buon design vive nei dettagli」が添えられている。",
      'proj.pot-clip.cs.alt.poster2': "深い赤地のポスター。中央にクリップ、その下にAlessiとNABAのマークが並ぶ。",
      'proj.pot-clip.cs.alt.poster3': "ボウルのふちに掛けたクリップが木のスプーンを支えるポスター。「Il buon design vive nei dettagli」の一文の下に置かれている。",
      'proj.fuse-partners-in-crime.desc': 'VRとPCの非対称協力型強盗ゲーム。ピオリア・リバーフロント美術館で公開。',
      'proj.fuse-partners-in-crime.type': 'Bradley FUSE · VRゲーム',
      'proj.fuse-partners-in-crime.role': 'VRインターフェース / VFX',
      'proj.fuse-partners-in-crime.body': "VRとPCをまたいで遊ぶ2人協力型の作品で、ブラッドリー大学のFUSEプログラムのために17人のチームで制作し、ピオリア・リバーフロント美術館で一般公開しました。\n\n2人のプレイヤーが見ている画面は同じではありません。一方はVRで屋敷の中におり、もう一方はPCで間取り図とカメラ映像を追います。\n\n私は、本格的なチームプロジェクトになる前の最初のアイデアを出した少人数のグループに加わっていました。そこからはVR側を担当し、VRインターフェースを設計し、ゲーム内で何が起きているかをプレイヤーが理解できるよう、Unityでパーティクルとビジュアルエフェクトを制作しました。PCのメニューについても助言し、ゲームデザイナー、プログラマー、アーティストと協力して、コンセプトから遊べるゲームへと仕上げました。",
      'proj.fuse-partners-in-crime.alt.1': '「Partners in Crime」のタイトルバナー。紫色の屋敷のシルエットを背景に、太い白文字と金色のドル記号と宝石があしらわれている。',
      'proj.fuse-partners-in-crime.alt.2': "美術館でPC側をプレイする子ども。ノートパソコンには緑の間取り図UI、後ろのモニターにはVRプレイヤーの視点が映っている。",
      'proj.fuse-partners-in-crime.alt.3': "ピオリア・リバーフロント美術館の展示の様子。VRヘッドセットをつけたプレイヤーと、PCに向かうプレイヤー。",
      'proj.fuse-partners-in-crime.alt.4': '展示用のスタンドバナー。「Partners in Crime」のタイトルの下に、担当分野ごとに制作チーム全員の名前が並び、さらに下にはゲーム内のスキャナーとノートパソコンが描かれている。',
      'proj.easter-riverside.desc': "2つの礼拝をひとつのアイデンティティで。招待カードから建物の壁面バナーまで。",
      'proj.easter-riverside.type': 'イベントアイデンティティ',
      'proj.easter-riverside.role': 'グラフィックデザイナー',
      'proj.easter-riverside.body': "「Easter at Riverside」は、同じ週末に行われる2つの礼拝、18日の聖金曜日と20日のイースター礼拝のためのアイデンティティです。開けた空、雲間から昇るオレンジ色の太陽、そして上部に聖句を置いても負けない重さのセリフ体。空の青は、教会の礼拝用ピアノを塗ったのとまったく同じ色です。\n\n正反対の感情をもつ2つの礼拝を、ひとつの構造で支えました。聖金曜日は同じワードマークと同じ円をモノクロに落とし、開けた空を嵐の雲に、太陽を文字の背後で冷たく沈んだ円に置き換えています。2つは屋外の1枚のバナーに並んでいるので、礼拝に向かう道すがら、片方からもう片方への転換として読まれます。この対になった部分こそ、私が残したいところです。\n\nそのうえで、それぞれの媒体に耐える必要がありました。バナーは駐車場の反対側から読まれ、招待カードは片手で持たれます。考え方を変えさせられたのはフォトウォールです。人がその前に立つことが目的の媒体なので、ロックアップ以外をすべて外し、十数人が肩を並べて立っても読める高さに置きました。半分隠れることを前提に設計したグラフィックです。",
      'proj.easter-riverside.alt.1': "「Easter at Riverside」のグラフィック。青空を背景に背の高いセリフ体の「Easter」、オレンジ色の太陽と、雲間に浮かぶ淡い輪。",
      'proj.easter-riverside.alt.2': "教会の赤レンガの壁に掛けられた屋外バナー。左半分はモノクロの聖金曜日、右半分は青空のイースター。",
      'proj.easter-riverside.alt.3': "淡い青の「Easter at Riverside」フォトウォールの前に肩を並べて立つ教会のチーム。頭上にロックアップが見えている。",
      'proj.easter-riverside.alt.4': "小さな丸テーブルに積まれた「Easter at Riverside」の印刷された招待カード。",
      'proj.monmouth-retreat.desc': 'モンマスで行われた賛美チームのリトリートを撮ったスナップ写真。',
      'proj.monmouth-retreat.type': '写真コレクション',
      'proj.monmouth-retreat.role': 'フォトグラファー',
      'proj.monmouth-retreat.body': "イリノイ州モンマスで開かれたワーシップチームの音楽リトリートを撮影する機会をいただきました。活気と深い感情に満ちた場で、そのエネルギーを個人とグループ、どちらの自然な瞬間からも捉えようとしました。\n\n編集での課題は光の変化でした。1枚ずつ最善を追うと組写真としてはまとまらないため、ギャラリー全体をひとつのトーンに寄せて調整しました。",
      'proj.monmouth-retreat.alt.1': "床に座ってマイクで歌う女性。後ろのソファにバンドのメンバー。",
      'proj.monmouth-retreat.alt.2': "モンマスのリヴォリ劇場。歩道に雪が残っている。",
      'proj.monmouth-retreat.alt.3': "ロフトに並んで立ち、窓の方を向いているチーム。",
      'proj.monmouth-retreat.alt.4': "ウクレレとギターを持って床に座る3人のミュージシャン。",
      'proj.monmouth-retreat.alt.5': "ソファで小さな弦楽器を弾く男性。",
      'proj.monmouth-retreat.alt.6': "ヘッドホンをつけ、マイクに向かって笑う歌い手。",
      'proj.monmouth-retreat.alt.7': "ソファでマイクを分け合う2人と、その横で逆さまに寝そべる人。",
      'proj.monmouth-retreat.alt.8': "シンバルとタムの間から見えるドラマー。",
      'proj.monmouth-retreat.alt.9': "明るい戸口で演奏するギタリスト。手前に2人のぼけた人物。",
      'proj.monmouth-retreat.alt.10': "近くに立ち、パートを合わせている2人のギタリスト。",
      'proj.monmouth-retreat.alt.11': "譜面を前に、マイクスタンドの前で歌う人たち。",
      'proj.monmouth-retreat.alt.12': "ソファに逆さまに寝転がり、顔の上にマイクを持つ人。",
      'proj.monmouth-retreat.alt.13': "譜面の束に目を通すワーシップリーダー。後ろにキーボード奏者。",
      'proj.monmouth-retreat.alt.14': "開いた譜面ファイルを持つ歌い手の横顔。",
      'proj.monmouth-retreat.alt.15': "黒いタートルネックでアコースティックギターを弾くギタリスト。",
      'proj.monmouth-retreat.alt.16': "淡いブルーのエレキギターを持つギタリストと、見上げる友人。",
      'proj.monmouth-retreat.alt.17': "曲の途中で上を見上げる男性。手前に2人のぼけた人物。",
      'proj.monmouth-retreat.alt.18': "片手を上げ、目を閉じて歌う女性。後ろでもう1人が笑っている。",
      'proj.sandcastles.desc': '舞台スクリーン、SNS、印刷物に展開したシリーズのアイデンティティ。',
      'proj.sandcastles.type': '説教シリーズのアイデンティティ',
      'proj.sandcastles.role': 'グラフィックデザイナー',
      'proj.sandcastles.body': 'Sandcastlesは、詩篇で過ごす夏のためのアイデンティティです。150篇すべてを、週に10篇ずつ、15週で読みます。依頼は、そこから組み立てるための数行の文章として届いただけでした。\n\nSandcastlesは浜辺の子どもの言葉で、詩篇は軽い読みものではありません。必要だったのは、重さを支えられる遊び心でした。低い陽のもとの砂の城を、潮が必ず連れていくと誰もが知っているものの上に立てています。コラージュは何度も作り直し、書体も認めたくないほど試しました。調子の合う合わないと同じくらい、商用ライセンスの有無でふるいにかけながら。ロゴタイプは世に出る前に変わりました。クリエイティブディレクターが、ブラシスクリプトをセリフ体の大文字に差し替えています。\n\nそこから先は、置かれる先すべてで成立する必要がありました。満席の会堂を見下ろす舞台スクリーン、サムネイルやSNSの投稿、印刷されたポスターや配布物、幅5センチのしおり。それぞれがどれだけ語るかは、実際にどれだけの時間見てもらえるかで決まります。スクリーンではロゴタイプとわずかな要素だけ。三か月のあいだ毎日開かれる唯一のものであるしおりには、15週分の予定がすべて入っています。',
      'proj.sandcastles.alt.1': 'Sandcastlesのグラフィック。ティール地にオレンジの太陽と砂の城のコラージュ、白いブラシスクリプトの「Sandcastles」と、その周囲に配置された三つの詩篇。',
      'proj.sandcastles.alt.2': '同じアートワークを使った夏の読書プランのしおり。開いた聖書の上に置かれ、傍らにコーヒーカップとキャンドルがある。',
      'proj.sandcastles.alt.3': '礼拝中、教会の会堂のメインスクリーンに映し出されたSandcastlesのアートワークと、その前に座る会衆。',
      'proj.oasis-journey.desc': 'モーションとストーリーテリングの初期作品としてつくった3Dアニメーション短編。',
      'proj.oasis-journey.type': 'オーティス・カレッジ · 3Dアニメーション',
      'proj.oasis-journey.role': 'アニメーター / ディレクター',
      'proj.oasis-journey.body': "『Journey to the Oasis』は、オーティス・カレッジ・オブ・アート・アンド・デザインの3Dアニメーションの授業向けに制作した短編です。孤独なエイリアン、リードーが車高の低い船で砂漠の廃墟を突き抜け、広い裂け目をスローモーションで越え、輝く都市の前に降り立ちます。カメラが彼から太陽へと振り切るところで終わります。セリフはなく、風の音と短いスコアだけです。\n\nMaya、Blender、ZBrushを行き来しながらつくりました。スケジュールを決めたのはEeveeではなくCyclesでレンダリングするという判断でした。この作品にとっての質のためですが、最終パスに丸三日かかりました。授業の最終課題として締めくくりました。",
      'proj.oasis-journey.alt.1': "白い大理石のリングや円柱、椀のような屋根をもつ塔が並ぶ3Dの砂漠都市。上空には淡い緑の宇宙船が浮かび、背後には砂丘が続く。",
      'proj.oasis-journey.alt.2': "「Journey to the Oasis」のポスターアート。3Dの砂漠に大理石のアーチと塔が立ち、手前には低い宇宙船、その上に小さなエイリアンが立っている。",
      'proj.bradley-redesign.desc': "ケーススタディは近日公開です。",
      'proj.bradley-redesign.type': "ケーススタディ",
      'proj.bradley-redesign.role': "UXデザイナー",
      'proj.bradley-redesign.body': "ケーススタディは近日公開です。",
      'proj.bradley-redesign.alt.1': "Bradley Redesign プロジェクトの仮の画像。",

      'project.back': '← すべての作品',
      'project.next': '次のプロジェクト',
      'project.selected': '選んだ写真',
      'project.type': '種別',
      'project.year': '年',
      'project.role': '役割',

      'about.title': 'プロフィール',
      'about.statement': "ブラッドリー大学で学ぶUXデザイナーです。目指すのは、<b>他者のため</b>にものをつくること。誇示するためではなく、<b>リサーチ</b>によって<b>成功を検証できるデザイン</b>をつくるためのものです。",
      'about.hook': "3つの大陸で暮らしてきました。<br>だから、視点と文化はデザインに欠かせないと学びました。",
      'about.stat.nowValue': "ミラノ",
      'about.portraitLink': "ジャックについてもっと見る",
      'about.portraitAlt': "ミラノ中央駅のホームに立つジャック。隣には赤い高速列車、両手にダッフルバッグ、頭上には駅のアーチ屋根。",
      'about.stat.years': 'UX歴',
      'about.stat.projects': 'プロジェクト',
      'about.stat.countries': "訪れた国",
      'about.stat.now': "いま居る場所",
      'about.readmore': "ここに至るまで",
      'about.resume': '正式な履歴書を見る ↗︎',

      'aboutpage.back': '← 戻る',
      'aboutpage.photoAlt': 'ミラノの宮殿の中庭でカメラを持つジャック。背後のアーチには赤い糸が張り巡らされている。',
      'aboutpage.bandAlt': 'ドロミーテの草の尾根に立つジャック。背後には切り立った岩山が広がる。',
      'aboutpage.teamAlt': '印刷されたEaster at Riversideのフォトウォールの前に立つジャックとRiversideのクリエイティブチーム。',
      'aboutpage.heading': 'こんにちは、ジャックです。',
      'aboutpage.p1': "物事の仕組みを手探りで探る「外から来た人」を、何度も経験してきました。横浜のインターナショナルスクールに5年、日本語はそこで身につけました。そして今はミラノに1学期。おかげで、自分にしか意味が通らないものは、まだ終わっていないのだと学びました。だからリサーチをして、ひとつひとつの判断に意図を持たせ、仕上がりだと言う前に<a class='prose-link' href='#work' data-open-project='cat-coaching'>実際の人に試してもらいます</a>。",
      'aboutpage.p2': "はじまりはCool Math Gamesでした。書き出せる無料サイトを見つけてはロゴをつくり、誰にも頼まれていないのに学校の課題用にWixでサイトを立てていました。いまやっているのはユーザーリサーチ、ブランドシステム、プロトタイピング。衝動は同じで、道具が良くなっただけです。",
      'aboutpage.p3': "画面から離れているときは、ハイキングコースかバスケットコート、あるいは友人とカードゲームをしています。",
      'aboutpage.p4': "信仰も、自分を形づくる大きな部分です。Easter at Riversideはとくに好きなプロジェクトのひとつですが、その理由はほとんどチームにあります。やさしくて、ものすごく知識のある人たちが、まったくそんな義務もないのに、自分の分野で知っていることを全部吸収させてくれました。",
      'aboutpage.timeline': '経歴',
      'aboutpage.skills': 'スキル',
      'skills.design': 'デザイン',
      'skills.research': 'リサーチ',
      'skills.build': '実装',
      'skills.tools': 'ツール',

      'tl.1.year': '2026年8月〜12月',
      'tl.1.role': 'ミラノNABAへ留学',
      'tl.1.desc': 'Nuova Accademia di Belle ArtiでUXとプロダクトデザインを学んでいます。',
      'tl.2.year': '2025年〜現在',
      'tl.2.role': 'Jubilee Mediaで不動産写真の撮影',
      'tl.2.desc': '販売物件を現地で撮影し、物件ごとに光と構図、フレーミングを調整しています。',
      'tl.3.year': '2024〜2026年',
      'tl.3.role': 'Riverside Community Churchの技術・クリエイティブチーム',
      'tl.3.desc': '毎週の礼拝のライブ制作（音響、照明、カメラ、配信、スライド）と、イベントのデザイン、ブランディング、写真。',
      'tl.4.year': '2023〜2027年',
      'tl.4.role': 'ブラッドリー大学でUXデザイン',
      'tl.4.desc': 'UXデザイン学士、GPA 3.6。学部長表彰リスト。',
      'tl.5.year': '2022年',
      'tl.5.role': 'Otis Collegeのサマープログラム',
      'tl.5.desc': '3Dデザインとアニメーション。Journey to the Oasisはここから生まれました。',
      'tl.6.year': 'これから',
      'tl.6.role': 'ブラッドリーでの最終学年！',
      'tl.6.desc': '12月にミラノから戻り、2027年5月に卒業、その後は大学院へ進む予定です。今はフリーランス、その途中でインターンやフルタイムのお話も歓迎します。',

      'magnetic.rows': ['なにか', 'つくろう。'],
      'magnetic.aria': 'なにかつくろう。',

      'contact.title': 'お問い合わせ',
      'contact.statement': 'こんにちは！',
      'contact.copy': 'コピー',
      'contact.resume': '履歴書',
      'contact.copied': 'コピーしました ✓',

      'form.name': 'お名前',
      'form.email': 'メールアドレス',
      'form.message': 'メッセージ',
      'form.name.ph': 'お名前',
      'form.email.ph': 'you@email.com',
      'form.message.ph': '取り組んでいることを教えてください…',
      'form.submit': 'メッセージを送る →',
      'form.status.sending': "送信中...",
      'form.status.thanks': 'ありがとうございます。追ってご連絡します。',
      'form.status.mailto': 'メールアプリを開きます。送信いただければ返信します。',

      'footer.backtotop': 'トップへ戻る ↑',

      'egg.stickers': 'ステッカー',
      'egg.chaos': 'カオスモード',
      'egg.chaosWarn': '光過敏性発作の注意',
      'egg.dragsticker': 'ステッカーをどこへでもドラッグ →',
      'egg.close': '閉じる ✕',
      'egg.stopchaos': 'カオスを止める ✕',
      'egg.playpong': '▶ PONGで遊ぶ',
      'pong.title': 'PONG.EXE, グリッチ版',
      'pong.win': 'あなたの勝ち',
      'pong.lose': 'CPUの勝ち',
      'pong.rematch': 'もう一回 ▶',
      'pong.controls': '↑/↓ または W/S で移動, 5点先取',
      'pong.controlsTouch': 'ドラッグで移動, 5点先取'
    },

    /* ---------------------------------------------------------------- IT */
    it: {
      'a11y.skip': 'Vai al contenuto principale',
      'a11y.photoAlt': 'Foto {n} di {title}',
      'a11y.videoLabel': 'Filmato del progetto',
      'a11y.playFilm': 'Riproduci il filmato',
      'a11y.lightbox': 'Immagine ingrandita',
      'a11y.close': 'Chiudi',
      'a11y.zoomHint': 'Clicca per ingrandire',
      'a11y.prevImage': 'Immagine precedente',
      'a11y.nextImage': 'Immagine successiva',
      'a11y.modelViewer': "Modello 3D ruotabile dell'appoggio: trascina o usa i tasti freccia",
      'a11y.eggTrigger': 'Extra nascosti',
      'html.title': "Jack Murray · Designer UX",
      'html.description': "Portfolio di design UX di Jack Murray: siti web, sistemi visivi, branding, fotografia, motion ed esperimenti digitali.",

      'nav.projects': 'PROGETTI',
      'nav.about': 'CHI SONO',
      'nav.contact': 'CONTATTI',
      'nav.aria.theme': 'Modalità scura / chiara',
      'nav.aria.menu': 'menu',
      'nav.aria.language': 'Scegli la lingua',


      'hero.badge': 'CREIAMO QUALCOSA',
      'hero.cta': 'GUARDA I PROGETTI',
      'hero.role': 'DESIGNER UX &<br>CREATIVO DIGITALE',

      'work.title': 'PROGETTI SELEZIONATI',
      'filter.ALL': 'TUTTI',
      'e404.heading': 'Questa pagina non esiste.',
      'e404.body': "Il link potrebbe essere obsoleto, o l'indirizzo potrebbe contenere un errore.",
      'e404.home': 'TORNA AL PORTFOLIO',
      'e404.title': 'Pagina non trovata — Jack Murray',
      'filter.aria': 'Filtra i progetti per categoria',
      'filter.count.one': '1 progetto',
      'filter.count.many': '{n} progetti',
      'footer.built': 'Quattro lingue  ·  Modalità scura e chiara  ·  Contrasto AA  ·  Navigazione da tastiera  ·  Movimento ridotto',
      'card.cta': 'Vedi progetto',
      'filter.UX/UI': 'UX/UI',
      'filter.PRODUCT': 'PRODOTTO',
      'filter.GRAPHICS': 'GRAFICA',
      'filter.PHOTOGRAPHY': 'FOTOGRAFIA',
      'filter.MOTION': 'MOTION / 3D',
      'skill.ux-design': "Design UX",
      'skill.interaction-design': "Design dell'interazione",
      'skill.user-research': "Ricerca sugli utenti",
      'skill.user-flows': "Flussi utente",
      'skill.prototyping': "Prototipazione",
      'skill.usability-testing': "Test di usabilità",
      'skill.product-design': "Design di prodotto",
      'skill.3d-modeling': "Modellazione 3D",
      'skill.photography': "Fotografia",
      'skill.graphic-design': "Graphic design",
      'skill.brand-identity': "Identità del marchio",
      'skill.typography': "Tipografia",
      'skill.print-design': "Design per la stampa",
      'skill.ui-design': "Design UI",
      'skill.motion-design': "Motion design",
      'skill.visual-effects': "Effetti visivi",
      'skill.color-grading': "Color grading",
      'skill.3d-animation': "Animazione 3D",

      'cat.UX/UI': 'UX/UI',
      'cat.PRODUCT': 'PRODOTTO',
      'cat.GRAPHICS': 'GRAFICA',
      'cat.PHOTOGRAPHY': 'FOTOGRAFIA',
      'cat.MOTION': 'MOTION / 3D',

      'proj.cat-coaching.desc': "Interfaccia di coaching adattivo per operatori di mezzi pesanti, progettata con Caterpillar.",
      'proj.cat-coaching.type': 'Bradley University × Caterpillar',
      'proj.cat-coaching.role': 'Ricerca e design UX',
      'proj.cat-coaching.body': "Premio per la Miglior Ricerca. Nel corso di Advanced Interaction Design alla Bradley ho lavorato in un team di tre persone insieme a Caterpillar per progettare un'interfaccia di coaching adattivo per operatori di mezzi pesanti.\n\nHo messo mano a ogni fase del processo: ricerca, user flow, wireframe, prototipi in Figma e test di usabilità con 5 partecipanti. Abbiamo incontrato il team UX di Caterpillar per 7 settimane, siamo passati per 2 round di iterazione sulla base dei loro feedback e dei nostri test, e abbiamo chiuso con una visita in sede da Caterpillar a Peoria.",
      'proj.cat-coaching.alt.1': "Tre studenti al lavoro attorno a un tavolo riunioni da Caterpillar, con i portatili aperti sui file di design e la lavagna alle spalle coperta di appunti di progetto.",
      'proj.cat-coaching.alt.2': "Il team di tre persone davanti a una grafica murale Caterpillar con la scritta 'One Team, with a Common Goal'.",
      'proj.pot-clip.desc': "Progettato, scolpito a mano, modellato in digitale e testato.",
      'proj.pot-clip.type': "Design di Prodotto",
      'proj.pot-clip.role': "Design e Realizzazione",
      'proj.pot-clip.body': "Il brief era un cubo di dieci centimetri: progettare un oggetto da cucina nello spirito di Alessi, credibile al punto da pensare di averlo trovato in negozio. Sono partito dal negozio Alessi a Milano, guardando quello che fanno davvero: piccoli oggetti argentati, semplici, quasi sempre un gesto quotidiano reso un po' migliore. Poi ho cucinato più del solito e ho aspettato che qualcosa mi desse fastidio.\n\nQuello che mi dava fastidio era il cucchiaio. Non c'è un posto pulito dove appoggiarlo: il piano si sporca, e tenerlo in equilibrio sul bordo vuol dire che scivola o cade dentro. Appoggi del genere esistono già, ma quasi tutti si fissano in un punto solo e reggono una cosa sola. Il mio è fatto di due supporti indipendenti che stanno sul bordo e scorrono lungo di esso, così la distanza si regola da sé su quello che hai in mano: un mestolo di legno largo o una forchetta di metallo sottile. La parte migliore è venuta da dove si appoggia, non da come appare: stando sopra la pentola, le gocce tornano dentro, e non c'è un secondo oggetto che occupa il piano e poi va lavato.\n\nLa forma è nata da una pagina di domande \"come potremmo…\": come stringere bene pentole di diametri diversi, come tenere utilizzabile la parte superiore quando tutto è inclinato. Da lì: profili ritagliati nella carta e provati contro una pentola, e poi quello fisico, scolpito in schiuma da modellazione densa in laboratorio, trattato a mani di fondo e verniciato per leggere come metallo. È un modello di aspetto, non un pezzo funzionante. Il modello digitale è arrivato per ultimo, costruito a partire dall'oggetto finito e non prima, ed è da lì che vengono i render dei manifesti.\n\nNon è risolto, e quasi tutto ciò che non va è fisico. In metallo vero, agganciati a una pentola calda, diventerebbero troppo caldi da spostare a mani nude. I bordi delle pentole non sono standardizzati — sottili, spessi, arrotolati, svasati, alcuni con il beccuccio — quindi un solo profilo non li tiene tutti, e la presa è solo attrito. La parte superiore è abbastanza piatta da lasciar rotolare un manico tondo. Ed è fatto di due oggetti dove quello già in commercio è uno. Conoscere quella lista è gran parte di ciò che il progetto mi ha dato; una versione successiva partirebbe dal calore e dal profilo del bordo, non dalla forma.\n\nQuesto è un progetto accademico svolto alla NABA di Milano. Non è affiliato ad Alessi e non è stato commissionato né revisionato dall’azienda. Alessi è stato il marchio di riferimento per l’esercitazione, e i manifesti sono una campagna concettuale originale sviluppata per questo progetto.",
      'proj.pot-clip.cs.disclaimer': "Questo è un progetto accademico svolto alla NABA di Milano. Non è affiliato ad Alessi e non è stato commissionato né revisionato dall’azienda. Alessi è stato il marchio di riferimento per l’esercitazione, e i manifesti sono una campagna concettuale originale sviluppata per questo progetto.",
      'proj.pot-clip.alt.14': "Un render dell'appoggio finito su sfondo neutro, con la parte superiore curva e le due gambe.",
      'proj.pot-clip.cs.eyebrow': "Un concept di prodotto sviluppato nello stile di Alessi, NABA Milano 2026",
      'proj.pot-clip.cs.lede': "Progettato, scolpito a mano, modellato in digitale e testato.",
      'proj.pot-clip.cs.toc': "In questa pagina",
      'proj.pot-clip.cs.meta.context': "Contesto",
      'proj.pot-clip.cs.meta.contextV': "Corso di Product Design, progetto accademico",
      'proj.pot-clip.cs.meta.duration': "Durata",
      'proj.pot-clip.cs.meta.durationV': "8 settimane",
      'proj.pot-clip.cs.meta.role': "Ruolo",
      'proj.pot-clip.cs.meta.roleV': "Ricerca, concept, modellazione fisica e digitale, art direction",
      'proj.pot-clip.cs.meta.tools': "Strumenti digitali",
      'proj.pot-clip.cs.meta.toolsV': "Blender, Illustrator, Canva",
      'proj.pot-clip.cs.card1.t': "Problema",
      'proj.pot-clip.cs.card1.b': "Mentre si cucina in una cucina piccola, non c’è un posto pulito e stabile dove appoggiare un utensile.",
      'proj.pot-clip.cs.card2.t': "Soluzione",
      'proj.pot-clip.cs.card2.b': "Due supporti che scorrono lungo il bordo della pentola e tengono l’utensile sopra il cibo, così le gocce ricadono dentro.",
      'proj.pot-clip.cs.card3.t': "Risultato",
      'proj.pot-clip.cs.card3.b': "Un modello di aspetto scolpito, un modello 3D interattivo e una campagna di tre manifesti, con l’idea di fondo che funziona su pentole dal bordo sottile.",
      'proj.pot-clip.cs.brief.t': "Il brief",
      'proj.pot-clip.cs.brief.b': "Progettare un oggetto da cucina che stia in un cubo di 10 cm e che possa passare per un prodotto Alessi su uno scaffale.",
      'proj.pot-clip.cs.research.t': "Ricerca",
      'proj.pot-clip.cs.research.grid': "<dl class=\"cs-defs\"><dt>Ricerca sul marchio</dt><dd>Ho visitato il negozio Alessi a Milano e ho esaminato il sito e il catalogo del marchio. Quasi tutti i pezzi sono piccoli oggetti di metallo, semplici, che rendono più piacevoli i gesti quotidiani. Gli appoggia-posate di Alessi sono pezzi curvi in acciaio lucido, pensati per stare sul piano.</dd><dt>Osservazione d’uso</dt><dd>Ho studiato la mia routine in cucina come utente. Cucino da solo, con pochissimo piano fra fornelli e lavello. Ho annotato dove finivano gli utensili, dove nasceva lo sporco e come aggiravo la\u00A0mancanza\u00A0di\u00A0spazio.</dd><dt>Concorrenza</dt><dd>I fermacucchiaio da bordo pentola esistono già. Costano poco e spesso sono simpatici, ma quasi tutti si fissano in un punto solo e reggono un utensile.</dd></dl>",
      'proj.pot-clip.cs.problem.t': "Il problema",
      'proj.pot-clip.cs.problem.b': "<ul><li><strong>Instabilità.</strong> Un utensile in bilico sul bordo della pentola può rotolare, scivolare o cadere dentro.</li><li><strong>Gocciolamento.</strong> Portare l’utensile a un appoggio sul piano lascia gocce lungo il percorso.</li><li><strong>Spazio.</strong> Un appoggia-cucchiaio separato occupa un piano che le cucine piccole non hanno.</li></ul>",
      'proj.pot-clip.cs.problem.hmw': "Come potremmo: creare un appoggio stabile e regolabile proprio sopra la pentola, mantenendo puliti sia l’utensile sia il piano?",
      'proj.pot-clip.cs.design.t': "Il progetto",
      'proj.pot-clip.cs.design.b': "<p>Due supporti indipendenti poggiano sul bordo e vi scorrono. La distanza la imposti spostandoli, così la stessa coppia regge un cucchiaio di legno largo o una forchetta di metallo sottile.</p><p>Poiché l’utensile resta sopra la pentola, le gocce ricadono nel cibo. Significa anche nessun appoggia-cucchiaio separato che occupi il piano o si aggiunga ai piatti da lavare.</p>",
      'proj.pot-clip.cs.design.hint': "Trascina per ruotare",
      'proj.pot-clip.cs.process.t': "Processo",
      'proj.pot-clip.cs.process.1': "Schizzi e profili di carta",
      'proj.pot-clip.cs.process.1b': "Ho disegnato diversi schizzi, poi ho trasformato i più solidi in profili di carta a grandezza reale e li ho provati su pentole vere.",
      'proj.pot-clip.cs.process.2': "Scultura",
      'proj.pot-clip.cs.process.2b': "Ho scolpito la forma a mano nella schiuma ad alta densità.",
      'proj.pot-clip.cs.process.3': "Finitura",
      'proj.pot-clip.cs.process.3b': "Rifinito con più mani e verniciato a spruzzo per leggersi come metallo. Ho realizzato uno dei due supporti per provarne la forma e la calzata.",
      'proj.pot-clip.cs.process.4': "Modello digitale",
      'proj.pot-clip.cs.process.4b': "Ho scansionato il pezzo finito e l’ho ricostruito in Blender. Quel modello alimenta il visore 3D interattivo di questa pagina.",
      'proj.pot-clip.cs.testing.t': "Test",
      'proj.pot-clip.cs.testing.b': "<ul><li><strong>Metodo.</strong> Ho provato il prototipo su pentole di misure diverse per vedere dove tiene e dove cede.</li><li><strong>Risultato.</strong> Il supporto ha retto su pentole più piccole con bordi sottili, anche per un intero shooting di prodotto. Su pentole grandi con bordi spessi non entrava.</li><li><strong>Implicazione.</strong> Una sola apertura fissa non può adattarsi a ogni bordo, quindi la calzata sul bordo è la priorità della versione successiva.</li></ul>",
      'proj.pot-clip.cs.posters.t': "Manifesti",
      'proj.pot-clip.cs.posters.b': "<p>Ho sviluppato una serie di manifesti per mostrare come Pot Clip potrebbe uscire come prodotto Alessi. La frase <em><strong>Il buon design vive nei dettagli</strong></em> si collega a quello che ho visto nella mia ricerca. Alessi fa oggetti piccoli che migliorano le routine quotidiane. Ho scritto i testi in italiano per collocare la serie nel mondo Alessi, e sono partito dai manifesti esistenti del marchio.</p>",
      'proj.pot-clip.cs.limits.t': "Limiti e prossimi passi",
      'proj.pot-clip.cs.limits.b': "<p>Restano problemi reali nel concept, e alcuni richiedono altra ricerca prima che questo possa diventare un prodotto valido.</p><dl class=\"cs-defs cs-defs-row\"><dt>Calzata sul bordo</dt><dd>I test hanno mostrato che una sola apertura si adatta a circa metà delle pentole. Prossimo passo: un supporto a molla o una superficie interna rivestita, più una misura più grande.</dd><dt>Calore</dt><dd>In metallo vero su una pentola calda, i supporti scotterebbero troppo per spostarli a mano. Prossimo passo: un materiale a bassa conducibilità dove toccano le dita.</dd><dt>Stabilità</dt><dd>Ho tenuto la parte superiore piatta di proposito, per reggere più tipi di utensile, ma un manico tondo può ancora rotolare. Prossimo passo: una culla poco profonda per la presa, senza limitare ciò che regge.</dd><dt>Test limitati</dt><dd>Finora tutta la ricerca d’uso è la mia, su poche pentole. Prossimo passo: sviluppare altri concept, provarli su più pentole e affinare il più solido.</dd></dl>",
      'proj.pot-clip.alt.thumb': "Il supporto in argento lucido su fondo rosso scuro, con un cucchiaio, una forchetta e due spatole disegnati a linea intorno.",
      'proj.pot-clip.cs.alt.hero': "Un manifesto con la riga «Il buon design vive nei dettagli», il supporto argentato agganciato al bordo di una ciotola d’acciaio che regge un cucchiaio di legno, e il marchio Alessi sotto.",
      'proj.pot-clip.cs.alt.store': "Il negozio Alessi a Milano visto dall’altro lato della strada, con la vetrina ad arco piena di piccoli oggetti di metallo su scaffali di legno.",
      'proj.pot-clip.cs.alt.profiles': "Tre studi di profilo in carta del supporto, ritagliati su un tappetino da taglio verde con quote a matita.",
      'proj.pot-clip.cs.alt.foam': "Il modello in schiuma scolpito tenuto in una mano, con uno scarto sul banco dietro.",
      'proj.pot-clip.cs.alt.finished': "Il supporto finito in piedi su un pannello da verniciatura in laboratorio, con la superficie argentata che prende la luce.",
      'proj.pot-clip.cs.alt.painted': "Il modello finito appeso a un filo nella cabina di verniciatura, la superficie argentata contro una parete bianca forata.",
      'proj.pot-clip.cs.alt.blender': "Il modello scansionato aperto in Blender, mostrato come una mesh fitta di triangoli con il contorno selezionato.",
      'proj.pot-clip.cs.alt.rim': "Il supporto sul bordo di una ciotola d’acciaio che tiene un cucchiaio di legno sopra la ciotola, visto di lato.",
      'proj.pot-clip.cs.alt.poster1': "Un manifesto con il supporto ritagliato in grande su fondo chiaro, accanto alla frase “Il buon design vive nei dettagli”.",
      'proj.pot-clip.cs.alt.poster2': "Un manifesto su fondo rosso scuro con il supporto al centro sopra i marchi Alessi e NABA.",
      'proj.pot-clip.cs.alt.poster3': "Un manifesto del supporto sul bordo di una ciotola che regge un cucchiaio di legno, sotto la frase “Il buon design vive nei dettagli”.",
      'proj.fuse-partners-in-crime.desc': "Colpo cooperativo asimmetrico tra VR e PC, esposto al Peoria Riverfront Museum.",
      'proj.fuse-partners-in-crime.type': 'Bradley FUSE · Videogioco VR',
      'proj.fuse-partners-in-crime.role': 'Interfaccia VR e VFX',
      'proj.fuse-partners-in-crime.body': "Un'esperienza cooperativa per due giocatori giocata tra VR e PC, realizzata da un team di 17 persone per il programma FUSE della Bradley ed esposta al pubblico al Peoria Riverfront Museum.\n\nI due giocatori non vedono mai la stessa cosa: uno è dentro la villa in VR, mentre l'altro legge la piantina e le telecamere dal PC.\n\nFacevo parte del piccolo gruppo che ha avuto l'idea originale, prima che diventasse un progetto di squadra vero e proprio. Da lì mi sono concentrato sul lato VR: ho progettato l'interfaccia VR e creato particellari ed effetti visivi in Unity per aiutare i giocatori a capire cosa stesse succedendo nel gioco. Ho anche dato consulenza sui menu PC e lavorato con game designer, programmatori e artisti per portarlo dal concept a un gioco giocabile.",
      'proj.fuse-partners-in-crime.alt.1': "Il banner del titolo di Partners in Crime: lettere bianche spesse con un simbolo del dollaro e una gemma dorati, su una sagoma viola di una villa.",
      'proj.fuse-partners-in-crime.alt.2': "Una bambina al museo che gioca il lato PC, con l'interfaccia verde della piantina sul portatile e la visuale del giocatore VR sul monitor dietro.",
      'proj.fuse-partners-in-crime.alt.3': "L'allestimento della mostra al Peoria Riverfront Museum, con un giocatore con visore VR e un altro al PC.",
      'proj.fuse-partners-in-crime.alt.4': "Il banner verticale della mostra: il titolo di Partners in Crime sopra l'intero team di progetto elencato per reparto, con lo scanner e il portatile del gioco in basso.",
      'proj.easter-riverside.desc': "Un'identità per due servizi, dalle cartoline di invito a uno striscione sulla facciata.",
      'proj.easter-riverside.type': 'Identità di evento',
      'proj.easter-riverside.role': 'Graphic designer',
      'proj.easter-riverside.body': "Easter at Riverside è l'identità di un unico fine settimana con due servizi: il Venerdì Santo il 18 e la Pasqua il 20. Un cielo aperto, un sole arancione che sale tra le nuvole e un serif con il peso necessario a reggere un versetto sopra di sé. L'azzurro è esattamente il colore con cui abbiamo dipinto il pianoforte da culto della chiesa.\n\nDue servizi dalle emozioni opposte, una sola costruzione. Il Venerdì Santo usa lo stesso logotipo e lo stesso cerchio, portati in bianco e nero: nuvole di tempesta al posto del cielo aperto e il sole spento dietro la tipografia. Stanno uno accanto all'altro su un unico striscione sul muro esterno, così il passaggio dall'uno all'altro si legge mentre si entra. Questa coppia è il pezzo che terrei.\n\nPoi doveva reggere i supporti. Lo striscione si legge dall'altra parte del parcheggio. La cartolina di invito si tiene in una mano. La parete fotografica è quella che mi ha fatto ragionare diversamente: il suo scopo è che la gente ci si metta davanti, così ho tolto tutto tranne il logotipo e l'ho messo abbastanza in alto perché una dozzina di persone spalla a spalla lo lascino leggibile. Una grafica progettata per restare mezza coperta.",
      'proj.easter-riverside.alt.1': "La grafica di Easter at Riverside: «Easter» in un serif alto su un cielo azzurro, con un sole arancione e un anello pallido tra le nuvole.",
      'proj.easter-riverside.alt.2': "Lo striscione esterno sul muro di mattoni rossi della chiesa: Venerdì Santo in bianco e nero a sinistra e Pasqua con cielo azzurro a destra.",
      'proj.easter-riverside.alt.3': "Il team della chiesa spalla a spalla davanti alla parete fotografica azzurra di Easter at Riverside, con il logotipo visibile sopra di loro.",
      'proj.easter-riverside.alt.4': "Una pila di cartoline di invito stampate di Easter at Riverside su un tavolino rotondo.",
      'proj.monmouth-retreat.desc': "Fotografie spontanee dal ritiro di un team di lode a Monmouth.",
      'proj.monmouth-retreat.type': 'Raccolta fotografica',
      'proj.monmouth-retreat.role': 'Fotografo',
      'proj.monmouth-retreat.body': "Ho avuto l'occasione di fotografare un ritiro musicale di un gruppo di worship a Monmouth, in Illinois. Era un ritiro pieno di vita e di emozione profonda, e ho cercato di catturare quell'energia nei momenti spontanei, sia individuali che di gruppo.\n\nLa luce che cambiava era il problema del montaggio. Fotogramma per fotogramma l'insieme non avrebbe tenuto, così ho portato tutta la galleria verso un'unica resa invece di lasciare che ogni scatto fosse la sua versione migliore.",
      'proj.monmouth-retreat.alt.1': "Una cantante seduta a terra con un microfono, la band sul divano dietro.",
      'proj.monmouth-retreat.alt.2': "Il teatro Rivoli di Monmouth, con la neve lungo il marciapiede.",
      'proj.monmouth-retreat.alt.3': "Il gruppo in piedi nel loft, rivolto verso le finestre.",
      'proj.monmouth-retreat.alt.4': "Tre musicisti seduti a terra con un ukulele e una chitarra.",
      'proj.monmouth-retreat.alt.5': "Un uomo sul divano che suona un piccolo strumento a corde.",
      'proj.monmouth-retreat.alt.6': "Una cantante che ride davanti a un microfono, con le cuffie.",
      'proj.monmouth-retreat.alt.7': "Due cantanti sul divano condividono un microfono, accanto a loro una persona a testa in giù.",
      'proj.monmouth-retreat.alt.8': "Il batterista alla sua batteria, visto tra un piatto e un tom.",
      'proj.monmouth-retreat.alt.9': "Un chitarrista suona in un vano di porta luminoso, con due figure sfocate davanti.",
      'proj.monmouth-retreat.alt.10': "Due chitarristi vicini, che mettono a punto una parte.",
      'proj.monmouth-retreat.alt.11': "Cantanti alle aste dei microfoni con gli spartiti davanti.",
      'proj.monmouth-retreat.alt.12': "Una persona a testa in giù sul divano, con un microfono sopra il viso.",
      'proj.monmouth-retreat.alt.13': "Il worship leader sfoglia una pila di spartiti, dietro di lui un tastierista.",
      'proj.monmouth-retreat.alt.14': "Una cantante di profilo con una cartellina di spartiti aperta.",
      'proj.monmouth-retreat.alt.15': "Un chitarrista con un dolcevita nero suona una chitarra acustica.",
      'proj.monmouth-retreat.alt.16': "Un chitarrista con una elettrica azzurra e un amico che lo guarda.",
      'proj.monmouth-retreat.alt.17': "Un uomo guarda in alto durante un brano, due persone sfocate in primo piano.",
      'proj.monmouth-retreat.alt.18': "Una cantante con una mano alzata e gli occhi chiusi, dietro un'altra che ride.",
      'proj.sandcastles.desc': 'Identità di serie applicata a schermi da palco, social e stampa.',
      'proj.sandcastles.type': 'Identità per serie di sermoni',
      'proj.sandcastles.role': 'Graphic designer',
      'proj.sandcastles.body': "Sandcastles \u00E8 l\u2019identit\u00E0 di un\u2019estate nei Salmi: tutti e 150, dieci a settimana per quindici settimane. Il brief \u00E8 arrivato come un paio di frasi appena, da cui partire.\n\nSandcastles \u00E8 una parola da bambini in spiaggia, e i Salmi non sono una lettura leggera. Serviva una leggerezza che reggesse il peso: un castello di sabbia sotto un sole basso, costruito sull\u2019unica cosa che tutti sanno che la marea si porter\u00E0 via. Sono servite molte versioni del collage e pi\u00F9 caratteri di quanti mi vada di ammettere, scartati tanto per la licenza commerciale quanto per il tono. Il logotipo \u00E8 cambiato prima di uscire: il direttore creativo ha sostituito lo script a pennello con maiuscole serif.\n\nDa l\u00EC doveva reggere ovunque finisse: uno schermo da palco sopra un auditorium pieno, miniature e post social, manifesti e volantini stampati, un segnalibro largo cinque centimetri. Quanto dice ciascuno dipende da quanto tempo qualcuno ci passa davvero. Sullo schermo c\u2019\u00E8 il logotipo e poco altro. Sul segnalibro, l\u2019unico pezzo che qualcuno avrebbe aperto ogni giorno per tre mesi, c\u2019\u00E8 tutto il calendario di quindici settimane.",
      'proj.sandcastles.alt.1': 'La grafica di Sandcastles: un collage con castello di sabbia sotto un sole arancione su fondo turchese, con \u201CSandcastles\u201D in uno script a pennello bianco e tre Salmi disposti intorno.',
      'proj.sandcastles.alt.2': 'Il segnalibro stampato del piano di lettura estivo, con lo stesso artwork, appoggiato su una Bibbia aperta accanto a una tazza di caffè e una candela.',
      'proj.sandcastles.alt.3': 'L\u2019artwork di Sandcastles sullo schermo principale dell\u2019auditorium della chiesa durante un servizio, con l\u2019assemblea seduta davanti.',
      'proj.oasis-journey.desc': 'Cortometraggio animato in 3D nato come primo progetto di motion e narrazione.',
      'proj.oasis-journey.type': 'Otis College · Animazione 3D',
      'proj.oasis-journey.role': 'Animatore / Regista',
      'proj.oasis-journey.body': "Journey to the Oasis è un corto in animazione 3D realizzato per un corso di animazione 3D all'Otis College of Art and Design. Un alieno solitario, Leedo, sfreccia tra le rovine del deserto su una navicella bassa, supera un ampio crepaccio al rallentatore e scende davanti a una città scintillante; il film si chiude allontanandosi da lui verso il sole. Non c'è dialogo, solo vento e una breve partitura.\n\nÈ stato costruito tra Maya, Blender e ZBrush. La scelta che ha deciso i tempi è stata renderizzare in Cycles invece che in Eevee, per la resa che dava a questo pezzo: la passata finale ha richiesto tre giorni pieni. Ha chiuso il corso come mio progetto finale.",
      'proj.oasis-journey.alt.1': "Una città desertica in 3D fatta di anelli, colonne e torri di marmo bianco con sommità a coppa, una nave verde pallido sospesa in alto e dune sullo sfondo.",
      'proj.oasis-journey.alt.2': "L'illustrazione del poster di Journey to the Oasis: una scena desertica in 3D con archi e torri di marmo, navi basse in primo piano e una piccola figura aliena in piedi su una di esse.",
      'proj.bradley-redesign.desc': "Case study in arrivo.",
      'proj.bradley-redesign.type': "Case study",
      'proj.bradley-redesign.role': "UX Designer",
      'proj.bradley-redesign.body': "Case study in arrivo.",
      'proj.bradley-redesign.alt.1': "Immagine provvisoria del progetto Bradley Redesign.",

      'project.back': '← TUTTI I PROGETTI',
      'project.next': 'PROSSIMO PROGETTO',
      'project.selected': 'Fotografie selezionate',
      'project.type': 'TIPO',
      'project.year': 'ANNO',
      'project.role': 'RUOLO',

      'about.title': 'CHI SONO',
      'about.statement': "Sono un UX designer e studio alla Bradley University. L'obiettivo è fare cose <b>per gli altri</b>. Non si tratta di essere ostentati, ma di usare la <b>ricerca</b> per creare <b>progetti verificabilmente riusciti</b>.",
      'about.hook': "Ho vissuto in tre continenti.<br>Così ho imparato quanto contano prospettiva e cultura nel design.",
      'about.stat.nowValue': "Milano",
      'about.portraitLink': "Altro su Jack",
      'about.portraitAlt': "Jack su un binario di Milano Centrale, un treno ad alta velocità rosso accanto a lui e un borsone tra le mani, sotto le volte della stazione.",
      'about.stat.years': 'Anni di UX',
      'about.stat.projects': 'Progetti',
      'about.stat.countries': "Paesi visitati",
      'about.stat.now': "Dove sono adesso",
      'about.readmore': "COME CI SONO ARRIVATO",
      'about.resume': 'GUARDA IL MIO CV UFFICIALE ↗︎',

      'aboutpage.back': '← INDIETRO',
      'aboutpage.photoAlt': 'Jack con una macchina fotografica nel cortile di un palazzo milanese, fili rossi tesi tra gli archi.',
      'aboutpage.bandAlt': 'Jack su un crinale erboso delle Dolomiti, con le cime frastagliate alle spalle.',
      'aboutpage.teamAlt': 'Jack e il team creativo di Riverside davanti al pannello fotografico stampato di Easter at Riverside.',
      'aboutpage.heading': 'CIAO, SONO JACK.',
      'aboutpage.p1': "Sono stato tante volte quello che viene da fuori e cerca di capire come funzionano le cose. Cinque anni in una scuola internazionale a Yokohama, da cui viene il giapponese, e adesso un semestre a Milano. Mi ha insegnato che se una cosa ha senso solo per me, non è ancora finita. Perciò faccio ricerca, prendo ogni scelta con intenzione e <a class='prose-link' href='#work' data-open-project='cat-coaching'>la metto alla prova con persone vere</a> prima di considerare qualcosa concluso.",
      'aboutpage.p2': "Ho iniziato con Cool Math Games, facendo loghi su qualunque sito gratuito mi lasciasse esportare e costruendo siti in Wix per i lavori di scuola anche quando nessuno me lo chiedeva. Ora faccio ricerca con gli utenti, sistemi di marca e prototipi. Gli stessi istinti, solo con strumenti migliori.",
      'aboutpage.p3': "Lontano dallo schermo, mi trovi su un sentiero di montagna, su un campo da basket o a giocare a carte con gli amici.",
      'aboutpage.p4': "Anche la fede è una parte importante di chi sono. Easter at Riverside è uno dei miei progetti preferiti, soprattutto per il team: persone gentili e con una competenza enorme, che mi hanno lasciato assorbire tutto quello che sapevano del loro campo pur non essendone affatto obbligate.",
      'aboutpage.timeline': 'PERCORSO',
      'aboutpage.skills': 'COMPETENZE',
      'skills.design': 'DESIGN',
      'skills.research': 'RICERCA',
      'skills.build': 'SVILUPPO',
      'skills.tools': 'STRUMENTI',

      'tl.1.year': 'AGO – DIC 2026',
      'tl.1.role': 'Scambio alla NABA, Milano',
      'tl.1.desc': 'Design UX e di prodotto alla Nuova Accademia di Belle Arti.',
      'tl.2.year': '2025 – OGGI',
      'tl.2.role': 'Fotografo immobiliare da Jubilee Media',
      'tl.2.desc': 'Fotografo immobili residenziali sul posto, curando luce, composizione e inquadratura di ogni proprietà.',
      'tl.3.year': '2024 – 2026',
      'tl.3.role': 'Team tecnico e creativo alla Riverside Community Church',
      'tl.3.desc': 'Produzione live dei servizi settimanali: audio, luci, camere, streaming e slide. Più design, branding e fotografia per gli eventi.',
      'tl.4.year': '2023 – 2027',
      'tl.4.role': 'Design UX alla Bradley University',
      'tl.4.desc': "Laurea in User Experience Design, media 3.6. Dean’s List.",
      'tl.5.year': '2022',
      'tl.5.role': "Programma estivo all’Otis College",
      'tl.5.desc': 'Design 3D e animazione, da cui è nato Journey to the Oasis.',
      'tl.6.year': 'PROSSIMO',
      'tl.6.role': 'Ultimo anno alla Bradley!',
      'tl.6.desc': 'Rientro da Milano a dicembre, laurea a maggio 2027 e poi la magistrale. Disponibile per freelance adesso, e per stage o full-time lungo il percorso.',

      'magnetic.rows': ['CREIAMO', 'QUALCOSA.'],
      'magnetic.aria': 'Creiamo qualcosa.',

      'contact.title': 'CONTATTI',
      'contact.statement': 'Salutami!',
      'contact.copy': 'COPIA',
      'contact.resume': 'CV',
      'contact.copied': 'COPIATO ✓',

      'form.name': 'NOME',
      'form.email': 'EMAIL',
      'form.message': 'MESSAGGIO',
      'form.name.ph': 'Il tuo nome',
      'form.email.ph': 'tu@email.com',
      'form.message.ph': 'Raccontami a cosa stai lavorando...',
      'form.submit': 'INVIA MESSAGGIO →',
      'form.status.sending': "Invio in corso...",
      'form.status.thanks': 'Grazie, ti risponderò presto.',
      'form.status.mailto': 'Apro la tua app di posta, inviamela e ti rispondo presto.',

      'footer.backtotop': 'TORNA SU ↑',

      'egg.stickers': 'ADESIVI',
      'egg.chaos': 'MODALITÀ CAOS',
      'egg.chaosWarn': 'AVVISO EPILESSIA',
      'egg.dragsticker': 'TRASCINA UN ADESIVO OVUNQUE →',
      'egg.close': 'CHIUDI ✕',
      'egg.stopchaos': 'FERMA IL CAOS ✕',
      'egg.playpong': '▶ GIOCA A PONG',
      'pong.title': 'PONG.EXE, EDIZIONE GLITCH',
      'pong.win': 'HAI VINTO',
      'pong.lose': 'VINCE LA CPU',
      'pong.rematch': 'RIVINCITA ▶',
      'pong.controls': '↑/↓ O W/S PER MUOVERTI, PRIMO A 5',
      'pong.controlsTouch': 'TRASCINA PER MUOVERE, PRIMO A 5'
    }
  };

  var ORDER = ['en', 'es', 'ja', 'it'];
  var STORAGE_KEY = 'jm-lang';
  var listeners = [];
  var current = 'en';

  function t(key) {
    var pack = DICT[current] || DICT.en;
    var val = pack[key];
    if (val === undefined) val = DICT.en[key];
    return val === undefined ? '' : val;
  }

  /* Applies every data-i18n* attribute in the document. Safe to re-run:
     each call reads from the key, never from the current DOM text, so
     switching languages repeatedly can't compound. */
  function apply() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    // only for strings that legitimately carry markup (the <br> in the
    // contact statement) — every key here is authored above, never
    // user-supplied, so there's no injection surface
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      el.alt = t(el.getAttribute('data-i18n-alt'));
    });
    // data-tip, not title. The native tooltip waits about a second, cannot be
    // styled, and renders as system chrome on a page that has an opinion
    // about everything else - and setting both title and aria-label makes
    // some screen readers announce the control twice. The CSS tooltip reads
    // this attribute through content: attr(data-tip).
    //
    // Scoped to its own attribute rather than riding on data-i18n-aria: that
    // one is also on the lightbox, the portrait link and the magnetic
    // headline, none of which should sprout a tooltip. The keys are shared
    // with the aria labels, so the two cannot drift apart.
    document.querySelectorAll('[data-i18n-tip]').forEach(function (el) {
      el.setAttribute('data-tip', t(el.getAttribute('data-i18n-tip')));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });

    document.documentElement.lang = current;
    syncJapaneseFont();
    document.title = t('html.title');
    var ogTitle = document.querySelector('meta[property="og:title"]');
    var ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogTitle) ogTitle.setAttribute('content', t('html.title'));
    if (ogDesc) ogDesc.setAttribute('content', t('html.description'));
  }

  /* Noto Sans JP is ~1 MB across 48 subset files and nothing outside
     Japanese needs it, so its stylesheet is attached the first time Japanese
     is actually chosen rather than shipped to every visitor. Called from
     apply() rather than set(): set() returns early when the language is
     already current, which is exactly the case on first load for someone
     whose saved preference is ja. */
  var jpFontLink = null;
  function syncJapaneseFont() {
    if (current === 'ja') {
      if (jpFontLink) return;
      jpFontLink = document.createElement('link');
      jpFontLink.rel = 'stylesheet';
      jpFontLink.href = 'assets/fonts/noto-sans-jp.css';
      document.head.appendChild(jpFontLink);
      return;
    }
    // Detach it again on the way out. Leaving it attached was not free:
    // Noto Sans JP is the last fallback in every stack, and it covers the
    // arrows the Latin subsets do not - U+2190/2192/2197. So after one visit
    // to Japanese, every back arrow and CTA arrow on the English page
    // switched from the system font to Noto and stayed there. Same page,
    // two different renderings depending on where you had been.
    if (!jpFontLink) return;
    jpFontLink.remove();
    jpFontLink = null;
  }

  function set(lang, opts) {
    if (!DICT[lang] || lang === current) return;
    current = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* private mode */ }
    apply();
    syncMenu();
    listeners.forEach(function (fn) {
      try { fn(current); } catch (e) { /* one bad listener shouldn't block the rest */ }
    });
  }

  function syncMenu() {
    document.querySelectorAll('.lang-option').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.lang === current);
      btn.setAttribute('aria-current', btn.dataset.lang === current ? 'true' : 'false');
    });
    /* The trigger used to carry a two-letter code that this kept in step.
       It shows the translate mark alone now - which language is on is told
       by the marked option above, and by its aria-current. */
  }

  /* pick the starting language: saved choice first, then the browser's
     own preference if we actually speak it, then English */
  function detect() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && DICT[saved]) return saved;
    } catch (e) { /* private mode */ }
    var langs = navigator.languages || [navigator.language || 'en'];
    for (var i = 0; i < langs.length; i++) {
      var base = String(langs[i]).toLowerCase().split('-')[0];
      if (DICT[base]) return base;
    }
    return 'en';
  }

  // Resolved immediately rather than inside init(): script.js is a plain
  // <script> at the end of <body>, so it executes BEFORE DOMContentLoaded.
  // If the language were still defaulting to 'en' at that moment, every
  // string script.js generates at runtime would be built in English and
  // never revisited — apply() below only reaches data-i18n elements.
  current = detect();

  // {placeholder} substitution, for the few strings that need a number or
  // a title interpolated (photo alt fallbacks)
  function tf(key, vars) {
    var str = t(key);
    if (typeof str !== 'string') return '';
    return str.replace(/\{(\w+)\}/g, function (m, k) {
      return Object.prototype.hasOwnProperty.call(vars || {}, k) ? vars[k] : m;
    });
  }

  window.I18N = {
    t: t,
    tf: tf,
    apply: apply,
    set: set,
    langs: ORDER,
    get lang() { return current; },
    onChange: function (fn) { listeners.push(fn); }
  };

  function init() {
    apply();

    var toggle = document.getElementById('langToggle');
    var menu = document.getElementById('langMenu');
    if (toggle && menu) {
      toggle.addEventListener('click', function (e) {
        // Deliberately NOT stopPropagation: this click has to reach document
        // so the OTHER dropdowns' close handlers see it. The document handler
        // below ignores clicks on this toggle, so letting it through is safe.
        menu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', menu.classList.contains('open') ? 'true' : 'false');
      });
      menu.querySelectorAll('.lang-option').forEach(function (btn) {
        btn.addEventListener('click', function () {
          set(btn.dataset.lang);
          menu.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
      document.addEventListener('click', function (e) {
        // contains() rather than !==: the toggle has child nodes, and a click
        // landing on one of them would otherwise read as an outside click and
        // close the menu in the same gesture that opened it
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
          menu.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          menu.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
      // Scrolling away dismisses it, matching the two dropdowns beside it
      // (MENU_SCROLL_DISMISS in script.js). Same 40px threshold, same reason
      // for having one rather than closing on any scroll at all: opening the
      // menu can shift the page a pixel, and a menu that closes during the
      // gesture that opened it is worse than one that stays.
      var langScrollAnchor = null;
      toggle.addEventListener('click', function () {
        langScrollAnchor = menu.classList.contains('open') ? window.scrollY : null;
      });
      window.addEventListener('scroll', function () {
        if (langScrollAnchor === null) return;
        if (Math.abs(window.scrollY - langScrollAnchor) < 40) return;
        langScrollAnchor = null;
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }, { passive: true });
    }
    syncMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
