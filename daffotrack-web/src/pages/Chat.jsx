import { useEffect, useMemo, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Bell, BookOpen, Bot, Check, Copy, FileText, GraduationCap, Image as ImageIcon,
  Mic2, Paperclip, Plus, Send, Share2, ShieldAlert, Sparkles, Trash2, User,
  Volume2, VolumeX, X
} from 'lucide-react';
import { apiRequest } from '../lib/api';
import PageTopBar from '../components/PageTopBar';
import { getCurrentUser } from '../lib/session';

const SUGGESTED = [
  { icon: BookOpen, category: 'Finance', text: 'What is the tuition waiver policy at DIU?' },
  { icon: Bell, category: 'Exams', text: 'How do I register for a makeup midterm?' },
  { icon: GraduationCap, category: 'Grades', text: 'What is grade improvement vs retake?' },
  { icon: Sparkles, category: 'Attendance', text: 'What attendance is required for finals?' },
];

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function createWelcomeMessage() {
  return {
    id: `ai-${Date.now()}`,
    sender: 'ai',
    text: 'Hello! I am DaffoTrack AI, your smart academic companion at Daffodil International University. I can help with CGPA planning, waiver guidance, attendance, makeup exams, retakes, course planning, and uploaded file context.\n\nWhat can I clarify for you today?',
    time: nowTime(),
  };
}

function createConversation() {
  return {
    id: `chat-${Date.now()}`,
    title: 'New chat',
    updatedAt: new Date().toISOString(),
    messages: [createWelcomeMessage()],
  };
}

function titleFromMessage(text) {
  const clean = text.trim().replace(/\s+/g, ' ');
  return clean ? clean.slice(0, 42) : 'Attachment chat';
}

