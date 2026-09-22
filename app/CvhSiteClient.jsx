"use client";

import App from "../src/App.jsx";
import { applySiteContent } from "../src/data/site.js";

export default function CvhSiteClient({ content }) {
  applySiteContent(content);
  return <App />;
}
