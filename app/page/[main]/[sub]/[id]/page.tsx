/* ****************************************************
 *  import
 * ****************************************************/
import { JSDOM } from "jsdom";
import { marked } from "marked";
import matter from 'gray-matter';
import path from "path";
import fs from "fs/promises";
import { ReactElement } from 'react';

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

type Prop = {
  params: Promise<{
    main: string
    sub: string
    id: string
  }>
}

/* ****************************************************
 *  function BlogPage
 * ****************************************************/
export default async function BlogPage({ params }: Prop): Promise<ReactElement> {
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

  // dom create
  const domHtml = new JSDOM(html).window.document;

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

  // return
  return (
    <>
      <div className="mx-auto px-2 py-4 bg-gray-50" id="article">

        <a href="http://localhost:3000/index"
          style={{
            paddingLeft: "20px"
          }}>Go to Back
        </a>

        <div className="flex flex-row">

          <div className="hidden md:block w-72 ml-4 mr-4">
            <div className="flex flex-col sticky top-6">
              <div className="p-4 shadow-md rounded-md mb-8 bg-white ">
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

            <details open>
              <summary>meta</summary>
              <small className="text-gray-500">タイトル : {blogData.title}</small> <br />
              <small className="text-gray-500">投稿日 : {blogData.date}</small> <br />
              <small className="text-gray-500">投稿者 : {blogData.author}</small> <br />
              <small className="text-gray-500">履歴 : </small> <br />

              <table>
                <tbody>
                  <tr className="text-gray-500">
                    <th>No</th><th>日付</th><th>変更内容</th>
                  </tr>
                  {blogData.history.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.date}</td>
                      <td>{item.change}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>

            <div style={{ minHeight: "1000px" }}
              dangerouslySetInnerHTML={{ __html: blogData.blogContentHtml }}
            />

          </div>

        </div>
      </div>
    </>
  );
}