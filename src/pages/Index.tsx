import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';

type Tab = 'chats' | 'market';

interface Chat {
  id: number;
  name: string;
  last: string;
  time: string;
  unread: number;
  online: boolean;
  emoji: string;
  gradient: string;
  group?: boolean;
}

interface Message {
  id: number;
  text: string;
  mine: boolean;
  time: string;
}

interface Bot {
  id: number;
  name: string;
  desc: string;
  icon: string;
  users: string;
  price: string;
  tag: string;
}

const CHATS: Chat[] = [
  { id: 1, name: 'Анна Светлова', last: 'Отправила отчёт за квартал 📊', time: '14:32', unread: 2, online: true, emoji: 'АС', gradient: 'from-violet-500 to-fuchsia-500' },
  { id: 2, name: 'Команда «Восход»', last: 'Дмитрий: запускаем в пятницу!', time: '13:10', unread: 5, online: false, emoji: '🚀', gradient: 'from-cyan-400 to-blue-500', group: true },
  { id: 3, name: 'Михаил Зорин', last: 'Голосовое сообщение · 0:42', time: '12:45', unread: 0, online: true, emoji: 'МЗ', gradient: 'from-emerald-400 to-teal-500' },
  { id: 4, name: 'Бот Аналитики', last: 'Ваши продажи выросли на 18% 📈', time: '11:20', unread: 1, online: true, emoji: '🤖', gradient: 'from-amber-400 to-orange-500' },
  { id: 5, name: 'Семья ❤️', last: 'Мама: не забудь позвонить', time: 'Вчера', unread: 0, online: false, emoji: '🏠', gradient: 'from-pink-500 to-rose-500', group: true },
  { id: 6, name: 'Ольга Петрова', last: 'Спасибо за помощь!', time: 'Вчера', unread: 0, online: false, emoji: 'ОП', gradient: 'from-indigo-400 to-purple-500' },
];

const MESSAGES: Message[] = [
  { id: 1, text: 'Привет! Как продвигается проект? 🚀', mine: false, time: '14:20' },
  { id: 2, text: 'Отлично! Уже почти готово, осталось пара правок', mine: true, time: '14:22' },
  { id: 3, text: 'Супер! Отправила тебе отчёт за квартал, посмотри пожалуйста 📊', mine: false, time: '14:30' },
  { id: 4, text: 'Получил, цифры впечатляют 🔥 Сегодня изучу подробно', mine: true, time: '14:32' },
];

const BOTS: Bot[] = [
  { id: 1, name: 'Продажи Pro', desc: 'Автоворонки и приём заявок прямо в чате', icon: 'TrendingUp', users: '12.4K', price: '990 ₽/мес', tag: 'Бизнес' },
  { id: 2, name: 'Аналитик', desc: 'Отчёты, графики и прогнозы по вашим данным', icon: 'BarChart3', users: '8.1K', price: '690 ₽/мес', tag: 'Аналитика' },
  { id: 3, name: 'Автоответчик', desc: 'Отвечает клиентам 24/7 без выходных', icon: 'MessageSquareReply', users: '21.7K', price: 'Бесплатно', tag: 'Автоматизация' },
  { id: 4, name: 'CRM Связь', desc: 'Синхронизация чатов с вашей CRM-системой', icon: 'Database', users: '5.3K', price: '1490 ₽/мес', tag: 'Интеграции' },
];

const REPLIES = [
  'Принято! 👍',
  'Отличная мысль 🔥',
  'Сейчас посмотрю и отвечу',
  'Спасибо, что написали 🙌',
  'Договорились! 🚀',
];

