import lustre/attribute
import lustre/element
import lustre/element/html

import styling

pub fn meta(acc) {
  [
    #(
      "small_phone",
      "Small phone big transit where ( •̯́ ^ •̯̀)",
      element.text("Small phone big transit where ( •̯́ ^ •̯̀)"),
      view,
      "2025-03-19",
    ),
    ..acc
  ]
}

pub fn view() {
  html.p(
    [attribute.class("center"), attribute.style([#("text-align", "justify")])],
    [
      element.text(
        "The Pebble watch has always been really interesting to me. I don't want very much from a smartwatch, and an e-paper display seemed perfect, as did the customizability. Unfortunately, Pebble was eaten by Fitbit, which was in turn absorbed by Google, where technologies go to die. After much harassment, the valiant ",
      ),
      styling.href_text("https://ericmigi.com/", "Eric Migicovsky"),
      element.text(
        " got Google to open-source the unused technology, renewing hope for the enthusiast fans that have been holding on for 8 long years through continued support and a ",
      ),
      styling.href_text("https://repebble.com/", "revival"),
      element.text(
        ". Of course, Apple being Apple has fortified their walled garden to severely limit any non-Apple Watch smartwatches (though luckily ",
      ),
      styling.href_text(
        "https://www.theverge.com/news/632718/europe-digital-markets-act-apple-interoperability-smartwatches",
        "the EU is finally getting on that",
      ),
      element.text(")."),
      html.br([attribute.style([#("margin-bottom", "0.5em")])]),
      element.text(
        "Seeing Apple's malevolence for the umpteenth time, I reflected again on why I switched back to iOS to begin with. I don't think I had much of a reason apart from wanting to see what iOS was like on a phone after so long (and the fact that my Android broke ( ͡° ʖ̯ ͡°)). I miss being excited by hardware technology, growing up with the rapid improvement of the first half of the 2010s. It seems like very little has changed in the world of consumer technology since around 2017. Sure, things get faster, but to what end? I think the layman was satisfied long ago, and even I've been disinterested for a while apart from foldables and Apple silicon. ",
      ),
      html.br([attribute.style([#("margin-bottom", "0.5em")])]),
      element.text(
        "I hate that companies chase market trends and profitability above all else. The ",
      ),
      styling.href_text(
        "https://www.youtube.com/watch?v=FJgTKx-rg18",
        "enthusiast trap",
      ),
      element.text(
        " saddens me to no end, luring in consumers in a simple bid for market share before being able to pivot into a more competitive but larger category. A niche that is apparently not popular enough is that of the one-handable device, considering Apple and Asus' discontinuation of their (relatively) compact lines in 2022 and 2024 respectively. Seeing this, our aforementioned hero made a ",
      ),
      styling.href_text("https://smallandroidphone.com/", "petition"),
      element.text(
        " to tell manufacturers not to disregard us, but alas, this has borne no fruit thus far. ",
      ),
      html.br([attribute.style([#("margin-bottom", "0.5em")])]),
      element.text(
        "To me, this is a microcosm of the tyranny of the majority inherent to capitalism. Demand does not mean demand, as it measures not only how large a group wants something but also how much they are willing to pay for it, and how often. Anecdotally speaking, people with small phones tend not to upgrade very often (though this may just be a byproduct of how slim their options are), and since the screen size is smaller, a compactified sku is typically sold at a lower price and with smaller margins (even if only marginally so). So when the majority are satisfied with something that everyone needs, what's the issue with forcing the minority to conform? After all, what else can they do?",
      ),
      html.br([attribute.style([#("margin-bottom", "0.5em")])]),
      element.text(
        "Another confounding factor is, of course, government interest. While this doesn't much apply here, I'm also passionate about transit: I despise the ",
      ),
      styling.href_text(
        "https://medium.com/radical-urbanist/cars-gets-billions-in-hidden-subsidies-b3bf9e6bfafc",
        "subsidies",
      ),
      element.text(" and "),
      styling.href_text(
        "https://home.treasury.gov/data/troubled-assets-relief-program/automotive-programs/overview",
        "bailouts",
      ),
      element.text(" and "),
      styling.href_text(
        "https://www.urban.org/policy-centers/cross-center-initiatives/state-and-local-finance-initiative/state-and-local-backgrounders/highway-and-road-expenditures",
        "public works",
      ),
      element.text(
        " that all contribute to terrible infrastructure that harms communities and the world as a whole while creating a privatized, exorbitantly expensive commodity that's for all intents and purposes required to function within society. What's even more infuriating is the fact that North America was ",
      ),
      html.i([], [element.text("built ")]),
      element.text(
        "along railroads that the government chose to rip out, along with other forms of transit, just to artificially spur an enormous industry that they could proceed to propagandize until it sickeningly became a point of ",
      ),
      html.i([], [element.text("pride.")]),
      element.text(
        " The closest historical analog I can think of is the Opium Wars, but this was done ",
      ),
      html.i([], [element.text("domestically for profit and control")]),
      element.text(" and got the targets hooked to the point that "),
      html.i([], [element.text("they don't even notice")]),
      element.text(" and now serve as agents of the status quo."),
      html.br([attribute.style([#("margin-bottom", "0.5em")])]),
      element.text("While small phones perhaps wouldn't "),
      styling.href_text(
        "https://www.motortrend.com/features/why-americas-roads-keep-getting-deadlier-safety-research/",
        "save as many lives as small cars",
      ),
      element.text(
        ", both are much-needed remedies for industries that are so far removed from providing any actual utility to consumers that they now actively harm lives while charging a premium to both individuals and society; a common argument in favour of smaller phones is that they reduce screentime, which I believe is unilaterally good (at least holistically). (I don't need to make the comparison between smartphones and opium myself, do I?)",
      ),
      html.br([attribute.style([#("margin-bottom", "0.5em")])]),
      element.text(
        "On a hopeful (perhaps delusionally so) note, Nothing's expected CMF Phone 2 recently leaked, and sources are saying (with no actual evidence apart from dubious eyeballing) that it has a 5.2–5.5\" display, placing it firmly in iPhone mini territory. Even in this cruel, cruel world, there is hope after all! (At least until this is deconfirmed.)",
      ),
    ],
  )
}
