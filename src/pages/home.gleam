import lustre/attribute
import lustre/element
import lustre/element/html
import styling

pub fn view() {
  html.p(
    [attribute.class("center"), attribute.style([#("margin-top", "20px")])],
    [
      element.text("Hi, I'm a BCS '27 at UWaterloo. I made, "),
      styling.href_text(
        "https://github.com/Endolite/endolite.github.io",
        "this website",
      ),
      element.text(" for no reason other than wanting to learn "),
      html.a(
        [attribute.href("https://gleam.run/"), attribute.class("clickable")],
        [element.text("Gleam")],
      ),
      element.text(" (which was a great decision!)."),
      html.br([attribute.style([#("margin-bottom", "0.5em")])]),
      element.text(
        "On my own time, I'm currently learning about formal language theory (CS 442), topology (",
      ),
      styling.href_text(
        "https://github.com/Endolite/typst/blob/master/Munkres/topology.pdf",
        "Munkres ofc",
      ),
      element.text(
        "), and boolean algebras with application to analysis (Vladimirov).",
      ),
      html.br([attribute.style([#("margin-bottom", "0.5em")])]),
      element.text("I'm "),
      html.a(
        [
          attribute.href("https://github.com/Endolite"),
          attribute.class("clickable"),
        ],
        [element.text("Endolite on GitHub")],
      ),
      element.text(" and @endolite on Discord."),
    ],
  )
}
