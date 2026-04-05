/* ****************************************************
 *  import
 * ****************************************************/
import { JSDOM } from "jsdom";
import { marked } from "marked";
import matter from 'gray-matter';
import path from "path";
import fs from "fs/promises";
import fs2 from "fs";
import { ReactElement } from 'react';

import MetaSection from "@/components/metaSection";

/* ****************************************************
 *  type
 * ****************************************************/
type BlogData = {
  title: string;
  author: string;
  date: string;
  history: { id: string; date: string; change: string }[];
  blogContentHtml: string;
};

type TableOfContent = {
  level: string;
  title: string;
  href: string;
};

type getBackAndNextDocuments_table = {
  main: string
  sub: string
  id: string
};

type Prop = {
  params: Promise<{
    main: string
    sub: string
    id: string
  }>
}

/* ****************************************************
 *  function getBackAndNextDocuments
 * ****************************************************/
function getBackAndNextDocuments({ main, sub, id }: getBackAndNextDocuments_table) {

  const docsAllDirPath = path.join(process.cwd(), "docs", `${main}`, `${sub}`);
  const getDirs = fs2.readdirSync(docsAllDirPath, { withFileTypes: true });

  const getFillDirs = getDirs
    .filter((f) => f.isFile() && f.name.endsWith(".md"))
    .map((f) => `${f.name.replace(".md", "")}`);

  let preFilePath = null;
  let nextFilePath = null;
  for (var i = 0; i <= getFillDirs.length - 1; i++) {
    if (getFillDirs[i] === id) {
      if (getFillDirs[i - 1]) {
        preFilePath = path.join("/page", `${main}`, `${sub}`, `${getFillDirs[i - 1]}`);
      }
      if (getFillDirs[i + 1]) {
        nextFilePath = path.join("/page", `${main}`, `${sub}`, `${getFillDirs[i + 1]}`);
      }
      break;
    }
  }

  return {
    preFilePath,
    nextFilePath
  };
}

/* ****************************************************
 *  function MarkdonwToHtml
 * ****************************************************/
export default async function MarkdonwToHtml({ params }: Prop): Promise<ReactElement> {
  const { main } = await params;
  const { sub } = await params;
  const { id } = await params;

  // read markdown file
  const filePath = path.join(process.cwd(), "docs", `${main}`, `${sub}`, `${id}.md`);
  const markdown = await fs.readFile(filePath, "utf-8");

  // parse markdown file
  const { data, content } = matter(markdown);

  // convert markdown to html
  const html = await marked(content);

  // replace ../public to / for image path
  const replaceHtml = html.replace(/(\.\.\/)+public/g, "");

  // dom create
  const domHtml = new JSDOM(replaceHtml).window.document;

  // add html id attribute for anchor link
  const elements = domHtml.querySelectorAll<HTMLElement>("h1, h2");
  for (var i = 0; i <= elements.length - 1; i++) {
    elements[i].setAttribute("id", elements[i].textContent || "");
  }

  // for add id attribute
  const convHTML = domHtml.children[0].innerHTML;

  // create table of topic for anchor link
  const tableOfContent: TableOfContent[] = [];
  elements.forEach((element) => {
    const level = element.tagName;
    const title = element.textContent || "";
    const href = "#" + element.id;
    tableOfContent.push({ level, title, href });
  });

  // date format change
  if (!data.date) {
    data.date = "";
  } else {
    data.date = String(
      (new Date(data.date).getFullYear()) + "-" +
      (new Date(data.date).getMonth() + 1) + "-" +
      (new Date(data.date).getDate())
    );
  }

  // history date format change
  if (data.history) {
    data.history.forEach((item: { date: string }) => {
      item.date = String(
        (new Date(item.date).getFullYear()) + "-" +
        (new Date(item.date).getMonth() + 1) + "-" +
        (new Date(item.date).getDate())
      );
    });
  } else {
    data.history = [];
  }

  // blog data
  const blogData: BlogData = {
    title: data.title || "undefined",
    author: data.author || "undefined",
    date: data.date || "undefined",
    history: data.history || [],
    blogContentHtml: convHTML,
  };

  const ResultBackAndNextDocuments = getBackAndNextDocuments({ main: main, sub: sub, id: id });

  // return
  return (
    <>
      <div className="mx-auto px-2 py-4 bg-gray-50" id="article">
        <div className="flex flex-row">

          <div className="hidden md:block w-72 ml-4 mr-4">
            <div className="flex flex-col sticky top-6">
              <div className="p-4 shadow-md rounded-md mb-8 bg-white ">

                <a href="http://localhost:3000/index"
                  style={{
                    // paddingLeft: "20px"
                  }}>Go to Back
                </a><br />

                {ResultBackAndNextDocuments.preFilePath && <a href={ResultBackAndNextDocuments.preFilePath}>Previous</a>} <br />
                {ResultBackAndNextDocuments.nextFilePath && <a href={ResultBackAndNextDocuments.nextFilePath}>Next</a>}

                <h2>目次</h2>
                <ul>
                  {tableOfContent.map((anchor) => (
                    <li
                      key={`${anchor.href}-${anchor.title}`}
                    >
                      <a href={anchor.href}>{anchor.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="w-auto md:w-[calc(100%_-_16rem)] p-8 mr-8 shadow-md rounded-md bg-white">

            <MetaSection
              title={blogData.title}
              author={blogData.author}
              date={blogData.date}
              history={blogData.history}
            />

            <div style={{ minHeight: "100vh" }}
              dangerouslySetInnerHTML={{ __html: blogData.blogContentHtml }}
            />

          </div>
        </div>
      </div>
    </>
  );
}