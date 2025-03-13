import gleam/list
import gleam/result
import gleam/uri.{type Uri}
import lustre
import lustre/attribute
import lustre/effect.{type Effect}
import lustre/element.{type Element}
import lustre/element/html
import lustre/ui
import lustre/ui/cluster
import modem

import styling

import pages/home
import pages/resume

import pages/writings/tuples

pub fn main() {
  let app =
    lustre.application(init, update, fn(x) { x |> view |> mathjax_wrapper })
  let assert Ok(_) = lustre.start(app, "#app", Nil)
}

// Model
type Model {
  Model(route: Route)
}

type Route {
  Home
  Resume
  Writings(String)
}

fn init(_flags) -> #(Model, Effect(Msg)) {
  #(
    Model(
      route: case
        modem.initial_uri() |> result.unwrap(uri.empty) |> on_route_change
      {
        OnRouteChange(x) -> x
      },
    ),
    modem.init(on_route_change),
  )
}

fn on_route_change(uri: Uri) -> Msg {
  case uri.path_segments(uri.path) {
    ["resume"] -> OnRouteChange(Resume)
    ["writings", title] -> OnRouteChange(Writings(title))
    ["writings"] -> OnRouteChange(Writings(""))
    _ -> OnRouteChange(Home)
  }
}

// Update
pub opaque type Msg {
  OnRouteChange(Route)
}

fn update(_model: Model, msg: Msg) -> #(Model, Effect(Msg)) {
  case msg {
    OnRouteChange(route) -> #(Model(route:), {
      refresh()
      effect.none()
    })
  }
}

// View
fn view(model: Model) -> Element(Msg) {
  let page = case model.route {
    Resume -> resume.view()
    Writings(title) -> view_writing(title)
    _ -> home.view()
  }

  ui.stack([], [
    ui.centre([cluster.align_start()], ui.cluster([], [view_nav(), page])),
  ])
}

fn view_nav() {
  ui.box(
    [
      attribute.style([
        #("display", "flex"),
        #("justify-content", "space-between"),
        #("font-size", "16pt"),
      ]),
      ui.variant(ui.Primary),
    ],
    [
      styling.hoverable_text(
        html.a([attribute.href("/resume")], [element.text("Resume")]),
      ),
      styling.hoverable_text(html.a([attribute.href("/")], [element.text("Home")])),
      styling.hoverable_text(
        html.a([attribute.href("/writings")], [element.text("Writings")]),
      ),
    ],
  )
}

fn view_writing(title: String) {
  let writings = [
    #(
      "tuples",
      html.div([], [
        html.i([], [element.text("How")]),
        element.text(" are tuples?"),
      ]),
      tuples.view,
      "2025/03/12",
    ),
  ]
  case title == "" {
    True ->
      ui.centre(
        [cluster.align_start(), attribute.style([#("margin", "20px")])],
        ui.cluster(
          [],
          list.map(writings, fn(x) {
            html.div([], [
              styling.hoverable_text(
                html.a(
                  [
                    attribute.href("/writings/" <> x.0),
                    attribute.style([
                      #("position", "fixed"),
                      #("left", "50%"),
                      #("transform", "translate(-200px)"),
                    ]),
                  ],
                  [x.1],
                ),
              ),
              html.p(
                [
                  attribute.style([
                    #("position", "fixed"),
                    #("left", "50%"),
                    #("transform", "translate(100px)"),
                  ]),
                ],
                [element.text(x.3)],
              ),
            ])
          }),
        ),
      )
    False ->
      ui.centre(
        [cluster.align_centre(), attribute.style([#("margin", "20px")])],
        ui.cluster([], case list.filter(writings, fn(x) { x.0 == title }) {
          [a] -> [
            html.h1(
              [
                attribute.style([
                  #("font-size", "24pt"),
                  #("text-align", "center"),
                ]),
              ],
              [a.1],
            ),
            html.h2(
              [
                attribute.style([
                  #("font-size", "12pt"),
                  #("text-align", "center"),
                ]),
              ],
              [element.text(a.3)],
            ),
            a.2(),
          ]
          _ -> panic
        }),
      )
  }
}

const styles = [
  #("font-family", "CMU Serif"),
  #("font-weight", "575"),
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
    ]),
    html.body([attribute.style([#("padding", "20px")])], [ui.box([], [page])]),
  ])
}

@external(javascript, "./refresh.ffi.mjs", "refresh")
fn refresh() -> Nil {
  Nil
}
