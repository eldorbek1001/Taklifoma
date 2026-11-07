import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { wedding } from './weddingConfig'
import { createCalendarData, formatWeddingDate, getCountdownParts, getEventDate } from './weddingUtils'
import './styles.css'

function getGuestName() {
  return new URLSearchParams(window.location.search).get('guest')?.trim() || ''
}

function getMapUrl() {
  if (!wedding.mapsUrl) return null
  try {
    const url = new URL(wedding.mapsUrl)
    const isGoogleMapsHost =
      url.hostname === 'goo.gl' ||
      url.hostname === 'maps.app.goo.gl' ||
      /(^|\.)google\.[a-z.]+$/i.test(url.hostname)
    return url.protocol === 'https:' && isGoogleMapsHost ? url.href : null
  } catch {
    return null
  }
}

function BotanicalSprig({ className = '' }) {
  return (
    <svg className={`botanical-sprig ${className}`} viewBox="0 0 160 56" aria-hidden="true" focusable="false">
      <path d="M12 43C45 42 70 29 96 10c13-9 30-10 48-5" />
      <path d="M35 39c-9-13-7-22 5-27 4 12 2 21-5 27ZM53 33c-3-15 2-23 15-24 0 12-5 20-15 24ZM73 25c2-13 9-19 21-16-3 11-10 16-21 16ZM94 16c7-10 16-12 25-5-7 8-15 10-25 5ZM49 37c-2 12 3 19 15 21 2-11-3-18-15-21ZM75 27c2 11 9 16 21 13-3-10-10-14-21-13Z" />
    </svg>
  )
}

function BotanicalCorner({ className = '' }) {
  return (
    <svg className={`botanical-corner ${className}`} viewBox="0 0 150 150" aria-hidden="true" focusable="false">
      <path d="M4 146C19 98 50 51 142 4M23 104C15 84 19 70 36 62c5 18 0 32-13 42ZM48 70C43 48 51 34 71 30c2 19-6 33-23 40ZM80 38c2-20 14-30 34-28-3 18-14 28-34 28ZM39 83c20 1 31 12 29 32-18-3-28-13-29-32ZM72 53c19 4 28 16 23 35-17-5-25-16-23-35ZM107 25c16 7 22 21 13 38-15-8-19-20-13-38Z" />
    </svg>
  )
}

function Names({ className = '', as = 'p' }) {
  const NameTag = as
  const groomName = wedding.groomName?.trim()
  const brideName = wedding.brideName?.trim()

  return (
    <NameTag className={`couple-names ${className}`}>
      {groomName && <span>{groomName}</span>}
      {groomName && brideName && <span className="name-ampersand" aria-hidden="true">&amp;</span>}
      {brideName && <span>{brideName}</span>}
    </NameTag>
  )
}

function EnvelopeIntro({ isOpening, onOpen, initials }) {
  return (
    <section className={`envelope-intro ${isOpening ? 'is-opening' : ''}`} aria-label="Taklifnomani ochish">
      <BotanicalCorner className="envelope-corner envelope-corner-top" />
      <BotanicalCorner className="envelope-corner envelope-corner-bottom" />
      <div className="envelope-content">
        <h1 className="envelope-label">Siz uchun maxsus taklifnoma</h1>
        <div className="envelope-scene" aria-hidden="true">
          <div className="envelope-back" />
          <div className="envelope-letter">
            <BotanicalSprig />
            <span>{wedding.eventName}</span>
            <span className="letter-names">{[wedding.groomName, wedding.brideName].filter(Boolean).join(' & ')}</span>
          </div>
          <div className="envelope-pocket" />
          <div className="envelope-flap" />
          <svg className="envelope-folds" viewBox="0 0 420 252" preserveAspectRatio="none">
            <path d="M2 3 210 151 418 3M2 249l156-124m260 124L262 125" />
          </svg>
          <span className="wax-seal"><span>{initials}</span></span>
        </div>
        <button className="button button-green" onClick={onOpen} disabled={isOpening}>
          TAKLIFNOMANI OCHISH <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  )
}