function formatFileSize(size) {
  if (!size) return '0 KB';
  if (size < 1024 * 1024) return `${Math.ceil(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function historyKey(user) {
  return user?.userId
    ? `userId=${user.userId}`
    : `studentId=${encodeURIComponent(user?.studentId || 'guest')}`;
}

function attachmentContext(attachments) {
  if (!attachments.length) return '';
  return [
    '',
    'Uploaded file context available to you. Use this extracted content and metadata to answer. Do not say you cannot access attachments; if full binary content is not extracted, say what is available and ask for the missing text if needed.',
    ...attachments.map((file) => {
      const details = `- ${file.name} (${file.type || 'unknown type'}, ${file.sizeLabel})`;
      if (file.textContent) {
        return `${details}\n  Extracted content:\n${file.textContent.slice(0, 6000)}`;
      }
      if (file.isImage) {
        return `${details}\n  Image preview is visible to the user, but no computer-vision extraction has been performed. Ask the user for image text/details if visual analysis is required.`;
      }
      return `${details}\n  No text was extracted in the browser. Ask the user to paste key contents if needed.`;
    }),
  ].join('\n');
}

function fromApiConversation(conversation) {
  const apiMessages = conversation.messages || [];
  return {
    id: conversation.id,
    title: conversation.title || 'New chat',
    updatedAt: conversation.updatedAt || new Date().toISOString(),
    messages: apiMessages.length ? apiMessages.map(fromApiMessage) : [createWelcomeMessage()],
  };
}

function fromApiMessage(message) {
  let attachments = [];
  try {
    attachments = message.attachmentsJson ? JSON.parse(message.attachmentsJson) : [];
  } catch {
    attachments = [];
  }

  return {
    id: `db-${message.id}`,
    sender: message.sender,
    text: message.text,
    attachments,
    time: message.createdAt
      ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : nowTime(),
  };
}

function readAsDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

function readAsText(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => resolve('');
    reader.readAsText(file);
  });
}

export default function Chat() {
  const { drawerOpen, setDrawerOpen } = useOutletContext();
  const currentUser = getCurrentUser();
  const ownerQuery = useMemo(() => historyKey(currentUser), [currentUser?.userId, currentUser?.studentId]);

  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);
  const [ttsEnabled, setTtsEnabled] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  const activeConversation = conversations.find((item) => item.id === activeConversationId) || conversations[0];
  const messages = activeConversation?.messages || [];
  const hasOnlyWelcome = messages.length <= 1;

  useEffect(() => {
    let ignore = false;
    setLoadingHistory(true);
    apiRequest(`/api/chat/conversations?${ownerQuery}`)
      .then(async (items) => {
        if (ignore) return;
        if (!items.length) {
          const created = await createConversationOnServer('New chat');
          if (!ignore) {
            setConversations([fromApiConversation(created)]);
            setActiveConversationId(created.id);
          }
          return;
        }

        const first = await apiRequest(`/api/chat/conversations/${items[0].id}?${ownerQuery}`);
        if (!ignore) {
          const prepared = items.map(fromApiConversation);
          prepared[0] = fromApiConversation(first);
          setConversations(prepared);
          setActiveConversationId(first.id);
        }
      })
      .catch((err) => setError(err.message || 'Unable to load chat history.'))
      .finally(() => {
        if (!ignore) setLoadingHistory(false);
      });

    return () => {
      ignore = true;
    };
  }, [ownerQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const createConversationOnServer = (title = 'New chat') => apiRequest('/api/chat/conversations', {
    method: 'POST',
    body: JSON.stringify({
      userId: currentUser?.userId || null,
      studentId: currentUser?.studentId || 'guest',
      title,
    }),
  });

  const updateActiveConversation = (updater) => {
    setConversations((items) => items.map((conversation) => {
      if (conversation.id !== activeConversationId) return conversation;
      const updated = updater(conversation);
      return { ...updated, updatedAt: new Date().toISOString() };
    }));
  };

  const startNewChat = async () => {
    const next = fromApiConversation(await createConversationOnServer('New chat'));
    setConversations((items) => [next, ...items]);
    setActiveConversationId(next.id);
    setInputText('');
    setAttachments([]);
    setError('');
    window.speechSynthesis?.cancel();
    setSpeakingId(null);
  };

  const deleteConversation = async (id) => {
    await apiRequest(`/api/chat/conversations/${id}?${ownerQuery}`, { method: 'DELETE' });
    const nextItems = conversations.filter((item) => item.id !== id);
    if (!nextItems.length) {
      await startNewChat();
      return;
    }
    setConversations(nextItems);
    if (id === activeConversationId) {
      openConversation(nextItems[0].id);
    }
  };

  const appendMessage = (message) => {
    updateActiveConversation((conversation) => ({
      ...conversation,
      title: conversation.title === 'New chat' && message.sender === 'user'
        ? titleFromMessage(message.text)
        : conversation.title,
      messages: [...conversation.messages, message],
    }));
  };

  const openConversation = async (conversationId) => {
    setActiveConversationId(conversationId);
    const conversation = await apiRequest(`/api/chat/conversations/${conversationId}?${ownerQuery}`);
    setConversations((items) => items.map((item) => item.id === conversationId ? fromApiConversation(conversation) : item));
  };

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const prepared = await Promise.all(files.slice(0, 5).map(async (file) => {
      const base = {
        id: `file-${Date.now()}-${file.name}`,
        name: file.name,
        type: file.type,
        size: file.size,
        sizeLabel: formatFileSize(file.size),
        isImage: file.type.startsWith('image/'),
        isPdf: file.type === 'application/pdf' || /\.pdf$/i.test(file.name),
      };

      const isReadableText = file.type.startsWith('text/') || /\.(csv|txt|md|json)$/i.test(file.name);
      if (isReadableText && file.size <= 512 * 1024) {
        return { ...base, previewUrl: await readAsDataUrl(file), textContent: await readAsText(file) };
      }

      if (base.isImage && file.size <= 4 * 1024 * 1024) {
        return { ...base, previewUrl: await readAsDataUrl(file) };
      }

      if (base.isPdf && file.size <= 8 * 1024 * 1024) {
        return { ...base, previewUrl: await readAsDataUrl(file) };
      }

      return base;
    }));

    setAttachments((prev) => [...prev, ...prepared]);
    event.target.value = '';
  };

  const removeAttachment = (id) => {
    setAttachments((items) => items.filter((item) => item.id !== id));
  };

  const sendMessage = async (text) => {
    const msg = (text ?? inputText).trim();
    if ((!msg && !attachments.length) || isTyping) return;

    const files = attachments;
    const userText = msg || 'Please review the attached file context.';
    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      attachments: files,
      time: nowTime(),
    };

    appendMessage(userMessage);
    setInputText('');
    setAttachments([]);
    setIsTyping(true);
    setError('');

    const apiMessage = `${userText}${attachmentContext(files)}`;

    try {
      const data = await apiRequest('/api/chat/ask', {
        method: 'POST',
        body: JSON.stringify({
          conversationId: activeConversationId,
          userId: currentUser?.userId || null,
          studentId: currentUser?.studentId || 'guest',
          message: apiMessage,
          attachmentsJson: JSON.stringify(files),
        }),
      });
      const aiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.response || 'No response received from backend.',
        time: nowTime(),
      };
      appendMessage(aiMessage);
      if (ttsEnabled) speak(aiMessage.id, aiMessage.text);
    } catch (err) {
      setError(err.message || 'Failed to reach backend chat API.');
      appendMessage({
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'Backend chat API is unreachable right now. Please make sure Spring Boot is running on port 8081.',
        time: nowTime(),
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  const copyMessage = async (message) => {
    await navigator.clipboard?.writeText(message.text);
    setCopiedId(message.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const shareMessage = async (message) => {
    if (navigator.share) {
      await navigator.share({ title: 'DaffoTrack AI', text: message.text });
      return;
    }
    await copyMessage(message);
  };

  const speak = (id, text) => {
    if (!window.speechSynthesis) return;
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const toggleTts = () => {
    const next = !ttsEnabled;
    setTtsEnabled(next);
    if (!next) {
      window.speechSynthesis?.cancel();
      setSpeakingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#060e1a] text-white flex flex-col h-screen overflow-hidden">
      <PageTopBar
        title="AI Advisor Chat"
        subtitle="Ask DIU policy and academic questions"
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />

      <div className="flex-1 flex overflow-hidden pt-16">
        <aside className="hidden lg:flex w-72 bg-[#0a1525] border-r border-white/6 flex-col p-4 gap-4 overflow-y-auto shrink-0">
          <button
            type="button"
            onClick={startNewChat}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-teal-500/20 bg-teal-500/10 text-sm font-bold text-teal-400 hover:bg-teal-500/15"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>

          <div className="rounded-2xl border border-teal-500/15 bg-teal-500/6 p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-teal-500/15 border border-teal-500/25 flex items-center justify-center text-teal-400">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#060e1a]" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">DaffoTrack AI</p>
                <p className="text-[10px] text-emerald-400 font-mono">GROQ READY</p>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-slate-400 leading-relaxed">
              Chats are saved locally for this browser and user session.
            </p>
          </div>

          <div className="space-y-2">
            <p className="px-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">History</p>
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`group flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-all ${
                  conversation.id === activeConversationId
                    ? 'border-teal-500/25 bg-teal-500/10'
                    : 'border-white/6 bg-white/2 hover:bg-white/4'
                }`}
              >
                <button type="button" onClick={() => openConversation(conversation.id)} className="min-w-0 flex-1 text-left">
                  <p className="truncate text-xs font-bold text-white">{conversation.title}</p>
                  <p className="mt-0.5 text-[10px] text-slate-600">
                    {new Date(conversation.updatedAt).toLocaleDateString()}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => deleteConversation(conversation.id)}
                  className="rounded-lg p-1.5 text-slate-600 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 flex flex-col bg-[#060e1a] overflow-hidden">
          {loadingHistory && (
            <div className="border-b border-white/6 bg-[#0a1525] px-4 py-2 text-center text-xs text-slate-500">
              Loading chat history from database...
            </div>
          )}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-0.5 ${
                  msg.sender === 'ai'
                    ? 'bg-teal-500/15 border border-teal-500/25 text-teal-400'
                    : 'bg-white/8 border border-white/12 text-slate-400'
                }`}>
                  {msg.sender === 'ai' ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </div>

                <div className="max-w-[82%] sm:max-w-[70%]">
                  <div className={`rounded-2xl px-4 py-3 border whitespace-pre-line text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-teal-500/10 border-teal-500/20 text-white rounded-br-none'
                      : 'bg-[#0d1e35] border-white/7 text-slate-100 rounded-bl-none'
                  }`}>
                    <span className={`block text-[9px] font-bold uppercase tracking-widest mb-1.5 ${
                      msg.sender === 'ai' ? 'text-teal-400' : 'text-teal-300'
                    }`}>
                      {msg.sender === 'ai' ? 'DaffoTrack AI' : 'You'}
                    </span>
                    {msg.text}

                    {!!msg.attachments?.length && (
                      <div className="mt-3 grid gap-2">
                        {msg.attachments.map((file) => (
                          <AttachmentPreview key={file.id} file={file} />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={`mt-1 flex items-center gap-1.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.time && <span className="mr-1 text-[9px] text-slate-600">{msg.time}</span>}
                    {msg.sender === 'ai' && (
                      <>
                        <ActionButton label="Copy" onClick={() => copyMessage(msg)}>
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </ActionButton>
                        <ActionButton label="Share" onClick={() => shareMessage(msg)}>
                          <Share2 className="w-3.5 h-3.5" />
                        </ActionButton>
                        <ActionButton label={speakingId === msg.id ? 'Stop voice' : 'Listen'} onClick={() => speak(msg.id, msg.text)}>
                          {speakingId === msg.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </ActionButton>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-end gap-3">
                <div className="w-7 h-7 rounded-full bg-teal-500/15 border border-teal-500/25 flex items-center justify-center text-teal-400 shrink-0">
                  <Bot className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div className="bg-[#0d1e35] border border-white/7 rounded-2xl rounded-bl-none px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {[0, 150, 300].map((delay) => (
                      <span key={delay} className="w-1.5 h-1.5 bg-teal-500/60 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="bg-[#0a1525]/90 backdrop-blur-sm border-t border-white/6 p-4 shrink-0">
            <div className="mx-auto max-w-4xl space-y-3">
              {hasOnlyWelcome && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SUGGESTED.map(({ icon: Icon, category, text }) => (
                    <button
                      key={text}
                      type="button"
                      onClick={() => sendMessage(text)}
                      disabled={isTyping}
                      className="text-left rounded-xl border border-white/7 bg-white/3 p-3 transition-all hover:border-teal-500/30 hover:bg-teal-500/5"
                    >
                      <div className="mb-1.5 flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-teal-400" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600">{category}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-300">{text}</p>
                    </button>
                  ))}
                </div>
              )}

              {!!attachments.length && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {attachments.map((file) => (
                    <div key={file.id} className="relative">
                      <AttachmentPreview file={file} compact />
                      <button
                        type="button"
                        onClick={() => removeAttachment(file.id)}
                        className="absolute right-2 top-2 rounded-full border border-white/10 bg-[#060e1a]/90 p-1 text-slate-500 hover:text-red-400"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt,.csv" className="hidden" onChange={handleFiles} />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/4 text-slate-400 transition-all hover:border-teal-500/25 hover:text-teal-400"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={toggleTts}
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all ${
                    ttsEnabled
                      ? 'border-teal-500/30 bg-teal-500/10 text-teal-400'
                      : 'border-white/8 bg-white/4 text-slate-400 hover:text-teal-400'
                  }`}
                >
                  <Mic2 className="h-5 w-5" />
                </button>
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(event) => setInputText(event.target.value)}
                    placeholder="Ask about DIU waiver rules, upload files, or plan your CGPA..."
                    className="w-full bg-[#060e1a] border border-white/8 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={(!inputText.trim() && !attachments.length) || isTyping}
                  className="p-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-[#060e1a] font-bold transition-all disabled:opacity-40 disabled:pointer-events-none hover:scale-105 shadow-[0_0_20px_rgba(45,212,191,0.3)] shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>

            {error && (
              <div className="max-w-4xl mx-auto mt-3 text-xs text-red-400 bg-red-500/8 border border-red-500/15 rounded-xl px-3 py-2">
                {error}
              </div>
            )}

            <div className="text-[10px] text-center text-slate-600 mt-2.5 flex items-center justify-center gap-1.5">
              <ShieldAlert className="w-3 h-3 text-teal-500/50" />
              Chat history is stored in this browser. Uploaded files are sent as metadata/context only.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function ActionButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className="rounded-lg border border-white/6 bg-white/3 p-1.5 text-slate-500 transition-all hover:border-teal-500/25 hover:text-teal-400"
    >
      {children}
    </button>
  );
}

function AttachmentPreview({ file, compact = false }) {
  const showImage = file.previewUrl && file.isImage;
  const showPdf = file.previewUrl && file.isPdf;
  const showText = file.textContent;

  return (
    <div className="rounded-xl border border-white/8 bg-[#060e1a]/75 p-2">
      <div className="flex items-center gap-3">
        {showImage ? (
          <a href={file.previewUrl} target="_blank" rel="noreferrer" className="block shrink-0">
            <img src={file.previewUrl} alt={file.name} className={`${compact ? 'h-14 w-14' : 'h-16 w-16'} rounded-lg object-cover`} />
          </a>
        ) : (
          <div className={`${compact ? 'h-12 w-12' : 'h-10 w-10'} flex shrink-0 items-center justify-center rounded-lg bg-white/5 text-teal-400`}>
            {file.isImage ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
          </div>
        )}
        <div className="min-w-0 flex-1 pr-7">
          <p className="truncate text-xs font-bold text-white">{file.name}</p>
          <p className="mt-0.5 text-[10px] text-slate-500">
            {file.sizeLabel}
            {showText ? ' · text extracted' : showPdf ? ' · preview available' : file.isImage ? ' · image preview' : ''}
          </p>
          {showPdf && (
            <a href={file.previewUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block text-[10px] font-bold text-teal-400 hover:text-teal-300">
              Open PDF preview
            </a>
          )}
        </div>
      </div>
      {showText && !compact && (
        <pre className="mt-2 max-h-32 overflow-auto rounded-lg border border-white/6 bg-black/20 p-2 text-[10px] leading-relaxed text-slate-400 whitespace-pre-wrap">
          {file.textContent.slice(0, 1200)}
        </pre>
      )}
    </div>
  );
}
