######################################################################
######################################################################
# BUMP CACHE VED ENDRING AV static/css/main.css ELLER static/js/app.js 
# (dette kan jeg gjøre manuelt, siden jeg pusher selv)
######################################################################
######################################################################

# Intro
Her er en lang liste med alt jeg vil implementere. Både bugs, forbedringer, og nye funksjoner.
Les hele listen og begynn å arbeide deg igjennom den. IKKE PRØV Å TA ALT PÅ EN GANG. Ta litt og litt, jobb deg gjennom listen i flere omganger, da det er veldig mye. Del opp i fornuftige deler. Kanskje du finner en mer hensiktsmessig oppdeling enn jeg har, da det kan være noen ting går inni hverandre.
Bruk denne filen til å markere hva du har gjort og skal gjøre, så hvis jeg clearer chatten (pga. context) så kan du ta opp tråden igjen.

Lag en plan før du implementerer. For det er mange ting som trenger forslag og konkret plan for god implementasjon.
Noen nøkkelord er: god brukeropplevelse, intuitivt design, unngå rot, solid implemetasjon der ulike funksjonene samspiller godt, og tenke på at dette skal brukes på både mobil og pc.


# Bugs
- ikke alle vers har kryssreferanser! Nå vises kryssreferanse-tegnet på alle vers, og trykker man på et vers som ikke har, får man "kunne ikke finne krysreferanser". Kun vis tegnet for de som faktisk har
- søker man: bok kapittel:vers;vers-vers så tolkes den siste vers-vers som kapittel-kapittel, men kapittel:vers;vers gir vers. Forvirrende, vil at begge skal gi vers. Tar man bok:kapittel;kapittel eller bok:kapittel-kapittel;kapittel eller bok:kapittel-kapittel;kapittel-kapittel så skal det funke også slik. Basically at context carries på riktig måte, er man innenfor vers så er kontekst vers, er man kun på kapittelnivå er kontekst kun kapittel i den boka. Men man kan også spesifisere ved å gjøre slik: bok:kapittel;kapittel:vers (gå til mer spesifikk kontekst) men man kan da ikke gå fra et vers til et kapittel slik, bok:kapittel:vers;kapittel (ikke lov, går fra spesifikk til mindre spesifikk kontekst, den siste tolkes som vers)
- quick-search søketreff er mye bredere enn content bredden. Gjør at bredden på disse henger sammen med bredden på søkebar, versbokser, og vanlige søketreff. Altså alt annet content.
- kopier boksen åpnes mot høyre på mobil, av og til blir den nesten clippet av kanten. Vil at den skal kunne åpne til høyre eller venstre basert på hvilken side av skjermen den er på, så den alltid åpner mot midten.

Mindre alvorlige bugs:
- <- swipe -> teskten under hotkeys går utenfor den grå boksen på mobil, er for bred tekst. Må gjøre at de grå boksene med hotkeys kan være bredere for å romme all teksten
- refresh popup i PWA funker ikke etter jeg bumper cache versjon i sw.js, får ikke popup om refresh selv etter lukke/åpne app
- når man trykker "vis alle" fotnoter på mobil så blir teksten i søkefeltet alt for stor font ift slik den er på mobil. Er kun estetisk men ser litt stygt ut.


# Store endringer

## Kun norsk UI-språk
- fjern engelsk språk og funksjonen for å bytte UI-språk. Vil kun ha nettsiden på norsk. Men vil fortsatt beholde alt som har med søk på engelsk å gjøre, altså at man kan søke etter engelske bøker og engelske filtre. Dette gir mening siden vi fortsatt har engelske oversettelser. Men tenker nå bare på UI-språk.
- fjern variabler og funksjoner som var brukt til å bytte UI-språk
- fjern dette fra CLAUDE.md slik at fremtidige sessions ikke tror man skal legge inn på norsk og engelsk.

