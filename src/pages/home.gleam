import lustre/attribute
import lustre/element
import lustre/element/html

pub fn view() {
  html.p(
    [attribute.class("center"), attribute.style([#("margin-top", "20px")])],
    [
      element.text(
        "Hi, I'm an undergraduate UWaterloo BCS 27'. I made this website for no reason other than wanting to learn ",
      ),
      html.a(
        [attribute.href("https://gleam.run/"), attribute.class("clickable")],
        [element.text("Gleam")],
      ),
      element.text(" (which was a great decision!)."),
      html.br([attribute.style([#("margin-bottom", "0.5em")])]),
      element.text(
        "On my own time, I'm currently learning about formal language theory (CS 442), topology (Munkres ofc), and boolean algebras with application to analysis (Vladimirov).",
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
