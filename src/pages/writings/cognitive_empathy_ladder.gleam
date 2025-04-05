import lustre/attribute
import lustre/element
import lustre/element/html

import styling

pub fn meta(acc) {
  [
    #(
      "cognitive_empathy_ladder",
      "Cognitive Empathy and the Ladder",
      element.text("Cognitive Empathy and the Ladder"),
      view,
      "2025-04-04",
    ),
    ..acc
  ]
}

fn view() {
  html.p(
    [attribute.class("center"), attribute.style([#("text-align", "justify")])],
    [
      element.text(
        "I'm really grateful for where I am and the decisions and dumb luck that got me here. I'm very well-off in every regard apart from being a white noncitizen. I've spent nearly my entire life in North America, though, and in part due to wanting to feel like an American, I have little to no connection to my heritage. My perception is entirely coloured by the relatives and friends I see when returning home and my parents' history. ",
      ),
      styling.br("0.5em"),
      element.text(
        "My father was remarkably unambitious, studying just enough to get to the next step (if that). He wanted to be a computer scientist, but his English mark was too low, so he settled for medicine; he wanted to be a physician but ended up settling for anaesthesiology due to competition. He made a few incredibly lucky decisions without thinking too much about it, and we somehow ended up here. This isn't just luck, obviously. He's an incredibly single-mindedly hard worker, enabled by his genuine enjoyment of his field. We got to be well-off by the time I was about 10, but before that we struggled a fair bit. (This struggling is still relative, though.)",
      ),
      styling.br("0.5em"),
      element.text(
        "From what he says, his work ethic was forged by the fierce environment of India, where this is the norm. Intense capitalism and population density mean that you need to do so much more to stand out. Part of what this entails is being cutthroat with others. The people able to leave India, especially to the U.S., are the most affluent to begin with. Sure, that doesn't necessarily translate to comparable proportional wealth, but wealth and conservatism evidently correlate: those with wealth are wont to hoard it. This, in tandem with the ruthless competition of the visa process itself means that first-generation Indian immigrants are generally very, very conservative. Under capitalism, cognitive empathy is a boon while emotional empathy is a liability. Knowing there are countless others with the same goal of emigrating, naturalized first-generation immigrants want to keep others out. They don't dislike the system, they just have a delusion of their place in it. They then proceed to act surprised when it turns out that the fascist nationalists also happen to be racists. ",
      ),
      styling.br("0.5em"),
      element.text(
        "Speaking anectotally, the of the naturalized Indian immigrants I know voted for Trump, which is especially disheartening living in a swing state. This isn't a phenomenon at all unique to Indians, of course; most of the naturalized immigrants I know in general voted for Trump. By the time you realize you're not part of the in-group, it's already too late. This applied even to American-born whites that pretend they aren't just a number to someone higher up. ",
      ),
      styling.br("0.5em"),
      element.text(
        "On a perhaps more individual scale, class also has a clear impact on one's relation to wealth. While it's true that ",
      ),
      styling.href_text(
        link: "https://www.stlouisfed.org/publications/page-one-economics/2017/01/03/education-income-and-wealth",
        text: "wealth and education correlate",
      ),
      element.text(", as do "),
      styling.href_text(
        link: "https://www.pewresearch.org/politics/2024/04/09/partisanship-by-race-ethnicity-and-education/",
        text: "education and progressiveness",
      ),
      element.text(
        ", the composed correlation manifests in detached if perhaps well-meaning ways. (Performative progressivism is certainly a far better outcome than explicit evil, so long as it begets non-performative change.) Within a certain window of the upper-middle class that I've spent a fair amount of time around, though, money becomes an afterthought. Especially coming from somewhat humbler origins, the option to not have to think so much about money is itself the luxury. The mega-rich are of course driven by pure greed and seek infinite growth, but the upper-middle class ends up finding apathy not through nihilism but rather through complacency.",
      ),
      styling.br("0.5em"),
      element.text(
        "I'm used to being stingy while still being wont to please others, which isn't a great combination, since it amounts to overstepping my own boundaries and then being sad about it later ∪･ω･∪. I do still generally expect people to compensate me in some way at some point, usually through treating me to something at another time, but I'm not frugal to the point of keeping a balance. I don't really think this is a ",
      ),
      styling.i("good "),
      element.text(
        "habit, but it's somewhat okay for the time being, since the things I interact with on a regular basis are relatively inconsequential. I don't know whether I think about money more or less than I should, but I don't enjoy it either way, neither do most people apart from psychopaths, bargain-hunters, and numismatists. "
      ),
      styling.br("0.5em"),
      element.text(
        "It is always a bit sobering (mayhap even sonderous) to see someone in a vastly different class than you're used to interacting with; the human capacity for annoyance and complacency is seemingly tied very closely with how well one's immediate needs are met. I don't think there's a sweet spot per se, but I think that the fact that this is something anyone has to think about in the first place is stupid when we have enough resources for a global baseline far higher than it is now. The lack of such a baseline is perhaps what motivates the stark performative differences in wealth I've seen some of, from lower-middle- anxious conformity to upper-middle- progressivism to upper-class conservatism. Those that ascend the ladder in particular are very prone to wanting to pull it up behind them, since emotional empathy is something only afforded by those rich enough to have their needs met without being so rich that their self-worth comes from a number more valuable to them than life itself. "
      ),
      styling.br("0.5em"),
      element.text(
        "Sympathy is further obfuscated by the sheer abstraction of human lives in a global economy built on exploitation. In such an interconnected web, it's a given that any good or service involved significant harm to a living thing somewhere along its path to you, be it directly, indirectly, or even yet unrealized but inevitable (i.e., carbon footprint). This pincer of nihilism and obfuscation makes it so that whether or not you want to care, you won't soon enough. After all, heightened emotions with no viable action are rather exhausting, especially in a system that constantly reminds you quantifiably of how little influence you have relative to the richest men in the world."
      ),
      styling.br("0.5em"),
      element.text(
        "There's still a line between ignorance and nihilism, though. For a while, I was ignorant enough for the former, but enough prodding led me inevitably to intense loathing of the status quo: I've been left in a state of annoyance that I have no meaningful way of expressing productively (without risk of being deported, I suppose). (I'm assuming that the government doesn't care enough to read this in the month I have left in the country since it isn't on any social media platform, but God knows there's no telling what they'll do.) Divorcing oneself from the big picture is perhaps the objectively best route in a vulnerable position, but I don't want to lose my emotional empathy—I don't want to let it simmer long enough that it goes flat and dies down by the time I'm in a position to actually do anything even as insignificant as voting. I think that forcing myself to disengage leads me nowhere quickly, though, maybe because I have very little ambition for my own personal life (outside of living somewhere with good transit ꒰๑•̥﹏•̥๑꒱) but quite a lot of passion for the big picture (such as the proliferation of transit ( ͜。 ͡ʖ ͜。)). Instead, I meaninglessly synthesize the terrible, nebulous now into coherent information for my future decisions. The one thing that does significantly affect me is immigration policy and racism, so I have a bonus incentive now too!"
      )
    ],
  )
}
