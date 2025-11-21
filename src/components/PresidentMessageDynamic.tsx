import { useEffect, useState } from 'react';

interface PresidentMessageSettings {
  isActive: boolean;
  title: string;
  presidentName: string;
  presidentRole: string;
  message: string;
  quote: string;
  photoId: number | null;
  signatureId: number | null;
  backgroundImageId: number | null;
  backgroundColor: string;
  backgroundGradient: string;
  titleFontFamily: string;
  titleFontSize: string;
  titleColor: string;
  titleAlignment: string;
  nameFontFamily: string;
  nameFontSize: string;
  nameColor: string;
  roleFontFamily: string;
  roleFontSize: string;
  roleColor: string;
  messageFontFamily: string;
  messageFontSize: string;
  messageColor: string;
  quoteFontSize: string;
  quoteColor: string;
  imagePosition: string;
  imageAlignment: string;
  imageWidth: string;
  sectionPadding: string;
  contentGap: string;
}

const DEFAULT_SETTINGS: PresidentMessageSettings = {
  isActive: true,
  title: 'A word from the president',
  presidentName: 'Dr. Aderahim Azrkan',
  presidentRole: 'President, The Journey Association',
  message: `Dear Friends and Fellow Travelers,\n\nIt is with great pleasure and pride that I welcome you to The Journey Association. Our mission is to create sustainable pathways for tourism, culture, and community development across Morocco. We believe that tourism is not just about visiting beautiful places—it's about creating meaningful connections, preserving our heritage, and empowering local communities.\n\nTogether with our partners, clubs, and dedicated members, we are building bridges between cultures, protecting our natural and cultural treasures, and ensuring that the benefits of tourism reach every corner of our beloved Morocco. Your participation and support make all the difference in achieving our vision of a sustainable and prosperous future.`,
  quote: 'Together, we create lasting impact.',
  photoId: null,
  signatureId: null,
  backgroundImageId: null,
  backgroundColor: '#112250',
  backgroundGradient: 'linear-gradient(180deg, #112250 0%, #1a3366 100%)',
  titleFontFamily: 'Poppins',
  titleFontSize: '48px',
  titleColor: '#ffffff',
  titleAlignment: 'left',
  nameFontFamily: 'Poppins',
  nameFontSize: '28px',
  nameColor: '#ffffff',
  roleFontFamily: 'Poppins',
  roleFontSize: '18px',
  roleColor: '#D8C18D',
  messageFontFamily: 'Poppins',
  messageFontSize: '16px',
  messageColor: '#ffffff',
  quoteFontSize: '18px',
  quoteColor: '#D8C18D',
  imagePosition: 'left',
  imageAlignment: 'center',
  imageWidth: '42%',
  sectionPadding: '80px 0',
  contentGap: '48px',
};

const PresidentMessageDynamic = () => {
  const [settings, setSettings] = useState<PresidentMessageSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/cms/president-message');
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setSettings({ ...DEFAULT_SETTINGS, ...data });
          }
        }
      } catch (error) {
        console.error('Error loading president message settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  if (isLoading || !settings.isActive) {
    return null;
  }

  const photoUrl = settings.photoId 
    ? `/api/cms/media/${settings.photoId}`
    : '/attached_assets/527458761_17954306891994519_4667490874676487214_n_1762796640998.jpg';

  const signatureUrl = settings.signatureId ? `/api/cms/media/${settings.signatureId}` : null;

  const backgroundStyle = settings.backgroundImageId
    ? {
        backgroundImage: `url(/api/cms/media/${settings.backgroundImageId})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        background: settings.backgroundGradient || settings.backgroundColor,
      };

  const messageParagraphs = settings.message.split('\n\n').filter(p => p.trim());

  return (
    <section
      id="president-message"
      className="relative w-full scroll-mt-32"
      style={{ 
        ...backgroundStyle,
        padding: settings.sectionPadding,
      }}
    >
      <div className="container mx-auto px-4">
        <div 
          className={`flex flex-col ${settings.imagePosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center`}
          style={{ gap: settings.contentGap }}
        >
          {/* Image Section */}
          <div 
            className="w-full flex"
            style={{ 
              width: settings.imageWidth,
              justifyContent: settings.imageAlignment,
            }}
          >
            <div className="relative group max-w-full">
              <div 
                className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-lg transform rotate-3 group-hover:rotate-6 transition-transform duration-300"
              />
              <div className="relative overflow-hidden rounded-lg shadow-2xl">
                <img
                  src={photoUrl}
                  alt={settings.presidentName}
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
                    className="font-bold"
                    style={{
                      fontFamily: `${settings.nameFontFamily}, sans-serif`,
                      fontSize: settings.nameFontSize,
                      color: settings.nameColor,
                      textShadow: "0 2px 8px rgba(0,0,0,0.5)"
                    }}
                  >
                    {settings.presidentName}
                  </h3>
                  <p
                    style={{
                      fontFamily: `${settings.roleFontFamily}, sans-serif`,
                      fontSize: settings.roleFontSize,
                      color: settings.roleColor,
                      fontWeight: 500
                    }}
                  >
                    {settings.presidentRole}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full flex-1">
            <div className="space-y-6">
              <div>
                <h2
                  className="font-bold mb-4"
                  style={{
                    fontFamily: `${settings.titleFontFamily}, sans-serif`,
                    fontSize: settings.titleFontSize,
                    color: settings.titleColor,
                    fontWeight: 700,
                    textShadow: "0px 2px 8px rgba(0,0,0,0.3)",
                    textAlign: settings.titleAlignment as any,
                  }}
                >
                  {settings.title}
                </h2>
                <div 
                  className="w-24 h-1 rounded-full mb-8"
                  style={{ 
                    background: settings.roleColor,
                    marginLeft: settings.titleAlignment === 'center' ? 'auto' : undefined,
                    marginRight: settings.titleAlignment === 'center' ? 'auto' : undefined,
                  }}
                />
              </div>

              <div className="space-y-6">
                {messageParagraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="leading-relaxed"
                    style={{
                      fontFamily: `${settings.messageFontFamily}, sans-serif`,
                      fontSize: settings.messageFontSize,
                      color: settings.messageColor,
                      lineHeight: '1.75',
                      opacity: index === 0 ? 0.95 : 0.9,
                    }}
                    dangerouslySetInnerHTML={{ __html: paragraph }}
                  />
                ))}

                {settings.quote && (
                  <div className="pt-4">
                    <p
                      className="italic"
                      style={{
                        fontFamily: `${settings.messageFontFamily}, sans-serif`,
                        fontSize: settings.quoteFontSize,
                        color: settings.quoteColor,
                        fontWeight: 500
                      }}
                    >
                      "{settings.quote}"
                    </p>
                  </div>
                )}

                {signatureUrl && (
                  <div className="pt-4">
                    <img 
                      src={signatureUrl} 
                      alt="Signature" 
                      className="h-16 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PresidentMessageDynamic;
