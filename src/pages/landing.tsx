import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import Container from '@mui/material/Container';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { useTheme } from '@mui/material/styles';

import type { SxProps, Theme } from '@mui/material/styles';

import { CONFIG } from 'src/config-global';
import { RouterLink } from 'src/routes/components';
import { Iconify } from 'src/components/iconify';
import { varAlpha } from 'src/theme/styles';

// ----------------------------------------------------------------------

const FEATURES = [
  {
    icon: 'solar:document-add-bold-duotone',
    title: 'Gestione servizi',
    description:
      'Organizza servizi secondari e sportivi in pochi click, con dati sempre ordinati e aggiornati.',
  },
  {
    icon: 'solar:calendar-bold-duotone',
    title: 'Calendario e pianificazione',
    description:
      'Visualizza attività giornaliere e pianifica incarichi futuri senza perdere informazioni importanti.',
  },
  {
    icon: 'solar:chart-square-bold-duotone',
    title: 'Analisi e report',
    description:
      'Controlla andamento, ricavi e performance con dashboard e grafici chiari per decisioni rapide.',
  },
];

const STATS = [
  { value: '3', label: 'Aree principali', icon: 'solar:widget-4-bold-duotone' },
  { value: '100%', label: 'Analisi e report', icon: 'solar:graph-up-bold-duotone' },
  { value: '24/7', label: 'Dati sempre disponibili', icon: 'solar:clock-circle-bold-duotone' },
];

const STEPS = [
  {
    title: 'Registra il servizio',
    description:
      'Inserisci i dettagli essenziali: tipo servizio, date, mezzi, referenti e note operative.',
  },
  {
    title: 'Coordina il team',
    description:
      'Gestisci attività e stati in modo centralizzato, migliorando comunicazione e puntualità.',
  },
  {
    title: 'Analizza i risultati',
    description:
      'Monitora numeri e trend per ottimizzare risorse, tempi e costi dei servizi.',
  },
];

const SCREENSHOTS = [
  {
    title: 'Dashboard operativa',
    description: 'Panoramica immediata su servizi, calendario e prossime attività.',
    src: '/supabase/assets/landing_page/screen_1.png',
    position: 'center top',
  },
  {
    title: 'Analisi avanzata',
    description: 'Metriche e grafici per controllare andamento, ricavi e trend.',
    src: '/supabase/assets/landing_page/screen_2.png',
    position: 'center top',
  },
  {
    title: 'Gestione elenco servizi',
    description: 'Ricerca, filtri e azioni rapide per lavorare in modo efficiente.',
    src: '/supabase/assets/landing_page/screen_3.png',
    position: 'center top',
  },
];

const FAQS = [
  {
    question: 'A chi è destinato Pronto Servizi?',
    answer:
      'È pensato per associazioni di volontariato e organizzazioni che gestiscono servizi secondari e sportivi.',
  },
  {
    question: 'Posso usare la piattaforma da smartphone?',
    answer:
      "Si. L'interfaccia è responsive e permette di consultare e aggiornare i dati anche da dispositivi mobili.",
  },
  {
    question: 'Come accedo alla piattaforma?',
    answer:
      'Puoi creare un account dalla pagina di registrazione oppure accedere con le credenziali esistenti.',
  }
];

// ----------------------------------------------------------------------

function BrowserFrame({ children, sx }: { children: React.ReactNode; sx?: SxProps<Theme> }) {
  return (
    <Box
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: (t) => (t as Theme).customShadows?.z16 ?? '0 8px 24px rgba(0,0,0,0.12)',
        ...sx,
      }}
    >
      <Box
        sx={{
          px: 1.5,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          bgcolor: 'grey.100',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {['#FF5F57', '#FFBD2E', '#28C840'].map((color) => (
          <Box
            key={color}
            sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color }}
          />
        ))}
        <Box
          sx={{
            ml: 1,
            flex: 1,
            height: 22,
            borderRadius: 1,
            bgcolor: 'grey.200',
          }}
        />
      </Box>
      <Box sx={{ lineHeight: 0 }}>{children}</Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

