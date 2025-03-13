import lustre/attribute
import lustre/element
import lustre/element/html

pub fn view() {
  html.p([attribute.style([#("margin", "20px")])], [
    element.text(
      "Hi, I'm an undergraduate UWaterloo CS/Math 27' student. I made this website for no reason other than wanting to learn Gleam, and I'm very happy I did.",
    ),
    html.br([attribute.style([#("margin-bottom", "0.5em")])]),
    element.text("Right now, I'm learning about formal language theory (CS 442), topology (Munkres ofc), and boolean algebras with application to analysis (Vladimirov)."),
    html.br([attribute.style([#("margin-bottom", "0.5em")])]),
    element.text("I'm "),
    html.a([attribute.href("https://github.com/Endolite"), attribute.style([#("color", "#d8b4fe")]),], [element.text("Endolite on GitHub ")]),
    element.text("and @endolite on Discord")
  ])
}