function Hero({ guestName }) {
  const greeting = guestName ? `Hurmatli ${guestName}!` : 'Qadrli mehmonimiz!'
  const coverStyle = wedding.coverImage
    ? { backgroundImage: `url("${wedding.coverImage}")` }
    : undefined

  return (
    <header className="hero" style={coverStyle}>
      <div className="hero-overlay" />
      <BotanicalCorner className="hero-corner hero-corner-left" />
      <BotanicalCorner className="hero-corner hero-corner-right" />
      <div className="hero-content">
        <p className="eyebrow">SIZNI UNUTILMAS OQSHOMGA TAKLIF QILAMIZ</p>
        <BotanicalSprig />
        <Names as="h1" className="hero-names" />
        <p className="hero-event">{wedding.eventName}</p>
        <div className="gold-rule" />
        <div className="personal-invitation">
          <p className="guest-greeting">{greeting}</p>
          <p className="guest-invite">Sizni {wedding.eventName} oqshomimizga taklif etamiz.</p>
        </div>
        <p className="hero-message">{wedding.invitationText}</p>
        <p className="hero-date">
          {formatWeddingDate(wedding, { day: true, month: true, year: true })}
          <span>·</span>
          SOAT {wedding.time}
        </p>
        <a className="button button-light" href="#xotiralar">
          TAKLIFNOMANI KO‘RISH <span aria-hidden="true">↓</span>
        </a>
      </div>
      <p className="hero-footnote">MEHR BILAN, {wedding.brideName}</p>
    </header>
  )
}

function MemoryArt({ index }) {
  return (
    <div className={`memory-art memory-art-${index + 1}`} aria-hidden="true">
      <span className="art-arch" />
      <span className="art-leaf art-leaf-one" />
      <span className="art-leaf art-leaf-two" />
      <BotanicalSprig />
    </div>
  )
}

function Gallery({ onSelect }) {
  return (
    <section className="section memories reveal-section" id="xotiralar">
      <BotanicalCorner className="section-corner section-corner-left" />
      <BotanicalCorner className="section-corner section-corner-right" />
      <div className="section-inner">
        <p className="eyebrow section-kicker">QALBIMIZDAGI LAHZALAR</p>
        <h2>Go‘zal xotiralar</h2>
        <BotanicalSprig />
        <p className="section-intro">Qalbimizda saqlanadigan lahzalar va tabassumga to‘la kunlar…</p>
        <div className="gallery-grid">
          {wedding.gallery.map((item, index) => (
            <button
              className="memory-card"
              key={item.caption}
              onClick={(event) => onSelect({ ...item, index, trigger: event.currentTarget })}
              aria-label={`${item.caption} suratini kattalashtirish`}
            >
              <span className="memory-image">
                {item.src ? (
                  <img src={item.src} alt={item.alt} loading="lazy" />
                ) : (
                  <MemoryArt index={index} />
                )}
                <span className="image-zoom" aria-hidden="true">+</span>
              </span>
              <span className="memory-caption">{item.caption}</span>
            </button>
          ))}
        </div>
        {wedding.gallery.some((item) => !item.src) && (
          <p className="placeholder-note">Vaqtinchalik surat o‘rniga o‘z suratingizni weddingConfig.js faylida belgilang.</p>
        )}
      </div>
    </section>
  )
}

function EventDetails() {
  const mapUrl = getMapUrl()
  return (
    <section className="section details reveal-section" id="manzil">
      <BotanicalCorner className="section-corner section-corner-left" />
      <BotanicalCorner className="section-corner section-corner-right" />
      <div className="section-inner">
        <p className="eyebrow section-kicker">BIZ BILAN BIRGA BO‘LING</p>
        <h2>Uchrashuv manzili</h2>
        <BotanicalSprig />
        <p className="section-intro">Ushbu go‘zal oqshomda birga bo‘lish biz uchun katta baxt.</p>
        <div className="details-grid">
          <article className="detail-card">
            <span className="detail-icon" aria-hidden="true">
              <svg viewBox="0 0 32 32" focusable="false"><rect x="4.5" y="7" width="23" height="21" rx="1" /><path d="M10 4v6M22 4v6M5 13h22M10 18h3M18 18h4M10 23h3" /></svg>
            </span>
            <p className="eyebrow">TADBIR SANASI</p>
            <h3>{formatWeddingDate(wedding, { day: true, month: true })}</h3>
            <p>{formatWeddingDate(wedding, { weekday: true, year: true })}</p>
            <p className="detail-time">SOAT {wedding.time}</p>
          </article>
          <article className="detail-card">
            <span className="detail-icon location-icon" aria-hidden="true">
              <svg viewBox="0 0 32 32" focusable="false"><path d="M25 13c0 7-9 16-9 16S7 20 7 13a9 9 0 1 1 18 0Z" /><circle cx="16" cy="13" r="3" /></svg>
            </span>
            <p className="eyebrow">TADBIR MANZILI</p>
            <h3>{wedding.venue}</h3>
            <p className="address-text">{wedding.address}</p>
            {mapUrl && (
              <a className="button button-outline" href={mapUrl} target="_blank" rel="noreferrer">
                XARITADA OCHISH <span aria-hidden="true">↗</span>
              </a>
            )}
          </article>
        </div>
      </div>
    </section>
  )
}