const Index = () => {
  const [tab, setTab] = useState<Tab>('chats');
  const [activeChat, setActiveChat] = useState(CHATS[0]);
  const [messages, setMessages] = useState<Message[]>(MESSAGES);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const nowTime = () =>
    new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    const mine: Message = { id: Date.now(), text, mine: true, time: nowTime() };
    setMessages((prev) => [...prev, mine]);
    setDraft('');
    setTyping(true);
    setTimeout(() => {
      const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)];
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: reply, mine: false, time: nowTime() }]);
      setTyping(false);
    }, 1600);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  return (
    <div className="h-screen w-full overflow-hidden bg-background text-foreground flex flex-col relative">
      {/* фоновое свечение */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] animate-float-slow" />
      <div className="pointer-events-none absolute -bottom-52 -right-40 w-[600px] h-[600px] rounded-full bg-accent/20 blur-[120px] animate-float-slow" style={{ animationDelay: '3s' }} />

      {/* верхняя панель */}
      <header className="relative z-10 flex items-center justify-between px-5 md:px-8 h-16 glass border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl gradient-brand-anim animate-gradient-shift flex items-center justify-center shadow-lg shadow-primary/30">
            <Icon name="Send" size={20} className="text-white" />
          </div>
          <div className="leading-tight">
            <h1 className="font-display font-bold text-lg tracking-tight">Зов</h1>
            <p className="text-[11px] text-muted-foreground -mt-0.5">мессенджер для России 🇷🇺</p>
          </div>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-full bg-secondary/60 border border-border">
          <button
            onClick={() => setTab('chats')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${tab === 'chats' ? 'gradient-brand text-white shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Чаты
          </button>
          <button
            onClick={() => setTab('market')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${tab === 'market' ? 'gradient-brand text-white shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Icon name="Bot" size={15} /> Боты
          </button>
        </div>
        <button className="w-10 h-10 rounded-2xl bg-secondary/60 border border-border flex items-center justify-center hover:bg-secondary transition-colors">
          <Icon name="Settings" size={18} className="text-muted-foreground" />
        </button>
      </header>

      {tab === 'chats' ? (
        <div className="relative z-10 flex-1 flex overflow-hidden">
          {/* список чатов */}
          <aside className="w-full md:w-[360px] shrink-0 border-r border-border flex flex-col bg-card/40">
            <div className="p-4">
              <div className="relative">
                <Icon name="Search" size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="Поиск людей и чатов"
                  className="w-full h-11 pl-10 pr-4 rounded-2xl bg-secondary/60 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin px-2 pb-4 space-y-1">
              {CHATS.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setActiveChat(c)}
                  style={{ animationDelay: `${i * 50}ms` }}
                  className={`w-full animate-fade-up flex items-center gap-3 p-3 rounded-2xl text-left transition-all ${activeChat.id === c.id ? 'bg-secondary border border-border' : 'hover:bg-secondary/50 border border-transparent'}`}
                >
                  <div className="relative shrink-0">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white font-semibold text-sm`}>
                      {c.emoji}
                    </div>
                    {c.online && <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-card" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm truncate">{c.name}</span>
                      <span className="text-[11px] text-muted-foreground shrink-0">{c.time}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground truncate">{c.last}</span>
                      {c.unread > 0 && (
                        <span className="shrink-0 min-w-5 h-5 px-1.5 rounded-full gradient-brand text-white text-[11px] font-bold flex items-center justify-center">{c.unread}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* окно диалога */}
          <main className="hidden md:flex flex-1 flex-col">
            <div className="h-[72px] px-6 flex items-center justify-between border-b border-border glass">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${activeChat.gradient} flex items-center justify-center text-white font-semibold text-sm`}>
                  {activeChat.emoji}
                </div>
                <div>
                  <h2 className="font-semibold text-[15px]">{activeChat.name}</h2>
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    {activeChat.online ? <><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> в сети</> : <span className="text-muted-foreground">был(а) недавно</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {['Phone', 'Video', 'MoreVertical'].map((ic) => (
                  <button key={ic} className="w-10 h-10 rounded-2xl bg-secondary/60 border border-border flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors">
                    <Icon name={ic} size={18} />
                  </button>
                ))}
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.mine ? 'justify-end animate-msg-in-right' : 'justify-start animate-msg-in-left'}`}
                >
                  <div className={`max-w-[70%] px-4 py-2.5 text-sm leading-relaxed ${m.mine
                    ? 'gradient-brand text-white rounded-3xl rounded-br-md shadow-lg shadow-primary/20'
                    : 'bg-secondary rounded-3xl rounded-bl-md'}`}
                  >
                    {m.text}
                    <span className={`block text-[10px] mt-1 ${m.mine ? 'text-white/70 text-right' : 'text-muted-foreground'}`}>{m.time}</span>
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start animate-msg-in-left">
                  <div className="bg-secondary rounded-3xl rounded-bl-md px-4 py-3 flex items-center gap-1">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-typing-dot" style={{ animationDelay: `${d * 0.2}s` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border glass">
              <div className="flex items-center gap-2">
                <button className="w-11 h-11 rounded-2xl bg-secondary/60 border border-border flex items-center justify-center hover:text-primary transition-colors shrink-0">
                  <Icon name="Paperclip" size={19} />
                </button>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Написать сообщение..."
                  className="flex-1 h-11 px-4 rounded-2xl bg-secondary/60 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button
                  onClick={sendMessage}
                  className="w-11 h-11 rounded-2xl gradient-brand-anim animate-gradient-shift flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 transition-transform shrink-0"
                >
                  <Icon name="Send" size={18} className="text-white" />
                </button>
              </div>
            </div>
          </main>
        </div>
      ) : (
        /* маркетплейс ботов */
        <div className="relative z-10 flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-5xl mx-auto px-5 md:px-8 py-10">
            <div className="animate-fade-up text-center mb-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/60 border border-border text-xs text-muted-foreground mb-4">
                <Icon name="Sparkles" size={13} className="text-accent" /> Магазин ботов для бизнеса
              </span>
              <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight">
                Автоматизируй <span className="text-gradient">общение</span>
              </h2>
              <p className="text-muted-foreground mt-3 max-w-md mx-auto">
                Подключи готовых ботов за минуту — продажи, аналитика и поддержка прямо в мессенджере
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {BOTS.map((b, i) => (
                <div
                  key={b.id}
                  style={{ animationDelay: `${i * 80}ms` }}
                  className="animate-fade-up group relative p-5 rounded-3xl bg-card/60 border border-border hover:border-primary/40 transition-all overflow-hidden"
                >
                  <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-all" />
                  <div className="relative flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                      <Icon name={b.icon} size={24} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base">{b.name}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{b.tag}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{b.desc}</p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Icon name="Users" size={13} /> {b.users}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold">{b.price}</span>
                          <button className="px-4 py-1.5 rounded-full gradient-brand text-white text-sm font-medium hover:scale-105 transition-transform">
                            Подключить
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;