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
    <section id="contact" className="py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeader code="05" label="CONTACT" rightMeta="DIRECT INQUIRIES" />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:mt-10 lg:grid-cols-12 lg:gap-10">
          {/* Left column: Editorial headline + Direct email + Socials on clean studio surface */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35 }}
            className="studio-surface flex flex-col justify-between p-7 sm:p-10 lg:col-span-5"
          >
            <div>
              <h2 className="font-display text-4xl font-bold leading-[0.98] tracking-[-0.035em] text-[#F5F5F7] sm:text-5xl">
                Let&apos;s build
                <br />
                something
                <br />
                <span className="text-[#D2FF3A]">real.</span>
              </h2>

              <p className="mt-6 max-w-md text-[15px] leading-[1.65] text-[#C8C8D2] sm:text-base">
                Open to character sculpting inquiries, collaboration, and junior
                / internship studio opportunities.
              </p>

              {/* Direct Email Card with Click to Copy + Mailto fallback */}
              <div className="mt-8 border border-white/[0.1] bg-[#14141D] p-5">
                <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-[#A6A6B4]">
                  DIRECT EMAIL
                </span>

                <p className="mt-2 break-all font-mono text-sm font-medium text-[#F5F5F7] sm:text-base">
                  {contactData.email}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.13em] transition-colors ${
                      copied
                        ? 'border-[#D2FF3A] bg-[#D2FF3A]/15 text-[#D2FF3A]'
                        : 'border-white/[0.16] bg-[#1A1A26] text-[#F5F5F7] hover:border-[#D2FF3A] hover:text-[#D2FF3A]'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>COPIED TO CLIPBOARD</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>CLICK TO COPY</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`mailto:${contactData.email}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-[#111119] px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.13em] text-[#C8C8D2] transition-colors hover:border-white/30 hover:text-[#F5F5F7]"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>MAILTO:</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Social outline pill buttons */}
            {activeSocials.length > 0 && (
              <div className="mt-8 border-t border-white/[0.08] pt-6">
                <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-[#A6A6B4]">
                  PROFILES
                </span>
                <div className="mt-3.5 flex flex-wrap gap-2.5">
                  {activeSocials.map((social) => (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.14] bg-[#14141D] px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.13em] text-[#F5F5F7] transition-colors duration-150 hover:border-[#D2FF3A] hover:text-[#D2FF3A]"
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
              className="studio-surface h-full p-7 sm:p-10 lg:p-11"
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
                    className="block font-mono text-xs font-medium uppercase tracking-[0.14em] text-[#B5B5C2]"
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
                    className="mt-2.5 w-full border border-white/[0.14] bg-[#14141E] px-4 py-3 text-sm leading-relaxed text-[#F5F5F7] placeholder-[#8A8A98] transition-colors focus:border-[#D2FF3A] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block font-mono text-xs font-medium uppercase tracking-[0.14em] text-[#B5B5C2]"
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
                    className="mt-2.5 w-full border border-white/[0.14] bg-[#14141E] px-4 py-3 text-sm leading-relaxed text-[#F5F5F7] placeholder-[#8A8A98] transition-colors focus:border-[#D2FF3A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="contact-project-type"
                  className="block font-mono text-xs font-medium uppercase tracking-[0.14em] text-[#B5B5C2]"
                >
                  PROJECT TYPE
                </label>
                <select
                  id="contact-project-type"
                  name="project_type"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="mt-2.5 w-full border border-white/[0.14] bg-[#14141E] px-4 py-3 text-sm text-[#F5F5F7] transition-colors focus:border-[#D2FF3A] focus:outline-none"
                >
                  {contactData.projectTypes.map((type) => (
                    <option
                      key={type}
                      value={type}
                      className="bg-[#14141E] text-[#F5F5F7]"
                    >
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="contact-message"
                  className="block font-mono text-xs font-medium uppercase tracking-[0.14em] text-[#B5B5C2]"
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
                  className="mt-2.5 w-full resize-y border border-white/[0.14] bg-[#14141E] px-4 py-3 text-sm leading-[1.65] text-[#F5F5F7] placeholder-[#8A8A98] transition-colors focus:border-[#D2FF3A] focus:outline-none"
                />
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#D2FF3A] px-7 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#0A0A0A] transition-transform duration-150 hover:scale-[1.015] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>
                    {status === 'submitting' ? 'SENDING...' : 'SEND MESSAGE'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#A6A6B4]">
                  DELIVERS TO {contactData.email.toUpperCase()}
                </span>
              </div>

              {/* Feedback states */}
              {status === 'success' && (
                <div
                  role="status"
                  className="mt-6 border border-[#D2FF3A]/45 bg-[#D2FF3A]/[0.1] px-4 py-3.5 font-mono text-xs leading-relaxed text-[#D2FF3A]"
                >
                  MESSAGE SENT — Thank you! Your message has been delivered directly to{' '}
                  {contactData.email}.
                </div>
              )}

              {status === 'missing_key' && (
                <div
                  role="alert"
                  className="mt-6 border border-white/15 bg-[#14141E] p-4 text-xs leading-[1.65] text-[#C8C8D2]"
                >
                  <p className="font-mono uppercase tracking-[0.12em] text-[#F5F5F7]">
                    WEB3FORMS KEY NOT CONFIGURED YET
                  </p>
                  <p className="mt-1.5">
                    Add <code className="text-[#D2FF3A]">VITE_WEB3FORMS_ACCESS_KEY</code> in{' '}
                    <code className="text-[#F5F5F7]">.env</code> (or GitHub Actions Secrets) to
                    enable direct form submission, or send your message immediately via your
                    mail client:
                  </p>
                  <a
                    href={buildMailtoFallbackUrl()}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#D2FF3A] px-4 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#D2FF3A] hover:bg-[#D2FF3A] hover:text-[#0A0A0A]"
                  >
                    <span>OPEN PRE-FILLED EMAIL</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}

              {status === 'error' && (
                <div
                  role="alert"
                  className="mt-6 border border-red-400/40 bg-red-950/60 p-4 text-xs leading-[1.6] text-red-100"
                >
                  <p>{errorMessage}</p>
                  <a
                    href={buildMailtoFallbackUrl()}
                    className="mt-2.5 inline-flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#D2FF3A] underline underline-offset-4"
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
