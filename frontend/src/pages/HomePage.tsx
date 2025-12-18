import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Code2, 
  Building2, 
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Layers,
  Play
} from 'lucide-react';
import { patternsData, getProblemStats, getAllCompanies } from '../data';

const HomePage = () => {
  const stats = getProblemStats();
  const allCompanies = getAllCompanies().slice(0, 14);
  const totalPatterns = patternsData.length;
  const totalCompanies = getAllCompanies().length;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--primary-500)]/10 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--accent-purple)]/10 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[var(--primary-500)]/10 border border-[var(--primary-500)]/20 mb-10 sm:mb-12">
              <span className="animate-pulse w-3 h-3 rounded-full bg-[var(--accent-green)]"></span>
              <span className="text-base font-semibold text-[var(--primary-400)]">Premium DSA Platform for FAANG Prep</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-8 sm:mb-10 leading-tight">
              Master DSA,<br />
              <span className="text-gradient">Crack Your Dream Job</span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-[var(--text-secondary)] max-w-3xl mb-14 sm:mb-16 leading-relaxed">
              Practice <span className="font-bold text-[var(--text-primary)]">{stats.totalProblems.toLocaleString()}+</span> curated LeetCode problems organized by <span className="text-[var(--primary-400)] font-semibold">companies</span> and <span className="text-[var(--accent-purple)] font-semibold">patterns</span>. Used by thousands to land offers at FAANG.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mb-16 sm:mb-20">
              <Link to="/problems" className="btn-primary text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-5 flex items-center gap-3">
                Start Practicing Free
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
              <Link to="/patterns" className="btn-secondary text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-5 flex items-center gap-3">
                <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                Explore Patterns
              </Link>
            </div>
            
            {/* Stats Grid - Centered */}
            <div className="w-full max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { value: `${stats.totalProblems.toLocaleString()}+`, label: 'Total Problems', color: 'var(--primary-400)' },
                  { value: stats.easy.toLocaleString(), label: 'Easy', color: 'var(--accent-green)' },
                  { value: stats.medium.toLocaleString(), label: 'Medium', color: 'var(--accent-yellow)' },
                  { value: stats.hard.toLocaleString(), label: 'Hard', color: 'var(--accent-red)' },
                ].map((stat, index) => (
                  <div 
                    key={index} 
                    className="card p-4 sm:p-6 lg:p-8 text-center hover:scale-105 transition-transform duration-300"
                  >
                    <div className="text-2xl sm:text-3xl lg:text-5xl font-black mb-2 sm:mb-3" style={{ color: stat.color }}>
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm lg:text-lg text-[var(--text-muted)] font-semibold">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gap between sections */}
      <div className="h-32 sm:h-40 lg:h-52"></div>

      {/* Companies Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black mb-6 sm:mb-8 lg:mb-10">Problems from Top Tech Companies</h2>
            <p className="text-base sm:text-lg lg:text-xl text-[var(--text-secondary)] mb-10 sm:mb-14 lg:mb-16">Practice real interview questions from leading companies</p>
            
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10 sm:mb-14 max-w-5xl">
              {allCompanies.map((company, index) => (
                <Link
                  key={index}
                  to={`/problems?company=${encodeURIComponent(company)}`}
                  className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-primary)] text-sm sm:text-base lg:text-lg font-semibold text-[var(--text-secondary)] hover:border-[var(--primary-500)] hover:text-[var(--primary-400)] transition-all cursor-pointer hover:scale-105"
                >
                  {company}
                </Link>
              ))}
            </div>
            
            <Link 
              to="/problems" 
              className="inline-flex items-center gap-2 text-[var(--accent-green)] hover:text-[var(--accent-green)]/80 font-bold text-base sm:text-lg transition-colors cursor-pointer"
            >
              +{totalCompanies - 14} more companies
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Gap between sections */}
      <div className="h-32 sm:h-40 lg:h-52"></div>

      {/* Features Section */}
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black mb-6 sm:mb-8 lg:mb-10">Everything You Need to Succeed</h2>
            <p className="text-base sm:text-lg lg:text-xl text-[var(--text-secondary)] max-w-3xl mb-12 sm:mb-16 lg:mb-20">
              A complete platform designed to help you master Data Structures and Algorithms and ace your technical interviews
            </p>
            
            <div className="w-full max-w-6xl mx-auto">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                {[
                  {
                    icon: Building2,
                    title: 'Company-Wise Problems',
                    description: 'Browse problems asked by specific companies with recency filters. Know exactly what to expect in your interviews.',
                    color: 'var(--primary-500)',
                    link: '/problems'
                  },
                  {
                    icon: BookOpen,
                    title: 'Pattern-Based Learning',
                    description: 'Master DSA through curated patterns. Learn to recognize and apply patterns to solve any problem.',
                    color: 'var(--accent-purple)',
                    link: '/patterns'
                  },
                  {
                    icon: Layers,
                    title: `${totalPatterns}+ Patterns`,
                    description: 'Comprehensive pattern coverage from basic to advanced. Structured learning path for systematic improvement.',
                    color: 'var(--accent-blue)'
                  },
                  {
                    icon: TrendingUp,
                    title: 'Track Progress',
                    description: 'Mark problems as solved and track your improvement. Visualize your journey to interview readiness.',
                    color: 'var(--accent-green)'
                  },
                  {
                    icon: CheckCircle2,
                    title: 'Difficulty Levels',
                    description: 'Problems categorized by Easy, Medium, and Hard. Start at your level and progressively challenge yourself.',
                    color: 'var(--accent-yellow)'
                  },
                  {
                    icon: Code2,
                    title: 'Premium Content',
                    description: 'Access premium problems from LeetCode with detailed company and topic information.',
                    color: 'var(--accent-red)'
                  }
                ].map((feature, index) => (
                  <div key={index} className="card p-6 sm:p-8 lg:p-10 text-center group hover:scale-[1.02] transition-all duration-300">
                    <div 
                      className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 lg:mb-8 mx-auto transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${feature.color}20` }}
                    >
                      <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10" style={{ color: feature.color }} />
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4">{feature.title}</h3>
                    <p className="text-sm sm:text-base lg:text-lg text-[var(--text-secondary)] leading-relaxed mb-4 sm:mb-5 lg:mb-6">{feature.description}</p>
                    {feature.link && (
                      <Link 
                        to={feature.link}
                        className="inline-flex items-center gap-2 font-bold text-sm sm:text-base lg:text-lg transition-colors cursor-pointer"
                        style={{ color: feature.color }}
                      >
                        Explore
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gap between sections */}
      <div className="h-32 sm:h-40 lg:h-52"></div>

      {/* Quick Stats Showcase */}
      <section className="py-16 sm:py-24 lg:py-32 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black mb-6 sm:mb-8 lg:mb-10">
              Why Choose <span className="text-gradient">EduHub</span>?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-[var(--text-secondary)] max-w-2xl mb-12 sm:mb-16 lg:mb-20">
              Everything you need to ace your technical interviews
            </p>
            
            <div className="w-full max-w-5xl mx-auto mb-12 sm:mb-16 lg:mb-20">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {[
                  { stat: `${stats.totalProblems}+`, text: 'LeetCode Problems', color: 'var(--primary-400)' },
                  { stat: `${totalCompanies}+`, text: 'Companies', color: 'var(--accent-blue)' },
                  { stat: `${totalPatterns}+`, text: 'DSA Patterns', color: 'var(--accent-purple)' },
                  { stat: '4', text: 'Recency Levels', color: 'var(--accent-green)' }
                ].map((item, index) => (
                  <div key={index} className="card p-5 sm:p-6 lg:p-8 text-center hover:scale-105 transition-transform duration-300">
                    <div className="text-2xl sm:text-3xl lg:text-5xl font-black mb-2 sm:mb-3 lg:mb-4" style={{ color: item.color }}>
                      {item.stat}
                    </div>
                    <p className="text-xs sm:text-sm lg:text-lg text-[var(--text-muted)] font-semibold">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="w-full max-w-5xl mx-auto">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {[
                  { icon: '🎯', title: 'Targeted Practice', desc: 'Focus on companies you want to join' },
                  { icon: '📈', title: 'Track Progress', desc: 'See your improvement over time' },
                  { icon: '🧠', title: 'Pattern Mastery', desc: 'Learn once, solve many' },
                  { icon: '⚡', title: 'Quick Filters', desc: 'Find problems instantly' }
                ].map((item, index) => (
                  <div key={index} className="card p-5 sm:p-6 lg:p-8 text-center hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl sm:text-4xl lg:text-5xl mb-4 sm:mb-5 lg:mb-6">{item.icon}</div>
                    <h4 className="text-base sm:text-lg lg:text-xl font-bold mb-2 sm:mb-3">{item.title}</h4>
                    <p className="text-xs sm:text-sm lg:text-base text-[var(--text-muted)]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gap between sections */}
      <div className="h-32 sm:h-40 lg:h-52"></div>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black mb-6 sm:mb-8 lg:mb-10">Ready to Start Your Journey?</h2>
            <p className="text-base sm:text-lg lg:text-xl text-[var(--text-secondary)] mb-12 sm:mb-14 lg:mb-16 max-w-2xl">
              Join thousands of developers who have improved their problem-solving skills and landed their dream jobs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
              <Link to="/problems" className="btn-primary text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 flex items-center gap-3">
                Start with Company Problems
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
              <Link to="/patterns" className="btn-secondary text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 flex items-center gap-3">
                Start with Patterns
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gap before footer */}
      <div className="h-16 sm:h-20 lg:h-24"></div>

      {/* Footer */}
      <footer className="py-12 sm:py-16 lg:py-20 border-t border-[var(--border-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center gap-6 sm:gap-8 lg:gap-10">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-purple)] flex items-center justify-center">
                <Code2 className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="text-left">
                <span className="text-lg sm:text-xl lg:text-2xl font-black text-gradient">EduHub</span>
                <p className="text-xs sm:text-sm lg:text-base text-[var(--text-muted)]">PREMIUM DSA</p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-12">
              <Link to="/" className="text-sm sm:text-base lg:text-lg text-[var(--text-secondary)] hover:text-[var(--primary-400)] transition-colors font-medium">Home</Link>
              <Link to="/problems" className="text-sm sm:text-base lg:text-lg text-[var(--text-secondary)] hover:text-[var(--primary-400)] transition-colors font-medium">Company Problems</Link>
              <Link to="/patterns" className="text-sm sm:text-base lg:text-lg text-[var(--text-secondary)] hover:text-[var(--primary-400)] transition-colors font-medium">Pattern Wise</Link>
            </div>
            
            <p className="text-xs sm:text-sm lg:text-base text-[var(--text-muted)]">
              © {new Date().getFullYear()} EduHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