## Sidebar:
- på pc ønsker jeg en ny funksjon: sidebar. Dette er for å flytte visse elementer over, så man kan se på dem samtidig med teksten, og at de forblir der selv om man bytter tekst. For elementer som er koblet opp mot teksten (kart, kommentar), vil jeg at de skal oppdateres basert på hva som er in view.
- basics: en sidebar som er scrollbar. Den skal kun være på pc. Skal være på høyre side, og default ta opp litt mindre enn midten. Teksten flyttes til høyre. Nå tar jo teksten opp kun et område på midten, men vil at når sidebar er aktiv, så må tekst+sidebar fylle mye mer av bredden på skjermen. Sidebar skal også gå an å endre bredde på ved å dra kanten på den. Kanskje det kan kalles "festede elementer" elns
- først og fremst henger dette veldig sammen med kartet. Jeg vil kartet skal default åpnes i sidebar, og heller ha en knapp i kart header for å åpne det i fullskjerm, og hvis man lukker fullskjerm går det tilbake til sidebar.

Hvis bibelkommentar implementert:
- vil jeg at man skal kunne åpne bibelkommentar i sidebar. Da skal man se kommentar til alle versene som er i view. 
- Det skal føles intuitivt å bruke kommentarene sammen med teksten. Vil at når man trykker på en kommentar, så scroller den til og highligter det verset. 
- skal også her være en dropdown for å kunne velge mellom kommentarer.

Generelt:
- tenk på fremtiden: vil at det skal legges til rette for å kunne ha fremtidige nye elementer også i sidebar. 
- funksjon for å rearrange elementer, og for å collapse/expande hver enkelt, og for å krysse dem ut.
- ønsker en smooth brukeropplevelse, med intuitivt design, som allerede nevnt. Animasjoner, link mellom tekst og elementer, hensiktmessige knapper og design.
- tenk igjennom hvordan allerede implementerte funksjoner pairer med sidebaren. For eksempel hvordan det funker når man har flere tekster in view, sammenligning, osv. (kan man ha flere kart f.eks, men da hvordan det funker når man bytter tekst osv. ). Tenk på hva som trengs å gjøres for en komplett løsning.
- vil også ha en mulighet for å pinne vers/tekster i sidebar. Ikke hele versboksen, men at alle pinned vers kommer i en egen boks, med bare en preview av hvert. Må ikke ta for mye plass. Må kunne trykke på vers for å åpne hele. 
- vil også ha mulighet for å legge compare over i sidebar, slik at man kan ha en annen versjon (eller "alle versjoner") alltid klar, som også oppdaterer seg etter hva som er i visningen. 


## Kart:
- kartet har en veldig dårlig brukeropplevelse akkurat nå. Har noen ting som jeg vet er dårlig, men er også usikker på hvordan alt skal være. Trenger at du tenker ut en god implementasjon av kartet sammen med meg. Vil at det skal være raskt å finne det man vil, lett å koble sammen med bibelteksten, og være intuitivt å bruke.

