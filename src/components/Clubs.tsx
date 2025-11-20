import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const Clubs = () => {
  const { data: clubsData, isLoading } = useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      const response = await fetch('/api/clubs');
      if (!response.ok) throw new Error('Failed to fetch clubs');
      return response.json();
    },
  });

  const clubs = clubsData?.clubs || [];

  return (
    <section id="clubs" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our Clubs
          </h2>
          <p className="text-xl text-gray-400">
            Join local communities across Morocco's most fascinating cities
          </p>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-400">Loading clubs...</p>
          </div>
        ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club: any, index: number) => (
            <Link
              key={club.name}
              to={`/club/${club.id}`}
              className="group block animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-black border border-white/10 rounded-lg p-6 hover:border-yellow-400/50 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23 4a1 1 0 0 0-1.447-.894L12 7.882 2.447 3.106A1 1 0 0 0 1 4v13a1 1 0 0 0 .553.894l10 5a1 1 0 0 0 .894 0l10-5A1 1 0 0 0 23 17V4z"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">
                      {club.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-0.5">
                      {club.location}
                    </p>
                    <p className="text-sm text-gray-500">
                      {club.member_count || club.memberCount || 0} Members
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        )}
      </div>
    </section>
  );
};

export default Clubs;