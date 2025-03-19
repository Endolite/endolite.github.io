export const refresh = () => {
  setTimeout(() => {
    MathJax.typeset();
  }, 0);
};