function Countdown() {
  const target = useMemo(() => getEventDate(wedding), [])
  const [now, setNow] = useState(Date.now)

  useEffect(() => {
    if (!target || target.getTime() <= Date.now()) return undefined
    const timer = window.setInterval(() => {
      const currentTime = Date.now()
      setNow(currentTime)
      if (target.getTime() <= currentTime) window.clearInterval(timer)
    }, 1000)
    return () => window.clearInterval(timer)
  }, [target])

  const countdown = target ? getCountdownParts(target, now) : null

  return (
    <section className="section countdown-section reveal-section">
      <div className="section-inner">
        <p className="eyebrow section-kicker">HAYAJONLI KUTISH</p>
        <h2>Bayramgacha qoldi</h2>
        <BotanicalSprig />
        <p className="section-intro">Go‘zal oqshomimiz boshlanishiga qancha vaqt qoldi?</p>
        {!countdown ? (
          <p className="countdown-invalid">Sana va vaqt ma’lumotlarini tekshiring.</p>
        ) : countdown.arrived ? (
          <p className="countdown-arrived">Kutilgan kun keldi!</p>
        ) : (
          <div className="countdown-grid" aria-label="To‘y boshlanishiga qolgan vaqt" aria-live="off">
            {countdown.units.map(([label, value]) => (
              <div className="countdown-box" key={label}>
                <span className="countdown-value">{String(value).padStart(2, '0')}</span>
                <span className="countdown-label">{label}</span>
              </div>
            ))}
          </div>
        )}
        <p className="countdown-footnote">Har bir soniya bizni go‘zal oqshomga yaqinlashtiradi.</p>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="closing reveal-section">
      <BotanicalCorner className="footer-corner footer-corner-left" />
      <BotanicalCorner className="footer-corner footer-corner-right" />
      <div className="footer-content">
        <BotanicalSprig />
        <p className="eyebrow">MEHR BILAN TAKLIF ETAMIZ</p>
        <Names as="h2" className="closing-names" />
        <p className="closing-date">
          {formatWeddingDate(wedding, { day: true, month: true, year: true })}
          <span>·</span>
          {wedding.eventName}
        </p>
        <div className="gold-rule" />
        <p className="closing-note">Sizning tashrifingiz — bizning quvonchimiz.</p>
      </div>
    </footer>
  )
}

function Lightbox({ photo, onClose }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)

  useEffect(() => {
    if (!photo) return undefined
    closeRef.current?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      } else if (event.key === 'Tab') {
        event.preventDefault()
        closeRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [photo, onClose])

  if (!photo) return null
  return (
    <div
      ref={dialogRef}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <button ref={closeRef} className="lightbox-close" onClick={onClose} aria-label="Kattalashtirilgan suratni yopish">
        <span aria-hidden="true">×</span>
      </button>
      <div className="lightbox-content">
        {photo.src ? <img src={photo.src} alt={photo.alt} /> : <MemoryArt index={photo.index} />}
        <p>{photo.caption}</p>
      </div>
    </div>
  )
}

function MusicPlayer({ audioRef, isPlaying, setIsPlaying, hasError, setHasError }) {
  const toggleMusic = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      return
    }
    setHasError(false)
    try {
      await audio.play()
    } catch {
      setIsPlaying(false)
      setHasError(true)
    }
  }

  const label = isPlaying
    ? 'Musiqani pauza qilish'
    : hasError
      ? 'Musiqa ishlamadi — qayta urinish'
      : 'Musiqani davom ettirish'

  return (
    <button
      className={`music-control ${isPlaying ? 'is-playing' : ''}`}
      onClick={toggleMusic}
      aria-label={label}
      aria-pressed={isPlaying}
      title={label}
    >
      <span aria-hidden="true">{isPlaying ? 'Ⅱ' : '♫'}</span>
    </button>
  )
}

