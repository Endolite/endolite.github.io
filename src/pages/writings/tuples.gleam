import lustre/attribute
import lustre/element
import lustre/element/html

pub fn view() {
  html.div([attribute.style([#("text-align", "justify")])], [
    element.text(
      "
        Consider the humble pair, \\((x, y)\\). It's not exactly groundbreaking, but it's not immediately evident from the ZF axioms either, since a set \\(\\{x, y\\}\\) is inherently unordered. The traditional definition of a pair is
          \\[(x, y) \\triangleq \\{\\{x\\}, \\{\\{x, y\\}\\}\\]
        Ah, so a tuple is just a set ordered by inclusion, how simple! Surely, then,
          \\[(x_i)_{i = 1}^n = \\left\\{\\{x_i\\}_{i = 1}^j \\ \\middle|\\ j \\in \\{1, \\ldots, n\\}\\right\\}\\]
        This is what I genuinely believed for an embarassingly long time, but the trouble with this is that an ordered set is \\(\\it{itself}\\) a pair of a set and a relation, and a relation is also just a set of pairs. We just got past Russell's paradox, so we can't exactly afford any more self-reference. (I know this can be defined as a separate isomorhic entity; that's kind of the point of this as you'll soon find out.) Tuples are instead recursively defined with nesting (in a manner resembling lists in the \\(\\lambda\\)-calculus):
          \\[\\begin{align*}
            (x, y, z) &\\triangleq \\bigl(x, (y, z)\\bigr) \\\\
              &:= \\{\\{x\\}, \\{x, (y, z)\\}\\} \\\\
              &:= \\{\\{x\\}, \\{x, \\{\\{y\\}, \\{y, z\\}\\}\\}\\}
          \\end{align*}\\]
        Okay, this isn't the prettiest thing in the world, but it certainly does work. It also implies that cartesian exponentiation is right-associative, which is interesting.
      ",
    ),
  ])
}
