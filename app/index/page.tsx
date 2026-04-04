/* ****************************************************
 *  import
 * ****************************************************/
import fs from "fs";
import path from "path";
export const runtime = "nodejs";

/* ****************************************************
 *  function BlogListPage
 * ****************************************************/
export default async function BlogListPage() {

  // get Directory list
  const docsAllDirPath = path.join(process.cwd(), "docs");
  const getDirs = await fs.readdirSync(docsAllDirPath, { withFileTypes: true });

  const getFillDirs = getDirs
    .filter((file) => file.isDirectory())
    .map((file) => file.name);

  // get markdown file list
  const DirAndmdFile_Table = getFillDirs.map((main) => {
    const DirAllmdFile = path.join(docsAllDirPath, main);
    const getFiles = fs.readdirSync(DirAllmdFile, { withFileTypes: true });

    const getFillSubDirs = getFiles
      .filter((file) => file.isDirectory())
      .map((file) => file.name);

    // get markdown file list for sub directory
    const subs = getFillSubDirs.map((subs) => {

      const DirAllmdFile = path.join(docsAllDirPath, main, subs);
      const getFiles = fs.readdirSync(DirAllmdFile, { withFileTypes: true });
      const getFilleDiles = getFiles
        .filter((f) => f.isFile() && f.name.endsWith(".md"))
        .map((f) => `${f.name.replace(".md", "")}`);

      return {
        sub: subs,
        files: getFilleDiles
      };

    });

    return {
      main,
      subs
    };
  });

  // get docs directry markdown file list
  const getDocsFiles = getDirs
    .filter((file) => file.name.endsWith(".md"))
    .map((file) => file.name);

  // return
  return (
    <div style={{ padding: 20, minHeight: "100vh" }}>
      <h1>Markdown 一覧</h1>

      {DirAndmdFile_Table.map((main) => (
        <div key={main.main} style={{ marginBottom: 20 }}>
          <h2>{main.main}</h2>
          
          {main.subs.map((sub) => (
            <div key={`${main.main}-${sub.sub}`}>
              <h3>{sub.sub}</h3>
              <ul>
                {sub.files.map((file) => (
                  <li key={file}>
                    <a href={`/page/${main.main}/${sub.sub}/${file}`}>
                      {file}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

      ))}

    </div>
  );
}
