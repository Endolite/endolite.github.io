import lustre/attribute
import lustre/element
import lustre/element/html

pub fn meta(acc) {
  [
    #(
      "tuples",
      "How are tuples?",
      html.div([], [
        html.i([], [element.text("How")]),
        element.text(" are tuples?"),
      ]),
      view,
      "2025-03-12",
    ),
    ..acc
  ]
}

pub fn view() {
  html.div([], [
    html.p(
      [attribute.class("center"), attribute.style([#("text-align", "justify")])],
      [
        element.text(
          "Consider the humble pair, \\((x, y)\\). It's not exactly groundbreaking, but it's not immediately trivial from the ZF axioms either, since a set \\(\\{x, y\\}\\) is inherently unordered. The traditional definition of a pair is
          \\[(x, y) \\treq \\qty{\\qty{x}, \\qty{\\qty{x, y}}}\\]
      Ah, so a tuple is just a set ordered by inclusion, how simple! Surely, then,
        \\[(x_i)_{i = 1}^n = \\left\\{\\{x_i\\}_{i = 1}^j\\right\\}_{j = 1}^n\\]
      This is what I genuinely believed for an embarrassingly long time, but the trouble with this is that an ordered set is ",
        ),
        html.i([], [element.text("itself ")]),
        element.text(
          "a pair of a set and a relation, and a relation is also just a set of pairs. We just got past Russell's paradox, so we can't exactly afford any more self-reference. (I know this can be defined as a separate isomorphic entity; that's kind of the point of this, as you'll soon find out.) Tuples are instead recursively defined with nesting (in a manner resembling lists in the \\(\\lambda\\)-calculus):
        \\[\\begin{align*}
          (x, y, z) &\\treq \\bigl(x, (y, z)\\bigr) \\\\
            &= \\qty{\\qty{x}, \\qty{x, (y, z)}} \\\\
            &= \\qty{\\qty{x}, \\qty{x, \\qty{\\qty{y}, \\qty{y, z}}}}
        \\end{align*}\\]
      Okay, this isn't the prettiest thing in the world, but it certainly does work. It also implies that Cartesian exponentiation is right-associative, which is interesting. Speaking of which, Cartesian and set exponentiation differ. To see this, let us first review the set-theoretic notions of relations and functions.",
        ),
        html.br([attribute.style([#("margin-bottom", "0.5em")])]),
        element.text("A "),
        html.b([], [element.text("relation ")]),
        element.text(
          "with domain \\(X\\) and codomain \\(Y\\) is some
        \\[R \\subseteq X \\times Y \\triangleq \\{(x, y) \\mid x \\in X, y \\in Y\\}\\]
      \\(x \\in X\\) is related \\(y \\in Y\\) by \\(R\\) when \\((x, y) \\in R\\). A",
        ),
        html.b([], [element.text(" function ")]),
        element.text(
          "is simply a relation such that each \\(x \\in X\\) is related to exactly one \\(y \\in Y\\) (passing the vertical-line test, so to speak). A
       ",
        ),
        html.b([], [element.text("choice function ")]),
        element.text(
          "on an indexed family of sets \\(\\{X_y\\}_{y \\in Y}\\) is a function \\(f: Y \\to \\bigcup_{y \\in Y} X_y\\) such that each \\(y \\in Y\\) maps to an element of \\(X_y\\); that is, a choice function is a way to ",
        ),
        html.i([], [element.text("choose ")]),
        element.text("an element from a given index. The "),
        html.b([], [element.text("product ")]),
        element.text(
          "over the collection is the set of all such choice functions. When each \\(X_y\\) is the same, this can be regarded as the \\(Y\\)-fold product of \\(X\\), or \\(X^Y\\). This is a simply collection of functions \\(f: Y \\to X\\) such that for each \\(y \\in Y\\), \\(f(y) \\in X\\), which happens to characterize functions \\(f: Y \\to X\\). A crucial consideration to make is that natural numbers are themselves sets (as Von Neumann ordinals), defined recursively with \\(0 \\triangleq \\varnothing\\) and \\(n + 1 \\triangleq n \\cup \\{n\\}\\). In general, \\(n = \\{i\\}_{i = 0}^{n - 1}\\), so an element of \\(X^n\\) is a function that takes a natural number less than \\(n\\) and maps it to an element of \\(X\\). (This can be thought of as a 0-index list.) Expanding definitions, this yields
        \\[X^2 = \\{f \\in \\mathcal{P}(2 \\times X) \\mid \\forall n \\in 2, \\exists! x \\in X, (n, x) \\in f\\}\\]
      An element of \\(X^2\\) is a function \\(f: 2 \\to X\\) of the form \\(\\{(0, x_0), (1, x_1)\\}\\), which is decidedly not a pair \\((x_0, x_1)\\). This is analogous to a sequence, though, as an element of \\(X^\\mathbb{N}\\). This should be clear from the definition alone, since \\(\\mathbb{N}\\) can be regarded as the limit of \\(n\\) as you keep adding 1, being the union of ",
        ),
        html.i([], [element.text("all ")]),
        element.text("natural numbers as opposed to just the first \\(n\\). "),
        html.i([], [
          element.text(
            "(If only there were a convenient term for this exact thing.) ",
          ),
        ]),
        element.text(
          "The definition of exponentiation as a set of finite sequences rather than tuples means that \\(X^n \\subseteq X^*\\), where \\(*\\) is the ",
        ),
        html.b([], [element.text("Kleene star operator, ")]),
        element.text(
          "with \\(X^*\\) defined as the set of finite sequences (strings) with elements (characters) in \\(X\\) (the alphabet). ",
        ),
        html.br([attribute.style([#("margin-bottom", "0.5em")])]),
        element.text("Maybe we don't even need functions, though. A "),
        html.b([], [element.text("strict order relation ")]),
        element.text(
          " on \\(X\\) is a binary relation \\({<} \\subseteq X \\times X\\) such that for \\(x, y, z \\in X\\),",
        ),
        html.ol(
          [
            attribute.style([
              #("list-style", "decimal"),
              #("list-style-position", "inside"),
              #("margin-left", "1em"),
            ]),
          ],
          [
            html.li([], [
              element.text("exactly one of \\(x < y\\) or \\(y < x\\) is true,"),
            ]),
            html.li([], [element.text("\\(x \\not< x\\), and")]),
            html.li([], [
              element.text(
                "\\(x < y\\) and \\(y < z\\) implies that \\(x < z\\).",
              ),
            ]),
          ],
        ),
        element.text("Pairing \\(X\\) with such an ordering \\(<\\) yields a "),
        html.b([], [element.text("strictly ordered set ")]),
        element.text(
          "\\((X, {<})\\). Not only does this pair require a preexisting definition of a tuple, but so too does the relation, as established above, so while this is perhaps the most straightforward, axiomatic way to define ordering, it cannot be the most foundational one.",
        ),
        html.br([]),
        element.text(
          "My supposed definition of an \\(n\\)-tuple can be derived from this by letting \\({<} = {\\subseteq}\\) and denoting each set by its first element not in any smaller set (with a choice function!).",
        ),
        html.br([attribute.style([#("margin-bottom", "0.5em")])]),
        element.text(
          "It's trivial to see that all of these definitions are equivalent for most purposes, so this amounts to pedantry; while abuse of notation can certainly be an issue in mathematics, it's good to know when to draw the line. I'm no set theorist, so I think I'll leave it at that.",
        ),
      ],
    ),
  ])
}
