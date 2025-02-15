import HeroHeader from "./components/hero-header"
import BlogPost from "./components/blog-post"

export default function App() {
  return (
    <div id="app" className="min-h-screen bg-[rgb(10,10,30)]">
      <HeroHeader />
      <BlogPost />
    </div>
  )
}