- Open Street Map har hebraiske og arabiske navn, kan ikke forstå det. Kan man bruke Esri world street map i stedet som et vanlig kart? De har engelske navn. Går det an å kombinere satelitt og streetmap, altså satelitt med landegrenser/byer osv. (har esri noe sånt) eller må man ha som 2 forskjellige layers? begge går fint, er kanskje en god ide å ha 2 layers uansett så man kan velge satelitt/ikke satelitt, men kunne vært fint å hatt landegrenser og byer i satelitt-kartet også.
- kart zoomer alt for mye inn når man trykker på et sted. Etter jeg har trykket på et sted ønsker jeg fortsatt god oversikt over landet, når den zoomer for langt inn mister man helt oversikt over hvor man er i verden. F.eks når jeg trykker på jerusalem i et vers eller i sidemenyen, skal den gå til jerusalem, men ikke zoome inn mer enn at jeg kan se hele israel liksom. Er litt usikker på hvordan zoomen skal fungere i alle tilfeller. Men ønsker hvertfall at det ikke skal føles desorienterende ut.
- vil at når man har trykket på et sted/region/elv, så forblir outlinen/tykk linjen så lenge dette stedet er "aktivt" (pop up er åpen).
- er vanskelig å "treffe" når man skal trykke på elver og steder, fordi området som ser etter musetrykk er så lite.
- pop-up i kart er vanskelig å forstå hva egentlig sier. Denne må reworkes. Trenger tydelig info om: Navn, hva som er andre navn på samme sted, og hvilke(t) vers dette stedet er nevnt i. Det er heller ikke tydelig hva tallene betyr, f.eks "Cush 2". Her ser jeg at jeg ikke kjenner strukturen til dataene helt, , for noen ganger markeres nøyaktig samme sted i kartet flere ganger under ulike navn, dette er også forvirrende, men har nok noe med alias å gjøre. Og disse tallene vet jeg heller ikke helt hva betyr.
- Sidemenyen (toppmeny på mobil) er dårlig. Denne trenger også rework. For det første kan det være smart å ha det som toppmeny når kart er i sidebar, og vurere å ha som toppmeny også i fullskjerm eller bytte til sidemeny. Ha separatorer/kolonner elns mellom ulike elementer i kartet (altså steder øverst, regioner, elver, kanskje flere). Ha en mulighet for å skjule/vise steder på kart (typisk øyesymbol, og øyesymbol med strek over), samt en vis alle/skjul alle. Når man trykker på et sted i menyen, skal det navigeres til det på kartet (ref det jeg skrev om zoom). Ønsker ikke en åpne/lukke knapp.
- Hover og klikk: man hovrer over et sted i meny, skal man kunne se i kartet hvor det er med outline/liten animasjon. Når hovrer over et sted i kartet, skal samme skje. I begge tilfeller skal også verset higlightes så lenge man hovrer. Stedsnavnet (både i meny og popup) skal også ha hvilket vers det er nevnt i, og trykker man stedet, kommer man til verset (auto scroll) og verset blir highlightet. Er man i kart fullskjerm og trykker på et vers, går kartet tilbake til sidebar og man navigerer til verset. Er man i sidebar, scrolles det og navigeres til verset. Er stedet nevnt i flere vers, marker alle og naviger til det første.
- som nevnt skal sidebar kunne dynamisk rezises (i bredden) av bruker, tenk på dette også.
- forbedre disclaimer, legg den et annet sted, den er alt for intrusive der den er nå. Kan evt skjule den som en liten grå tekst eller ha den som en (i) eller (!) knapp
- kart header er på engelsk, fiks til norsk
- kanskje det også er bedre med vanlige kart-pins i stedet for prikker for nøyaktige steder. Og også kanskje en god ide å gi ulike steder ulike farger, hvertfall regioner, da de kan være vanskelige å skille fra hverandre.
- ønsker en måte å se alle bibelsteder et stedsnavn er nevnt. Her må det tenkes hvordan dette bruker alias og sånt for å vise alle stedene riktig. Kanskje man kan ha flere valg, vise kun dette navnet eller vise dette og dens alias. Her kan det være smart å gjenbruke "stats" panelet, og ha en knapp for å gjøre et søk på dette stedet.
- når man zoomer inn/ut, så går det i hakk, vil heller zoome kontinuerlig, så man kan stoppe når man vil.

Dette er mange ting, så forstå hva som trengs å gjøres og forklares, lag og en strukturert plan.


## Ny footer + next/prev navigasjon
- Nå er footer kart + les kapittel + ... . Vil heller ha 1 knapp, med en studiehatt emoji, tekst "Studie" og en pil ned, som extender footer (med en liten animasjon), og i den delen ligger alle knappene. Nå vil jeg ha en annen les kapittel funksjon, så dropp denne knappen herfra. Men ha kart slik som nå (men ha den greyed out hvis ingen stedsnavn i teksten), kommentar (bok emoji), og interlinear, bibleref og source som egne knapper, men med et "åpne eksternt" symbol (typ firkant med pil ut) som indikerer at de åpner nye faner. Vil gjøre designet mer ryddig, og man kan på en måte skille mellom "studiemodus" og "lesemodus". Vil at om studiemodus/extended footer er aktiv eller ikke skal bli husket, så man ikke trenger å åpne den hver gang, men man kan åpne den en gang og så forblir den åpen på andre tekster hvis man går inn på andre tekster, helt til man lukker den. Finn på en løsning på hvordan dette vil virke sammen med flere tekster in view.
- I stedet for å ha en "les kapittel" knapp, så vil jeg ha en pil ned (uten hale, bare V, men bred), som har et generøst hover område som lyser opp i opaque aksentfarge ved hover (ha et avrundet hover område langs hele bunnen). Denne åpner hele kapittelet, med en ekstension animasjon, og pilen har en trykk animasjon og en snu 180 grader animasjon. Fordi når kapittel er åpent, bytter pilen til andre veien, og man kan trykke igjen for å collapse til det opprinnelige verset/versene. Dette skal funke slik at hvis man har flere tekster åpne, kan man åpne hele kapittelet og lukke tilbake igjen uten å gjøre ett "nytt søk", altså at de andre tekstene ikke forsvinner
- relevant til dette, er at navigasjon til forrige/neste kapittel/vers. Jeg vil at på samme måte skal det være mulig, hvis man har flere tekster in view, å navigere den ene uten å miste de andre. Pass på at animasjonene blir riktige. Og vil at hover skal være likt som den nye les hele kapittel, der et avrundet område rundt pilen skal lyse opp i opaque aksentfarge og at disse også skal få en trykk-animasjon, alt lik den nye "les kapittel" pilen. Det skal se ut som et helhetlig design.
- Vil ha en måte å vise intuitivt på mobil at man kan swipe for å navigere. Nå er det små < > men de er nesten ikke synlige, og på lange tekster er de kun på midten av boksen så mye av tiden ser man de ikke i det hele tatt. Tenk gjennom en løsning for mer intuitiv brukeropplevelse. Kan godt hende pilene kan fjernes, og kanskje bare legge til et lite hint om at man kan swipe ett sted når man er på mobil? Siden det uansett ikke er så mye plass horisontalt


