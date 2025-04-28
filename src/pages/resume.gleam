import gleam/list
import lustre/attribute
import lustre/element
import lustre/element/html

import styling

fn heading(elem) {
  html.h1([attribute.style([#("font-size", "16pt")])], [elem])
}

fn subheading(elem) {
  html.h2([attribute.style([#("margin-left", "1em"), #("font-size", "14pt")])], [
    elem,
  ])
}

fn subsubheading(elem) {
  html.h3([attribute.style([#("margin-left", "2em")])], [elem])
}

fn details(label, margin, child) {
  html.details([attribute.style([#("margin-left", margin)])], [
    html.summary([], [label]),
    child,
  ])
}

fn p_margin(elem) {
  html.p([attribute.style([#("margin-left", "1em")])], [elem])
}

fn descriptions(content) {
  html.div(
    [],
    list.map(content, fn(x) {
      case x {
        #(a, b) -> details(a, "1em", p_margin(b))
      }
    }),
  )
}

pub fn view() {
  let projects = [
    #(
      styling.href_text(
        "https://github.com/Endolite/tree-sitter-sil",
        "SIL Tree-sitter",
      ),
      html.p([], [
        element.text("A "),
        styling.href_text(
          "https://tree-sitter.github.io/tree-sitter/",
          "Tree-sitter",
        ),
        element.text(
          " grammar for SIL, the Simple Imperative Language used in UWaterloo's CS 442.",
        ),
      ]),
    ),
    #(
      styling.href_text("https://github.com/Endolite/typst", "Typst"),
      html.p([], [
        element.text(
          "I started getting tired of handwriting math problems that I wanted to work out, so I decided to start porting it over to ",
        ),
        styling.href_text("https://typst.app/", "Typst"),
        element.text(
          ", which I've been meaning to use more seriously for a while anyways. Easy live preview for multifile projects is so nice and the syntax is fine enough. It's really nice being able to more granularly and modularly configure document-wide settings, something I only really ever did the bare minimum of in \\(\\mathrm{\\LaTeX}\\). This isn't really a project as much as it is a dumping grounds for scratch work, but it's all I have to publicly show for all the time I've spent doing math ʕ •ᴥ• ʔ",
        ),
      ]),
    ),
  ]

  let courses_math =
    list.map(
      [
        #(
          "MATH 136 – Linear Algebra 1",
          "Relaxed introduction to linear algebra I was long overdue for and ended up really liking thanks to its emphasis on proofs",
        ),
        #(
          "MATH 235 – Linear Algebra 2",
          "Spent way too long on abstract vector spaces, which is review from the previous course, and then crammed in a bunch of unmotivated computation in the second half; not a great time, but certainly useful for at least one other course",
        ),
        #(
          "MATH 138 – Calculus 2",
          "Entirely review, so not much to say; integrals are pretty fun",
        ),
        #(
          "AMATH 231 – Calculus 4",
          "Half review and half new material, all of which was computational; a tolerable covering of vector calculus and Fourier series/transforms",
        ),
        #(
          "PMATH 333 – Introduction to Analysis",
          "While this course made me realize that I like analysis more than algebra, it came at the cost of really annoying computational proofs that required a lot of memorization",
        ),
        #(
          "PMATH 351 – Real Analysis",
          "Easily my favourite course I've taken so far, covering a lot in depth in a straightforward manner with motivation that never made it feel overly difficult to intuit the progression",
        ),
        #(
          "PMATH 450 – Lebesgue Integration and Fourier Analysis",
          "Lebesgue integration has been my white whale in math for a long time, and this course was certainly as difficult as I expected, though maybe moreso due to the Fourier analysis; still really fun, and finally motivated the material from Linear Algebra 2",
        ),
        #(
          "MATH 249 – Introduction to Combinatorics",
          "Intro to algebraic combinatorics with lots of fun proofs that made me feel clever and stupid; graph theory was a bit less engaging, though",
        ),
        #(
          "STAT 230 – Probability",
          "Simple introduction to probability with annoying problems and an emphasis on knowing the applicability of distributions; sadly untheoretical, I wanted measure theory ( • ᴖ • ｡)",
        ),
        #(
          "STAT 231 – Statistics",
          "Rigorous introduction to theoretical statistics focusing on estimation and emphasizing consciousness of assumptions; also tested R for some reason; lots and lots of memorization, but open-note ʅ(°_°)ʃ",
        ),
      ],
      fn(x) {
        case x {
          #(a, b) -> #(element.text(a), element.text(b))
        }
      },
    )

  let courses_cs =
    list.map(
      [
        #(
          "CS 145 – Introduction to Functional Programming",
          html.p([], [
            element.text(
              "Racket is a fun language, can't wait to use it in the real world; this course really prepared me for making my ",
            ),
            html.a(
              [
                attribute.href(
                  "https://gist.github.com/Endolite/aa8024db78eb546dd36d7ba1be0de34e",
                ),
                attribute.class("clickable"),
              ],
              [element.text("Kanata config")],
            ),
          ]),
        ),
        #(
          "CS 146 – Elementary Algorithm Design and Data Abstraction",
          element.text(
            "Course title is the vaguest possible for a CS course, but it was a great well-motivated (if perhaps overly dense) introduction to imperative programming; now I can pretend to understand compilers",
          ),
        ),
        #(
          "CS 136L – Tools and Techniques for Software Development",
          element.text(
            "Intro to tools like Linux and git which are really useful; unfortunately I have dementia (´；ω；`)",
          ),
        ),
        #(
          "CS 241E – Foundations of Sequential Programs",
          element.text(
            "Another vague title, but this was focused on implementing abstractions from machine code, going from a verison of MIPS implemeted in Scala to a toy language Lacs with some of Scala's functionality; the final was disproportionately representative language theory, which was my favourite part of the course; now I can pretend to understand compilers a bit more confidently",
          ),
        ),
        #(
          "CS 245 – Logic and Computation",
          element.text(
            "I'm more of a math guy, so an introduction to formal logic with some connections to model theory was much appreciated",
          ),
        ),
        #(
          "CS 246 – Object-Oriented Software Development",
          element.text(
            "Didn't go to a single lecture or learn much of anything but still somehow passed; C++ is certainly a language",
          ),
        ),
      ],
      fn(x) {
        case x {
          #(a, b) -> #(element.text(a), b)
        }
      },
    )

  let courses_other =
    list.map(
      [
        #(
          "ENGL 109 – Introduction to Academic Writing",
          "Pretty basic course on academic writing; writing essays is fun, though",
        ),
        #(
          "ENGL 210E – Genres of Technical Communication",
          "Another relatively basic course, though it both was more interesting and more tedious",
        ),
        #(
          "JAPAN 201R – Second-Year Japanese 1",
          "Decent handwriting practice, but I didn't learn anything since it just covered the first half of Genki Ⅱ; I sorely need more speaking practice",
        ),
        #("MUSIC 116/117 – Music Ensemble", "I love jazz -=iii=<()"),
      ],
      fn(x) {
        case x {
          #(a, b) -> #(element.text(a), element.text(b))
        }
      },
    )

  let activities =
    list.map(
      [
        #("Jazz Ensemble", "Trumpet/flugel player in W24 and F24"),
        #(
          "Concert Band Club",
          "Trumpet player in F23, W24, and F24; quintet lead in F24",
        ),
        #("Warriors Band", "Trumpet player in F23, W24, and F24"),
        #("Animusic", "Trumpet player in F23 and F24"),
      ],
      fn(x) {
        case x {
          #(a, b) -> #(element.text(a), element.text(b))
        }
      },
    )

  let courses_ltu =
    list.map(
      [
        #(
          "MCS 2414 – Calculus 3",
          "Very straightforward, computational primer on multivariable and vector calculus",
        ),
        #(
          "MCS 2423 – Differential Equations",
          "Thoroughly computationally rigorous introduction to differential equations; I gravely overestimated the relevance of differential equations for my career",
        ),
        #(
          "MCS 2523 – Discrete Math",
          "Sporadic, unrigorous introduction to number theory, enumeration, graph theory, propositional logic, set theory, and discrete probability (in that order?)",
        ),
        #(
          "MCS 2514 – Computer Science 2",
          "Relaxed introduction to basic C++ and object-oriented programming more generally; my only background was Java, which was slightly suboptimal",
        ),
        #(
          "PHY 3653 – Contemporary Physics",
          "Largely conceptual survey of modern physics, with computation for motivation and simple examples; classical and special relativity, wave-particle duality, quantum mechanics, modelling atoms, nuclear physics, astrophysics, and general relativity",
        ),
      ],
      fn(x) {
        case x {
          #(a, b) -> #(element.text(a), element.text(b))
        }
      },
    )

  html.div(
    [attribute.class("center"), attribute.style([#("margin-top", "20px")])],
    [
      heading(element.text("Projects")),
      descriptions(projects),
      heading(element.text("Education")),
      subheading(element.text("University of Waterloo (BCS 23–27)")),
      subsubheading(element.text("Courses")),
      details(element.text("Math"), "3em", descriptions(courses_math)),
      details(element.text("CS"), "3em", descriptions(courses_cs)),
      details(element.text("Electives"), "3em", descriptions(courses_other)),
      details(element.text("Activities"), "2em", descriptions(activities)),
      subheading(element.text(
        "Lawrence Technological University (Dual Enrollment 22–23)",
      )),
      details(element.text("Courses"), "2em", descriptions(courses_ltu)),
    ],
  )
}
