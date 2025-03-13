import lustre/attribute
import lustre/element/html

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
