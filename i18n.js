/* ==========================================================================
   i18n.js — language switching for the portfolio.

   Loaded BEFORE script.js so window.I18N exists by the time script.js
   builds the marquee, the typewriter, and the magnetic headline.

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
      'lang.name': 'ENGLISH',
      'a11y.skip': 'Skip to main content',
      // {n} = image number, {title} = project title. Fallback only — real
      // per-image alt text belongs in proj.<id>.alt.<n>
      'a11y.photoAlt': 'Photo {n} from {title}',
      'a11y.videoLabel': 'Project film',
      'a11y.playFilm': 'Play the film',
      'a11y.lightbox': 'Enlarged image',
      'a11y.close': 'Close',
      'a11y.zoomHint': 'Click to enlarge',
      'a11y.projectDialog': 'Project details',
      'a11y.aboutDialog': 'About Jack Murray',
      'html.title': "Jack Murray · UX Designer",
      'html.description': "UX design portfolio by Jack Murray: websites, visual systems, branding, photography, motion, and digital experiments.",

      'nav.projects': 'PROJECTS',
      'nav.about': 'ABOUT',
      'nav.contact': 'CONTACT',
      'nav.aria.colorVision': 'color vision mode',
      'nav.aria.theme': 'toggle theme',
      'nav.aria.menu': 'menu',
      'nav.aria.language': 'choose language',

      'cvd.normal': 'NORMAL',
      'cvd.deuteranopia': 'DEUTERANOPIA',
      'cvd.protanopia': 'PROTANOPIA',
      'cvd.highcontrast': 'HIGH CONTRAST',

      'hero.badge': 'OPEN TO PROJECTS & DESIGN WORK',
      'hero.cta': 'VIEW PROJECTS ↓',
      'hero.taglines': [
        'UX designer building websites with personality.',
        'Websites, visual systems, and digital experiments.',
        "Design that's intentional, not generic."
      ],
      'marquee.items': ['UX DESIGN', 'WEBSITES', 'BRAND SYSTEMS', 'PHOTOGRAPHY', 'MOTION', 'AUTOMATION'],

      'work.title': 'SELECTED PROJECTS',
      'work.num': '01 / PROJECTS',
      'filter.ALL': 'ALL',
      'filter.UX/UI': 'UX/UI',
      'filter.BRANDING': 'BRANDING',
      'filter.GRAPHICS': 'GRAPHICS',
      'filter.PHOTOGRAPHY': 'PHOTOGRAPHY',
      'filter.WEB': 'WEB',
      'filter.MOTION': 'MOTION',

      'cat.UX/UI': 'UX/UI',
      'cat.GRAPHICS': 'GRAPHICS',
      'cat.PHOTOGRAPHY': 'PHOTOGRAPHY',
      'cat.MOTION': 'MOTION',
      'cat.WEB': 'WEB',
      'cat.BRANDING': 'BRANDING',

      'proj.cat-coaching.desc': "Adaptive coaching interface for heavy equipment operators, designed with Caterpillar.",
      'proj.cat-coaching.type': 'Bradley University × Caterpillar',
      'proj.cat-coaching.role': 'UX Research & Design',
      'proj.cat-coaching.body': "Best Research Award winner. In my Advanced Interaction Design course at Bradley, I worked in a three-person team partnered with Caterpillar to design an adaptive coaching interface for heavy equipment operators.\n\nI got my hands on every part of the process: research, user flows, wireframes, Figma prototypes, and usability testing with 5 participants. We met with Caterpillar's UX team for 7 weeks, went through 2 rounds of iteration based on their feedback and our testing, and wrapped up with an on-site visit to Caterpillar in Peoria.",
      'proj.cat-coaching.alt.1': "Three students working at a conference table at Caterpillar, laptops open to design files, with project notes filling the whiteboard behind them.",
      'proj.cat-coaching.alt.2': "A team working session, with feature priorities and screen names written across a whiteboard.",
      'proj.cat-coaching.alt.3': "The three-person project team in front of a Caterpillar wall graphic reading 'One Team, with a Common Goal'.",
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
      'proj.monmouth-retreat.body': "I got an opportunity to photograph a musical retreat for a worship team over in Monmouth, IL. This retreat was full of life and deep emotion, and I aimed to capture that energy through candid moments, both individual and group interactions.\n\nThe changing lighting presented a challenge in editing, but I worked to create a cohesive feel that reflects the passion of the team and the significance of this place.\n\nThrough this gallery, I hope viewers can experience the heart of this retreat and the impact it had on those who were there.",
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
      'proj.oasis-journey.body': "Journey to the Oasis is a 3D animated short made for a 3D animation course at Otis College of Art and Design. A lone alien, Leedo, tears through desert ruins in a low-slung ship, clears a wide gap in slow motion, and steps out in front of a gleaming city, the film ends panning off him into the sun.\n\nIt was built across Maya, Blender and ZBrush. I rendered in Cycles rather than Eevee for the quality it gave this piece, and the final pass took three full days.\n\nIt closed out the course as my final project and drew a strong response at the end-of-term showing. There's no dialogue, just wind and a short score.",
      'proj.oasis-journey.alt.1': "A 3D desert city of white marble rings, columns and wide bowl-topped towers, with a pale green ship hovering above and dunes rising behind.",
      'proj.oasis-journey.alt.2': "The Journey to the Oasis poster art: a 3D desert scene with marble arches and towers, low ships in the foreground and a small alien figure standing on one of them.",
      'proj.portfolio-website.desc': 'Personal website built to explore UX, front-end design, and visual identity.',
      'proj.portfolio-website.type': 'Personal Project',
      'proj.portfolio-website.role': 'Designer & Developer',
      'proj.brand-concept.desc': 'Conceptual identity work exploring brand systems, typography, and visual direction.',
      'proj.brand-concept.type': 'Concept Project',
      'proj.brand-concept.role': 'Brand Designer',
      'proj.university-redesign.desc': "Research, flows, and prototypes for rebuilding a university website.",
      'proj.university-redesign.type': "Case Study",
      'proj.university-redesign.role': "UX Designer",
      'proj.editorial-system.desc': "A type and grid system carried across a publication in print and on screen.",
      'proj.editorial-system.type': "Concept Project",
      'proj.editorial-system.role': "Designer",

      'project.back': '← BACK TO WORK',
      'project.type': 'TYPE',
      'project.year': 'YEAR',
      'project.role': 'ROLE',

      'about.title': 'ABOUT',
      'about.num': '02 / ABOUT',
      'about.statement': "I'm a UX designer studying at Bradley University. Successful design, to me, is research based and intentional the whole way down, from the first interview to the last pixel.",
      'about.hook': "I've lived on three continents. When you design for other people, culture and context are crucial.",
      'about.stat.nowValue': "Milan",
      'about.portraitLink': "More about Jack",
      'about.portraitAlt': "Jack with a camera in a Milan courtyard, red threads strung between the arches behind him.",
      'about.stat.years': 'Years designing',
      'about.stat.projects': 'Projects & experiments',
      'about.stat.continents': "Continents lived on",
      'about.stat.now': "Where I am right now",
      'about.readmore': "HOW I GOT HERE →",
      'about.resume': 'DOWNLOAD RESUME ↓',
      'skills.marquee': ['UX DESIGN', 'UI DESIGN', 'WEB DESIGN', 'BRAND SYSTEMS', 'TYPOGRAPHY', 'PHOTOGRAPHY', 'MOTION', 'HTML / CSS', 'AUTOMATION'],

      'aboutpage.back': '← BACK',
      'aboutpage.photoAlt': 'Jack with a camera in a Milan palazzo courtyard, red threads strung between the arches behind him.',
      'aboutpage.bandAlt': 'Jack on a grassy ridge in the Dolomites with jagged peaks behind him.',
      'aboutpage.teamAlt': 'Jack and the Riverside creative team in front of the printed Easter at Riverside photo wall.',
      'aboutpage.eyebrow': 'ABOUT JACK',
      'aboutpage.heading': "HI, I'M JACK.",
      'aboutpage.p1': "I'm a UX designer studying at Bradley University. What I care about is whether a design actually works: that it's research based, that every choice was intentional, and that it still holds up once real people are using it. I move across interfaces, brand systems, graphics, photography and motion, and the projects I like best need several of those at once.",
      'aboutpage.p2': "I grew up making logos and getting pulled into the internet through games, websites, and creative tools. I also grew up between countries: five years at an international school in Yokohama, where I picked up the Japanese, and right now a semester in Milan. It has made me care less about work that just looks strong and more about work that still makes sense to someone who didn’t grow up where I did.",
      'aboutpage.p3': 'My faith is also part of who I am, and some of my favorite work has come from church graphics and creative projects that connect design with meaning.',
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
      'contact.num': "03 / LET'S TALK",
      'contact.statement': "GOT AN IDEA?<br>LET'S TALK.",
      'contact.copy': 'COPY',
      'contact.copied': 'COPIED ✓',
      'contact.location': 'BASED IN ILLINOIS. AVAILABLE ANYWHERE.',

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
      'pong.controls': '↑/↓ OR W/S TO MOVE, FIRST TO 5'
    },

    /* ---------------------------------------------------------------- ES */
    es: {
      'lang.name': 'ESPAÑOL',
      'a11y.skip': 'Saltar al contenido principal',
      'a11y.photoAlt': 'Foto {n} de {title}',
      'a11y.videoLabel': 'Película del proyecto',
      'a11y.playFilm': 'Reproducir la película',
      'a11y.lightbox': 'Imagen ampliada',
      'a11y.close': 'Cerrar',
      'a11y.zoomHint': 'Clic para ampliar',
      'a11y.projectDialog': 'Detalles del proyecto',
      'a11y.aboutDialog': 'Sobre Jack Murray',
      'html.title': "Jack Murray · Diseñador UX",
      'html.description': "Portafolio de diseño UX de Jack Murray: sitios web, sistemas visuales, branding, fotografía, motion y experimentos digitales.",

      'nav.projects': 'PROYECTOS',
      'nav.about': 'SOBRE MÍ',
      'nav.contact': 'CONTACTO',
      'nav.aria.colorVision': 'modo de visión del color',
      'nav.aria.theme': 'cambiar tema',
      'nav.aria.menu': 'menú',
      'nav.aria.language': 'elegir idioma',

      'cvd.normal': 'NORMAL',
      'cvd.deuteranopia': 'DEUTERANOPÍA',
      'cvd.protanopia': 'PROTANOPÍA',
      'cvd.highcontrast': 'ALTO CONTRASTE',

      'hero.badge': 'DISPONIBLE PARA PROYECTOS Y DISEÑO',
      'hero.cta': 'VER PROYECTOS ↓',
      'hero.taglines': [
        'Diseñador UX que crea sitios web con personalidad.',
        'Sitios web, sistemas visuales y experimentos digitales.',
        'Diseño intencional, nunca genérico.'
      ],
      'marquee.items': ['DISEÑO UX', 'SITIOS WEB', 'SISTEMAS DE MARCA', 'FOTOGRAFÍA', 'MOTION', 'AUTOMATIZACIÓN'],

      'work.title': 'PROYECTOS SELECCIONADOS',
      'work.num': '01 / PROYECTOS',
      'filter.ALL': 'TODO',
      'filter.UX/UI': 'UX/UI',
      'filter.BRANDING': 'BRANDING',
      'filter.GRAPHICS': 'GRÁFICOS',
      'filter.PHOTOGRAPHY': 'FOTOGRAFÍA',
      'filter.WEB': 'WEB',
      'filter.MOTION': 'MOTION',

      'cat.UX/UI': 'UX/UI',
      'cat.GRAPHICS': 'GRÁFICOS',
      'cat.PHOTOGRAPHY': 'FOTOGRAFÍA',
      'cat.MOTION': 'MOTION',
      'cat.WEB': 'WEB',
      'cat.BRANDING': 'BRANDING',

      'proj.cat-coaching.desc': "Interfaz de coaching adaptativo para operadores de maquinaria pesada, diseñada con Caterpillar.",
      'proj.cat-coaching.type': 'Bradley University × Caterpillar',
      'proj.cat-coaching.role': 'Investigación y diseño UX',
      'proj.cat-coaching.body': "Premio a la Mejor Investigación. En mi curso de Diseño de Interacción Avanzado en Bradley trabajé en un equipo de tres personas junto a Caterpillar para diseñar una interfaz de coaching adaptativo para operadores de maquinaria pesada.\n\nParticipé en todas las partes del proceso: investigación, flujos de usuario, wireframes, prototipos en Figma y pruebas de usabilidad con 5 participantes. Nos reunimos con el equipo de UX de Caterpillar durante 7 semanas, pasamos por 2 rondas de iteración a partir de sus comentarios y de nuestras pruebas, y terminamos con una visita presencial a Caterpillar en Peoria.",
      'proj.cat-coaching.alt.1': "Tres estudiantes trabajando en una mesa de reuniones en Caterpillar, con portátiles abiertos en archivos de diseño y notas del proyecto cubriendo la pizarra detrás.",
      'proj.cat-coaching.alt.2': "Una sesión de trabajo en equipo, con prioridades de funciones y nombres de pantallas escritos en una pizarra.",
      'proj.cat-coaching.alt.3': "El equipo de tres personas frente a un gráfico mural de Caterpillar que dice 'One Team, with a Common Goal'.",
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
      'proj.monmouth-retreat.body': "Tuve la oportunidad de fotografiar un retiro musical de un equipo de alabanza en Monmouth, Illinois. Fue un retiro lleno de vida y de emoción profunda, y busqué capturar esa energía a través de momentos espontáneos, tanto individuales como de grupo.\n\nLa luz cambiante supuso un reto en la edición, pero trabajé para lograr una sensación cohesionada que reflejara la pasión del equipo y el peso de este lugar.\n\nCon esta galería espero que quien la vea pueda sentir el corazón de aquel retiro y la huella que dejó en quienes estuvieron allí.",
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
      'proj.oasis-journey.body': "Journey to the Oasis es un cortometraje animado en 3D realizado para un curso de animación 3D en el Otis College of Art and Design. Leedo, un alienígena solitario, atraviesa a toda velocidad unas ruinas del desierto en una nave baja, salva un amplio barranco a cámara lenta y baja frente a una ciudad reluciente; la película termina con una panorámica que se aleja de él hacia el sol.\n\nSe construyó con Maya, Blender y ZBrush. Rendericé en Cycles en lugar de Eevee por la calidad que aportaba a esta pieza, y el render final tardó tres días completos.\n\nFue el proyecto final del curso y tuvo muy buena acogida en la muestra de fin de trimestre. No hay diálogo: solo viento y una breve banda sonora.",
      'proj.oasis-journey.alt.1': "Una ciudad desértica en 3D de anillos, columnas y torres de mármol blanco rematadas en forma de cuenco, con una nave verde pálido suspendida encima y dunas al fondo.",
      'proj.oasis-journey.alt.2': "La ilustración del póster de Journey to the Oasis: una escena desértica en 3D con arcos y torres de mármol, naves bajas en primer plano y una pequeña figura alienígena de pie sobre una de ellas.",
      'proj.portfolio-website.desc': 'Sitio web personal creado para explorar UX, diseño front-end e identidad visual.',
      'proj.portfolio-website.type': 'Proyecto personal',
      'proj.portfolio-website.role': 'Diseñador y desarrollador',
      'proj.brand-concept.desc': 'Trabajo de identidad conceptual que explora sistemas de marca, tipografía y dirección visual.',
      'proj.brand-concept.type': 'Proyecto conceptual',
      'proj.brand-concept.role': 'Diseñador de marca',
      'proj.university-redesign.desc': "Investigación, flujos y prototipos para rediseñar el sitio web de una universidad.",
      'proj.university-redesign.type': "Caso de estudio",
      'proj.university-redesign.role': "Diseñador UX",
      'proj.editorial-system.desc': "Un sistema de tipografía y retícula aplicado a una publicación en papel y en pantalla.",
      'proj.editorial-system.type': "Proyecto conceptual",
      'proj.editorial-system.role': "Diseñador",

      'project.back': '← VOLVER A PROYECTOS',
      'project.type': 'TIPO',
      'project.year': 'AÑO',
      'project.role': 'ROL',

      'about.title': 'SOBRE MÍ',
      'about.num': '02 / SOBRE MÍ',
      'about.statement': "Soy diseñador UX y estudio en Bradley University. Para mí, un diseño exitoso se basa en la investigación y es intencional de principio a fin, desde la primera entrevista hasta el último píxel.",
      'about.hook': "He vivido en tres continentes. Cuando diseñas para otras personas, la cultura y el contexto son cruciales.",
      'about.stat.nowValue': "Milán",
      'about.portraitLink': "Más sobre Jack",
      'about.portraitAlt': "Jack con una cámara en un patio de Milán, con hilos rojos tendidos entre los arcos detrás de él.",
      'about.stat.years': 'Años diseñando',
      'about.stat.projects': 'Proyectos y experimentos',
      'about.stat.continents': "Continentes en los que he vivido",
      'about.stat.now': "Dónde estoy ahora mismo",
      'about.readmore': "CÓMO LLEGUÉ AQUÍ →",
      'about.resume': 'DESCARGAR CV ↓',
      'skills.marquee': ['DISEÑO UX', 'DISEÑO UI', 'DISEÑO WEB', 'SISTEMAS DE MARCA', 'TIPOGRAFÍA', 'FOTOGRAFÍA', 'MOTION', 'HTML / CSS', 'AUTOMATIZACIÓN'],

      'aboutpage.back': '← VOLVER',
      'aboutpage.photoAlt': 'Jack con una cámara en el patio de un palacio de Milán, con hilos rojos tendidos entre los arcos.',
      'aboutpage.bandAlt': 'Jack en una ladera de los Dolomitas con picos escarpados detrás.',
      'aboutpage.teamAlt': 'Jack y el equipo creativo de Riverside ante el panel fotográfico impreso de Easter at Riverside.',
      'aboutpage.eyebrow': 'SOBRE JACK',
      'aboutpage.heading': 'HOLA, SOY JACK.',
      'aboutpage.p1': "Soy diseñador UX y estudio en Bradley University. Lo que me importa es si un diseño funciona de verdad: que se base en la investigación, que cada decisión sea intencional y que siga aguantando cuando ya lo está usando gente real. Me muevo entre interfaces, sistemas de marca, gráfica, fotografía y motion, y los proyectos que más me gustan necesitan varias de esas cosas a la vez.",
      'aboutpage.p2': 'Crecí haciendo logos y me enganché a internet a través de los videojuegos, las webs y las herramientas creativas. También crecí entre países: cinco años en un colegio internacional en Yokohama, de donde me viene el japonés, y ahora un semestre en Milán. Eso hace que me importe menos el trabajo que solo luce bien y más el que sigue teniendo sentido para alguien que no creció donde yo.',
      'aboutpage.p3': 'Mi fe también forma parte de quién soy, y algunos de mis trabajos favoritos han salido de gráficos para la iglesia y de proyectos que conectan el diseño con un sentido.',
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
      'contact.num': '03 / HABLEMOS',
      'contact.statement': '¿TIENES UNA IDEA?<br>HABLEMOS.',
      'contact.copy': 'COPIAR',
      'contact.copied': 'COPIADO ✓',
      'contact.location': 'CON BASE EN ILLINOIS. DISPONIBLE EN TODAS PARTES.',

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
      'pong.controls': '↑↑/↓ O W/S PARA MOVER, PRIMERO A 5'
    },

    /* ---------------------------------------------------------------- JA */
    ja: {
      'lang.name': '日本語',
      'a11y.skip': '本文へスキップ',
      'a11y.photoAlt': '「{title}」の写真 {n}枚目',
      'a11y.videoLabel': 'プロジェクトの映像',
      'a11y.playFilm': '映像を再生',
      'a11y.lightbox': '拡大画像',
      'a11y.close': '閉じる',
      'a11y.zoomHint': 'クリックで拡大',
      'a11y.projectDialog': 'プロジェクトの詳細',
      'a11y.aboutDialog': 'ジャック・マレーについて',
      'html.title': "Jack Murray · UXデザイナー",
      'html.description': "Jack MurrayのUXデザインポートフォリオ。ウェブサイト、ビジュアルシステム、ブランディング、写真、モーション、デジタル実験。",

      'nav.projects': 'プロジェクト',
      'nav.about': 'プロフィール',
      'nav.contact': 'お問い合わせ',
      'nav.aria.colorVision': '色覚モード',
      'nav.aria.theme': 'テーマを切り替える',
      'nav.aria.menu': 'メニュー',
      'nav.aria.language': '言語を選択',

      'cvd.normal': '標準',
      'cvd.deuteranopia': '緑色覚特性',
      'cvd.protanopia': '赤色覚特性',
      'cvd.highcontrast': 'ハイコントラスト',

      'hero.badge': 'プロジェクト・デザインのご依頼受付中',
      'hero.cta': 'プロジェクトを見る ↓',
      'hero.taglines': [
        '個性のあるウェブサイトをつくるUXデザイナー。',
        'ウェブサイト、ビジュアルシステム、デジタルの実験。',
        'ありきたりではなく、意図のあるデザインを。'
      ],
      'marquee.items': ['UXデザイン', 'ウェブサイト', 'ブランドシステム', '写真', 'モーション', '自動化'],

      'work.title': '選りすぐりのプロジェクト',
      'work.num': '01 / プロジェクト',
      'filter.ALL': 'すべて',
      'filter.UX/UI': 'UX/UI',
      'filter.BRANDING': 'ブランディング',
      'filter.GRAPHICS': 'グラフィック',
      'filter.PHOTOGRAPHY': '写真',
      'filter.WEB': 'ウェブ',
      'filter.MOTION': 'モーション',

      'cat.UX/UI': 'UX/UI',
      'cat.GRAPHICS': 'グラフィック',
      'cat.PHOTOGRAPHY': '写真',
      'cat.MOTION': 'モーション',
      'cat.WEB': 'ウェブ',
      'cat.BRANDING': 'ブランディング',

      'proj.cat-coaching.desc': '建設機械オペレーター向けのアダプティブなコーチングUIを、キャタピラーと共同で設計。',
      'proj.cat-coaching.type': 'ブラッドリー大学 × キャタピラー',
      'proj.cat-coaching.role': 'UXリサーチ / デザイン',
      'proj.cat-coaching.body': "ベストリサーチ賞受賞。ブラッドリー大学の上級インタラクションデザインの講座で、3人チームとしてキャタピラーと組み、建設機械オペレーター向けのアダプティブなコーチングUIを設計しました。\n\nリサーチ、ユーザーフロー、ワイヤーフレーム、Figmaプロトタイプ、5名を対象としたユーザビリティテストまで、プロセスのすべてに関わりました。キャタピラーのUXチームとは7週間にわたって打ち合わせを重ね、そのフィードバックと自分たちのテスト結果をもとに2回のイテレーションを行い、最後はピオリアのキャタピラーを訪問して締めくくりました。",
      'proj.cat-coaching.alt.1': "キャタピラーの会議室で作業する3人の学生。ノートパソコンにはデザインファイルが開かれ、背後のホワイトボードはプロジェクトのメモで埋まっている。",
      'proj.cat-coaching.alt.2': "チームの作業風景。ホワイトボードに機能の優先順位と画面名が書き出されている。",
      'proj.cat-coaching.alt.3': "「One Team, with a Common Goal」と書かれたキャタピラーの壁面グラフィックの前に立つ3人のチーム。",
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
      'proj.monmouth-retreat.body': "イリノイ州モンマスで行われたワーシップチームの音楽リトリートを撮影する機会をいただきました。生命力と深い感情に満ちたリトリートで、個人のふとした表情もグループのやりとりも、自然な瞬間を通してそのエネルギーをとらえることを目指しました。\n\n光が刻々と変わるため編集は簡単ではありませんでしたが、チームの情熱とこの場所のもつ意味が伝わるよう、全体のトーンをそろえていきました。\n\nこのギャラリーを通して、あのリトリートの核にあったものと、そこにいた人たちが受け取ったものを感じてもらえたらうれしいです。",
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
      'proj.oasis-journey.body': "「Journey to the Oasis」は、オーティス・カレッジ・オブ・アート・アンド・デザインの3Dアニメーション講座のために制作した3Dアニメーションの短編です。孤独なエイリアン、リードーが低く構えた宇宙船で砂漠の遺跡を駆け抜け、大きな谷をスローモーションで飛び越え、輝く都市の前に降り立ちます。最後は彼から離れて太陽へとパンしながら幕を閉じます。\n\n制作にはMaya、Blender、ZBrushを使いました。レンダリングはEeveeではなくCyclesを選びました。この作品に必要な質感が出せるからで、最終レンダリングには丸3日かかりました。\n\n講座の最終課題であり、学期末の上映では大きな反響がありました。セリフはなく、風の音と短いスコアだけで構成しています。",
      'proj.oasis-journey.alt.1': "白い大理石のリングや円柱、椀のような屋根をもつ塔が並ぶ3Dの砂漠都市。上空には淡い緑の宇宙船が浮かび、背後には砂丘が続く。",
      'proj.oasis-journey.alt.2': "「Journey to the Oasis」のポスターアート。3Dの砂漠に大理石のアーチと塔が立ち、手前には低い宇宙船、その上に小さなエイリアンが立っている。",
      'proj.portfolio-website.desc': 'UX、フロントエンドデザイン、ビジュアルアイデンティティを探るために制作した個人サイト。',
      'proj.portfolio-website.type': '個人プロジェクト',
      'proj.portfolio-website.role': 'デザイナー兼デベロッパー',
      'proj.brand-concept.desc': 'ブランドシステム、タイポグラフィ、ビジュアルディレクションを探るコンセプトアイデンティティ。',
      'proj.brand-concept.type': 'コンセプトプロジェクト',
      'proj.brand-concept.role': 'ブランドデザイナー',
      'proj.university-redesign.desc': "大学ウェブサイトの再構築に向けたリサーチ、フロー、プロトタイプ。",
      'proj.university-redesign.type': "ケーススタディ",
      'proj.university-redesign.role': "UXデザイナー",
      'proj.editorial-system.desc': "紙面と画面の両方にわたって展開するタイポグラフィとグリッドのシステム。",
      'proj.editorial-system.type': "コンセプトプロジェクト",
      'proj.editorial-system.role': "デザイナー",

      'project.back': '← 作品一覧へ戻る',
      'project.type': '種別',
      'project.year': '年',
      'project.role': '役割',

      'about.title': 'プロフィール',
      'about.num': '02 / プロフィール',
      'about.statement': "ブラッドリー大学で学ぶUXデザイナーです。成功したデザインとは、リサーチに裏づけられ、最初のインタビューから最後の1ピクセルまで意図を持って決められたものだと考えています。",
      'about.hook': "3つの大陸で暮らしてきました。他者のためにデザインするとき、文化と文脈は欠かせません。",
      'about.stat.nowValue': "ミラノ",
      'about.portraitLink': "ジャックについてもっと見る",
      'about.portraitAlt': "ミラノの中庭でカメラを持つジャック。背後のアーチの間には赤い糸が張り渡されている。",
      'about.stat.years': 'デザイン歴',
      'about.stat.projects': 'プロジェクトと実験',
      'about.stat.continents': "暮らした大陸",
      'about.stat.now': "いま居る場所",
      'about.readmore': "ここに至るまで →",
      'about.resume': '履歴書をダウンロード ↓',
      'skills.marquee': ['UXデザイン', 'UIデザイン', 'ウェブデザイン', 'ブランドシステム', 'タイポグラフィ', '写真', 'モーション', 'HTML / CSS', '自動化'],

      'aboutpage.back': '← 戻る',
      'aboutpage.photoAlt': 'ミラノの宮殿の中庭でカメラを持つジャック。背後のアーチには赤い糸が張り巡らされている。',
      'aboutpage.bandAlt': 'ドロミーテの草の尾根に立つジャック。背後には切り立った岩山が広がる。',
      'aboutpage.teamAlt': '印刷されたEaster at Riversideのフォトウォールの前に立つジャックとRiversideのクリエイティブチーム。',
      'aboutpage.eyebrow': 'ジャックについて',
      'aboutpage.heading': 'こんにちは、ジャックです。',
      'aboutpage.p1': "ブラッドリー大学で学ぶUXデザイナーです。大事にしているのは、そのデザインが実際に機能するかどうかです。リサーチに裏づけられていること、ひとつひとつの判断に意図があること、そして実際に人が使い始めてからも成り立つこと。インターフェース、ブランドシステム、グラフィック、写真、モーションを行き来していて、好きなプロジェクトほど、そのうちのいくつかを同時に必要とします。",
      'aboutpage.p2': 'ロゴをつくりながら育ち、ゲームやウェブサイト、制作ツールを通じてインターネットに引き込まれていきました。国をまたいで育ったことも大きいと思います。横浜のインターナショナルスクールに5年、日本語はそこで身につきました。そして今はミラノに1学期。おかげで、見た目が強いだけのものよりも、自分と違う場所で育った人にも意味が通るものを大切に思うようになりました。',
      'aboutpage.p3': '信仰も自分を形づくる大きな部分です。お気に入りの仕事のいくつかは、教会のグラフィックや、デザインと意味を結びつける制作から生まれました。',
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
      'contact.num': '03 / 話しましょう',
      'contact.statement': 'アイデアがありますか？<br>話しましょう。',
      'contact.copy': 'コピー',
      'contact.copied': 'コピーしました ✓',
      'contact.location': 'イリノイ拠点。どこでも対応可能。',

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
      'pong.controls': '↑/↓ または W/S で移動, 5点先取'
    },

    /* ---------------------------------------------------------------- IT */
    it: {
      'lang.name': 'ITALIANO',
      'a11y.skip': 'Vai al contenuto principale',
      'a11y.photoAlt': 'Foto {n} di {title}',
      'a11y.videoLabel': 'Filmato del progetto',
      'a11y.playFilm': 'Riproduci il filmato',
      'a11y.lightbox': 'Immagine ingrandita',
      'a11y.close': 'Chiudi',
      'a11y.zoomHint': 'Clicca per ingrandire',
      'a11y.projectDialog': 'Dettagli del progetto',
      'a11y.aboutDialog': 'Su Jack Murray',
      'html.title': "Jack Murray · Designer UX",
      'html.description': "Portfolio di design UX di Jack Murray: siti web, sistemi visivi, branding, fotografia, motion ed esperimenti digitali.",

      'nav.projects': 'PROGETTI',
      'nav.about': 'CHI SONO',
      'nav.contact': 'CONTATTI',
      'nav.aria.colorVision': 'modalità visione dei colori',
      'nav.aria.theme': 'cambia tema',
      'nav.aria.menu': 'menu',
      'nav.aria.language': 'scegli la lingua',

      'cvd.normal': 'NORMALE',
      'cvd.deuteranopia': 'DEUTERANOPIA',
      'cvd.protanopia': 'PROTANOPIA',
      'cvd.highcontrast': 'ALTO CONTRASTO',

      'hero.badge': 'DISPONIBILE PER PROGETTI E DESIGN',
      'hero.cta': 'GUARDA I PROGETTI ↓',
      'hero.taglines': [
        'Designer UX che crea siti web con personalità.',
        'Siti web, sistemi visivi ed esperimenti digitali.',
        'Design intenzionale, mai generico.'
      ],
      'marquee.items': ['DESIGN UX', 'SITI WEB', 'SISTEMI DI MARCA', 'FOTOGRAFIA', 'MOTION', 'AUTOMAZIONE'],

      'work.title': 'PROGETTI SELEZIONATI',
      'work.num': '01 / PROGETTI',
      'filter.ALL': 'TUTTI',
      'filter.UX/UI': 'UX/UI',
      'filter.BRANDING': 'BRANDING',
      'filter.GRAPHICS': 'GRAFICA',
      'filter.PHOTOGRAPHY': 'FOTOGRAFIA',
      'filter.WEB': 'WEB',
      'filter.MOTION': 'MOTION',

      'cat.UX/UI': 'UX/UI',
      'cat.GRAPHICS': 'GRAFICA',
      'cat.PHOTOGRAPHY': 'FOTOGRAFIA',
      'cat.MOTION': 'MOTION',
      'cat.WEB': 'WEB',
      'cat.BRANDING': 'BRANDING',

      'proj.cat-coaching.desc': "Interfaccia di coaching adattivo per operatori di mezzi pesanti, progettata con Caterpillar.",
      'proj.cat-coaching.type': 'Bradley University × Caterpillar',
      'proj.cat-coaching.role': 'Ricerca e design UX',
      'proj.cat-coaching.body': "Premio per la Miglior Ricerca. Nel corso di Advanced Interaction Design alla Bradley ho lavorato in un team di tre persone insieme a Caterpillar per progettare un'interfaccia di coaching adattivo per operatori di mezzi pesanti.\n\nHo messo mano a ogni fase del processo: ricerca, user flow, wireframe, prototipi in Figma e test di usabilità con 5 partecipanti. Abbiamo incontrato il team UX di Caterpillar per 7 settimane, siamo passati per 2 round di iterazione sulla base dei loro feedback e dei nostri test, e abbiamo chiuso con una visita in sede da Caterpillar a Peoria.",
      'proj.cat-coaching.alt.1': "Tre studenti al lavoro attorno a un tavolo riunioni da Caterpillar, con i portatili aperti sui file di design e la lavagna alle spalle coperta di appunti di progetto.",
      'proj.cat-coaching.alt.2': "Una sessione di lavoro del team, con priorità delle funzioni e nomi delle schermate scritti sulla lavagna.",
      'proj.cat-coaching.alt.3': "Il team di tre persone davanti a una grafica murale Caterpillar con la scritta 'One Team, with a Common Goal'.",
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
      'proj.monmouth-retreat.body': "Ho avuto l'occasione di fotografare un ritiro musicale di un worship team a Monmouth, in Illinois. È stato un ritiro pieno di vita e di emozione profonda, e ho cercato di catturare quell'energia attraverso momenti spontanei, sia individuali sia di gruppo.\n\nLa luce che cambiava di continuo ha reso l'editing impegnativo, ma ho lavorato per ottenere una resa coerente che restituisse la passione del gruppo e il peso di questo luogo.\n\nSpero che attraverso questa galleria si possa percepire il cuore di quel ritiro e il segno che ha lasciato in chi c'era.",
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
      'proj.oasis-journey.body': "Journey to the Oasis è un cortometraggio animato in 3D realizzato per un corso di animazione 3D all'Otis College of Art and Design. Leedo, un alieno solitario, sfreccia tra le rovine del deserto su un'astronave bassa, supera un ampio crepaccio al rallentatore e scende davanti a una città scintillante; il film si chiude con una panoramica che si allontana da lui verso il sole.\n\nÈ stato costruito con Maya, Blender e ZBrush. Ho renderizzato in Cycles anziché in Eevee per la qualità che dava a questo pezzo, e il render finale ha richiesto tre giorni pieni.\n\nÈ stato il progetto finale del corso e ha avuto un'ottima accoglienza alla proiezione di fine semestre. Non c'è dialogo: solo vento e una breve colonna sonora.",
      'proj.oasis-journey.alt.1': "Una città desertica in 3D fatta di anelli, colonne e torri di marmo bianco con sommità a coppa, una nave verde pallido sospesa in alto e dune sullo sfondo.",
      'proj.oasis-journey.alt.2': "L'illustrazione del poster di Journey to the Oasis: una scena desertica in 3D con archi e torri di marmo, navi basse in primo piano e una piccola figura aliena in piedi su una di esse.",
      'proj.portfolio-website.desc': 'Sito web personale creato per esplorare UX, design front-end e identità visiva.',
      'proj.portfolio-website.type': 'Progetto personale',
      'proj.portfolio-website.role': 'Designer e sviluppatore',
      'proj.brand-concept.desc': 'Lavoro di identità concettuale su sistemi di marca, tipografia e direzione visiva.',
      'proj.brand-concept.type': 'Progetto concettuale',
      'proj.brand-concept.role': 'Brand designer',
      'proj.university-redesign.desc': "Ricerca, flussi e prototipi per la ricostruzione del sito di un'università.",
      'proj.university-redesign.type': "Caso di studio",
      'proj.university-redesign.role': "UX designer",
      'proj.editorial-system.desc': "Un sistema di caratteri e griglia portato su una pubblicazione a stampa e a schermo.",
      'proj.editorial-system.type': "Progetto concettuale",
      'proj.editorial-system.role': "Designer",

      'project.back': '← TORNA AI PROGETTI',
      'project.type': 'TIPO',
      'project.year': 'ANNO',
      'project.role': 'RUOLO',

      'about.title': 'CHI SONO',
      'about.num': '02 / CHI SONO',
      'about.statement': "Sono un UX designer e studio alla Bradley University. Per me un progetto riuscito nasce dalla ricerca ed è intenzionale fino in fondo, dalla prima intervista all'ultimo pixel.",
      'about.hook': "Ho vissuto in tre continenti. Quando progetti per altre persone, la cultura e il contesto sono cruciali.",
      'about.stat.nowValue': "Milano",
      'about.portraitLink': "Altro su Jack",
      'about.portraitAlt': "Jack con una macchina fotografica in un cortile di Milano, fili rossi tesi tra gli archi alle sue spalle.",
      'about.stat.years': 'Anni di design',
      'about.stat.projects': 'Progetti ed esperimenti',
      'about.stat.continents': "Continenti in cui ho vissuto",
      'about.stat.now': "Dove sono adesso",
      'about.readmore': "COME CI SONO ARRIVATO →",
      'about.resume': 'SCARICA IL CV ↓',
      'skills.marquee': ['DESIGN UX', 'DESIGN UI', 'WEB DESIGN', 'SISTEMI DI MARCA', 'TIPOGRAFIA', 'FOTOGRAFIA', 'MOTION', 'HTML / CSS', 'AUTOMAZIONE'],

      'aboutpage.back': '← INDIETRO',
      'aboutpage.photoAlt': 'Jack con una macchina fotografica nel cortile di un palazzo milanese, fili rossi tesi tra gli archi.',
      'aboutpage.bandAlt': 'Jack su un crinale erboso delle Dolomiti, con le cime frastagliate alle spalle.',
      'aboutpage.teamAlt': 'Jack e il team creativo di Riverside davanti al pannello fotografico stampato di Easter at Riverside.',
      'aboutpage.eyebrow': 'SU JACK',
      'aboutpage.heading': 'CIAO, SONO JACK.',
      'aboutpage.p1': "Sono un UX designer e studio alla Bradley University. Quello che mi interessa è se un progetto funziona davvero: che nasca dalla ricerca, che ogni scelta sia intenzionale e che regga anche quando sono persone vere a usarlo. Mi muovo tra interfacce, sistemi di marca, grafica, fotografia e motion, e i progetti che preferisco ne richiedono più di uno alla volta.",
      'aboutpage.p2': 'Sono cresciuto disegnando loghi e lasciandomi trascinare dentro internet attraverso i videogiochi, i siti e gli strumenti creativi. Sono anche cresciuto tra paesi diversi: cinque anni in una scuola internazionale a Yokohama, da cui viene il giapponese, e adesso un semestre a Milano. Mi ha fatto tenere meno al lavoro che sembra solo forte e di più a quello che ha ancora senso per qualcuno cresciuto altrove.',
      'aboutpage.p3': 'Anche la fede fa parte di chi sono, e alcuni dei lavori a cui tengo di più sono nati da grafiche per la chiesa e da progetti che legano il design a un significato.',
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
      'contact.num': '03 / PARLIAMONE',
      'contact.statement': 'HAI UN’IDEA?<br>PARLIAMONE.',
      'contact.copy': 'COPIA',
      'contact.copied': 'COPIATO ✓',
      'contact.location': 'CON BASE IN ILLINOIS. DISPONIBILE OVUNQUE.',

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
      'pong.controls': '↑/↓ O W/S PER MUOVERTI, PRIMO A 5'
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
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });

    document.documentElement.lang = current;
    document.title = t('html.title');
    var ogTitle = document.querySelector('meta[property="og:title"]');
    var ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogTitle) ogTitle.setAttribute('content', t('html.title'));
    if (ogDesc) ogDesc.setAttribute('content', t('html.description'));
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
    var label = document.getElementById('langCode');
    if (label) label.textContent = current.toUpperCase();
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
    }
    syncMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
