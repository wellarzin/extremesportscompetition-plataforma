import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Trophy,
  Activity,
  BarChart3,
  Scan,
  Zap,
  Users,
  ChevronRight,
  Instagram,
  Twitter,
  Youtube,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { mockEvents } from '@/data';
import { getModalityLabel, getPhaseLabel, formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useLenis } from '@/hooks/useLenis';

gsap.registerPlugin(ScrollTrigger);

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const step = target / 60;
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString('pt-BR')}{suffix}</span>;
}

const features = [
  {
    icon: <BarChart3 size={24} />,
    title: 'Sistema de Apuração',
    description: 'Rankings em tempo real baseados em menor tempo acumulado. Seis provas, cálculo automático, desempate técnico.',
    color: 'royal',
  },
  {
    icon: <Activity size={24} />,
    title: 'Strava Integration',
    description: 'Sincronize automaticamente suas corridas, rides e nados diretamente do Strava para a plataforma.',
    color: 'orange',
  },
  {
    icon: <Scan size={24} />,
    title: 'Body Scan',
    description: 'Monitore sua composição corporal com precisão clínica. IMC, % gordura, massa muscular e hidratação.',
    color: 'royal',
  },
  {
    icon: <Trophy size={24} />,
    title: 'Conquistas',
    description: 'Sistema de badges por consistência, performance e participação. Compartilhe suas vitórias.',
    color: 'orange',
  },
  {
    icon: <Zap size={24} />,
    title: 'Movimentos Livres',
    description: 'Registre burpees, pull-ups, muscle-ups e 14 movimentos funcionais sem peso com validação por vídeo.',
    color: 'royal',
  },
  {
    icon: <Users size={24} />,
    title: 'Rankings ao Vivo',
    description: 'Acompanhe sua posição em tempo real por fase (estadual, nacional, final) e por modalidade.',
    color: 'orange',
  },
];

const steps = [
  { number: '01', title: 'Cadastre-se', description: 'Crie seu perfil, entre para um time e escolha suas modalidades.' },
  { number: '02', title: 'Registre Atividade', description: 'Conecte o Strava ou registre manualmente seus treinos e provas.' },
  { number: '03', title: 'Compete', description: 'Participe de eventos estaduais, nacionais e da grande final.' },
  { number: '04', title: 'Conquiste', description: 'Suba no ranking, desbloqueie conquistas e ganhe premiações.' },
];

const upcomingEvents = mockEvents.filter(e => e.status === 'active').slice(0, 3);

