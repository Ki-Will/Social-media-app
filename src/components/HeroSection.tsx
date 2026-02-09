export function HeroSection() {
  return (
    <section className="py-20 px-4 max-w-4xl mx-auto text-center">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 font-unbounded">
        Irakoze Prince Bonheur
      </h1>
      <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 font-unbounded">
        BUILDING SYSTEMS THAT SCALE BEYOND INDIVIDUALS
      </h2>
      <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
        A systematic approach to scalable software solutions, focusing on engineering excellence and long-term impact.
      </p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-3">Design & Plan</h3>
          <p className="text-gray-300">Strategic planning and architectural design to lay the foundation for robust systems.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-3">Build & Develop</h3>
          <p className="text-gray-300">Implementation of scalable solutions using modern technologies and best practices.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-3">Deploy & Scale</h3>
          <p className="text-gray-300">Seamless deployment and optimization for growing user bases and enterprise needs.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-3">Continuous Growth</h3>
          <p className="text-gray-300">Ongoing maintenance, updates, and evolution to ensure sustained performance.</p>
        </div>
      </div>
    </section>
  );
}
