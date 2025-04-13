import lustre/attribute
import lustre/element
import lustre/element/html

import styling

pub fn meta(acc) {
  [
    #(
      "on_epistemology",
      "On Epistemology",
      element.text("On Epistemology"),
      view,
      "2025-03-26",
    ),
    ..acc
  ]
}

fn view() {
  html.p(
    [attribute.class("center"), attribute.style([#("text-align", "justify")])],
    [
      element.text(
        "A statement within a given model can be evaluated as true, false, unprovable, undisprovable, or independent (e.g. the ",
      ),
      styling.href_text(
        "https://plato.stanford.edu/entries/continuum-hypothesis/",
        "Continuum Hypothesis",
      ),
      element.text(
        "), but these proofs are often incredibly tedious from the axioms. In the language \\(\\L\\) of predicate logic, strings are comprised of ",
      ),
      html.ul(
        [
          attribute.style([
            #("list-style", "circle"),
            #("list-style-position", "outside"),
            #("margin-left", "1em"),
          ]),
        ],
        [
          html.li([], [
            element.text(
              "connectives \\(\\lnot\\), \\(\\land\\), \\(\\lor\\), \\(\\smp\\), and \\(\\sff\\);",
            ),
          ]),
          html.li([], [
            element.text(
              "free variable symbols \\(u\\), \\(v\\), \\(w\\), \\(u_1\\),…;",
            ),
          ]),
          html.li([], [
            element.text(
              "bound variable symbols \\(x\\), \\(y\\), \\(z\\), \\(x_1\\),…;",
            ),
          ]),
          html.li([], [
            element.text("quantifiers \\(\\forall\\) and \\(\\exists\\);"),
          ]),
          html.li([], [
            element.text("punctuation symbols "),
            html.q([], [element.text("(")]),
            element.text(", "),
            html.q([], [element.text(")")]),
            element.text(", and "),
            html.q([], [element.text(",")]),
            element.text(";"),
          ]),
          html.li([], [
            element.text(
              "constant symbols \\(a\\), \\(b\\), \\(c\\), \\(a_1\\),…;",
            ),
          ]),
          html.li([], [
            element.text(
              "relation symbols \\(F\\), \\(G\\), \\(H\\), \\(P\\), \\(F_1\\),…;",
            ),
          ]),
          html.li([], [
            element.text(
              "function symbols \\(f\\), \\(g\\), \\(h\\), \\(f_1\\),…; and",
            ),
          ]),
          html.li([], [
            element.text(
              "an (optional) equality binary relation \\(\\approx\\).",
            ),
          ]),
        ],
      ),
      element.text("The syntax of \\(\\L\\) is given in "),
      styling.href_text(
        "https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form",
        "EBNF",
      ),
      element.text("  as follows:"),
      html.div([attribute.class("equation")], [
        element.text(
          "\\[\\begin{align*}
          \\evit{BinCon} &::= {\\land} \\mid {\\lor} \\mid {\\smp} \\mid {\\sff} \\\\
          \\evit{FreeVar} &::= u \\mid v \\mid w \\mid u_1 \\mid \\cdots \\\\
          \\evit{BoundVar} &::= x \\mid y \\mid z \\mid x_1 \\mid \\cdots \\\\
          \\evit{Quant} &::= {\\forall} \\mid {\\exists} \\\\
          \\evit{Const} &::= a \\mid b \\mid c \\mid a_1 \\mid \\cdots \\\\
          \\evit{Rel} &::= F \\mid G \\mid H \\mid P \\mid F_1 \\mid \\cdots \\\\
          \\evit{Func} &::= f \\mid g \\mid h \\mid f_1 \\mid \\cdots \\\\
          \\evit{Term} &::= \\evit{Const} \\mid \\evit{FreeVar} \\tag{Term} \\\\
            &\\qquad\\mid \\evit{Func}, \\t{‘‘(''}, [\\evit{Term}], \\qty{\\t{‘‘,''}, \\evit{Term}}, \\t{‘‘)''} \\\\
          \\evit{Atom} &::= \\evit{Rel}, \\t{‘‘(''}, \\evit{Term}, \\t{‘‘)''} \\tag{Atom} \\\\
            &\\qquad\\mid \\t{‘‘(''}, \\evit{Term}, \\t{‘‘\\(\\approx\\)''}, \\evit{Term}, \\t{‘‘)''} \\\\
          \\evit{Form} &::= \\evit{Atom} \\mid \\t{‘‘(''}, \\t{‘‘\\(\\lnot\\)''},  \\evit{Atom}, \\t{‘‘)''} \\tag{Formula} \\\\
            &\\qquad\\mid \\t{‘‘(''}, \\evit{Atom}, \\evit{BinCon}, \\evit{Atom}, \\t{‘‘)''} \\\\
            &\\qquad\\mid \\evit{Quant}, \\evit{BoundVar}, \\evit{Form}
        \\end{align*}\\]",
        ),
      ]),
      element.text(
        "This allows formulas to be made but does not give them any meaning, as no valuation has been defined. Even without evaluation, though, the validity of statements should be justifiable from rules of the system alone; \\(a \\sff a\\) should always evaluate to true, for example. With this as motivation, rules of formal deduction can be defined. To this end, let \\(\\Sigma\\) denote a set of formulas.",
      ),
      html.div(
        [
          attribute.class("border"),
          attribute.style([
            #("padding", "1em"),
            #("margin-top", "0.5em"),
            #("margin-bottom", "0.5em"),
          ]),
        ],
        [
          element.text("A formula should trivially prove itself:"),
          styling.equation(
            "
              \\[\\begin{prooftree}
                \\AXC{}
                \\LeftLabel{Reflexivity} \\RightLabel{ (Ref)} \\UIC{\\(A \\vdash A\\)}
              \\end{prooftree}\\]
          ",
          ),
          element.text(
            "Adding premises to an argument should not affect its conclusion:",
          ),
          styling.equation(
            "
            \\[\\begin{prooftree}
                \\AXC{\\(\\Sigma \\vdash A\\)}
                \\LeftLabel{Addition of premises} \\RightLabel{ (+)} \\UIC{\\(\\Sigma \\cup \\Sigma' \\vdash A\\)}
            \\end{prooftree}\\]
          ",
          ),
          element.text(
            "If a set of premises along with the negation of an additional formula \\(A\\) is able to prove another formula \\(B\\) along with its negation, then the premises are inconsistent with \\(\\lnot A\\), so the premises must prove \\(A\\):",
          ),
          styling.equation(
            "
            \\[\\begin{prooftree}
              \\AXC{\\(\\Sigma \\cup \\qty{\\lnot A} \\vdash B\\)} \\AXC{\\(\\Sigma \\cup \\qty{\\lnot A} \\vdash \\lnot B\\)} \\
              \\LeftLabel{\\(\\lnot\\) elimination} \\RightLabel{ \\(({\\lnot}{-})\\)} \\BIC{\\(\\Sigma \\vdash A\\)}
            \\end{prooftree}\\]
          ",
          ),
          element.text(
            "If a set of premises proves that \\(A\\) implies \\(B\\) as well as \\(A\\) itself, then it must also prove \\(B\\):",
          ),
          styling.equation(
            "
            \\[\\begin{prooftree}
              \\AXC{\\(\\Sigma \\vdash A \\smp B\\)} \\AXC{\\(\\Sigma \\vdash A\\)} \\\\
              \\LeftLabel{\\(\\smp\\) elimination} \\RightLabel{ \\(({\\smp}{-})\\)} \\BIC{\\(\\Sigma \\vdash B\\)}
            \\end{prooftree}\\]
          ",
          ),
          element.text(
            "Similarly, if a set of premises proves a statement \\(B\\), then removing some element \\(A\\) from the premises should yield a new set proving that \\(A \\smp B\\):",
          ),
          styling.equation(
            "
            \\[\\begin{prooftree}
              \\AXC{\\(\\Sigma \\cup \\qty{A} \\smp B\\)} \\\\
              \\LeftLabel{\\(\\smp\\) introduction} \\RightLabel{ \\(({\\smp}{+})\\)} \\UIC{\\(\\Sigma \\vdash A \\smp B\\)}
            \\end{prooftree}\\]
          ",
          ),
          element.text(
            "Proving the validity of multiple statements should prove each individually:",
          ),
          styling.equation(
            "
          \\[\\begin{prooftree}
            \\AXC{\\(\\Sigma \\vdash A \\land B\\)} \\\\
            \\LeftLabel{\\(\\land\\) elimination} \\RightLabel{ \\(({\\land}{-})\\)} \\UIC{\\(\\Sigma \\vdash A \\qquad \\Sigma \\vdash B\\)}
          \\end{prooftree}\\]
          ",
          ),
          element.text("The converse should also hold:"),
          styling.equation(
            "
            \\[\\begin{prooftree}
              \\AXC{\\(\\Sigma \\vdash A\\)} \\AXC{\\(\\Sigma \\vdash B\\)} \\\\
              \\LeftLabel{\\(\\land\\) introduction} \\RightLabel{ \\(({\\land}{+})\\)} \\BIC{\\(\\Sigma \\vdash A \\land B\\)}
            \\end{prooftree}\\]
          ",
          ),
          element.text(
            "
            If adding either \\(A\\) or \\(B\\) as a premise suffices, then adding \\(A \\lor B\\) should as well:
          ",
          ),
          styling.equation(
            "
            \\[\\begin{prooftree}
              \\AXC{\\(\\Sigma \\cup \\qty{A} \\vdash C\\)} \\AXC{\\(\\Sigma \\cup \\qty{B} \\vdash C\\)} \\\\
              \\LeftLabel{\\(\\lor\\) elimination} \\RightLabel{ \\(({\\lor}{-})\\)} \\BIC{\\(\\Sigma \\cup \\qty{A \\lor B} \\vdash C\\)}
            \\end{prooftree}\\]
          ",
          ),
          element.text(
            "Proving \\(A\\) should also prove \\(A \\lor B\\), and \\(\\lor\\) should be commutative:",
          ),
          styling.equation(
            "
            \\[\\begin{prooftree}
                \\AXC{\\(\\Sigma \\vdash A\\)}
                \\LeftLabel{\\(\\lor\\) introduction} \\RightLabel{ \\(({\\lor}{+})\\)} \\UIC{\\(\\Sigma \\vdash A \\lor B \\qquad \\Sigma \\vdash B \\lor B\\)}
            \\end{prooftree}\\]
          ",
          ),
          element.text(
            "
            A proof of \\(A \\sff B\\) should prove \\(A\\) if and only if it proves \\(B\\):
          ",
          ),
          styling.equation(
            "
            \\[
              \\begin{prooftree}
                \\AXC{\\(\\Sigma \\vdash A \\sff B\\)} \\AXC{\\(\\Sigma \\vdash A\\)} \\
                \\LeftLabel{\\(\\sff\\) elimination} \\BIC{\\(\\Sigma \\vdash B\\)}
              \\end{prooftree} \\quad \\begin{prooftree}
                \\AXC{\\(\\Sigma \\vdash A \\sff B\\)} \\AXC{\\(\\Sigma \\vdash B\\)} \\
                \\RightLabel{ \\(({\\sff}{-})\\)} \\BIC{\\(\\Sigma \\vdash A\\)}
              \\end{prooftree}
            \\]
          ",
          ),
          element.text("If adding \\(A\\) as a premise proves \\(B\\) and "),
          styling.i("vice versa, "),
          element.text("the premises prove \\(A \\sff B\\):"),
          styling.equation(
            "
            \\[\\begin{prooftree}
                \\AXC{\\(\\Sigma \\cup \\qty{A} \\vdash B\\)} \\AXC{\\(\\Sigma \\cup \\qty{B} \\vdash A\\)}
                \\LeftLabel{\\(\\sff\\) introduction} \\RightLabel{ \\(({\\sff}{+})\\)} \\BIC{\\(\\Sigma \\vdash A \\sff B\\)}
            \\end{prooftree}\\]
          ",
          ),
        ],
      ),
      element.text(
        "From these, new rules can be derived. For example, a set of premises should prove all of its elements:",
      ),
      styling.equation(
        "
        \\[\\begin{prooftree}
           \\AXC{\\(A \\in \\Sigma\\)} \\UIC{\\(\\Sigma \\cup \\qty{A} = \\Sigma\\)}
           \\AXC{(Ref)} \\UIC{\\(A \\vdash A\\)} \\AXC{(+)}
           \\BIC{\\(\\Sigma \\cup \\qty{A} \\vdash A\\)}
          \\LeftLabel{Membership rule } \\RightLabel{ \\((\\in)\\)} \\BIC{\\(\\Sigma \\vdash A\\)}
        \\end{prooftree}\\]
      ",
      ),
      element.text(
        "
        Proofs quickly grow tediously long, though; consider a proof that \\(\\qty{A \\sff B} \\vdash (A \\smp B) \\land (B \\smp A)\\):",
      ),
      styling.equation(
        "
        \\[\\begin{alignat}{3}
          (1) &&\\qquad \\qty{A \\sff B, A} &\\vdash A \\sff B \\qquad&& (\\in) \\\\
          (2) &&\\qquad &\\vdash A \\qquad&&(\\in) \\\\
          (3) &&\\qquad &\\vdash B \\qquad&& (1), (2), ({\\sff}{-}) \\\\
          (4) &&\\qquad \\qty{A \\sff B} &\\vdash A \\smp B \\qquad&& (3), ({\\smp}{+}) \\\\
          (5) &&\\qquad \\qty{A \\sff B, B} &\\vdash A \\sff B \\qquad&& (\\in) \\\\
          (6) &&\\qquad &\\vdash B \\qquad&&(\\in) \\\\
          (7) &&\\qquad &\\vdash A \\qquad&& (5), (6), ({\\sff}{-}) \\\\
          (8) &&\\qquad \\qty{A \\sff B} &\\vdash A \\smp B \\qquad&& (7), ({\\smp}{+}) \\\\
          (9) &&\\qquad \\qty{A \\sff B} &\\vdash (A \\smp B) \\land (B \\smp A) \\qquad&& (4), (8), ({\\land}{+})
        \\end{alignat}\\]
      ",
      ),
      element.text(
        "The rules given thus far only suffice for propositional logic, so let's add a few more!",
      ),
      html.div(
        [
          attribute.class("border"),
          attribute.style([
            #("padding", "1em"),
            #("margin-top", "0.5em"),
            #("margin-bottom", "0.5em"),
          ]),
        ],
        [
          element.text(
            "Proving that something holds for all \\(x\\) proves that it holds for any arbitrary term \\(t\\) ",
          ),
          styling.i("a fortiori: "),
          styling.equation(
            "
            \\[\\begin{prooftree}
              \\AXC{\\(\\Sigma \\vdash \\forall x A(x)\\)}
              \\LeftLabel{\\(\\forall\\) elimination} \\RightLabel{ \\(({\\forall}{-}\\))} \\UIC{\\(\\Sigma \\vdash A(t)\\)}
            \\end{prooftree}\\]
          ",
          ),
          element.text(
            "Conversely, proving that something holds for some \\(u\\) that has no assumptions imposed upon it proves that it holds for all \\(x\\):",
          ),
          styling.equation(
            "
            \\[\\begin{prooftree}
              \\AXC{\\(\\Sigma \\vdash A(u)\\)} \\AXC{\\(u\\) not occurring in \\(\\Sigma\\)}
              \\LeftLabel{\\(\\forall\\) introduction} \\RightLabel{ \\(({\\forall}{+})\\)} \\BIC{\\(\\Sigma \\vdash \\forall x A(x)\\)}
            \\end{prooftree}\\]
          ",
          ),
          element.text(
            "When \\(u\\) is completely arbitrary, then assuming \\(A(u)\\) is the same as assuming that \\(A(x)\\) holds for some \\(x\\):",
          ),
          styling.equation(
            "
            \\[\\begin{prooftree}
              \\AXC{\\(\\Sigma \\cup \\qty{A(u)} \\vdash B\\)} \\AXC{\\(u\\) not occurring in \\(\\Sigma\\) or \\(B\\)}
              \\LeftLabel{\\(\\exists\\) elimination} \\RightLabel{ \\(({\\exists}{-}\\))} \\BIC{\\(\\Sigma \\cup \\qty{\\exists x A(x)} \\vdash B\\)}
            \\end{prooftree}\\]
          ",
          ),
          element.text("Proving that a statement holds for any \\(t\\) proves"),
          styling.i("a fortiori "),
          element.text("that it holds for some \\(x\\):"),
          styling.equation(
            "
            \\[\\begin{prooftree}
              \\AXC{\\(\\Sigma \\vdash A(t)\\)}
              \\LeftLabel{\\(\\exists\\) introduction} \\RightLabel{ \\(({\\exists}{+})\\)} \\UIC{\\(\\Sigma \\vdash \\exists x A(x)\\)}
            \\end{prooftree}\\]
          ",
          ),
          element.text(
            "If \\(t_1 \\approx t_2\\), then \\(A(t_1)\\) implies \\(A(t_2)\\) (where not all occurrences of \\(t_1\\) need be replaced):",
          ),
          styling.equation(
            "
            \\[\\begin{prooftree}
              \\AXC{\\(\\Sigma \\vdash A(t)\\)} \\AXC{\\(t_1 \\approx t_2\\)}
              \\LeftLabel{\\(\\approx\\) elimination} \\RightLabel{ \\(({\\approx}{-})\\)} \\BIC{\\(\\Sigma \\vdash A(t_2)\\)}
            \\end{prooftree}\\]
          ",
          ),
          element.text("Equivalence is reflexive:"),
          styling.equation(
            "
            \\[\\begin{prooftree}
              \\AXC{}
              \\LeftLabel{\\(\\approx\\) introduction} \\RightLabel{ \\(({\\approx}{+})\\)} \\UIC{\\(\\varnothing \\vdash u \\approx u\\)}
            \\end{prooftree}\\]
          ",
          ),
        ],
      ),
      element.text(
        "This is now exactly sufficient for describing first-order logic semantically through a single (meta-)relation! (There are simpler ways to do this, like ",
      ),
      styling.href_text(
        "https://en.wikipedia.org/wiki/Resolution_(logic)",
        "Resolution",
      ),
      element.text(
        ", but it is not immediately evident how they imply the individual semantics of each syntactical element, at least for the purposes of introducing formal deduction.) Now we can prove more statements:",
      ),
      styling.equation(
        "
        \\[\\begin{alignat}{3}
          && \\Sigma &= \\qty{\\forall x(A(x) \\smp C(x)), \\forall x(B(x) \\smp D(x))} \\\\
          (1) &&\\qquad \\Sigma \\cup \\qty{A(t)} &\\vdash A(t) \\qquad&& (\\in) \\\\
          (2) && &\\vdash \\forall x(A(x) \\smp C(x)) \\qquad&& (\\in) \\\\
          (3) && &\\vdash A(t) \\smp C(t) \\qquad&& (2), ({\\forall}{-}) \\\\
          (4) && &\\vdash C(t) \\qquad&& (1), (3), ({\\smp}{-}) \\\\
          (5) && &\\vdash C(t) \\lor D(t) \\qquad&& (4), ({\\lor}{+}) \\\\
          (6) && &\\vdash \\exists x(C(x) \\lor D(x)) \\quad&& (5), ({\\exists}{+}) \\\\
          (7) &&\\qquad \\Sigma \\cup \\qty{B(t)} &\\vdash B(t) \\qquad&& (\\in) \\\\
          (8) && &\\vdash \\forall x(B(x) \\smp D(x)) \\qquad&& (\\in) \\\\
          (9) && &\\vdash A(t) \\smp D(t) \\qquad&& (8), ({\\forall}{-}) \\\\
          (10) && &\\vdash C(t) \\qquad&& (7), (9), ({\\smp}{-}) \\\\
          (11) && &\\vdash C(t) \\lor D(t) \\qquad&& (10), ({\\lor}{+}) \\\\
          (12) && &\\vdash \\exists x(C(x) \\lor D(x)) \\quad&& (11), ({\\exists}{+}) \\\\
          (13) &&\\qquad \\Sigma \\cup \\qty{A(t) \\lor B(t)} &\\vdash \\exists x(C(x) \\lor D(x)) \\qquad&& (6), (12), ({\\lor}{-}) \\\\
          (14) &&\\qquad \\Sigma \\cup \\qty{\\exists x(A(x) \\lor B(x))} &\\vdash \\exists x(C(x) \\lor D(x)) \\quad&& (13), ({\\exists}-) \\\\
          (15) &&\\qquad \\Sigma &\\vdash \\exists x(A(x) \\lor B(x)) \\smp \\exists x(C(x) \\lor D(x)) \\quad&& (14), ({\\smp}{+})
        \\end{alignat}\\]
      ",
      ),
      element.text(
        "No way, adding more rules made the system more complicated ∪･ω･∪. In exchange, though, we gain the full expressive power of first-order logic! With this, set theory can be formally abstracted into the rest of mathematics.",
      ),
      styling.hr(),
      element.text(
        "In my eyes, much of the joy of mathematics comes from this underlying formal system that can generally be taken for granted. Abstracting so far above logic counterintuitively makes the immediate emergent properties extremely relevant, as they butterfly into more useful specific cases depending on the field of discourse and the degree of abstraction. Of course, my only exposure to logic is through computer science rather than philosophy or math, and model theory and category theory are a bit strange to be learning before even a formal treatment of abstract algebra, so I'll hold off a bit before expounding on this.",
      ),
      html.br([]),
      element.text(
        "I would, however, like to pontificate about the more pragmatic philosophy of truth. In reality, there are no underlying axioms (apart from physics, I suppose). Even then, we know only what our senses tell us. It's not meaningful to ponder the validity of one's own perception, lest we devolve into self-contained ",
      ),
      styling.href_text(
        "https://en.wikipedia.org/wiki/Boltzmann_brain",
        "Boltzmann brains",
      ),
      element.text(
        ", but individual perspectives are of course inherently subjective. I will never see most of the world, or interact with most of its people, or eat most of its foods, or hear most of its music. From this, I make two extrapolations: ",
      ),
      html.ol(
        [
          attribute.style([
            #("list-style", "decimal"),
            #("list-style-position", "outside"),
            #("margin-left", "1em"),
          ]),
        ],
        [
          html.li([], [
            element.text(
              "Obviously, it isn't possible to know everything, nor is there a need to. It's not possible not to live in a bubble both spacial and temporal, so all I can hope to do is to see a fraction of a fraction of this small slice. It would be ridiculous to suppose that this bubble just so happens to be representative of everything else; given how miniscule the sample is, it would only make sense that any averages I observe are far from reality. ",
            ),
          ]),
          html.li([], [
            element.text(
              "When faced with a reality I can't hope to understand, I have very, very little ground to stand in opposition. Without receiving communication, I have no way of knowing what's happening outside of my world, but this isn't justification for naïveté. One of the wonders of Web \\(2.0\\) is that it's never been easier to hear from an incredibly diverse population. As such, it's best to place weight on firsthand information while being conscientious of the unfortunate web of ulterior motives begotten by the profit motive.",
            ),
          ]),
        ],
      ),
      element.text(
        "These took me far too long to come to thanks to the sophistry of pseudo-logic peddled by proponents of so-called meritocracy. For a time, I attempted to reconcile the incongruity between perspectives, but that gets increasingly difficult as the people rhetorically pushing some of those perspectives demonstrably do not have my own interest in mind. Communication is built on mutual understanding, which is diametrically opposed with a system founded on exploitation. Allowing oneself to facetiously sell an ideology has the added bonus of justifying the status quo, giving solace to many and absolving some amount of guilt from the abusers of the system.",
      ),
      styling.br("0.5em"),
      element.text(
        "It's painfully easy to forget the logical foundations we take for granted. Especially easy to miss is the fact that ",
      ),
      styling.i(
        "these foundations exist to describe existing systems, not the other way around. ",
      ),
      element.text(
        "Applying rules where they don't belong is made simpler when you aren't exposed to a world where those rules don't arise; if all you know is \\(\\Z/2\\Z\\), the ",
      ),
      styling.href_text(
        "https://en.wikipedia.org/wiki/Freshman's_dream",
        "freshman's dream",
      ),
      element.text(" is trivial, after all:"),
      styling.equation(
        "
        \\[\\begin{align*}
          ([a]_2 +_2 [b]_2)^2 &= \\qty[(a + b)^2]_2 = \\qty[a^2 + 2ab + b^2]_2 \\\\
            &= \\qty[a^2]_2 +_2 [2ab]_2 +_2 \\qty[b^2]_2 = \\qty[a]_2^2 +_2 \\qty[b]_2^2
        \\end{align*}\\]
      ",
      ),
      element.text(
        "Pondering the nature of truth has gotten me nowhere quickly. I had a particularly bad period when I was about 10, realizing the tautology of reality and starting to distrust it as a result. After a bit, though, I realized how useless thinking about all of this is. Math is only interesting because we acknowledge assumptions and limitations explicitly. Reality is only interesting when you acknowledge the limitations of truth.",
      ),
      styling.br("0.5em"),
      element.text(
        "So what is truth, then? Truth is power—it is a story to rationalize the structures we encounter in life, to influence our feelings towards them in relation to ourselves—but more than that, it is a narrative. Rationality and truth are the story we tell ourselves—the assumptions we hold to be self-evident. As such, these truths reflect their subscribers potentially more than their subjects. Unlike mathematical logic, reality cannot be discretized so neatly into truths and untruths, as facts are themselves opinions, implicitly contingent on the axioms. These axioms may come in the form of a social contract or simply as societal norms, but they cannot be intrinsic. A commitment to empiricism is a perspective, so what makes it better or worse than someone's independent arbitration?",
      ),
      html.br([]),
      element.text(
        "A social truth can come from consensus, but this consensus is an aggregate of subjectivities that is itself aggregated and finally observed subjectively once more. Through so many filters, its value becomes more dubious. I believe it is ",
      ),
      styling.i("values "),
      element.text(
        "that govern our facts. Take climate change, for example: scientists make independent assessments of a situation, find that they all share a common thread, notice a correlation, are able to reason a causal relationship, and then relay that information to the others. Science definitionally values observation, which is then assessed mathematically. The reason that this is touted as truthful is that we have historically tested its results and predictions and evaluated them as a crucial system for furthering human progress. Truth is our interpretation of the world, so a value system built on evaluating that world as close to axiomatically as possible allows us to imitate reality with our own system of truths, just as with the abstraction of first-order logic. (After all, physics is just a field of mathematics, as are all other sciences o(≧∇≦o).)",
      ),
      styling.br("0.5em"),
      element.text(
        "In this case, the difference between reality and truth is largely a philosophical technicality. Science is our attempt to distill reality into comprehensible truth. Choosing to value the scientific method is still a value judgement, though, and one that ",
      ),
      styling.i("cannot be taken for granted. "),
      element.text(
        "An issue with trying to accurately portray reality is that it captures the good and the bad, though it of course does not specify which is which. (Who's to say whether human lives or a made-up number is more valuable, after all?) The power of rhetoric comes from its ability to frame judgement and truth alike as objective and natural, or at the very least in a persuasive light.",
      ),
      html.br([]),
      element.text(
        "It seems natural to always want the truth to align with reality as closely as possible, but when reality is disadvantageous to a cause, it is always excluded from the truth, be it ex- or implicitly. The Enlightenment was characterized by a rejection of blind truth in pursuit of representing reality as it is, rather than falling back on societal truths. This cultural shift required a change in the dissemination of information from authority; it was no longer enough to simply cite God. When ethos is no longer sufficient, it's time for pathos and logos. Moralistic nationalism under the guise of objectivity has become the hallmark of fascist movements for the past several centuries, which show no signs of slowing. On the other hand, science remains a tool for manipulating public interest. With the sudden relevance of STEM in the past century and the sheer abstraction inherent to the modern sciences, it's easier than ever to peddle lies posing as skepticism or rationality. Technology has been characterized by speculative bubbles built on such false promises, from dot-com to Web 2.0 to the App Store to Web 3.0 to AI to quantum computing. Perhaps an even better example is the growing anti-intellectual movement headed by ",
      ),
      styling.i("certain "),
      element.text(" sociopolitical groups. (I wonder why…)"),
      html.br([]),
      element.text(
        "Meta-studies are how consensus is formally assessed, but they are colloquially irrelevant. People are often very passionate yet hardly invested in issues close to their identity, lest they be challenged. Any investment that is there often takes the form of an echo chamber, made ever easier by algorithms designed to feed us what we want to hear (so long as it doesn't hurt business!). So when a large group of people distrusts another group of people, it's not terribly difficult to play into that distrust to peddle snake oil. When truth is part of your identity, you eschew any hope of self-criticism, becoming a mere tool for someone else's prerogative. The scientific process of revision is what enables progress, not a dogmatic fixation on truth. ",
      ),
    ],
  )
}