export function Landing() {
  useLenis();
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      });
      gsap.from('.hero-sub', {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
      });
      gsap.from('.hero-cta', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        ease: 'power3.out',
      });
      gsap.from('.hero-badge', {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        delay: 0.1,
        ease: 'back.out(1.7)',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-extreme-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-extreme-black/80 backdrop-blur-xl border-b border-white/6">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-extreme-royal to-extreme-orange flex items-center justify-center">
              <span className="text-white font-manrope font-black text-sm">X</span>
            </div>
            <span className="font-manrope font-bold text-white">Extreme Sports</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors font-dm-sans">Funcionalidades</a>
            <a href="#events" className="text-sm text-white/60 hover:text-white transition-colors font-dm-sans">Eventos</a>
            <a href="#how-it-works" className="text-sm text-white/60 hover:text-white transition-colors font-dm-sans">Como funciona</a>
          </div>
          <Link to="/app/dashboard">
            <Button size="sm">Entrar</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-extreme-royal/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-extreme-orange/15 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(65,105,225,0.08)_0%,transparent_70%)]" />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />

        {/* Viewfinder corners */}
        <div className="absolute top-24 left-12 w-16 h-16 border-l-2 border-t-2 border-extreme-royal/40" />
        <div className="absolute top-24 right-12 w-16 h-16 border-r-2 border-t-2 border-extreme-royal/40" />
        <div className="absolute bottom-16 left-12 w-16 h-16 border-l-2 border-b-2 border-extreme-orange/40" />
        <div className="absolute bottom-16 right-12 w-16 h-16 border-r-2 border-b-2 border-extreme-orange/40" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="hero-badge mb-8 inline-flex">
            <Badge variant="gradient" size="md">
              <Zap size={12} />
              1200+ Atletas Ativos em 2025
            </Badge>
          </div>

          <h1 ref={titleRef} className="font-manrope font-black leading-tight mb-6">
            <span className="block text-5xl md:text-7xl lg:text-8xl text-white">
              Extreme
            </span>
            <span className="block text-5xl md:text-7xl lg:text-8xl gradient-text">
              Sports
            </span>
            <span className="block text-3xl md:text-4xl lg:text-5xl text-white/80 font-light mt-2">
              Plataforma
            </span>
          </h1>

          <p className="hero-sub text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 font-dm-sans leading-relaxed">
            A plataforma definitiva para atletas de esportes radicais. Compete, registra, conquista.
            Rankings ao vivo, body scan e muito mais.
          </p>

          <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/app/dashboard">
              <Button variant="gradient" size="lg" className="w-full sm:w-auto">
                Entrar na Plataforma
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/app/events">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Ver Eventos
                <ChevronRight size={18} />
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <span className="text-[10px] font-manrope uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-y border-white/6 bg-extreme-dark/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 1200, suffix: '+', label: 'Atletas' },
              { value: 48, suffix: '', label: 'Eventos' },
              { value: 15, suffix: '', label: 'Modalidades' },
              { value: 120, suffix: 'K', label: 'Premiação (R$)' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-manrope font-black text-4xl md:text-5xl gradient-text mb-2">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-white/50 text-sm font-dm-sans">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="royal" className="mb-4">Funcionalidades</Badge>
          <h2 className="font-manrope font-black text-4xl md:text-5xl text-white mb-4">
            Construído para{' '}
            <span className="gradient-text">atletas sérios</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto font-dm-sans">
            Cada feature foi desenhada para quem leva a performance a sério. Sem firulas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass-card rounded-2xl p-6 hover:border-white/15 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  feature.color === 'royal'
                    ? 'bg-extreme-royal/15 text-extreme-royal group-hover:bg-extreme-royal/25'
                    : 'bg-extreme-orange/15 text-extreme-orange group-hover:bg-extreme-orange/25'
                } transition-colors duration-200`}
              >
                {feature.icon}
              </div>
              <h3 className="font-manrope font-bold text-white text-lg mb-2">{feature.title}</h3>
              <p className="text-white/50 text-sm font-dm-sans leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Events Preview */}
      <section id="events" className="py-24 bg-extreme-dark/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <Badge variant="orange" className="mb-4">Eventos</Badge>
              <h2 className="font-manrope font-black text-4xl text-white">
                Próximos <span className="gradient-text">Eventos</span>
              </h2>
            </div>
            <Link to="/app/events">
              <Button variant="ghost" size="sm">
                Ver todos <ChevronRight size={16} />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="glass-card rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 group">
                <div className="h-48 bg-gradient-to-br from-extreme-royal/20 to-extreme-orange/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-extreme-black/80 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge variant="royal">{getModalityLabel(event.modality)}</Badge>
                    <Badge variant="orange">{getPhaseLabel(event.phase)}</Badge>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <p className="text-2xl font-manrope font-black text-white leading-tight">{event.name.split('—')[0].trim()}</p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-white/60 font-dm-sans">
                      {format(new Date(event.date), "d 'de' MMM, yyyy", { locale: ptBR })}
                    </p>
                    <p className="text-xs text-white/40 font-dm-sans">{event.city}, {event.state}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/40 font-dm-sans">{event.registeredTeams}/{event.maxTeams} times</p>
                      <div className="w-32 h-1.5 bg-white/8 rounded-full mt-1">
                        <div
                          className="h-full bg-extreme-royal rounded-full"
                          style={{ width: `${(event.registeredTeams / event.maxTeams) * 100}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-sm font-manrope font-bold text-extreme-orange">
                      {formatCurrency(event.prizePool)}
                    </p>
                  </div>
                  <Link to={`/app/events/${event.id}`} className="mt-4 block">
                    <Button variant="secondary" size="sm" className="w-full">
                      Ver Evento <ArrowRight size={14} />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="royal" className="mb-4">Como Funciona</Badge>
          <h2 className="font-manrope font-black text-4xl text-white">
            Quatro passos para a{' '}
            <span className="gradient-text">vitória</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-8 left-1/8 right-1/8 h-px bg-gradient-to-r from-extreme-royal/20 via-extreme-orange/40 to-extreme-royal/20" />

          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mb-6 mx-auto relative z-10">
                <span className="font-manrope font-black text-2xl gradient-text">{step.number}</span>
              </div>
              <h3 className="font-manrope font-bold text-white text-xl text-center mb-3">{step.title}</h3>
              <p className="text-white/50 text-sm text-center font-dm-sans leading-relaxed">{step.description}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute top-8 -right-4 text-white/20">
                  <ChevronRight size={16} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-extreme-royal/10 to-extreme-orange/10" />
        <div className="absolute top-0 left-1/2 w-96 h-96 bg-extreme-royal/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-manrope font-black text-4xl md:text-5xl text-white mb-6">
            Pronto para competir?
          </h2>
          <p className="text-white/60 text-lg mb-10 font-dm-sans">
            Mais de 1200 atletas já estão na plataforma. Sua próxima conquista está esperando.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/app/dashboard">
              <Button variant="gradient" size="xl">
                Entrar na Plataforma <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 flex-wrap">
            {['Sem cartão de crédito', 'Acesso imediato', 'Suporte 24/7'].map(item => (
              <div key={item} className="flex items-center gap-2 text-white/40 text-sm font-dm-sans">
                <CheckCircle size={14} className="text-extreme-royal" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/6 bg-extreme-dark/50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-extreme-royal to-extreme-orange flex items-center justify-center">
                  <span className="text-white font-manrope font-black text-sm">X</span>
                </div>
                <span className="font-manrope font-bold text-white">Extreme Sports</span>
              </div>
              <p className="text-sm text-white/40 font-dm-sans leading-relaxed">
                A plataforma definitiva para atletas de esportes radicais.
              </p>
            </div>
            {[
              {
                title: 'Plataforma',
                links: ['Dashboard', 'Eventos', 'Rankings', 'Conquistas'],
              },
              {
                title: 'Modalidades',
                links: ['Atletismo', 'CrossFit', 'Body Scan', 'Natação'],
              },
              {
                title: 'Suporte',
                links: ['Documentação', 'Regulamento', 'Contato', 'Status'],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-manrope font-semibold text-white text-sm mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-white/40 hover:text-white transition-colors font-dm-sans">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/6 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30 font-dm-sans">
              © 2025 Extreme Sports Plataforma. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              {[Instagram, Twitter, Youtube].map((Icon, i) => (
                <button key={i} className="p-2 text-white/30 hover:text-white transition-colors">
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