export default function LandingPage() {
  const theme = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Helmet>
        <title>{`Pronto Servizi - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="Piattaforma completa per gestire servizi secondari e sportivi con pianificazione, dashboard e analisi."
        />
      </Helmet>

      {/* ---- Sticky Navbar ---- */}
      <Box
        component="nav"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: theme.zIndex.appBar,
          transition: 'background-color 250ms, box-shadow 250ms',
          ...(scrolled
            ? {
                bgcolor: varAlpha(theme.vars.palette.background.defaultChannel, 0.8),
                backdropFilter: 'blur(8px)',
                boxShadow: theme.customShadows?.z8 ?? '0 4px 16px rgba(0,0,0,0.08)',
              }
            : {
                bgcolor: 'transparent',
              }),
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ height: 72 }}
          >
            <Box
              component={RouterLink}
              href="/"
              sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            >
              <Box
                component="img"
                alt="Pronto Servizi"
                src="/logo/main_logo.png"
                sx={{ height: 48 }}
              />
            </Box>

            <Stack direction="row" spacing={1.5}>
              <Button
                component={RouterLink}
                href="/sign-in"
                variant="outlined"
                sx={{ fontSize: { xs: 13, md: 14 }, px: { xs: 1.5, md: 2 }, py: { xs: 0.5, md: 0.75 } }}
              >
                Accedi
              </Button>
              <Button
                component={RouterLink}
                href="/sign-up"
                variant="contained"
                sx={{ fontSize: { xs: 13, md: 14 }, px: { xs: 1.5, md: 2 }, py: { xs: 0.5, md: 0.75 } }}
              >
                Crea account
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* ---- Page Content ---- */}
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Stack spacing={12} sx={{ pt: { xs: '96px', md: '112px' }, pb: { xs: 6, md: 10 } }}>

            {/* ===== HERO ===== */}
            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
              {/* Decorative blob */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -100,
                  right: -120,
                  width: 500,
                  height: 500,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${varAlpha(theme.vars.palette.primary.mainChannel, 0.12)} 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }}
              />

              <Grid container spacing={5} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Stack spacing={3}>
                    <Chip
                      label="Piattaforma per associazioni e volontariato"
                      color="primary"
                      sx={{ width: 'fit-content' }}
                    />
                    <Typography
                      variant="h2"
                      sx={{ fontSize: { xs: 34, md: 52 }, lineHeight: 1.1 }}
                    >
                      Pronto Servizi
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 500 }}>
                      Gestisci servizi secondari e sportivi in modo moderno, veloce e affidabile
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Dalla registrazione del servizio fino all&apos;analisi finale: tutto in un unico
                      spazio, progettato per il lavoro operativo quotidiano.
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Button
                        component={RouterLink}
                        href="/sign-in"
                        variant="contained"
                        size="large"
                      >
                        Accedi
                      </Button>
                      <Button
                        component={RouterLink}
                        href="/sign-up"
                        variant="outlined"
                        size="large"
                      >
                        Crea account
                      </Button>
                    </Stack>
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <BrowserFrame>
                    <Box
                      component="img"
                      alt="Dashboard Pronto Servizi"
                      src="/supabase/assets/landing_page/screen_1.png"
                      sx={{
                        width: '100%',
                        display: 'block',
                        objectFit: 'cover',
                        objectPosition: 'center top',
                      }}
                    />
                  </BrowserFrame>
                </Grid>
              </Grid>
            </Box>

            {/* ===== STATS ROW ===== */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              {STATS.map((item) => (
                <Card
                  key={item.label}
                  variant="outlined"
                  sx={{
                    flex: 1,
                    borderRadius: 3,
                    transition: 'box-shadow 250ms, transform 250ms',
                    '&:hover': {
                      boxShadow: theme.customShadows?.z8,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <CardContent sx={{ py: 2.5 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                          display: 'grid',
                          placeItems: 'center',
                          bgcolor: 'primary.lighter',
                          color: 'primary.main',
                        }}
                      >
                        <Iconify icon={item.icon} width={24} />
                      </Box>
                      <Box>
                        <Typography variant="h5">{item.value}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.label}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>

            {/* ===== FEATURES ===== */}
            <Box>
              <Stack spacing={1} sx={{ mb: 4 }}>
                <Typography variant="overline" color="primary.main">
                  Funzionalità principali
                </Typography>
                <Typography variant="h4">Tutto quello che serve per operare meglio</Typography>
              </Stack>

              <Grid container spacing={3}>
                {FEATURES.map((feature) => (
                  <Grid key={feature.title} item xs={12} md={4}>
                    <Card
                      variant="outlined"
                      sx={{
                        borderRadius: 3,
                        height: '100%',
                        transition: 'box-shadow 250ms, transform 250ms',
                        '&:hover': {
                          boxShadow: theme.customShadows?.z8,
                          transform: 'translateY(-4px)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Stack spacing={2}>
                          <Box
                            sx={{
                              width: 46,
                              height: 46,
                              borderRadius: 2,
                              display: 'grid',
                              placeItems: 'center',
                              bgcolor: 'primary.lighter',
                              color: 'primary.main',
                            }}
                          >
                            <Iconify icon={feature.icon} width={24} />
                          </Box>
                          <Typography variant="h6">{feature.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {feature.description}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* ===== STEPS ===== */}
            <Box>
              <Stack spacing={1} sx={{ mb: 4 }}>
                <Typography variant="overline" color="primary.main">
                  Come funziona
                </Typography>
                <Typography variant="h4">Processo semplice in 3 passaggi</Typography>
              </Stack>

              <Grid container spacing={3}>
                {STEPS.map((step, index) => (
                  <Grid key={step.title} item xs={12} md={4}>
                    <Card
                      variant="outlined"
                      sx={{
                        borderRadius: 3,
                        height: '100%',
                        transition: 'box-shadow 250ms, transform 250ms',
                        '&:hover': {
                          boxShadow: theme.customShadows?.z8,
                          transform: 'translateY(-4px)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Stack spacing={2}>
                          <Typography
                            variant="caption"
                            sx={{
                              width: 'fit-content',
                              px: 1.25,
                              py: 0.5,
                              borderRadius: 10,
                              bgcolor: 'primary.lighter',
                              color: 'primary.main',
                              fontWeight: 700,
                            }}
                          >
                            STEP {index + 1}
                          </Typography>
                          <Typography variant="h6">{step.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {step.description}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* ===== SCREENSHOTS ===== */}
            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
              {/* Decorative blob */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -80,
                  left: -100,
                  width: 400,
                  height: 400,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${varAlpha(theme.vars.palette.info.mainChannel, 0.08)} 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }}
              />

              <Stack spacing={1} sx={{ mb: 4 }}>
                <Typography variant="overline" color="primary.main">
                  Screenshot prodotto
                </Typography>
                <Typography variant="h4">Guarda l&apos;interfaccia in azione</Typography>
                <Typography variant="body2" color="text.secondary">
                  Schermate reali della piattaforma, rifinite per evidenziare le aree più utili.
                </Typography>
              </Stack>

              <Grid container spacing={3}>
                {SCREENSHOTS.map((screen, idx) => (
                  <Grid key={screen.title} item xs={12} md={idx === 0 ? 12 : 6}>
                    <BrowserFrame>
                      <Box
                        component="img"
                        src={screen.src}
                        alt={screen.title}
                        sx={{
                          width: '100%',
                          display: 'block',
                          objectFit: 'cover',
                          objectPosition: screen.position,
                        }}
                      />
                    </BrowserFrame>
                    <Stack spacing={0.5} sx={{ mt: 2, px: 0.5 }}>
                      <Typography variant="subtitle1">{screen.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {screen.description}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* ===== FAQ ===== */}
            <Box>
              <Stack spacing={1} sx={{ mb: 3 }}>
                <Typography variant="overline" color="primary.main">
                  FAQ
                </Typography>
                <Typography variant="h4">Domande frequenti</Typography>
              </Stack>

              <Stack spacing={1.5}>
                {FAQS.map((faq) => (
                  <Accordion
                    key={faq.question}
                    disableGutters
                    sx={{ borderRadius: 2, '&:before': { display: 'none' } }}
                  >
                    <AccordionSummary
                      expandIcon={
                        <Iconify icon="eva:arrow-ios-downward-fill" width={18} />
                      }
                    >
                      <Typography variant="subtitle1">{faq.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Stack>
            </Box>

            {/* ===== CTA ===== */}
            <Card
              variant="outlined"
              sx={{
                borderRadius: 4,
                borderColor: 'primary.main',
                bgcolor: 'primary.lighter',
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack
                  spacing={3}
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  textAlign={{ md: 'center' }}
                >
                  <Typography variant="h4">
                    Pronto a semplificare la gestione dei tuoi servizi?
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ maxWidth: 760 }}
                  >
                    Inizia ora con Pronto Servizi e porta organizzazione, visibilita e controllo
                    nel flusso operativo quotidiano.
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button
                      component={RouterLink}
                      href="/sign-up"
                      variant="contained"
                      size="large"
                    >
                      Inizia subito
                    </Button>
                    <Button
                      component={RouterLink}
                      href="/sign-in"
                      variant="outlined"
                      size="large"
                    >
                      Ho gia un account
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            {/* ===== FOOTER ===== */}
            <Box>
              <Divider sx={{ mb: 4 }} />
              <Grid container spacing={3} alignItems="flex-start">
                <Grid item xs={12} md={4}>
                  <Box
                    component="img"
                    alt="Pronto Servizi"
                    src="/logo/main_logo.png"
                    sx={{ height: { xs: 38, md: 48 } }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Link utili
                    </Typography>
                    <Link
                      component={RouterLink}
                      href="/sign-in"
                      variant="body2"
                      color="text.secondary"
                      underline="hover"
                    >
                      Accedi
                    </Link>
                    <Link
                      component={RouterLink}
                      href="/sign-up"
                      variant="body2"
                      color="text.secondary"
                      underline="hover"
                    >
                      Registrati
                    </Link>
                    <Link
                      href="mailto:ezeddin.eddaouy@gmail.com"
                      variant="body2"
                      color="text.secondary"
                      underline="hover"
                    >
                      Supporto
                    </Link>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: { md: 'right' } }}
                  >
                    © 2026 Pronto Servizi. Tutti i diritti riservati.
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