## Bibelkommentar
Vil implementere bibelkommentarer. Har 2 stk jeg vil ha inn:

- scofield er allerede parset til json (ligger i temp_resources/). Den har kommentar for mange vers (pass på \n, _kursiv_ i formateringen) og kryssreferanser. 
- Kan bruke json filen som den er, eller legge inn i en ny database, der man også kan legge inn andre kommentarer senere. Problem: ikke alle kommentarer er på samme format
- implementasjon: to valg:
    1. enten, hvert vers som har en kommentar, kan få en knapp ved seg, lik fotnoter. Kom med forslag for tegn. Denne implementasjonen er rask og enkel, funker på både mobil og pc. For å støtte flere kommentarer i fremtiden, så vil ha en liten dropdown for å velge blant alle kommentarene som har kommentar for det verset. 
    Må ha en egen toggle i "visning" for å slå kommentarer av/på. Vil ha det som en separat fra kryssreferanse og fotnote toggle, siden det er to seperate ting (intern bibel/ekstern kommentar)
        - fordel: 
            - lett å koble kommentar til vers. F.eks scofield som er vers for vers passer bra til dette, og kan bli veldig mye om man skal liste alt sammen som i alternativ 2.
        - ulempe: 
            - ikke alle kommentarer er vers for vers. Kan bli litt mye å blande dette også inn i bibelteksten.
    2. knapp i footer (ref. "ny footer"). Denne åpner et vindu under verset (mobil) eller i sidebar (pc, ref "sidebar"). 
    Ha en dropdown for ulike kommentarer, da antar man at man ikke har mer enn en åpen om gangen, men det er vel ok. De skal også følge hvilken tekst som er åpen i view, ref "sidebar".
        - fordel: 
            - passer til ulike typer kommentarer. Har f.eks en matthew henry som er en .md fil pr kapittel, sen passer bedre i dette designet. 
            - holder adskilt fra teksten
        - ulempe: 
            - ikke like lett å se kobling mellom vers og kommentar. Må evt ha link mellom dem med trykk/navigasjon/highlighting, kanskje også ved hover
    Trenger dine forslag her.

En annen kommentar:
    Matthew Henry Consise: hvert kapittel har en .md fil, ligger i temp_resources/mhenry_consise/. Det er mange filer, er nok lurt å lagre i database for ryddighets skyld.
    Her tenker jeg det er mest naturlig med implementasjon 2., altså knapp i footer som åpner i sidebar/under. Åpner filen for kapitlet som teksten er i.
    Vet ikke hvordan det er best å vise disse .md filene. Kan de vises direkte? Kan de konverteres til hmtl, der de beholder formateringen? Eller noe annet?


## Outline
outline for hver bok, ligger som txt filer i temp_resources/bsb_outlines, en per bok
- liste-format må tolkes (1. 2. 3  \  a. b. c.  \  i. ii. iii.)
- inneholder bibelreferanser til hvert punkt i lista, innenfor parentes. Dette må tolkes så det kan linke til teksten, så man kan trykke og åpne den teksten. Mulig å gjøre én gang (hardkode links), og gjenbruke, siden de ikke skal endre seg.
- ha som en knapp i footer, åpner outline for gitt bok (under på mobil, sidebar på pc.)