function App() {
  const audioRef = useRef(null)
  const mainRef = useRef(null)
  const closeTriggerRef = useRef(null)
  const [isOpening, setIsOpening] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioError, setAudioError] = useState(false)
  const [photo, setPhoto] = useState(null)
  const guestName = useMemo(() => getGuestName(), [])
  const initials = `${Array.from((wedding.groomName || '').trim())[0] ?? ''}${Array.from((wedding.brideName || '').trim())[0] ?? ''}`
  const animationTimer = useRef(null)

  const startMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.25
    setAudioError(false)
    audio.play().catch(() => {
      setIsPlaying(false)
      setAudioError(true)
    })
  }

  const openInvitation = () => {
    if (isOpening || hasOpened) return
    startMusic()
    setIsOpening(true)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    animationTimer.current = window.setTimeout(() => {
      setHasOpened(true)
      window.requestAnimationFrame(() => mainRef.current?.focus())
    }, prefersReducedMotion ? 80 : 1350)
  }

  const closeLightbox = () => {
    const trigger = closeTriggerRef.current
    setPhoto(null)
    window.requestAnimationFrame(() => trigger?.focus())
  }

  useEffect(() => () => window.clearTimeout(animationTimer.current), [])

  useEffect(() => {
    if (wedding.coverImage) {
      let imageMeta = document.querySelector('meta[property="og:image"]')
      if (!imageMeta) {
        imageMeta = document.createElement('meta')
        imageMeta.setAttribute('property', 'og:image')
        document.head.append(imageMeta)
      }
      imageMeta.setAttribute('content', new URL(wedding.coverImage, wedding.siteUrl || window.location.href).href)
    }
    const titleNames = [wedding.groomName, wedding.brideName].filter(Boolean).join(' va ')
    document.title = `${titleNames} — ${wedding.eventName}`
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      `${titleNames ? `${titleNames}ning` : ''} ${wedding.eventName} oqshomiga taklifnomasi. ${formatWeddingDate(wedding, { day: true, month: true, year: true })}, soat ${wedding.time}.`,
    )
    document.querySelector('meta[property="og:title"]')?.setAttribute(
      'content',
      `${titleNames} — ${wedding.eventName}`,
    )
    document.querySelector('meta[property="og:description"]')?.setAttribute(
      'content',
      `${wedding.invitationText} ${formatWeddingDate(wedding, { day: true, month: true, year: true })}, soat ${wedding.time}. ${wedding.venue}, ${wedding.address}.`,
    )
    if (wedding.siteUrl) {
      let urlMeta = document.querySelector('meta[property="og:url"]')
      if (!urlMeta) {
        urlMeta = document.createElement('meta')
        urlMeta.setAttribute('property', 'og:url')
        document.head.append(urlMeta)
      }
      urlMeta.setAttribute('content', wedding.siteUrl)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined
    audio.volume = 0.25
    const onPlaying = () => {
      setIsPlaying(true)
      setAudioError(false)
    }
    const onPause = () => setIsPlaying(false)
    const onWaiting = () => setIsPlaying(false)
    const onError = () => {
      setIsPlaying(false)
      setAudioError(true)
    }
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('error', onError)
    return () => {
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('error', onError)
    }
  }, [])

  useEffect(() => {
    if (!hasOpened || !('IntersectionObserver' in window)) return undefined
    const elements = document.querySelectorAll('.reveal-section')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [hasOpened])

  return (
    <>
      {!hasOpened && (
        <EnvelopeIntro isOpening={isOpening} onOpen={openInvitation} initials={initials} />
      )}
      <main
        ref={mainRef}
        id="main-content"
        className={`main-content ${hasOpened ? 'is-uncovered' : ''}`}
        aria-hidden={!hasOpened}
        inert={!hasOpened ? '' : undefined}
        tabIndex={-1}
      >
        <Hero guestName={guestName} />
        <Gallery onSelect={(selectedPhoto) => {
          closeTriggerRef.current = selectedPhoto.trigger
          setPhoto(selectedPhoto)
        }} />
        <EventDetails />
        <Countdown />
        <Footer />
      </main>
      <audio ref={audioRef} src={wedding.music} loop preload="none" />
      {hasOpened && (
        <MusicPlayer
          audioRef={audioRef}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          hasError={audioError}
          setHasError={setAudioError}
        />
      )}
      <Lightbox photo={photo} onClose={closeLightbox} />
    </>
  )
}

createRoot(document.getElementById('root')).render(<App />)
