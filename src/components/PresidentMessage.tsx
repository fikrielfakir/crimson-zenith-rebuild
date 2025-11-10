const PresidentMessage = () => {
  const messages = [
    {
      title: "Vision",
      description:
        "Our vision is to create a sustainable future for Morocco, where tourism and culture thrive together",
      bgImage:
        "https://images.unsplash.com/photo-1551836022-8b2858c9c69b?auto=format&fit=crop&q=80&w=1200",
      showBirds: false,
    },
    {
      title: "Message",
      description:
        "Together, we are building bridges between communities, preserving our heritage, and creating opportunities for all Moroccans",
      bgImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=1200",
      showBirds: true,
    },
    {
      title: "Commitment",
      description:
        "We are committed to sustainable development, cultural preservation, and empowering local communities",
      bgImage: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1200",
      showBirds: false,
    },
  ];

  return (
    <section
      id="president-message"
      className="relative w-full scroll-mt-32"
      style={{ height: "600px" }}
    >
      <div className="relative w-full h-full flex overflow-hidden">
        {messages.map((message, index) => (
          <div
            key={message.title}
            className="relative flex-1 group cursor-pointer"
            style={{
              borderRight:
                index < messages.length - 1
                  ? "3px solid rgba(255, 255, 255, 0.9)"
                  : "none",
              borderRadius:
                index === 0
                  ? "8px 0 0 8px"
                  : index === messages.length - 1
                    ? "0 8px 8px 0"
                    : "0",
              overflow: "hidden"
            }}
          >
            <div className="absolute inset-0 transition-transform duration-300 ease-in-out group-hover:scale-105">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${message.bgImage})`,
                }}
              />

              <div
                className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(to top, rgba(90, 70, 30, 0.8), rgba(40, 30, 20, 0.3))",
                }}
              />
            </div>

            {message.showBirds && (
              <div className="absolute top-8 left-10 opacity-0 group-hover:opacity-60 transition-opacity duration-500">
                <svg
                  width="60"
                  height="40"
                  viewBox="0 0 60 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 10C7 8 10 5 13 5C16 5 18 7 20 10M25 5C27 3 30 0 33 0C36 0 38 2 40 5M45 15C47 13 50 10 53 10C56 10 58 12 60 15"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                </svg>
              </div>
            )}

            <div className="absolute bottom-6 left-8">
              <h3
                className="font-bold transition-all duration-500"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "26px",
                  color: "#FFFFFF",
                  textShadow: "0 2px 6px rgba(0,0,0,0.5)",
                }}
              >
                {message.title}
              </h3>
              <p
                className="max-w-xs opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40 transition-all duration-500 overflow-hidden transform translate-y-4 group-hover:translate-y-0 mt-2"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  color: "#E8D8AA",
                  lineHeight: "22px",
                }}
              >
                {message.description}
              </p>
            </div>
          </div>
        ))}

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(#112250 0%, rgba(10, 26, 61, 0.4) 40%, transparent 60%)",
            zIndex: 1,
          }}
        />

        <div className="absolute top-0 left-0 right-0 text-center pt-12 pb-6 z-10 pointer-events-none">
          <h2
            className="font-bold mb-3"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "48px",
              fontWeight: 700,
              color: "#FFFFFF",
              textShadow: "0px 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            A Word from the President
          </h2>
          <p
            className="mx-auto"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "22px",
              fontWeight: 400,
              color: "#FFFFFF",
              letterSpacing: "0.5px",
              maxWidth: "75%",
            }}
          >
            Leading with purpose, building with passion
          </p>
        </div>
      </div>
    </section>
  );
};

export default PresidentMessage;
