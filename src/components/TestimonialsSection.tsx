export function TestimonialsSection() {
  return (
    <section className="py-20 px-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-12 text-center font-unbounded">What People Say</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <blockquote className="text-gray-300 italic mb-4">
            "Irakoze is a methodical thinker who approaches every challenge with precision and creativity. His systematic approach to problem-solving has been invaluable to our team's success."
          </blockquote>
          <cite className="text-white font-semibold">- Senior Developer, Tech Corp</cite>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <blockquote className="text-gray-300 italic mb-4">
            "Working with Irakoze has been a pleasure. His reliability and clear communication make him an outstanding collaborator. He consistently delivers high-quality work on time."
          </blockquote>
          <cite className="text-white font-semibold">- Project Manager, Startup Inc</cite>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <blockquote className="text-gray-300 italic mb-4">
            "Irakoze's strong work ethic and dedication to excellence shine through in everything he does. He's not just technically proficient but also great at mentoring junior developers."
          </blockquote>
          <cite className="text-white font-semibold">- Lead Engineer, Innovation Labs</cite>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <blockquote className="text-gray-300 italic mb-4">
            "His ability to design scalable systems that perform under pressure is remarkable. Irakoze consistently thinks ahead and builds for the future."
          </blockquote>
          <cite className="text-white font-semibold">- CTO, Enterprise Solutions</cite>
        </div>
      </div>
    </section>
  );
}
