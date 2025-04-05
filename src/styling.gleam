import lustre/attribute
import lustre/element
import lustre/element/html
import lustre/ui

pub fn br(size) {
  html.br([attribute.style([#("margin-bottom", size)])])
}

pub fn i(text) {
  html.i([], [element.text(text)])
}

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

pub fn hr() {
  html.hr([
    attribute.style([#("margin-top", "0.5em"), #("margin-bottom", "0.5em")]),
  ])
}

pub fn href_text(link llink, text ttext) {
  html.a([attribute.href(llink), attribute.class("clickable")], [
    element.text(ttext),
  ])
}

const styles = [
  #("font-family", "Computer Modern Serif !important"),
  #("font-size", "13pt"),
  #("color", "White"),
  #("background-color", "#20201E"),
  #("min-height", "100vh"),
  #("height", "100%"),
  #("margin", "0"),
]

pub fn mathjax_wrapper(page) {
  // let preamble = simplifile.read(from: "./latex_preamble.txt")
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
        attribute.attribute("type", "text/css"),
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
        a:hover {
          text-decoration: underline;
        }
        .element {
            font-feature-settings: 'liga' 1;
            -webkit-font-feature-settings: 'liga' 1;
            text-rendering: optimizeLegibility;
        }
      ",
      ),
    ]),
    html.body([attribute.style([#("padding", "20px")])], [
      ui.box([], [
        html.div(
          [
            attribute.style([
              #("max-height", "0"),
              #("color", "rgba(0, 0, 0, 0)"),
            ]),
          ],
          [
            element.text(
              "\\(
          \\require{action}
          \\require{boldsymbol}
          \\require{bussproofs}
          \\require{cases}
          \\require{centernot}
          \\require{mathtools}
          \\require{mhchem}
          \\require{physics}
          \\require{upgreek}
          \\require{verb}

          % Categories
            \\DeclareMathOperator{\\Aut}{Aut}
            \\DeclareMathOperator{\\End}{End}
            \\DeclareMathOperator{\\hom}{hom}
            \\DeclareMathOperator{\\Iso}{Iso}
            \\DeclareMathOperator{\\ob}{ob}
            \\newcommand{\\op}[1]{#1^{\\text{op}}}
            % Arrows
              \\DeclareMathOperator{\\lff}{\\leftrightsquigarrow}
              \\DeclareMathOperator{\\lrar}{\\leftrightarrow}
              \\DeclareMathOperator{\\hra}{\\hookrightarrow}
              \\DeclareMathOperator{\\impto}{\\dashrightarrow}
              \\DeclareMathOperator{\\opto}{\\leftrightarrows}
              \\DeclareMathOperator{\\parto}{\\rightrightarrows}
              \\DeclareMathOperator{\\qlff}{\\quad\\lff\\quad}
              \\DeclareMathOperator{\\qlto}{\\quad\\leadsto\\quad}
              \\DeclareMathOperator{\\rat}{\\rightarrowtail}
              \\DeclareMathOperator{\\rest}{{\\restriction}}
              \\DeclareMathOperator{\\rsq}{\\rightsquigarrow}
              \\DeclareMathOperator{\\thra}{\\twoheadrightarrow}
              % Labelled arrows
                \\newcommand{\\xto}[1]{\\xrightarrow{#1}}
          % Combinatorics
            \\DeclareMathOperator{\\cyc}{cyc}
            \\DeclareMathOperator{\\Des}{Des}
            \\DeclareMathOperator{\\des}{des}
            \\newcommand{\\en}[2]{\\genfrac{\\langle}{\\rangle}{0pt}{}{#1}{#2}}
            \\DeclareMathOperator{\\girth}{girth}
            \\DeclareMathOperator{\\maj}{maj}
            \\DeclareMathOperator{\\inv}{inv}
            \\DeclareMathOperator{\\indeg}{indeg}
            \\newcommand{\\multi}[2]{\\left(\\kern-.3em\\left(\\genfrac{}{}{0pt}{}{#1}{#2}\\right)\\kern-.3em\\right)}
            \\newcommand{\\npr}[2]{#1^{\\qty\\(#2)}}
            \\DeclareMathOperator{\\outdeg}{outdeg}
            \\DeclareMathOperator{\\per}{per}
            \\DeclareMathOperator{\\stimes}{\\mathbin{\\square}}
          % CS
            \\DeclareMathOperator{\\BV}{BV}
            \\DeclareMathOperator{\\Da}{\\Downarrow}
            \\DeclareMathOperator{\\depth}{depth}
            \\newcommand{\\evit}[1]{\\ev{\\tit{#1}}}
            \\newcommand{\\evt}[1]{\\ev{\\t{#1}}}
            \\DeclareMathOperator{\\FV}{FV}
            \\newcommand{\\hoare}[3]{\\qty(\\abs{#1})#2\\qty(\\abs{#3})}
            \\newcommand{\\lop}[3]{(\\(#1\\) \\(#2\\) \\(#3\\))}
            \\newcommand{\\lopt}[3]{\\text{(\\(\\#1\\) \\(#2\\) \\(#3\\))}}
            \\DeclareMathOperator{\\rename}{rename}
            \\newcommand{\\rep}[1]{\\texttt{⟦#1⟧}}
            \\newcommand{\\repm}[1]{⟦#1⟧}
            \\DeclareMathOperator{\\step}{step}
          % Differentials
            \\newcommand{\\vnabla}{\\vec{\\nabla}}
          % Functions
            \\DeclareMathOperator{\\cis}{cis}
            \\newcommand{\\ceil}[1]{\\left\\lceil #1 \\right\\rceil}
            \\DeclareMathOperator{\\erfc}{erfc}
            \\newcommand{\\floor}[1]{\\left\\lfloor #1 \\right\\rfloor}
            \\DeclareMathOperator{\\supp}{supp}
            \\DeclareMathOperator{\\sgn}{sgn}
            \\DeclareMathOperator{\\sinc}{sinc}
            \\DeclareMathOperator{\\Uscr}{\\mathscr{U}}
            % Transforms
              \\DeclareMathOperator{\\Ell}{\\mathscr{L}}
              \\DeclareMathOperator{\\id}{id}
          % Geometry
            \\DeclareMathOperator{\\vol}{vol}
          % Groups
            \\DeclareMathOperator{\\aut}{aut}
            \\DeclareMathOperator{\\Hom}{Hom}
            \\DeclareMathOperator{\\lcm}{lcm}
            \\DeclareMathOperator{\\ord}{ord}
            % Rings
              \\DeclareMathOperator{\\char}{char}
          % Integrals
            \\newcommand{\\oiint}{{\\subset\\!\\supset} \\llap{\\iint}}
            \\newcommand{\\oiiint}{{\\large{\\subset\\!\\supset}} \\llap{\\iiint}}
            \\newcommand{\\Ft}{\\mathcal{F}}
          % Lamina
            \\newcommand{\\bbar}[1]{\\bar{\\bar{#1}}}
          % Logic
            \\DeclareMathOperator{\\Atom}{Atom}
            \\DeclareMathOperator{\\CNF}{CNF}
            \\DeclareMathOperator{\\DNF}{DNF}
            \\DeclareMathOperator{\\Form}{Form}
            \\DeclareMathOperator{\\Func}{Func}
            \\newcommand{\\simp}{\\Longrightarrow}
            \\newcommand{\\smp}{\\Rightarrow}
            \\newcommand{\\siff}{\\Longleftrightarrow}
            \\newcommand{\\sff}{\\Leftrightarrow}
            \\newcommand{\\seq}{\\vdash\\!\\dashv}
            \\DeclareMathOperator{\\Sent}{Sent}
            \\DeclareMathOperator{\\Term}{Term}
            \\DeclareMathOperator{\\Th}{Th}
            \\newcommand{\\teq}{\\models\\!\\mid}
          % Matrices
            \\DeclareMathOperator{\\adj}{adj}
            \\DeclareMathOperator{\\Col}{Col}
            \\DeclareMathOperator{\\diag}{diag}
            \\DeclareMathOperator{\\Null}{null}
            \\DeclareMathOperator{\\nullity}{nullity}
            \\DeclareMathOperator{\\REF}{REF}
            \\newcommand{\\row}[1]{\\overrightarrow{\\mathrm{row}_{#1}}}
            \\DeclareMathOperator{\\Row}{Row}
            \\DeclareMathOperator{\\RREF}{RREF}
          % Measure Theory
            \\DeclareMathOperator{\\Bor}{Bor}
            \\DeclareMathOperator{\\esssup}{ess\\sup}
            \\DeclareMathOperator{\\Simp}{S{\\small IMP}}
            \\DeclareMathOperator{\\Step}{S{\\small TEP}}
            \\DeclareMathOperator{\\Trig}{Trig}
          % Numbers
            \\let\\Im\\relax
            \\DeclareMathOperator{\\Im}{Im}
            \\let\\Re\\relax
            \\DeclareMathOperator{\\Re}{Re}
          % Probability/Statistics
            \\DeclareMathOperator{\\AUC}{AUC}
            \\DeclareMathOperator{\\Bias}{Bias}
            \\DeclareMathOperator{\\Cov}{Cov}
            \\DeclareMathOperator{\\Exp}{\\mathbb{E}}
            \\newcommand{\\IQR}{\\mathrm{IQR}}
            \\DeclareMathOperator{\\loss}{loss}
            \\DeclareMathOperator{\\median}{median}
            \\DeclareMathOperator{\\MSE}{MSE}
            \\DeclareMathOperator{\\SSE}{SSE}
            \\DeclareMathOperator{\\sd}{sd}
            \\DeclareMathOperator{\\Var}{Var}
            % ISDs
              \\DeclareMathOperator{\\BS}{BS}
              \\DeclareMathOperator{\\IBS}{IBS}
              \\DeclareMathOperator{\\KM}{KM}
            % Distributions
              \\DeclareMathOperator{\\1}{\\mathbb{1}}
              \\DeclareMathOperator{\\Binomial}{Bin}
              \\DeclareMathOperator{\\Bin}{Bin}
              \\DeclareMathOperator{\\Exponential}{Exp}
              \\DeclareMathOperator{\\Expo}{Exp}
              \\DeclareMathOperator{\\Geometric}{Geom}
              \\DeclareMathOperator{\\Geom}{Geom}
              \\DeclareMathOperator{\\Hypergeometric}{Hyp}
              \\DeclareMathOperator{\\Hyp}{Hyp}
              \\DeclareMathOperator{\\Multinomial}{Mult}
              \\DeclareMathOperator{\\Mult}{Mult}
              \\DeclareMathOperator{\\NB}{NB}
              \\DeclareMathOperator{\\Norm}{\\mathcal{N}}
              \\DeclareMathOperator{\\Poisson}{Pois}
              \\DeclareMathOperator{\\Pois}{Pois}
              \\DeclareMathOperator{\\Uniform}{Uniform}
            % Tests
              \\newcommand{\\pval}{p\\text{-value}}
          % Relations
            \\DeclareMathOperator{\\codom}{codom}
            \\DeclareMathOperator{\\dom}{dom}
            \\DeclareMathOperator{\\field}{field}
            \\DeclareMathOperator{\\graph}{graph}
            \\DeclareMathOperator{\\ran}{ran}
            \\newcommand{\\treq}{\\triangleq}
            % Arrows
              \\newcommand{\\lrarr}{\\leftrightarrow}
              \\newcommand{\\Lrarr}{\\Leftrightarrow}
          % Sets
            \\newcommand{\\cmp}{\\mathsf{c}}
            \\DeclareMathOperator{\\glb}{glb}
            \\DeclareMathOperator{\\lub}{lub}
            \\newcommand{\\Mid}{\\hspace{1.25mm}\\middle|\\hspace{1.25mm}}
            \\renewcommand{\\P}{\\mathcal{P}}
            \\DeclareMathOperator{\\Perm}{Perm}
            \\DeclareMathOperator{\\sdf}{\\mathbin{\\triangle}}
            \\newcommand{\\sub}{\\subset}
            \\newcommand{\\sube}{\\subseteq}
            \\newcommand{\\supe}{\\supseteq}
          % Sequences
            \\DeclareMathOperator{\\LIM}{LIM}
            \\DeclareMathOperator*{\\liminf}{\\mathop{\\lim\\inf}}
            \\DeclareMathOperator*{\\limsup}{\\lim\\sup}
          % Topology
            \\DeclareMathOperator{\\Cl}{Cl}
            \\DeclareMathOperator*{\\boxtop}{\\square}
            \\DeclareMathOperator{\\diam}{diam}
            \\DeclareMathOperator{\\dist}{dist}
            \\DeclareMathOperator{\\Ext}{Ext}
            \\DeclareMathOperator{\\ext}{ext}
            \\DeclareMathOperator{\\Int}{Int}
          % Vectors
            \\DeclareMathOperator{\\comp}{comp}
            \\newcommand{\\coord}[3]{{}_{#1}\\qty[#2]_{#3}}
            \\renewcommand{\\curl}{\\mathrm{curl}}
            \\DeclareMathOperator{\\divg}{div}
            \\newcommand{\\norms}[1]{\\left|\\!\\left|\\!\\left|#1\\right|\\!\\right|\\!\\right|}
            \\newcommand{\\normt}[1]{\\Vert #1 \\Vert}
            \\DeclareMathOperator{\\orth}{orth}
            \\DeclareMathOperator{\\proj}{proj}
            \\DeclareMathOperator{\\span}{span}
            \\renewcommand{\\Vec}[1]{\\overrightarrow{#1}}

          % Symbols
            % Sets
              \\newcommand{\\A}{\\mathcal{A}}
              \\DeclareMathOperator{\\B}{\\mathcal{B}}
              \\newcommand{\\BB}{\\mathcal{B}}
              \\newcommand{\\C}{\\mathbb{C}}
              \\newcommand{\\CC}{\\mathcal{C}}
              \\newcommand{\\D}{\\mathcal{D}}
              \\newcommand{\\F}{\\mathbb{F}}
              \\newcommand{\\G}{\\mathcal{G}}
              \\newcommand{\\H}{\\mathbb{H}}
              \\newcommand{\\Hs}{\\mathcal{H}}
              \\newcommand{\\I}{\\mathbb{I}}
              \\newcommand{\\J}{\\mathcal{J}}
              \\newcommand{\\K}{\\mathbb{K}}
              \\newcommand{\\Kc}{\\mathcal{K}}
              \\newcommand{\\L}{\\mathcal{L}}
              \\newcommand{\\M}{\\mathcal{M}}
              \\newcommand{\\N}{\\mathbb{N}}
              \\DeclareMathOperator{\\O}{\\mathcal{O}}
              \\newcommand{\\Q}{\\mathbb{Q}}
              \\newcommand{\\Qc}{\\mathcal{Q}}
              \\newcommand{\\R}{\\mathbb{R}}
              \\newcommand{\\RR}{\\mathcal{R}}
              \\renewcommand{\\S}{\\mathbb{S}}
              \\newcommand{\\SS}{\\mathcal{S}}
              \\newcommand{\\T}{\\mathbb{T}}
              \\newcommand{\\U}{\\mathcal{U}}
              \\newcommand{\\V}{\\mathbb{V}}
              \\newcommand{\\W}{\\mathbb{W}}
              \\newcommand{\\Ws}{\\mathcal{W}}
              \\newcommand{\\X}{\\mathfrak{X}}
              \\newcommand{\\Y}{\\mathfrak{Y}}
              \\newcommand{\\Z}{\\mathbb{Z}}
              % Cardinality
                \\newcommand{\\cf}{\\mathfrak{c}}
              % Topology
                \\newcommand{\\Fm}{\\mathrm{F}}
                \\newcommand{\\Gm}{\\mathrm{G}}
            % Greek Letters
              \\newcommand{\\Alpha}{\\mathrm{A}}
              \\newcommand{\\emf}{\\mathcal{E}}
              \\newcommand{\\Iota}{\\mathrm{I}}
              \\newcommand{\\Mu}{\\mathrm{M}}
              \\newcommand{\\Tau}{\\mathcal{T}}
          % Vectors
            \\newcommand{\\vps}{\\hspace{0.5mm}}
            % Unit Vectors
              \\newcommand{\\vi}{\\text{\\^i}}
              \\newcommand{\\vj}{\\text{\\^j}}
              \\newcommand{\\vk}{\\text{\\^k}}
              \\newcommand{\\vr}{\\hat{r}}
              \\newcommand{\\vphi}{\\hat{\\varphi}}

          % Miscellaneous/Utilities
            \\newcommand{\\and}{\\text{ and }}
            \\newcommand{\\And}{\\qquad \\text{and} \\qquad}
            \\newcommand{\\andown}[2]{\\underset{#2}{\\underbrace{#1}}}
            \\newcommand{\\anup}[2]{\\overset{#2}{\\overbrace{#1}}}
            \\newcommand{\\bb}[1]{\\mathbb{#1}}
            \\newcommand{\\bf}[1]{\\textbf{#1}}
            \\newcommand{\\bs}[1]{\\boldsymbol{#1}}
            \\renewcommand{\\cal}[1]{\\mathcal{#1}}
            \\newcommand{\\clabel}[2]{\\begin{array}{c} #1 \\ #2 \\end{array}}
            \\newcommand{\\enquote}[1]{``#1''}
            \\newcommand{\\hsp}[1]{\\hspace{#1}}
            \\newcommand{\\mb}[1]{\\mathbin{#1}}
            \\renewcommand{\\not}{\\centernot}
            \\newcommand{\\oline}[1]{\\overline{#1}}
            \\renewcommand{\\rm}[1]{\\mathrm{#1}}
            \\newcommand{\\sc}[1]{{\\small #1}}
            \\renewcommand{\\sf}[1]{\\textsf{#1}}
            \\newcommand{\\subt}[2]{#1_{\\text{#2}}}
            \\newcommand{\\subttt}[2]{#1_{\\texttt{#2}}}
            \\newcommand{\\supt}[2]{#1^{\\text{#2}}}
            \\newcommand{\\system}[1]{\\left\\{\\begin{aligned}#1\\end{aligned}\\right.}
            \\newcommand{\\t}[1]{\\text{#1}}
            \\newcommand{\\tbf}[1]{\\textbf{#1}}
            \\newcommand{\\tit}[1]{\\textit{#1}}
            \\newcommand{\\ttt}[1]{\\texttt{#1}}
            \\newcommand{\\uline}[1]{\\underline{#1}}
          \\)",
            ),
          ],
        ),
        page,
      ]),
    ]),
  ])
}
