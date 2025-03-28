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

import model
import styling

import pages/home
import pages/resume

import pages/writings/authority_despair_michigan
import pages/writings/on_epistemology
import pages/writings/small_phone
import pages/writings/tuples

@external(javascript, "./refresh.ffi.mjs", "refresh")
fn refresh() -> Nil {
  Nil
}

@external(javascript, "./refresh.ffi.mjs", "retitle")
fn retitle(_title: String) -> Nil {
  Nil
}

pub fn main() {
  let app =
    lustre.application(init, update, fn(x) {
      x |> view |> styling.mathjax_wrapper
    })
  let assert Ok(_) = lustre.start(app, "#app", Nil)
}

// Model
fn init(_flags) -> #(model.Model, Effect(Msg)) {
  #(
    model.Model(
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
      OnRouteChange(model.Resume)
    }
    ["writings", title] -> OnRouteChange(model.Writings(title))
    ["writings"] -> OnRouteChange(model.Writings(""))
    _ -> {
      retitle("Endolite")
      OnRouteChange(model.Home)
    }
  }
}

// Update
pub opaque type Msg {
  OnRouteChange(model.Route)
}

fn update(_model: model.Model, msg: Msg) -> #(model.Model, Effect(Msg)) {
  case msg {
    OnRouteChange(route) -> #(model.Model(route:), {
      refresh()
      effect.none()
    })
  }
}

// View
fn view(model: model.Model) -> Element(Msg) {
  let page = case model.route {
    model.Resume -> resume.view()
    model.Writings(title) -> view_writing(title)
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
