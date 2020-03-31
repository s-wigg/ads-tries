export const loadTemplate = (name, clone = true) => {
  const selector = `.template--${name}`;
  const template = document.querySelector(selector);

  if (!template) {
    throw new Error(`Could not load template - query for selector ${selector} returned nothing`);
  }

  if (clone) {
    return template.content.cloneNode(true);
  } else {
    return template;
  }
}