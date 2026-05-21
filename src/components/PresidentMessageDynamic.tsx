import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

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

const STYLE_DEFAULTS = {
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
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [settings, setSettings] = useState<PresidentMessageSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getDefaultSettings = (): PresidentMessageSettings => ({
    isActive: true,
    title: t('president.title'),
    presidentName: t('president.name'),
    presidentRole: t('president.role'),
    message: `${t('president.greeting')}\n\n${t('president.body1')}\n\n${t('president.body2')}`,
    quote: t('president.quote'),
    ...STYLE_DEFAULTS,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/cms/president-message');
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setSettings({ ...getDefaultSettings(), ...data });
            return;
          }
        }
      } catch (error) {
        console.error('Error loading president message settings:', error);
        setSettings(getDefaultSettings());
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const activeSettings = settings ?? getDefaultSettings();

  if (isLoading || !activeSettings.isActive) {
    return null;
  }

  const s = activeSettings;

  const photoUrl = s.photoId
    ? `/api/cms/media/${s.photoId}`
    : '/attached_assets/527458761_17954306891994519_4667490874676487214_n_1762796640998.jpg';

  const signatureUrl = s.signatureId ? `/api/cms/media/${s.signatureId}` : null;

  const backgroundStyle = s.backgroundImageId
    ? {
        backgroundImage: `url(/api/cms/media/${s.backgroundImageId})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        background: s.backgroundGradient || s.backgroundColor,
      };

  const messageParagraphs = s.message.split('\n\n').filter(p => p.trim());

  /*
   * In RTL, flex-direction:row naturally flows R→L (first item on RIGHT).
   * So to keep imagePosition consistent (physical left/right), we need:
   *   LTR + imageLeft  → row          LTR + imageRight → row-reverse
   *   RTL + imageLeft  → row-reverse  RTL + imageRight → row
   * We inject via <style> so the media query (md:) still applies and we
   * bypass the global RTL CSS-flip on .md:flex-row classes.
   */
  const presidentFlexDir = (isRTL === (s.imagePosition === 'right')) ? 'row' : 'row-reverse';

  const titleAlign = isRTL ? 'right' : (s.titleAlignment as 'left' | 'center' | 'right');
  const accentMarginLeft = titleAlign === 'center' ? 'auto' : isRTL ? 'auto' : undefined;
  const accentMarginRight = titleAlign === 'center' ? 'auto' : isRTL ? 0 : undefined;

  return (
    <section
      id="president-message"
      className="relative w-full scroll-mt-32"
      style={{ 
        ...backgroundStyle,
        padding: s.sectionPadding,
      }}
    >
      {/* Inject responsive styles — bypasses global RTL class-flip for this section */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 768px) {
          .president-img-wrapper { width: ${s.imageWidth} !important; flex-shrink: 0; }
          .president-content-row { flex-direction: ${presidentFlexDir} !important; }
        }
        @media (max-width: 767px) {
          .president-img-wrapper { width: 100% !important; max-width: 100% !important; }
          .president-content-row { flex-direction: column !important; }
        }
      `}} />

      <div className="container mx-auto px-4">
        <div 
          className="president-content-row flex flex-col items-center"
          style={{ gap: "clamp(24px, 4vw, " + s.contentGap + ")" }}
        >
          {/* Image Section */}
          <div
            className="president-img-wrapper w-full flex"
            style={{ justifyContent: s.imageAlignment }}
          >
            <div className="relative group max-w-full w-full">
              <div 
                className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-lg transform rotate-3 group-hover:rotate-6 transition-transform duration-300"
              />
              <div className="relative overflow-hidden rounded-lg shadow-2xl">
                <img
                  src={photoUrl}
                  alt={s.presidentName}
                  className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{ filter: "brightness(1.05) contrast(1.1)" }}
                />
                <div 
                  className="absolute bottom-0 left-0 right-0 p-6"
                  style={{ background: "linear-gradient(to top, rgba(17, 34, 80, 0.95), transparent)" }}
                >
                  <h3
                    className="font-bold"
                    style={{
                      fontFamily: `${s.nameFontFamily}, sans-serif`,
                      fontSize: s.nameFontSize,
                      color: s.nameColor,
                      textShadow: "0 2px 8px rgba(0,0,0,0.5)"
                    }}
                  >
                    {s.presidentName}
                  </h3>
                  <p
                    style={{
                      fontFamily: `${s.roleFontFamily}, sans-serif`,
                      fontSize: s.roleFontSize,
                      color: s.roleColor,
                      fontWeight: 500
                    }}
                  >
                    {s.presidentRole}
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
                    fontFamily: `${s.titleFontFamily}, sans-serif`,
                    fontSize: s.titleFontSize,
                    color: s.titleColor,
                    fontWeight: 700,
                    textShadow: "0px 2px 8px rgba(0,0,0,0.3)",
                    textAlign: titleAlign,
                  }}
                >
                  {s.title}
                </h2>
                <div 
                  className="w-24 h-1 rounded-full mb-8"
                  style={{ 
                    background: s.roleColor,
                    marginLeft: accentMarginLeft,
                    marginRight: accentMarginRight,
                  }}
                />
              </div>

              <div className="space-y-6">
                {messageParagraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="leading-relaxed"
                    style={{
                      fontFamily: `${s.messageFontFamily}, sans-serif`,
                      fontSize: s.messageFontSize,
                      color: s.messageColor,
                      lineHeight: '1.75',
                      opacity: index === 0 ? 0.95 : 0.9,
                    }}
                    dangerouslySetInnerHTML={{ __html: paragraph }}
                  />
                ))}

                {s.quote && (
                  <div className="pt-4">
                    <p
                      className="italic"
                      style={{
                        fontFamily: `${s.messageFontFamily}, sans-serif`,
                        fontSize: s.quoteFontSize,
                        color: s.quoteColor,
                        fontWeight: 500
                      }}
                    >
                      "{s.quote}"
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
