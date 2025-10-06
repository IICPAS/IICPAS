import ThinHeroSection from "../../components/ThinHeroSection";

export default function BlogHero({ blogTitle }) {
  return (
    <ThinHeroSection
      title={blogTitle || "Blog Post"}
      breadcrumb={`Home // Our Blogs // ${blogTitle || "Blog Post"}`}
    />
  );
}
