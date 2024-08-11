// To parse this data:
//
//   import { Convert, Icons } from "./file";
//
//   const icons = Convert.toIcons(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface IconsInterface {
  groups: Books;
  books: Books;
  verified: Books;
  frame: Books;
  tools: Books;
  dashboard: Books;
  house: AccordionActive;
  arrowUp: AccordionActive;
  checkCircle: CheckCircle;
  bookmark: Bookmark;
  arrowRight: AccordionActive;
  facebook: Facebook;
  x: Facebook;
  linkedIn: Facebook;
  share: AccordionActive;
  github: Books;
  arrowRightStatic: AccordionActive;
  openInNew: AccordionActive;
  accordionNotActive: AccordionActive;
  accordionActive: AccordionActive;
  xFooter: Footer;
  facebookFooter: Footer;
  githubFooter: Footer;
  googleFooter: Footer;
  slackFooter: Footer;
  quotation: Books;
  question: AccordionActive;
  chatBubble: AccordionActive;
  mapPin: AccordionActive;
  envelopeOpen: AccordionActive;
  earth: AccordionActive;
  guides: AccordionActive;
  puzzle: AccordionActive;
  rocket: AccordionActive;
  hammer: AccordionActive;
  sparks: AccordionActive;
  community: AccordionActive;
  chevronDown: AccordionActive;
}

export interface AccordionActive {
  paths: AccordionActivePath[];
  class: string;
  width?: number;
  height?: number;
  viewBox: ViewBox;
  fill: Fill;
  strokeWidth: string;
  strokeLinecap: StrokeLine;
  strokeLinejoin: StrokeLine;
  stroke: Stroke;
}

export enum Fill {
  None = "none",
}

export interface AccordionActivePath {
  d: string;
}

export enum Stroke {
  CurrentColor = "currentColor",
}

export enum StrokeLine {
  Round = "round",
}

export enum ViewBox {
  The002424 = "0 0 24 24",
}

export interface Bookmark {
  paths: BookmarkPath[];
  class: string;
  width: number;
  height: number;
  viewBox: ViewBox;
  fill: Fill;
  strokeWidth: string;
  strokeLinecap: StrokeLine;
  strokeLinejoin: StrokeLine;
  stroke: Stroke;
}

export interface BookmarkPath {
  d: string;
  class: string;
}

export interface Books {
  paths: AccordionActivePath[];
  class: string;
  width: number;
  height: number;
  viewBox: string;
  fill?: Stroke;
}

export interface CheckCircle {
  paths: AccordionActivePath[];
  class: string;
  viewBox: string;
  fill: Stroke;
  fillRule: string;
  clipRule: string;
}

export interface Facebook {
  paths: AccordionActivePath[];
  class: string;
  viewBox: ViewBox;
  stroke: Stroke;
}

export interface Footer {
  paths: AccordionActivePath[];
  class: string;
  viewBox: ViewBox;
  fill: Stroke;
  title: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toIcons(json: string): IconsInterface {
    return cast(JSON.parse(json), r("Icons"));
  }

