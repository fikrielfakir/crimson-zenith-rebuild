import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Clubs = () => {

  // Fetch real clubs data from API
  const { data: clubsResponse, isLoading, error } = useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      const response = await fetch('/api/clubs');
      if (!response.ok) {
        throw new Error('Failed to fetch clubs');
      }
      return response.json();
    },
  });

  // Transform API data for UI display
  const clubs = clubsResponse?.clubs?.map((club: any) => ({
    id: club.id,
    name: club.name,
    image: club.image || "/api/placeholder/300/200",
    memberCount: club.member_count,
    activities: club.features || [],
    nextMeetup: {
      date: "Coming Soon",
      location: club.location
    },
    description: club.description,
    isJoined: false,
    rating: club.rating,
    location: club.location
  })) || [];


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading clubs...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600">Failed to load clubs. Please try again.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Clubs
            </h2>
            <p className="text-xl text-gray-400">
              Join local communities across Morocco's most fascinating cities
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club, index) => (
              <a
                key={club.id}
                href={`/club/${encodeURIComponent(club.name.toLowerCase().replace(/\s+/g, '-'))}`}
                className="group block animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4 transition-all duration-300">
                  <div className="flex-shrink-0 w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-white">
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
                      {club.memberCount}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Clubs;