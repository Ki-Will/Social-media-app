export function SkillsSection() {
  return (
    <section className="py-20 px-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-12 text-center font-unbounded">Technical Skills & Expertise</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Formal Training</h3>
          <ul className="text-gray-300 space-y-2">
            <li>• Software Engineering - Comprehensive education in software development principles and practices</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Backend Development</h3>
          <ul className="text-gray-300 space-y-2">
            <li>• Node.js, Express - Building robust server-side applications and APIs</li>
            <li>• Python, Django - Web development with scalable frameworks</li>
            <li>• PostgreSQL, MongoDB - Database design and management for various data models</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Full-Stack Integration</h3>
          <ul className="text-gray-300 space-y-2">
            <li>• React, TypeScript - Modern frontend development with type safety</li>
            <li>• Next.js, Tailwind CSS - Full-stack React frameworks and utility-first styling</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Advanced Topics</h3>
          <ul className="text-gray-300 space-y-2">
            <li>• AI/ML - Implementing machine learning solutions and intelligent systems</li>
            <li>• 3D Design (Blender, Three.js) - Creating immersive 3D experiences and visualizations</li>
            <li>• System Architecture - Designing scalable and maintainable software architectures</li>
            <li>• Cloud Solutions (AWS, GCP) - Deploying and managing applications in the cloud</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
