import ReactMarkdown from "react-markdown"
import { useState, useEffect } from "react"

export default function BlogPost() {
  const [articleZero, setArticleZero] = useState("")
  const [articleSpaceLab, setArticleSpaceLab] = useState("")
  const [articleConclusion, setArticleConclusion] = useState("")

  useEffect(() => {
    try {
      fetch("./Mission_0.md").then(res => { if (!res.headers.get("Content-Type")?.startsWith("text/markdown")) throw new Error("Wrong Content-Type."); return res.text() }).then(restext => setArticleZero(restext)).catch(err => console.error(err));
    } catch (err) {
      console.error(err);
    }
    try {
      fetch("./Mission_SpaceLab.md").then(res => { if (!res.headers.get("Content-Type")?.startsWith("text/markdown")) throw new Error("Wrong Content-Type."); return res.text() }).then(restext => setArticleSpaceLab(restext)).catch(err => console.error(err));
    } catch (err) {
      console.error(err);
    }
    try {
      fetch("./Záver.md").then(res => { if (!res.headers.get("Content-Type")?.startsWith("text/markdown")) throw new Error("Wrong Content-Type."); return res.text() }).then(restext => setArticleConclusion(restext)).catch(err => console.error(err));
    } catch (err) {
      console.error(err);
    }
  }, [])

  return (
    <article className="max-w-3xl mx-auto px-4 py-8 font-noto flex flex-col gap-y-8 selection:bg-white selection:text-[rgb(10,10,30)]">
      <ReactMarkdown className="prose prose-invert max-w-none">{articleZero}</ReactMarkdown>
      <br /><br /><br /><ReactMarkdown className={"prose prose-invert max-w-none"}>---</ReactMarkdown><br /><br /><br />
      <ReactMarkdown className="prose prose-invert max-w-none">{articleSpaceLab}</ReactMarkdown>
      <br /><br /><br /><ReactMarkdown className={"prose prose-invert max-w-none"}>---</ReactMarkdown><br /><br /><br />
      <ReactMarkdown className="prose prose-invert max-w-none">{articleConclusion}</ReactMarkdown>
      <i className="text-xs text-neutral-400 text-center">Vypracovali <b>Peter Hošták</b>, <b>Samuel Hájek</b>, <b>Peter Kučera</b>, <b>Richard Kužela</b>, <b>Dominik Temiak</b> a <b>Tomáš Moško</b></i>
    </article>
  )
}

