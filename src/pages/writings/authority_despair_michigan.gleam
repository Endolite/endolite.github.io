import lustre/attribute
import lustre/element
import lustre/element/html

pub fn view() {
  html.p(
    [attribute.class("center"), attribute.style([#("text-align", "justify")])],
    [
      element.text(
        "I don't know whether it's part of human nature to defer to authority or if we're socialized to be this way. It's hopelessly easy to be pessimistic about humanity, but I think that largely comes down to the fact that those with power are the most vocal by social construction. The history of the West is, to my (admittedly little) knowledge, a story of a few people doing ",
      ),
      html.i([], [element.text("something ")]),
      element.text(
        "to rationalize their power as the natural order, be it through religion, eugenics, or capitalism; by presenting a single source of authority that's advantageous to themselves, they consolidate power until that status quo is inevitably challenged, at which point conflict dictates whose turn is next to be at the top of the pecking order. So if human nature is truly compassionate, how does this cycle remain unbroken?",
      ),
      html.br([attribute.style([#("margin-bottom", "0.5em")])]),
      element.text(
        "When faced with despair, you can only do so much to cope. Dissociating isn't all too productive, so eventually, some decision must be made to continue on. Rejecting the status quo requires action, which is often difficult and dangerous. Of course, collective action is safer, but when people act purely in their own interest, they aren't exactly wont to do something that draws their very existence into question. The notion of existence I refer to here is not the state of living but rather the state of perceived stability on a micro level—a life without risk of significant interruption, good or bad. As long as you can find ",
      ),
      html.i([], [element.text("something ")]),
      element.text(
        "you don't want to give up, you can justify doing nothing under the guise of protecting what little you have. After all, why risk it if you'll potentially be rewarded for staying docile, be it in this life or the next? If enough people can rationalize their own condition, good or bad, significant revolt can be suppressed, since organizing becomes much more difficult with lesser numbers.",
      ),
      html.br([attribute.style([#("margin-bottom", "0.5em")])]),
      element.text(
        "Anything can be justified through deference: if you're not the one making the final judgement—if you're just doing your best in someone else's world—you're shielded from your complicity. Having individuals as figureheads allows misgivings of the system to be attributed to a few bad actors rather than the system itself, again rationalizing its perpetuation. When a society is complicit, to act against the system is to act without thinking of the harm that could be brought to others through said action, so it's never deontologically viable to risk it.",
      ),
      html.br([attribute.style([#("margin-bottom", "0.5em")])]),
      element.text(
        "This transfer of guilt to the authority of a higher power—be it God, the natural order, or the economy—from those responsible for and benefitting from the source of said guilt is what allows an exploitative system to keep functioning. This abstraction away from humanity towards a projection of true authority directly justifies and rewards a lack of empathy. But even still, kind people can always be found. And progress can always be made, no matter how gradual.",
      ),
      html.hr([
        attribute.style([#("margin-top", "0.5em"), #("margin-bottom", "0.5em")]),
      ]),
      html.img([
        attribute.src(
          "
            https://f4.bcbits.com/img/a3087694239_10.jpg",
        ),
        attribute.style([#("max-height", "350px"), #("padding", "20px")]),
        attribute.class("center"),
      ]),
      element.text("Sufjan Steven's 2003 album "),
      html.cite([], [element.text("Michigan ")]),
      element.text("starts on a somber note with "),
      html.cite([], [element.text("Flint (For the Unemployed and Underpaid)")]),
      element.text(
        ", painting a picture of a Flint resident's embrace of emptiness. Its instrumentation is fittingly sparse, with accompaniment mostly coming from piano and heavily reverbed trumpet. The latter instrument builds with repetition of the lyric ",
      ),
      html.q([], [element.text("Even if I died alone")]),
      element.text(
        " to express resignation to and eventual proclamation of this line.",
      ),
      html.br([attribute.style([#("margin-bottom", "0.5em")])]),
      element.text("The subsequent "),
      html.cite([], [
        element.text(
          "All Good Naysayers, Speak Up! Or Forever Hold Your Peace!",
        ),
      ]),
      element.text(
        " introduces the other aspect to this recurring dialogue with the pathological appeal deficiencies in society as they are (",
      ),
      html.q([], [
        element.text(
          "Often not the state is advocation/If we forma power of recognition",
        ),
      ]),
      element.text(", "),
      html.q([], [
        element.text(
          "Entertain ideas of great communion/Shelter not materials in union",
        ),
      ]),
      element.text(
        "). It makes no call to action beyond acknowledgement, and its innocent motivation is accentuated by the exclamation in the title and the song itself's jaunty 5/4. This pseudo-naïveté continues into the reminiscence and appreciation of ",
      ),
      html.cite([], [element.text("Say Yes! to M!ch!gan!")]),
      html.br([attribute.style([#("margin-bottom", "0.5em")])]),
      element.text(
        "Facing the bleakness of reality can lead to the empty despair described in ",
      ),
      html.cite([], [element.text("Flint")]),
      element.text(" as exemplified by the end of "),
      html.cite([], [element.text("The Upper Peninsula")]),
      element.text(
        " with the panicking synth rising in prominence from the line ",
      ),
      html.q([], [
        element.text(
          "I lost my mind, I lost my life/I lost my job, I lost my wife",
        ),
      ]),
      element.text(
        " until suddenly giving way to a gentle guitar chord, as though abruptly resigning.",
      ),
      html.br([attribute.style([#("margin-bottom", "0.5em")])]),
      html.cite([], [
        element.text(
          "Oh Detroit, Lift Up Your Weary Head! (Rebuild! Restore! Reconsider!)",
        ),
      ]),
      element.text(
        " is perhaps the most direct look at reality, taking a more detached and cynical tone in observance of the ruin wrought on Detroit through the intense proliferation and stark abandonment of industry, returning to the upbeat 5/4 of ",
      ),
      html.cite([], [element.text("All Good Naysayers")]),
      element.text(" in an almost mocking contrast."),
      html.br([attribute.style([#("margin-bottom", "0.5em")])]),
      element.text("The more laid-back "),
      html.cite([], [element.text("Sleeping Bear, Sault Ste. Marie")]),
      element.text(
        " expresses not frustration but rather counsel, expressing hope for God's ",
      ),
      html.q([], [element.text("perfect design")]),
      element.text(
        " before eventually pleading with nature, reflecting on the forgotten pain of the buried Surgeon Bay and the drowned of Saint Marie. ",
      ),
      html.br([attribute.style([#("margin-bottom", "0.5em")])]),
      element.text("The proceeding "),
      html.cite([], [
        element.text(
          "They Also Mourn Who Do Not Wear Black (For the Homeless in Muskegon)",
        ),
      ]),
      element.text(
        " returns to a more hopeful place, seeing the justification for perpetual mourning and apathy and using it to instead choose to at least attempt to motivate change for the better; rather than waiting for something better in the next life, the system of the advantageous is criticized for preventing growth and societal actualization altogether in the name of their own interests (",
      ),
      html.q([], [
        element.text(
          "If the advantageous/Reprimand misgivings/We won't grow/We will not ever know",
        ),
      ]),
      element.text("). The final proclamation of "),
      html.q([], [element.text("Lift my life in healthy places!")]),
      element.text(" asserts the intent to at least do something."),
      html.br([attribute.style([#("margin-bottom", "0.5em")])]),
      html.cite([], [
        element.text(
          "Oh God Where Are You Now? (In Pickerel Lake? Pigeon? Marquette? Mackinaw?)",
        ),
      ]),
      element.text(
        " nonetheless searches again for divine comfort and judgement while the narrator questions the relationship between their own perception of righteousness and that of God's (",
      ),
      html.q([], [element.text("Oh God, hold me now")]),
      element.text(", "),
      html.q([], [
        element.text(
          "Would the righteous still remain?/Would my body stay the same?",
        ),
      ]),
      element.text(") in light of the pleading in "),
      html.cite([], [element.text("Sleeping Bear")]),
      element.text("."),
      html.br([attribute.style([#("margin-bottom", "0.5em")])]),
      element.text(" This respite is beautifully offered by "),
      html.cite([], [element.text("Vito's Ordination Song")]),
      element.text(" ("),
      html.q([], [
        element.text(
          "Rest in my arms/Sleep in my bet/There's a design/To what I did and said",
        ),
      ]),
      element.text(
        "), quelling the prior doubt by asserting that all is as ordained by universal, divine love, and serving as a cathartic epilogue of sorts to the album. Repeating this like a mantra, this expresses an internal resolution and restored faith, despite it all.",
      ),
      html.hr([
        attribute.style([#("margin-top", "0.5em"), #("margin-bottom", "0.5em")]),
      ]),
      html.img([
        attribute.src(
          "
            https://imagescdn.juno.co.uk/full/CS788496-01A-BIG.jpg",
        ),
        attribute.style([#("max-height", "350px"), #("padding", "20px")]),
        attribute.class("center"),
      ]),
      element.text("The 2004 follow-up "),
      html.cite([], [element.text("Seven Swans")]),
      element.text(" is not the canonical sequel to "),
      html.cite([], [element.text("Michigan")]),
      element.text(" (that title goes to the seminal 2005 work "),
      html.cite([], [element.text("Illinois")]),
      element.text(
        "), but its even more overt Christian themes serve as a fearful yet accepting reflection of the journey of the prior album. ",
      ),
      html.cite([], [
        element.text("All the Trees of the Field Will Clap Their Hands "),
      ]),
      element.text("kicks off in a darker place than "),
      html.cite([], [element.text("Flint")]),
      element.text("both musically and lyrically ("),
      html.q([], [element.text("If I am alive this time next year")]),
      element.text(
        ") but defers to the divine despite expressed concern over whether they are on the right side of the outcome (",
      ),
      html.q([], [
        element.text(
          "And will I be invited to the sound?/And will I be a part of what you've made?",
        ),
      ]),
      element.text(") similarly to "),
      html.cite([], [element.text("Oh God Where Are You Now?")]),
      html.br([attribute.style([#("margin-bottom", "0.5em")])]),
      element.text("In accordance with this, "),
      html.cite([], [element.text("In The Devil's Territory")]),
      element.text(
        " matter-of-factly dubs the world as having already fallen, portending the end of times as something inevitable to be anticipated (",
      ),
      html.q([], [
        element.text(
          "Be still and know your sign/The beast will arrive in time",
        ),
      ]),
      element.text(
        ") yet maintaining a placid tone, seeing this as an opportunity to meet God rather than as a threat (",
      ),
      html.q([], [
        element.text(
          "We stayed a long, long time/But I'm not afraid to die/To see you/To meet you/To see you/At last",
        ),
      ]),
      element.text(
        ") aided by the light banjo, ephemeral vocals, and whistling synths. ",
      ),
      html.br([attribute.style([#("margin-bottom", "0.5em")])]),
      element.text(
        "The subsequent few tracks exemplify the overt Christian theming with direct gratitude towards Jesus and Abraham, and ",
      ),
      html.cite([], [element.text("We Won't Need Legs To Stand")]),
      element.text(
        " looks forward to the burdenless afterlife as a final reward for the unchanging present, approaching the subject with a dark yet optimistically resolvent tone. Inversely, ",
      ),
      html.cite([], [element.text("A Good Man Is Hard To Find")]),
      element.text(
        " displays an acceptance of Hell as a result of failing to satisfactorily better oneself after costing another (",
      ),
      html.q([], [
        element.text(
          "And so I go to Hell/I wait for it but someone's left me creased",
        ),
      ]),
      element.text(
        ") in so doing casting doubt on the innocence of all complicit in the system through comparison (",
      ),
      html.q([], [element.text("Once in the backyard/She was once like me")]),
      element.text(
        "). The gravitas of this seeming contradiction is hauntingly emphasized by the detuned vocals present in the bridge.",
      ),
      html.br([attribute.style([#("margin-bottom", "0.5em")])]),
      element.text("The title track capitalizes on this by recalling "),
      html.cite([], [element.text("In The Devil's Territory")]),
      element.text(", actually showing the judgement alluded to ("),
      html.q([], [
        element.text(
          "I saw a sign in the sky/Seven horns, Seven horns, Seven horns",
        ),
      ]),
      element.text(
        "). The vocals cycle between rising hopefully and falling back down, quieting to a whisper. After reassurance of God's presence comes a grave proclamation of omnipotence that communicates universal compassion in a manner akin to a threat (",
      ),
      html.q([], [
        element.text(
          "He will take you/If you run, He will chase you/'Cause He is the Lord",
        ),
      ]),
      element.text(
        ") with a correspondingly booming piano part, Sufjan's icy falsetto sitting above the dark, swirling colours evoking fate, finally resolving peacefully.",
      ),
      html.br([attribute.style([#("margin-bottom", "0.5em")])]),
      html.cite([], [element.text("The Transfiguration")]),
      element.text(
        ", the final track, is more upbeat (with a melody eventually evoked by ",
      ),
      html.cite([], [element.text("Chicago")]),
      element.text(
        "), being told from the perspective of a truly benevolent deity tending to humanity as a parent (",
      ),
      html.q([], [
        element.text("Lost in the cloud, a voice/Lamb of God, we draw near"),
      ]),
      element.text(")."),
      html.hr([
        attribute.style([#("margin-top", "0.5em"), #("margin-bottom", "0.5em")]),
      ]),
      element.text(
        "In my eyes, these albums exemplify the relationship between hope, faith, fear, despair, and authority. Power structures serve both to pull us up and to put us back down, and it is up to us to figure out how to respond to that. In a vacuum, faith is easy to sustain, as there is no alternative. Even when other options are present, sufficient propagandization can warp reality to the point that they aren't seriously observed. This alone is enough for many; they choose to view the advancement of humanity as a result of these systems rather than an induced side effect that was produced in spite of them.",
      ),
      html.br([attribute.style([#("margin-bottom", "0.5em")])]),
      element.text(
        "Choosing to be blind to alternatives is one thing, but there's only so much that can be done to deny immediate reality. Again, those for and against the system are mutually opposed, each attributing deficiencies to the other in a stalemate that benefits the former by virtue of incumbency. Dissatisfaction with the status quo leads very quickly to dissatisfaction, which is of course untenable. If this yields despair, the status quo is unchanged; further, this despair may beget even deeper devotion out of othering and deflection. ",
      ),
      html.br([attribute.style([#("margin-bottom", "0.5em")])]),
      element.text(
        "It's always in the best interest of those in power to make themselves out to be the natural leaders. Blind acceptance is often the simplest option when it comes to complex issues made only more complex by intentional muddying of the waters due to the impossibility of a third party without some vested interest. This has always been true and will always be true for as long as there is a ruling class. But that doesn't make it okay to do nothing; from the throes of despair, the fact that getting here is possible ",
      ),
      html.i([], [element.text("despite")]),
      element.text(" its historical constancy is proof enough to recover."),
    ],
  )
}
