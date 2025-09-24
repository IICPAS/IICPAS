export default function BlogHero({ blogTitle }) {
  return (
    <section className="relative bg-gradient-to-br from-[#afffe8] via-white to-[#b8e6ff] py-16 md:py-20 px-4 md:px-20 pl-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mt-8">
        {blogTitle || "Blog Post"}
      </h1>
      <p className="mt-2 text-sm text-gray-500 font-medium ">
        Home // Our Blogs // {blogTitle || "Blog Post"}
      </p>
    </section>
  );
}
