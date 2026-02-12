export default function AboutPage() {
  return (
    <section>
      <h1>About Me</h1>
      <p>
        I am a full-stack developer focused on resilient systems, accessible interfaces,
        and maintainable code.
      </p>
      <div className="grid two">
        <article className="card">
          <h3>Skills</h3>
          <p>React, Node.js, Express, MongoDB, API design, testing.</p>
        </article>
        <article className="card">
          <h3>Timeline</h3>
          <p>2022-Now: Building production web apps and developer tooling.</p>
          <p><a href="#">Download Resume</a></p>
        </article>
      </div>
    </section>
  );
}
