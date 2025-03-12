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
import lustre/ui/colour
import modem

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
        _ -> panic
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
  OnClick(String)
}

fn update(model: Model, msg: Msg) -> #(Model, Effect(Msg)) {
  case msg {
    OnRouteChange(route) -> #(Model(route:), {
      refresh()
      effect.none()
    })
    _ -> #(model, {
      refresh()
      effect.none()
    })
  }
}

// View
const styles = [
  #("margin", "2vh"),
  #("font-family", "CMU Serif"),
  #("font-weight", "575"),
  #("font-size", "14pt"),
]

fn theme() {
  ui.Theme(
    primary: colour.slate_dark(),
    greyscale: colour.grey_dark(),
    error: colour.amber_dark(),
    warning: colour.gold_dark(),
    success: colour.sage_dark(),
    info: colour.red_dark(),
  )
}

fn view(model: Model) -> Element(Msg) {
  let page = case model.route {
    Resume -> resume.view()
    Writings(title) -> view_writing(title)
    _ -> view_home()
  }

  ui.stack([attribute.style(styles)], [
    ui.centre([cluster.align_start()], ui.cluster([], [view_nav(), page])),
  ])
}

fn view_nav() {
  ui.box(
    [
      attribute.style([
        #("display", "flex"),
        #("justify-content", "space-between"),
      ]),
      ui.variant(ui.Primary),
    ],
    [
      html.a([attribute.href("/resume")], [element.text("Resume")]),
      html.a([attribute.href("/")], [element.text("Home")]),
      html.a([attribute.href("/writings")], [element.text("Writings")]),
    ],
  )
}

fn view_home() {
  html.h1([], [element.text("come one come all")])
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
        [cluster.align_start()],
        ui.cluster(
          [],
          list.map(writings, fn(x) {
            ui.box(
              [
                attribute.style([
                  #("display", "flex"),
                  #("justify-content", "space-between"),
                  #("padding-left", "100px"),
                  #("padding-right", "100px"),
                ]),
              ],
              [
                html.a([attribute.href("/writings/" <> x.0)], [x.1]),
                html.p([], [element.text(x.3)]),
              ],
            )
          }),
        ),
      )
    False ->
      ui.centre(
        [cluster.align_centre()],
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

pub fn mathjax_wrapper(page) {
  html.html([], [
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
          "https://fonts.googleapis.com/css2?family=CM+U+Serif+MX&family=CMU+Concrete&family=CMU+Typewriter+Text+1&family=Latin+Modern+Math&family=TeX+Gyre+Termes&family=TeX+Gyre+DejaVu+Math&display=swap",
        ),
      ]),
    ]),
    html.body([attribute.style(styles)], [page]),
  ])
}

@external(javascript, "./refresh.ffi.mjs", "log_test")
fn log_test() -> Nil {
  Nil
}

@external(javascript, "./refresh.ffi.mjs", "refresh")
fn refresh() -> Nil {
  Nil
}
