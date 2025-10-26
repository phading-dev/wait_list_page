import { E } from "@selfage/element/factory";

export function createSecountBrandIcon(size: number): HTMLDivElement {
  return E.div(
    {
      style: `display: flex; flex-flow: row nowrap; align-items: center; height: ${size}rem; font-size: ${size}rem; line-height: 1;`,
    },
    E.text("SEC"),
    createSecountLogoIcon("text-blue-400"),
    E.text("UNT"),
  );
}

export function createSecountLogoIcon(colorClass: string): SVGSVGElement {
  return E.svg(
    {
      class: `logo-icon ${colorClass}`,
      style: `height: 100%; fill: none; stroke: currentColor;`,
      viewBox: "-2 -2.8 24 24",
      "aria-label": "O",
    },
    E.svgTitle({}, E.text("O")),
    // 50 deg to 10 deg
    E.path({
      d: `M17.66 3.57 A10 10 0 1 1 11.74 .15`,
      "stroke-width": "2.5",
    }),
    // 20 deg to 40 deg
    E.path({
      d: `M13.42 0.6 A10 10 0 0 1 16.43 2.34`,
      "stroke-width": "7",
    }),
    E.path({
      d: `M15 10 L7.5 14.33 L7.5 5.67z`,
      "stroke-width": "2.5",
      "stroke-linejoin": "round",
    }),
  );
}

export function createFandazyBrandIcon(size: number): HTMLDivElement {
  return E.div(
    {
      style: `display: flex; flex-flow: row nowrap; align-items: center; height: ${size}rem; font-size: ${size}rem; line-height: 1; font-family: sans-serif;`,
    },
    E.span({ class: `text-pink-500` }, E.text("F")),
    E.text("ANDAZY"),
  );
}
