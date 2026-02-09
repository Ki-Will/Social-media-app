export function ProjectsSection() {
  return (
    <section className="py-20 px-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-12 text-center font-unbounded">Selected Projects</h2>
      
      <div className="space-y-12">
        <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
          <h3 className="text-2xl font-semibold text-white mb-4">Blink Campus System</h3>
          <p className="text-gray-300 mb-4">
            A comprehensive campus management platform designed to streamline administrative processes and enhance student experience.
          </p>
          <ul className="text-gray-300 space-y-2">
            <li>• Led UI/UX design for intuitive user interfaces</li>
            <li>• Wrote detailed technical documentation for system architecture</li>
            <li>• Participated in backend development using Node.js and PostgreSQL</li>
          </ul>
        </div>
        
        <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
          <h3 className="text-2xl font-semibold text-white mb-4">Sapient Learning</h3>
          <p className="text-gray-300 mb-4">
            An AI-powered learning management system that adapts to individual learning styles and provides personalized educational content.
          </p>
          <ul className="text-gray-300 space-y-2">
            <li>• Developed full-stack features with React and Django</li>
            <li>• Integrated AI/ML components for personalized learning recommendations</li>
            <li>• Ensured scalable architecture and cloud deployment on AWS</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
