import lustre/attribute
import lustre/element
import lustre/element/html

pub fn view() {
  html.div([attribute.style([#("margin", "20px")])], [
    html.h1([attribute.style([#("font-size", "16pt")])], [
      element.text("Education"),
    ]),
      html.h2(
        [attribute.style([#("font-size", "14pt"), #("margin-left", "1em")])],
        [element.text("University of Waterloo (BCS 23–27)")],
      ),
        html.h3([attribute.style([#("margin-left", "2em")])], [
          element.text("Courses"),
        ]),
          html.h4([attribute.style([#("margin-left", "3em")])], [
            element.text("MATH 136 – Linear Algebra 1"),
          ]),
            html.p([attribute.style([#("margin-left", "4em")])], [
              element.text(
                "A relaxed introduction linear algebra course I was long overdue for and ended up really liking thanks to its emphasis on proofs",
              ),
            ]),
          html.h4([attribute.style([#("margin-left", "3em")])], [
            element.text("MATH 235 – Linear Algebra 2"),
          ]),
            html.p([attribute.style([#("margin-left", "4em")])], [
              element.text(
                "Spent way too long on abstract vector spaces, which is review from the previous course, and then crammed in a bunch of unmotivated computation in the second half; not a great time, but certainly useful for at least one other course",
              ),
            ]),
          html.h4([attribute.style([#("margin-left", "3em")])], [
            element.text("MATH 138 – Calculus 2"),
          ]),
            html.p([attribute.style([#("margin-left", "4em")])], [
              element.text(
                "This course was entirely review, so not much to say; integrals are pretty fun",
              ),
            ]),
          html.h4([attribute.style([#("margin-left", "3em")])], [
            element.text("AMATH 231 – Calculus 4"),
          ]),
            html.p([attribute.style([#("margin-left", "4em")])], [
              element.text(
                "This course was half review and half-new material, all of which was computational; a tolerable covering of vector calculus and Fourier series/transforms",
              ),
            ]),
          html.h4([attribute.style([#("margin-left", "3em")])], [
            element.text("PMATH 333 – Introduction to Analysis"),
          ]),
            html.p([attribute.style([#("margin-left", "4em")])], [
              element.text(
                "While this course made me realize that I like analysis more than algebra, it came at the cost really annoying proofs that were quite computational and required a lot of memorization",
              ),
            ]),
          html.h4([attribute.style([#("margin-left", "3em")])], [
            element.text("PMATH 351 – Real Analysis"),
          ]),
            html.p([attribute.style([#("margin-left", "4em")])], [
              element.text(
                "Easily my favourite course I've taken so far, covering a lot in depth in a straightforward manner with motivation that never made it feel overly difficult to intuit the progression",
              ),
            ]),
          html.h4([attribute.style([#("margin-left", "3em")])], [
            element.text("PMATH 450 – Lebesgue Integration and Fourier Analysis"),
          ]),
          html.p([attribute.style([#("margin-left", "4em")])], [
              element.text(
                "Lebesgue integration has been my white whale in math for a long time, and it this course was certainly as difficult as I expected, though maybe moreso due to the Fourier analysis; still really fun even, and finally motivated the material from MATH 235"
              ),
            ]),
          html.h4([attribute.style([#("margin-left", "3em")])], [
            element.text("MATH 249 – Introduction to Combinatorics"),
          ]),
            html.p([attribute.style([#("margin-left", "4em")])], [
              element.text(
                "A course with a lot of fun proofs that made me feel clever and stupid; graph theory was a bit less engaging, though",
              ),
            ]),
          html.br([]),

          html.h4([attribute.style([#("margin-left", "3em")])], [
            element.text("CS 145 – Introduction to Functional Programming"),
          ]),
            html.p([attribute.style([#("margin-left", "4em")])], [
              element.text(
                "Racket is a really fun language; this course really prepared me for making my ",
              ),
              html.a(
                [
                  attribute.href(
                    "https://gist.github.com/Endolite/aa8024db78eb546dd36d7ba1be0de34e",
                  ),
                  attribute.style([#("color", "#d8b4fe")]),
                ],
                [element.text("Kanata config")],
              ),
            ]),
          html.h4([attribute.style([#("margin-left", "3em")])], [
            element.text("CS 146 – Elementary Algorithm Design and Data Abstraction"),
          ]),
            html.p([attribute.style([#("margin-left", "4em")])], [
              element.text(
                "Course title is the vaguest possible for a CS course, but it was a great well-motivated introduction to imperative programming; now I can pretend to understand compilers",
              ),
            ]),
          html.h4([attribute.style([#("margin-left", "3em")])], [
            element.text("CS 241E – Foundations of Sequential Programs"),
          ]),
            html.p([attribute.style([#("margin-left", "4em")])], [
              element.text(
                "Another vague title, but this was focused on implementing abstractions from machine code, going from a verison of MIPS implemeted in Scala to a toy language Lacs with some of Scala's functionality; the final was disproportionately representative language theory, which was my favourite part of the course; now I can pretend to understand compilers a bit more confidently",
              ),
            ]),
          html.h4([attribute.style([#("margin-left", "3em")])], [
            element.text("CS 245 – Logic and Computation"),
          ]),
            html.p([attribute.style([#("margin-left", "4em")])], [
              element.text(
                "I'm more of a math guy, so an introduction to formal logic with some connections to model theory was much appreciated",
              ),
            ]),
          html.h4([attribute.style([#("margin-left", "3em")])], [
            element.text("CS 246 – Object-Oriented Software Development"),
          ]),
            html.p([attribute.style([#("margin-left", "4em")])], [
              element.text(
                "Didn't go to a single lecture but still somehow passed; C++ is certainly a language",
              ),
            ]),
          html.br([]),

          html.h4([attribute.style([#("margin-left", "3em")])], [
            element.text("ENGL 109 – Introduction to Academic Writing"),
          ]),
            html.p([attribute.style([#("margin-left", "4em")])], [
              element.text(
                "A pretty useless course on academic writing; writing essays is fun, though",
              ),
            ]),
          html.h4([attribute.style([#("margin-left", "3em")])], [
            element.text("ENGL 210E – Genres of Technical Communication"),
          ]),
            html.p([attribute.style([#("margin-left", "4em")])], [
              element.text(
                "Another relatively useless course, though it both was more interesting and more tedious",
              ),
            ]),

          html.h4([attribute.style([#("margin-left", "3em")])], [
            element.text("JAPAN 201R – Second-Year Japanese 1"),
          ]),
            html.p([attribute.style([#("margin-left", "4em")])], [
              element.text(
                "Decent writing practice but didn't learn anything since it just covered the first half of Genki Ⅱ; I definitely need more speaking practice",
              ),
            ]),
      html.br([]),

      html.h2(
        [attribute.style([#("font-size", "14pt"), #("margin-left", "1em")])],
        [element.text("Lawrence Technological University (Dual Enrollment 22–23)")],
      ),
        html.h3([attribute.style([#("margin-left", "2em")])], [
          element.text("Courses"),
        ]),
          html.h4([attribute.style([#("margin-left", "3em")])], [
            element.text("MCS 2414 – Calculus 3"),
          ]),
            html.p([attribute.style([#("margin-left", "4em")])], [
              element.text(
                "A very straightforward, computational primer on multivariable and vector calculus",
              ),
            ]),
          html.h4([attribute.style([#("margin-left", "3em")])], [
            element.text("MCS 2423 – Differential Equations"),
          ]),
            html.p([attribute.style([#("margin-left", "4em")])], [
              element.text(
                "A thoroughly computationally rigorous introduction to differential equations; I gravely oversetimated the imporatnce of differential equations for my career"
              ),
            ]),
          html.h4([attribute.style([#("margin-left", "3em")])], [
            element.text("MCS 2523 – Discrete Math"),
          ]),
              html.p([attribute.style([#("margin-left", "4em")])], [
                element.text(
                  "A sporadic, unrigorous introduction to number theory, basic enumeration, graph theory, propositional logic, set theory, and discrete probability (in that order?)"
                ),
              ]),
          html.br([]),

          html.h4([attribute.style([#("margin-left", "3em")])], [
            element.text("MCS 2514 – Computer Science 2"),
          ]),
              html.p([attribute.style([#("margin-left", "4em")])], [
                element.text(
                  "A relaxed introduction to basic C++ and object-oriented programming more generally; my only background was Java, which was slightly suboptimal"
                ),
              ]),
          html.br([]),
          html.h4([attribute.style([#("margin-left", "3em")])], [
            element.text("PHY 3653 – Contemporary Physics"),
          ]),
              html.p([attribute.style([#("margin-left", "4em")])], [
                element.text(
                  "A largely conceptual survey of modern physics, with computation for motivation and simply examples; classical relativity, special relativity, wave-particle duality, quantum mechanics, modelling atoms, nuclear physics, astrophysics, and general relativity"
                ),
              ]),
  ])
}
