export function elt(
  tagName: string,
  attrs: Record<string, string>,
  ...children: (HTMLElement | string)[]
): HTMLElement {
  const element = document.createElement(tagName);

  for (const [attrName, attrValue] of Object.entries(attrs)) {
    element.setAttribute(attrName, attrValue);
  }

  for (const child of children) {
    if (!(child instanceof Element)) {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  }

  return element;
}
