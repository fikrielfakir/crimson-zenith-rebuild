import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const ClubDetailDebug = () => {
  const { clubName } = useParams();
  
  console.log("Club name from URL:", clubName);
  
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

  console.log("Clubs response:", clubsResponse);
  console.log("Loading:", isLoading);
  console.log("Error:", error);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!clubsResponse?.clubs) {
    return <div>No clubs found</div>;
  }

  // Find the current club by name from the API data
  const club = clubsResponse.clubs.find((c: any) => 
    c.name === decodeURIComponent(clubName || '')
  );

  console.log("Found club:", club);

  if (!club) {
    return <div>Club not found: {clubName}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Debug Club Detail</h1>
      <h2>{club.name}</h2>
      <p>{club.description}</p>
      <p>Location: {club.location}</p>
      <p>Members: {club.member_count}</p>
      <p>Rating: {club.rating}</p>
    </div>
  );
};

export default ClubDetailDebug;