## Bible topics (fra BSB)
Mange temaer med tilhørende vers. Kan reversere, slik at alle nevnte vers får liste med topics som inneholder dette verset -> link til andre vers under samme tema
- ligger i temp_resources/ som excel fil, må parses og lagres på ett format. Har top temaer og undertemaer, må gruppere disse, altså vise topptema og deretter undertema som lister under der, for ryddighet og oversikt. Få til et format der det ikke blir for rotete og alt for mye på en gang.
- implementasjon. En knapp i ny footer, "Temaer". Åpner en boks i sidebar (pc) eller under (mobil). Ha expandable lister for hvert tema, med preview av versene lignende preview i fotnoter, altså vise 2 linjer, og la trykke for å komme inn på hele. Kanskje lurt å vise hvilket vers i teksten som er in view som faktisk "trigget" dette temaet, så det blir en direkte/intuitiv kobling mellom dem. Her er kanskje highlighting også en god ide, ved hover/trykk.


## Ny bibel: BLB (Berean Literal Bible)
Literal: ord for ord oversatt
som .txt (tsv?) fil: https://literalbible.com/blb.txt, format må sjekkes 
legge inn i databasen og versjons-dropdown på lik linje med andre oversettelser.
Test og se at funker. 



# Diverse mindre endringer
- underline vers med accent color i stedet for grå highlight på vers ved hover
- når trykk på vers, vil jeg at i popup skal det være: (bok emoji) åpne, og etter tilgjengelighet: kryssreferanse (kun tegnet), fotnote (tegn), bibelkommentar (etter det er implementert). Nå kan man ikke trykke på verset hvis kun ett vers i visning, men siden det nå inkluderer flere ting enn bare "les vers" så skal man kunne gjøre det nå.
- når man er i quick search, vil jeg at man skal kunne bruke pil opp og ned for å navigere gjennom resultatene, og enter for å gå inn på valgt
- vil kanskje dele opp bla & vis i 2, en for "bla" og en for "visning". Kanskje gjør det lettere å skjønne at det finnes toggles der for å endre på visning. Og ønsker å organisere toggles slik at det er mer robust særlig på mobil, nå blir verslinje togglen litt clippet av (i) knappen blant annet. Kommer kanskje til å legge til flere toggles etter hvert, så ønsker det skal være robust. 
- Relevant til dette: Og da reworke "bla" funskjonen, is stedet for 2 dropdowns kan man ha knapper først GT/NT, deretter bok, deretter kapittel. Viser ikke mer enn nødvendig på en gang, og er raskere enn å bla i dropdown. Særlig hvis man ha kapitler i et grid så man slipper å bla så langt. Vil ha dette på mobil og pc.
- ny "end" syntaks for å ta fra et vers til enden av kapittelet, altså kan skrive eks "1. kor 6:9-end". Hvis man har et startvers og vil ta ut kapittelet, men ikke vet hva sluttverset er. Hvis implementert må det legges inn i "hjelp"

Design:
- litt mer rom mellom søkebar og main header-linje/separator på mobil (kan manuelt endre?)
- litt mer avrundede kanter i hele designet
- liker at designet er minimalistisk, men kan også føles litt dødt/tomt. Kanskje det hadde vært fint med en slags aksentfarge i header, nå er den samme farge som bakgrunn.
- kom gjerne med dine forslag


# Kanskje endre
- search engine optimizing? metadata som vises i søkemotorer?


# Manuelle endringer
- rydde opp i "hjelp" tab, er for mange punkter. Heller ha et hovedpunkt "Studie" med korte underpunkter




# endringer som ikke kom med i claude sin mega-plan
- ha | og + som OR operatorer i stedet for OR, begge de 2 blir alias for samme funksjonalitet. Oppdater syntax felt i "hjelp"



1. b
2. b
3. a
4. Spesifisering: Vil at hvis man trykket på V for å åpne fra et vers til et kapittel, så skal man kunne trykke på pilen igjen (nå opp-ned) for å collapse tilbake til verset/versene man var på. Så pilen skal kun skjules hvis man er på et kapittel uten å ha kommet fra et vers, for da er det ingenting å collapse til.
5. ja
6. ja, spesifisering: vil at URL-en endres, slik at tilbake og del link fortsatt funker etter man har navigert vers (dette skjer nok uansett?). Men søkebar trengs ikke endres. 
7. a
8. ja