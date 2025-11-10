const PresidentMessage = () => {
  return (
    <section
      id="president-message"
      className="relative w-full py-20 scroll-mt-32"
      style={{ 
        background: "linear-gradient(180deg, #112250 0%, #1a3366 100%)"
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-5/12 flex justify-center">
            <div className="relative group">
              <div 
                className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-lg transform rotate-3 group-hover:rotate-6 transition-transform duration-300"
              />
              <div className="relative overflow-hidden rounded-lg shadow-2xl">
                <img
                  src="/attached_assets/527458761_17954306891994519_4667490874676487214_n_1762796640998.jpg"
                  alt="President"
                  className="w-full h-[500px] object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{
                    filter: "brightness(1.05) contrast(1.1)"
                  }}
                />
                <div 
                  className="absolute bottom-0 left-0 right-0 p-6"
                  style={{
                    background: "linear-gradient(to top, rgba(17, 34, 80, 0.95), transparent)"
                  }}
                >
                  <h3
                    className="font-bold text-white"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "28px",
                      textShadow: "0 2px 8px rgba(0,0,0,0.5)"
                    }}
                  >
                    Dr. Aderahim Azrkan
                  </h3>
                  <p
                    className="text-secondary"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "18px",
                      fontWeight: 500
                    }}
                  >
                    President, The Journey Association
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-7/12">
            <div className="space-y-6">
              <div>
                <h2
                  className="font-bold text-white mb-4"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "48px",
                    fontWeight: 700,
                    textShadow: "0px 2px 8px rgba(0,0,0,0.3)"
                  }}
                >
                  A Word from the President
                </h2>
                <div 
                  className="w-24 h-1 rounded-full mb-8"
                  style={{ background: "#D8C18D" }}
                />
              </div>

              <div className="space-y-6">
                <p
                  className="text-white/95 leading-relaxed"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "18px",
                    lineHeight: "32px"
                  }}
                >
                  Dear Friends and Fellow Travelers,
                </p>

                <p
                  className="text-white/90 leading-relaxed"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "16px",
                    lineHeight: "28px"
                  }}
                >
                  It is with great pleasure and pride that I welcome you to The Journey Association. Our mission is to create sustainable pathways for tourism, culture, and community development across Morocco. We believe that tourism is not just about visiting beautiful places—it's about creating meaningful connections, preserving our heritage, and empowering local communities.
                </p>

                <p
                  className="text-white/90 leading-relaxed"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "16px",
                    lineHeight: "28px"
                  }}
                >
                  Together with our partners, clubs, and dedicated members, we are building bridges between cultures, protecting our natural and cultural treasures, and ensuring that the benefits of tourism reach every corner of our beloved Morocco. Your participation and support make all the difference in achieving our vision of a sustainable and prosperous future.
                </p>

                <div className="pt-4">
                  <p
                    className="text-secondary italic"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "18px",
                      fontWeight: 500
                    }}
                  >
                    "Together, we create lasting impact."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PresidentMessage;
