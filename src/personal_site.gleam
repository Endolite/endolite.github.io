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

//import tardis

import styling

import pages/home
import pages/resume

import pages/writings/authority_despair_michigan
import pages/writings/cognitive_empathy_ladder
import pages/writings/on_epistemology
import pages/writings/small_phone
import pages/writings/tuples

@external(javascript, "./utils.ffi.mjs", "refresh")
fn refresh() -> Nil

@external(javascript, "./utils.ffi.mjs", "retitle")
fn retitle(_title: String) -> Nil

pub fn main() {
  //let assert Ok(main) = tardis.single("main")
  lustre.application(init, update, fn(x) {
    x |> view |> styling.mathjax_wrapper
  })
  //|> tardis.wrap(with: main)
  |> lustre.start("#app", Nil)
  //|> tardis.activate(with: main)
}

// Model
pub type Model {
  Model(route: Route)
}

pub type Route {
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
    ["resume"] -> {
      retitle("Résumé")
      OnRouteChange(Resume)
    }
    ["writings", title] -> OnRouteChange(Writings(title))
    ["writings"] -> OnRouteChange(Writings(""))
    _ -> {
      retitle("Endolite")
      OnRouteChange(Home)
    }
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
        html.a([attribute.href("/resume")], [element.text("Résumé")]),
      ),
      styling.hoverable_text(
        html.a([attribute.href("/")], [element.text("Home")]),
      ),
      styling.hoverable_text(
        html.a([attribute.href("/writings")], [element.text("Writings")]),
      ),
    ],
  )
}

fn view_writing(title: String) {
  let writings =
    []
    |> tuples.meta
    |> authority_despair_michigan.meta
    |> small_phone.meta
    |> on_epistemology.meta
    |> cognitive_empathy_ladder.meta
  case title == "" {
    True -> {
      retitle("Writings")
      html.div(
        [attribute.style([#("margin", "20px")])],
        list.map(writings, fn(x) {
          html.div(
            [
              attribute.class("center"),
              attribute.style([
                #("display", "flex"),
                #("justify-content", "space-between"),
                #("max-width", "400px"),
              ]),
            ],
            [
              styling.hoverable_text(
                html.a([attribute.href("/writings/" <> x.0)], [x.2]),
              ),
              html.p([], [element.text(x.4)]),
            ],
          )
        }),
      )
    }
    False ->
      html.div([], case list.filter(writings, fn(x) { x.0 == title }) {
        [a] -> {
          retitle(a.1)
          [
            html.h1(
              [
                attribute.style([
                  #("font-size", "24pt"),
                  #("text-align", "center"),
                ]),
              ],
              [a.2],
            ),
            html.div([attribute.style([#("text-align", "center")])], [
              html.time(
                [
                  attribute.style([#("font-size", "12pt")]),
                  attribute.attribute("datetime", a.4),
                ],
                [element.text(a.4)],
              ),
            ]),
            a.3(),
          ]
        }
        _ -> panic
      })
  }
}
