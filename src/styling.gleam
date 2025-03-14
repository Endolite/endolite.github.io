import lustre/attribute
import lustre/element/html
import lustre/ui

pub fn hoverable_text(el) {
  html.div(
    [
      attribute.class(
        "transition-colors duration-200 ease-in-out hover:text-purple-300",
      ),
    ],
    [el],
  )
}

const styles = [
  #("font-family", "CMU Serif-Regular !important"),
  //#("font-weight", "575"),
  #("font-size", "13pt"),
  #("color", "White"),
  #("background-color", "#20201E"),
  #("min-height", "100vh"),
  #("height", "100%"),
  #("margin", "0"),
]

pub fn mathjax_wrapper(page) {
  html.html([attribute.style(styles)], [
    html.head([], [
      html.script(
        [
          attribute.src(
            "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js",
          ),
          attribute.id("MathJax-script"),
        ],
        "",
      ),
      html.link([
        attribute.rel("stylesheet"),
        attribute.href(
          "https://cdn.jsdelivr.net/gh/bitmaks/cm-web-fonts@latest/fonts.css",
        ),
      ]),
      html.style(
        [],
        "
        .clickable {
          color: #d8b4fe;
        }
        .center {
          margin: auto;
          max-width: min(1000px, 90vw);
        }
      ",
      ),
    ]),
    html.body([attribute.style([#("padding", "20px")])], [ui.box([], [page])]),
  ])
}