  public static iconsToJson(value: IconsInterface): string {
    return JSON.stringify(uncast(value, r("Icons")), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ""): never {
  const prettyTyp = prettyTypeName(typ);
  const parentText = parent ? ` on ${parent}` : "";
  const keyText = key ? ` for key "${key}"` : "";
  throw Error(
    `Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`,
  );
}

function prettyTypeName(typ: any): string {
  if (Array.isArray(typ)) {
    if (typ.length === 2 && typ[0] === undefined) {
      return `an optional ${prettyTypeName(typ[1])}`;
    } else {
      return `one of [${typ
        .map((a) => {
          return prettyTypeName(a);
        })
        .join(", ")}]`;
    }
  } else if (typeof typ === "object" && typ.literal !== undefined) {
    return typ.literal;
  } else {
    return typeof typ;
  }
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(
  val: any,
  typ: any,
  getProps: any,
  key: any = "",
  parent: any = "",
): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key, parent);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val, key, parent);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(
      cases.map((a) => {
        return l(a);
      }),
      val,
      key,
      parent,
    );
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue(l("Date"), val, key, parent);
    }
    return d;
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any,
  ): any {
    if (val === null || typeof val !== "object" || Array.isArray(val)) {
      return invalidValue(l(ref || "object"), val, key, parent);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, key, ref);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key, ref);
      }
    });
    return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val, key, parent);
  }
  if (typ === false) return invalidValue(typ, val, key, parent);
  let ref: any = undefined;
  while (typeof typ === "object" && typ.ref !== undefined) {
    ref = typ.ref;
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers")
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty("arrayItems")
        ? transformArray(typ.arrayItems, val)
        : typ.hasOwnProperty("props")
          ? transformObject(getProps(typ), typ.additional, val)
          : invalidValue(typ, val, key, parent);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
  return { literal: typ };
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  Icons: o(
    [
      { json: "groups", js: "groups", typ: r("Books") },
      { json: "books", js: "books", typ: r("Books") },
      { json: "verified", js: "verified", typ: r("Books") },
      { json: "frame", js: "frame", typ: r("Books") },
      { json: "tools", js: "tools", typ: r("Books") },
      { json: "dashboard", js: "dashboard", typ: r("Books") },
      { json: "house", js: "house", typ: r("AccordionActive") },
      { json: "arrowUp", js: "arrowUp", typ: r("AccordionActive") },
      { json: "checkCircle", js: "checkCircle", typ: r("CheckCircle") },
      { json: "bookmark", js: "bookmark", typ: r("Bookmark") },
      { json: "arrowRight", js: "arrowRight", typ: r("AccordionActive") },
      { json: "facebook", js: "facebook", typ: r("Facebook") },
      { json: "x", js: "x", typ: r("Facebook") },
      { json: "linkedIn", js: "linkedIn", typ: r("Facebook") },
      { json: "share", js: "share", typ: r("AccordionActive") },
      { json: "github", js: "github", typ: r("Books") },
      {
        json: "arrowRightStatic",
        js: "arrowRightStatic",
        typ: r("AccordionActive"),
      },
      { json: "openInNew", js: "openInNew", typ: r("AccordionActive") },
      {
        json: "accordionNotActive",
        js: "accordionNotActive",
        typ: r("AccordionActive"),
      },
      {
        json: "accordionActive",
        js: "accordionActive",
        typ: r("AccordionActive"),
      },
      { json: "xFooter", js: "xFooter", typ: r("Footer") },
      { json: "facebookFooter", js: "facebookFooter", typ: r("Footer") },
      { json: "githubFooter", js: "githubFooter", typ: r("Footer") },
      { json: "googleFooter", js: "googleFooter", typ: r("Footer") },
      { json: "slackFooter", js: "slackFooter", typ: r("Footer") },
      { json: "quotation", js: "quotation", typ: r("Books") },
      { json: "question", js: "question", typ: r("AccordionActive") },
      { json: "chatBubble", js: "chatBubble", typ: r("AccordionActive") },
      { json: "mapPin", js: "mapPin", typ: r("AccordionActive") },
      { json: "envelopeOpen", js: "envelopeOpen", typ: r("AccordionActive") },
      { json: "earth", js: "earth", typ: r("AccordionActive") },
      { json: "guides", js: "guides", typ: r("AccordionActive") },
      { json: "puzzle", js: "puzzle", typ: r("AccordionActive") },
      { json: "rocket", js: "rocket", typ: r("AccordionActive") },
      { json: "hammer", js: "hammer", typ: r("AccordionActive") },
      { json: "sparks", js: "sparks", typ: r("AccordionActive") },
      { json: "community", js: "community", typ: r("AccordionActive") },
      { json: "chevronDown", js: "chevronDown", typ: r("AccordionActive") },
    ],
    false,
  ),
  AccordionActive: o(
    [
      { json: "paths", js: "paths", typ: a(r("AccordionActivePath")) },
      { json: "class", js: "class", typ: "" },
      { json: "width", js: "width", typ: u(undefined, 0) },
      { json: "height", js: "height", typ: u(undefined, 0) },
      { json: "viewBox", js: "viewBox", typ: r("ViewBox") },
      { json: "fill", js: "fill", typ: r("Fill") },
      { json: "strokeWidth", js: "strokeWidth", typ: "" },
      { json: "strokeLinecap", js: "strokeLinecap", typ: r("StrokeLine") },
      { json: "strokeLinejoin", js: "strokeLinejoin", typ: r("StrokeLine") },
      { json: "stroke", js: "stroke", typ: r("Stroke") },
    ],
    false,
  ),
  AccordionActivePath: o([{ json: "d", js: "d", typ: "" }], false),
  Bookmark: o(
    [
      { json: "paths", js: "paths", typ: a(r("BookmarkPath")) },
      { json: "class", js: "class", typ: "" },
      { json: "width", js: "width", typ: 0 },
      { json: "height", js: "height", typ: 0 },
      { json: "viewBox", js: "viewBox", typ: r("ViewBox") },
      { json: "fill", js: "fill", typ: r("Fill") },
      { json: "strokeWidth", js: "strokeWidth", typ: "" },
      { json: "strokeLinecap", js: "strokeLinecap", typ: r("StrokeLine") },
      { json: "strokeLinejoin", js: "strokeLinejoin", typ: r("StrokeLine") },
      { json: "stroke", js: "stroke", typ: r("Stroke") },
    ],
    false,
  ),
  BookmarkPath: o(
    [
      { json: "d", js: "d", typ: "" },
      { json: "class", js: "class", typ: "" },
    ],
    false,
  ),
  Books: o(
    [
      { json: "paths", js: "paths", typ: a(r("AccordionActivePath")) },
      { json: "class", js: "class", typ: "" },
      { json: "width", js: "width", typ: 0 },
      { json: "height", js: "height", typ: 0 },
      { json: "viewBox", js: "viewBox", typ: "" },
      { json: "fill", js: "fill", typ: u(undefined, r("Stroke")) },
    ],
    false,
  ),
  CheckCircle: o(
    [
      { json: "paths", js: "paths", typ: a(r("AccordionActivePath")) },
      { json: "class", js: "class", typ: "" },
      { json: "viewBox", js: "viewBox", typ: "" },
      { json: "fill", js: "fill", typ: r("Stroke") },
      { json: "fillRule", js: "fillRule", typ: "" },
      { json: "clipRule", js: "clipRule", typ: "" },
    ],
    false,
  ),
  Facebook: o(
    [
      { json: "paths", js: "paths", typ: a(r("AccordionActivePath")) },
      { json: "class", js: "class", typ: "" },
      { json: "viewBox", js: "viewBox", typ: r("ViewBox") },
      { json: "stroke", js: "stroke", typ: r("Stroke") },
    ],
    false,
  ),
  Footer: o(
    [
      { json: "paths", js: "paths", typ: a(r("AccordionActivePath")) },
      { json: "class", js: "class", typ: "" },
      { json: "viewBox", js: "viewBox", typ: r("ViewBox") },
      { json: "fill", js: "fill", typ: r("Stroke") },
      { json: "title", js: "title", typ: "" },
    ],
    false,
  ),
  Fill: ["none"],
  Stroke: ["currentColor"],
  StrokeLine: ["round"],
  ViewBox: ["0 0 24 24"],
};
