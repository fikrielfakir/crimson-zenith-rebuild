import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { apiFetch, resolveStorageUrl } from '@/lib/apiFetch';
import { useCmsTranslations } from '@/hooks/useCmsTranslations';

const FALLBACK_PHOTO = 'https://api.thejourney-ma.org/attached_assets/527458761_17954306891994519_4667490874676487214_n_1762796640998.jpg';

const DEFAULTS = {
  is_active: true,
  title: 'A word from the president',
  president_name: 'Dr. Aderahim Azrkan',
  president_role: 'President, The Journey Association',
  message:
    'Dear Friends and Fellow Travelers,\n\nIt is with great pleasure and pride that I welcome you to The Journey Association. Our mission is to create sustainable pathways for tourism, culture, and community development across Morocco. We believe that tourism is not just about visiting beautiful places—it\'s about creating meaningful connections, preserving our heritage, and empowering local communities.\n\nTogether with our partners, clubs, and dedicated members, we are building bridges between cultures, protecting our natural and cultural treasures, and ensuring that the benefits of tourism reach every corner of our beloved Morocco. Your participation and support make all the difference in achieving our vision of a sustainable and prosperous future.',
  quote: 'Together, we create lasting impact.',
  photo_id: null as number | null,
  background_gradient: 'linear-gradient(180deg, #112250 0%, #1a3366 100%)',
  background_color: '#112250',
  title_font_family: 'Poppins',
  title_font_size: '48px',
  title_color: '#ffffff',
  title_alignment: 'left',
  name_font_family: 'Poppins',
  name_font_size: '28px',
  name_color: '#ffffff',
  role_font_family: 'Poppins',
  role_font_size: '18px',
  role_color: '#D8C18D',
  message_font_family: 'Poppins',
  message_font_size: '16px',
  message_color: '#ffffff',
  quote_font_size: '18px',
  quote_color: '#D8C18D',
  image_position: 'left',
  image_width: '42%',
  section_padding: '80px 0',
  content_gap: '48px',
};

type Settings = typeof DEFAULTS;

function merge(data: Record<string, any>): Settings {
  const s = { ...DEFAULTS };
  for (const key of Object.keys(DEFAULTS) as (keyof Settings)[]) {
    const val = data[key as string];
    if (val !== undefined && val !== null && val !== '') {
      (s as any)[key] = val;
    }
  }
  return s;
}

const PresidentMessage = () => {
  const { i18n } = useTranslation();
  const lang = (i18n.language || 'en').split('-')[0];
  const isAr = lang === 'ar';
  const tr = useCmsTranslations('president_message');

  const { data: raw } = useQuery({
    queryKey: ['cms', 'president-message'],
    queryFn: async () => {
      const res = await apiFetch('/api/cms/president-message');
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const s: Settings = raw ? merge(raw) : DEFAULTS;

  if (!s.is_active) return null;

  const photoSrc = s.photo_id
    ? `/api/cms/media/${s.photo_id}`
    : FALLBACK_PHOTO;

  const title    = tr('default', 'title',           s.title);
  const name     = tr('default', 'president_name',  s.president_name);
  const role     = tr('default', 'president_role',  s.president_role);
  const message  = tr('default', 'message',         s.message);
  const quote    = tr('default', 'quote',            s.quote);

  const paragraphs = message
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const fontFamily = isAr ? 'Cairo, Tajawal, sans-serif' : `${s.title_font_family}, sans-serif`;

  const isImageLeft = s.image_position !== 'right';

  const imageBlock = (
    <div
      className="flex justify-center"
      style={{ width: s.image_width, flexShrink: 0 }}
    >
      <div className="relative group w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-lg transform rotate-3 group-hover:rotate-6 transition-transform duration-300" />
        <div className="relative overflow-hidden rounded-lg shadow-2xl">
          <img
            src={resolveStorageUrl(photoSrc) ?? FALLBACK_PHOTO}
            alt={name}
            className="w-full h-[500px] object-cover transition-transform duration-300 group-hover:scale-105"
            style={{ filter: 'brightness(1.05) contrast(1.1)' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_PHOTO;
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 p-6"
            style={{ background: 'linear-gradient(to top, rgba(17, 34, 80, 0.95), transparent)' }}
          >
            <h3
              className="font-bold text-white"
              style={{
                fontFamily: `${s.name_font_family}, sans-serif`,
                fontSize: s.name_font_size,
                color: s.name_color,
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              }}
            >
              {name}
            </h3>
            <p
              style={{
                fontFamily: `${s.role_font_family}, sans-serif`,
                fontSize: s.role_font_size,
                color: s.role_color,
                fontWeight: 500,
              }}
            >
              {role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const textBlock = (
    <div className="flex-1 min-w-0">
      <div className="space-y-6">
        <div>
          <h2
            className="font-bold mb-4"
            style={{
              fontFamily,
              fontSize: s.title_font_size,
              fontWeight: 700,
              color: s.title_color,
              textAlign: s.title_alignment as any,
              textShadow: '0px 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            {title}
          </h2>
          <div
            className="w-24 h-1 rounded-full mb-8"
            style={{ background: s.quote_color }}
          />
        </div>

        <div className="space-y-4">
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className="leading-relaxed"
              style={{
                fontFamily: `${s.message_font_family}, sans-serif`,
                fontSize: s.message_font_size,
                color: i === 0 && paragraphs.length > 1
                  ? `${s.message_color}f2`
                  : `${s.message_color}e6`,
                lineHeight: '28px',
              }}
            >
              {para}
            </p>
          ))}
        </div>

        {quote && (
          <div className="pt-4">
            <p
              className="italic"
              style={{
                fontFamily: `${s.message_font_family}, sans-serif`,
                fontSize: s.quote_font_size,
                color: s.quote_color,
                fontWeight: 500,
              }}
            >
              "{quote}"
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <section
      id="president-message"
      className="relative w-full scroll-mt-32"
      style={{
        background: s.background_gradient || s.background_color,
        padding: s.section_padding,
      }}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4">
        <div
          className="flex flex-col md:flex-row items-center"
          style={{ gap: s.content_gap }}
        >
          {isImageLeft ? (
            <>
              {imageBlock}
              {textBlock}
            </>
          ) : (
            <>
              {textBlock}
              {imageBlock}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default PresidentMessage;
