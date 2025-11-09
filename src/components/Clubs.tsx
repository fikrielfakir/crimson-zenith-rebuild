import { Link } from "react-router-dom";

const Clubs = () => {
  const clubs = [
    {
      name: "Atlas Hikers Club",
      location: "Atlas Mountains",
      city: "Al Hoceima",
      address: "62 Via A, Bokjdadan"
    },
    {
      name: "Coastal Adventures", 
      location: "Atlantic Coast",
      city: "Essaouira",
      address: "15 Port Road, Medina"
    },
    {
      name: "Desert Explorers",
      location: "Sahara Desert",
      city: "Merzouga",
      address: "Desert Gateway, Erg Chebbi"
    },
    {
      name: "Marrakech Club",
      location: "Red City",
      city: "Marrakech",
      address: "Jemaa el-Fnaa Square"
    },
    {
      name: "Fez Heritage", 
      location: "Old Medina",
      city: "Fez",
      address: "Bab Boujloud Gate"
    },
    {
      name: "Casablanca Club",
      location: "Modern Coast",
      city: "Casablanca",
      address: "Hassan II Boulevard"
    },
    {
      name: "Blue Pearl Club",
      location: "Rif Mountains",
      city: "Chefchaouen",
      address: "Outa el Hammam Square"
    },
    {
      name: "Tangier Gateway",
      location: "Mediterranean",
      city: "Tangier",
      address: "Grand Socco, Medina"
    },
    {
      name: "Rabat Royale",
      location: "Capital City",
      city: "Rabat",
      address: "Kasbah des Oudayas"
    },
  ];

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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club, index) => (
            <Link
              key={club.name}
              to={`/club/${encodeURIComponent(club.name.toLowerCase().replace(/\s+/g, '-'))}`}
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
                      {club.address}
                    </p>
                    <p className="text-sm text-gray-500">
                      {club.city}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clubs;