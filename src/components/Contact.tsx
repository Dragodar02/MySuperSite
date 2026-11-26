import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, Copy, Mail } from 'lucide-react';
import { contactData, siteConfig } from '../data/portfolio';
import { SectionHeader } from './SectionHeader';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error' | 'missing_key';

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState(contactData.projectTypes[0]);
  const [message, setMessage] = useState('');
  const [botcheck, setBotcheck] = useState(false);

  const activeSocials = contactData.socials.filter(
    (social) => social.enabled && social.url.trim().length > 0
  );

  const accessKey = (
    import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ||
    contactData.web3formsAccessKey ||
    ''
  ).trim();

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactData.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      window.location.href = `mailto:${contactData.email}`;
    }
  };

  const buildMailtoFallbackUrl = () => {
    const subject = encodeURIComponent(
      `[${projectType}] Inquiry from ${name || 'Portfolio Visitor'}`
    );
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nProject Type: ${projectType}\n\n${message}`
    );
    return `mailto:${contactData.email}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (botcheck) return;

    if (!accessKey) {
      setStatus('missing_key');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `[Portfolio — ${projectType}] New message from ${name}`,
          from_name: siteConfig.name,
          name,
          email,
          project_type: projectType,
          message,
          botcheck: false,
        }),
      });

      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (response.ok && result.success) {
        setStatus('success');
        setName('');
        setEmail('');
        setProjectType(contactData.projectTypes[0]);
        setMessage('');
      } else {
        setStatus('error');
        setErrorMessage(
          result.message || 'Unable to send message right now. Please use direct email.'
        );
      }
    } catch {
      setStatus('error');
      setErrorMessage(
        'Network error while sending message. Please use the direct email link.'
      );
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left column: Editorial headline + Direct email + Socials */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col justify-between lg:col-span-5"
          >
            <div>
              <SectionHeader code="05" label="CONTACT" />

              <h2 className="editorial-text-guard mt-7 font-display text-4xl font-bold leading-[0.96] tracking-[-0.035em] text-[#F5F5F5] sm:text-5xl lg:text-6xl">
                Let&apos;s build
                <br />
                something
                <br />
                <span className="text-[#D2FF3A]">real.</span>
              </h2>

              <p className="editorial-text-guard mt-6 max-w-md text-sm leading-relaxed text-[#B4B4BC] sm:text-base">
                Open to character sculpting inquiries, collaboration, and junior
                / internship studio opportunities.
              </p>

              {/* Direct Email Card with Click to Copy + Mailto fallback */}
              <div className="mt-8 border border-white/[0.1] bg-[#0C0C12]/76 p-5 backdrop-blur-md">
                <span className="block font-mono text-[10px] uppercase tracking-[0.15em] text-[#8E8E93]">
                  DIRECT EMAIL
                </span>

                <p className="mt-2 break-all font-mono text-sm text-[#F5F5F5] sm:text-base">
                  {contactData.email}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
                      copied
                        ? 'border-[#D2FF3A] bg-[#D2FF3A]/10 text-[#D2FF3A]'
                        : 'border-white/[0.14] bg-[#14141C]/85 text-[#F5F5F5] hover:border-[#D2FF3A] hover:text-[#D2FF3A]'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>COPIED TO CLIPBOARD</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>CLICK TO COPY</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`mailto:${contactData.email}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-[#101018]/75 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#9E9EA8] transition-colors hover:border-white/25 hover:text-[#F5F5F5]"
                  >
                    <Mail className="h-3 w-3" />
                    <span>MAILTO:</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Social outline pill buttons */}
            {activeSocials.length > 0 && (
              <div className="mt-8 pt-4">
                <span className="editorial-text-guard block font-mono text-[10px] uppercase tracking-[0.15em] text-[#9E9EA8]">
                  PROFILES
                </span>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {activeSocials.map((social) => (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.14] bg-[#0C0C12]/76 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.13em] text-[#F5F5F5] backdrop-blur-md transition-colors duration-150 hover:border-[#D2FF3A] hover:text-[#D2FF3A]"
                    >
                      <span>{social.label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right column: Working Web3Forms Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="lg:col-span-7"
          >
            <form
              onSubmit={handleSubmit}
              className="border border-white/[0.1] bg-[#0C0C12]/78 p-6 backdrop-blur-md sm:p-8 lg:p-10"
            >
              {/* Hidden Web3Forms anti-spam honeypot */}
              <input
                type="checkbox"
                name="botcheck"
                checked={botcheck}
                onChange={(e) => setBotcheck(e.target.checked)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block font-mono text-[11px] uppercase tracking-[0.14em] text-[#9E9EA8]"
                  >
                    NAME *
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name or studio"
                    className="mt-2.5 w-full border border-white/[0.1] bg-[#12121A]/80 px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#8E8E93]/50 transition-colors focus:border-[#D2FF3A] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block font-mono text-[11px] uppercase tracking-[0.14em] text-[#9E9EA8]"
                  >
                    EMAIL *
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@studio.com"
                    className="mt-2.5 w-full border border-white/[0.1] bg-[#12121A]/80 px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#8E8E93]/50 transition-colors focus:border-[#D2FF3A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="contact-project-type"
                  className="block font-mono text-[11px] uppercase tracking-[0.14em] text-[#9E9EA8]"
                >
                  PROJECT TYPE
                </label>
                <select
                  id="contact-project-type"
                  name="project_type"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="mt-2.5 w-full border border-white/[0.1] bg-[#12121A]/80 px-4 py-3 text-sm text-[#F5F5F5] transition-colors focus:border-[#D2FF3A] focus:outline-none"
                >
                  {contactData.projectTypes.map((type) => (
                    <option
                      key={type}
                      value={type}
                      className="bg-[#12121A] text-[#F5F5F5]"
                    >
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="contact-message"
                  className="block font-mono text-[11px] uppercase tracking-[0.14em] text-[#9E9EA8]"
                >
                  MESSAGE *
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me about your project, timeline, or role..."
                  className="mt-2.5 w-full resize-y border border-white/[0.1] bg-[#12121A]/80 px-4 py-3 text-sm leading-relaxed text-[#F5F5F5] placeholder-[#8E8E93]/50 transition-colors focus:border-[#D2FF3A] focus:outline-none"
                />
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#D2FF3A] px-7 py-3.5 font-mono text-xs font-medium uppercase tracking-[0.14em] text-[#0A0A0A] transition-transform duration-150 hover:scale-[1.015] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>
                    {status === 'submitting' ? 'SENDING...' : 'SEND MESSAGE'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <span className="font-mono text-[10px] uppercase tracking-[0.13em] text-[#9E9EA8]">
                  DELIVERS TO {contactData.email.toUpperCase()}
                </span>
              </div>

              {/* Feedback states */}
              {status === 'success' && (
                <div
                  role="status"
                  className="mt-6 border border-[#D2FF3A]/40 bg-[#D2FF3A]/[0.08] px-4 py-3.5 font-mono text-xs text-[#D2FF3A]"
                >
                  MESSAGE SENT — Thank you! Your message has been delivered directly to{' '}
                  {contactData.email}.
                </div>
              )}

              {status === 'missing_key' && (
                <div
                  role="alert"
                  className="mt-6 border border-white/15 bg-[#12121A]/90 p-4 text-xs leading-relaxed text-[#9E9EA8]"
                >
                  <p className="font-mono uppercase tracking-[0.12em] text-[#F5F5F5]">
                    WEB3FORMS KEY NOT CONFIGURED YET
                  </p>
                  <p className="mt-1.5">
                    Add <code className="text-[#D2FF3A]">VITE_WEB3FORMS_ACCESS_KEY</code> in{' '}
                    <code className="text-[#F5F5F5]">.env</code> (or GitHub Actions Secrets) to
                    enable direct form submission, or send your message immediately via your
                    mail client:
                  </p>
                  <a
                    href={buildMailtoFallbackUrl()}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#D2FF3A] px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#D2FF3A] hover:bg-[#D2FF3A] hover:text-[#0A0A0A]"
                  >
                    <span>OPEN PRE-FILLED EMAIL</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}

              {status === 'error' && (
                <div
                  role="alert"
                  className="mt-6 border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-200"
                >
                  <p>{errorMessage}</p>
                  <a
                    href={buildMailtoFallbackUrl()}
                    className="mt-2.5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#D2FF3A] underline underline-offset-4"
                  >
                    <span>SEND VIA MAIL APP INSTEAD</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
