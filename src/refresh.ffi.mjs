export const refresh = () => {
  setTimeout(() => {
    MathJax.typeset();
  }, 0);
};

export const retitle = (newTitle) => {
  setTimeout(() => {
    document.title = newTitle;
  });
};
