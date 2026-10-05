'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { listDemoSlots, upcomingDates } from '@/lib/booking/demo-slots';
import {
  applyChange,
  DRAFT_STORAGE_KEY,
  firstIncompleteStep,
  parseDraft,
  serializeDraft,
  stepsFor,
  type BookingDraft,
  type BookingStep,
} from '@/lib/booking/draft';
import type { BusinessHours, HomeServiceZone, Locale, Service } from '@/lib/data/types';
import { formatNumber, intlLocale } from '@/lib/format';
import { isValidQatarPhone } from '@/lib/phone';
import { computeTotal, formatQar, getPriceDisplay } from '@/lib/pricing';
import { weekdayOf } from '@/lib/time';
import styles from './BookingFlow.module.css';

interface Props {
  initial: BookingDraft;
  services: Service[];
  zones: HomeServiceZone[];
  hours: BusinessHours[];
  homeTravelMinutes?: number;
  isDemo: boolean;
}

interface Details {
  name: string;
  phone: string;
  address: string;
  notes: string;
}

function readStoredDraft(): BookingDraft {
  try {
    return parseDraft(window.localStorage.getItem(DRAFT_STORAGE_KEY), Date.now());
  } catch {
    return {};
  }
}

function storeDraft(draft: BookingDraft) {
  try {
    window.localStorage.setItem(DRAFT_STORAGE_KEY, serializeDraft(draft, Date.now()));
  } catch {
    // Storage unavailable (private mode): the flow still works, it just won't survive a reload.
  }
}

export function BookingFlow({ initial, services, zones, hours, homeTravelMinutes, isDemo }: Props) {
  const t = useTranslations('book');
  const common = useTranslations('common');
  const demo = useTranslations('demo');
  const locale = useLocale() as Locale;

  const [draft, setDraft] = useState<BookingDraft>(initial);
  const [step, setStep] = useState<BookingStep>(() => firstIncompleteStep(initial));
  const [details, setDetails] = useState<Details>({ name: '', phone: '', address: '', notes: '' });
  const [showErrors, setShowErrors] = useState(false);
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'received'>('idle');
  const [now, setNow] = useState<Date | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const restored = useRef(false);

  const homeAvailable = zones.length > 0 && services.some((s) => s.availableAtHome);

  // Restore the saved draft once; explicit choices in the URL win over stored ones.
  useEffect(() => {
    const stored = readStoredDraft();
    const fromQuery = Object.fromEntries(
      Object.entries(initial).filter(([, v]) => v !== undefined),
    );
    const merged = applyChange(stored, fromQuery);
    // Restoring from storage on mount is an external-system sync; one render is acceptable.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(merged);
    setStep(firstIncompleteStep(merged));
    setNow(new Date());
    restored.current = true;
  }, [initial]);

  useEffect(() => {
    if (restored.current) storeDraft(draft);
  }, [draft]);

  const steps = stepsFor(draft.place);
  const stepIndex = Math.max(0, steps.indexOf(step));

  const goTo = useCallback((next: BookingStep) => {
    setShowErrors(false);
    setStep(next);
    requestAnimationFrame(() => headingRef.current?.focus());
  }, []);

  const update = (change: Partial<BookingDraft>) => setDraft((d) => applyChange(d, change));

  const placeServices = useMemo(
    () =>
      services.filter((s) =>
        draft.place === 'home'
          ? s.availableAtHome
          : draft.place === 'salon'
            ? s.availableAtSalon
            : false,
      ),
    [services, draft.place],
  );
  const service = placeServices.find((s) => s.slug === draft.serviceSlug);
  const zone = zones.find((z) => z.id === draft.zoneId);
  const isHome = draft.place === 'home';

  const dates = useMemo(() => (now ? upcomingDates(now, 14) : []), [now]);
  const slots = useMemo(() => {
    if (!now || !draft.date || !service?.durationMinutes) return [];
    return listDemoSlots({
      date: draft.date,
      hours,
      durationMinutes: service.durationMinutes,
      now,
      travelMinutes: isHome ? (homeTravelMinutes ?? 0) : 0,
    });
  }, [now, draft.date, service, hours, isHome, homeTravelMinutes]);

  const detailsErrors = {
    name: details.name.trim() === '',
    phone: !isValidQatarPhone(details.phone),
    address: isHome && details.address.trim() === '',
  };
  const detailsValid = !detailsErrors.name && !detailsErrors.phone && !detailsErrors.address;

  const canContinue: Record<BookingStep, boolean> = {
    place: !!draft.place,
    service: !!service,
    zone: !!zone,
    datetime: !!draft.date && !!draft.time,
    details: detailsValid,
    review: true,
  };

  const next = () => {
    if (!canContinue[step]) {
      setShowErrors(true);
      return;
    }
    const following = steps[stepIndex + 1];
    if (following) goTo(following);
  };
  const back = () => {
    const previous = steps[stepIndex - 1];
    if (previous) goTo(previous);
  };

  const submit = () => {
    if (submitState !== 'idle') return; // guards double clicks; the server adds idempotency in Phase 5
    setSubmitState('submitting');
    window.setTimeout(() => {
      setSubmitState('received');
      requestAnimationFrame(() => headingRef.current?.focus());
    }, 700);
  };

  const startOver = () => {
    setDraft({});
    setDetails({ name: '', phone: '', address: '', notes: '' });
    setSubmitState('idle');
    goTo('place');
  };

  const dateLabel = (iso: string) =>
    new Intl.DateTimeFormat(intlLocale(locale), {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    }).format(new Date(`${iso}T00:00:00Z`));
  const longDate = (iso: string) =>
    new Intl.DateTimeFormat(intlLocale(locale), {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(`${iso}T00:00:00Z`));
  const timeLabel = (hhmm: string) =>
    new Intl.DateTimeFormat(intlLocale(locale), {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'UTC',
    }).format(new Date(`1970-01-01T${hhmm}:00Z`));

  const priceText = (s: Service) => {
    const p = getPriceDisplay(s);
    return p.kind === 'fixed' ? formatQar(p.amount, locale) : common('priceAfterReview');
  };

  // ---------- Received screen ----------
  if (submitState === 'received') {
    return (
      <div className={`container ${styles.wrap}`}>
        <div className={styles.received}>
          <span className={styles.receivedIcon}>
            <Icon name="check" size={40} />
          </span>
          <h1 ref={headingRef} tabIndex={-1} className={styles.receivedTitle}>
            {t('receivedTitle')}
          </h1>
          <Badge tone="pending" dot>
            {t('statusPending')}
          </Badge>
          {isDemo && (
            <p className={styles.demoNotice} role="note">
              {t('demoReceivedNotice')}
            </p>
          )}
          <Button variant="secondary" size="lg" onClick={startOver}>
            {t('startOver')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.wrap}`}>
      <div className={styles.top}>
        <h1 className={styles.title}>{t('title')}</h1>
        <span className={styles.stepCount}>
          {t('stepOf', {
            current: formatNumber(stepIndex + 1, locale),
            total: formatNumber(steps.length, locale),
          })}
        </span>
      </div>

      <ol className={styles.stepper} aria-label={t('title')}>
        {steps.map((s, i) => (
          <li
            key={s}
            className={i < stepIndex ? styles.done : i === stepIndex ? styles.current : undefined}
            aria-current={i === stepIndex ? 'step' : undefined}
          >
            <span className={styles.bar} aria-hidden="true" />
            {t(`steps.${s}`)}
          </li>
        ))}
      </ol>

      <section className={styles.panel} aria-labelledby="step-heading">
        {step === 'place' && (
          <>
            <h2 id="step-heading" ref={headingRef} tabIndex={-1}>
              {t('placeQuestion')}
            </h2>
            <div className={styles.options} role="group" aria-labelledby="step-heading">
              <OptionCard
                checked={draft.place === 'salon'}
                onSelect={() => update({ place: 'salon' })}
                icon="salon"
                title={t('placeSalon')}
                hint={t('placeSalonHint')}
              />
              <OptionCard
                checked={draft.place === 'home'}
                onSelect={() => update({ place: 'home' })}
                icon="home"
                title={t('placeHome')}
                hint={homeAvailable ? t('placeHomeHint') : t('homeUnavailable')}
                disabled={!homeAvailable}
              />
            </div>
          </>
        )}

        {step === 'service' && (
          <>
            <h2 id="step-heading" ref={headingRef} tabIndex={-1}>
              {t('serviceQuestion')}
            </h2>
            {placeServices.length === 0 ? (
              <p className={styles.emptyNote}>{t('noServices')}</p>
            ) : (
              <div className={styles.options} role="group" aria-labelledby="step-heading">
                {placeServices.map((s) => (
                  <OptionCard
                    key={s.id}
                    checked={draft.serviceSlug === s.slug}
                    onSelect={() => update({ serviceSlug: s.slug })}
                    title={s.name[locale]}
                    hint={[
                      s.durationMinutes
                        ? common('minutes', { count: formatNumber(s.durationMinutes, locale) })
                        : common('durationUnknown'),
                      priceText(s),
                    ].join(' • ')}
                    badge={s.isDemo ? demo('badge') : undefined}
                    disabled={!s.durationMinutes}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {step === 'zone' && (
          <>
            <h2 id="step-heading" ref={headingRef} tabIndex={-1}>
              {t('zoneQuestion')}
            </h2>
            <div className={styles.options} role="group" aria-labelledby="step-heading">
              {zones.map((z) => (
                <OptionCard
                  key={z.id}
                  checked={draft.zoneId === z.id}
                  onSelect={() => update({ zoneId: z.id })}
                  icon="pin"
                  title={z.name[locale]}
                  hint={
                    typeof z.visitFee === 'number'
                      ? `${t('visitFee')}: ${formatQar(z.visitFee, locale)}`
                      : t('visitFeePending')
                  }
                  badge={z.isDemo ? demo('badge') : undefined}
                />
              ))}
            </div>
            <p className={styles.hint}>{t('zoneNotListed')}</p>
          </>
        )}

        {step === 'datetime' && (
          <>
            <h2 id="step-heading" ref={headingRef} tabIndex={-1}>
              {t('dateQuestion')}
            </h2>
            <div className={styles.dates} role="group" aria-labelledby="step-heading">
              {dates.map((d) => {
                const day = hours.find((h) => h.weekday === weekdayOf(d));
                const closed = !day || day.closed;
                return (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={draft.date === d}
                    disabled={closed}
                    className={styles.dateChip}
                    onClick={() => update({ date: d })}
                  >
                    <span>{dateLabel(d)}</span>
                    {closed && <small>{t('closedDay')}</small>}
                  </button>
                );
              })}
            </div>
            {draft.date && (
              <>
                <h3 id="time-heading" className={styles.subheading}>
                  {t('timeQuestion')}
                </h3>
                {slots.length === 0 ? (
                  <p className={styles.emptyNote} role="status">
                    {t('noSlots')}
                  </p>
                ) : (
                  <div className={styles.times} role="group" aria-labelledby="time-heading">
                    {slots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        aria-pressed={draft.time === slot}
                        className={styles.timeChip}
                        onClick={() => update({ time: slot })}
                      >
                        {timeLabel(slot)}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {step === 'details' && (
          <>
            <h2 id="step-heading" ref={headingRef} tabIndex={-1}>
              {t('detailsTitle')}
            </h2>
            <p className={styles.infoNote}>
              <Icon name="info" size={20} />
              <span>{t('loginNotice')}</span>
            </p>
            <div className={styles.fields}>
              <Field
                id="name"
                label={t('name')}
                value={details.name}
                onChange={(v) => setDetails({ ...details, name: v })}
                error={showErrors && detailsErrors.name ? t('required') : undefined}
                autoComplete="name"
              />
              <Field
                id="phone"
                label={t('phone')}
                value={details.phone}
                onChange={(v) => setDetails({ ...details, phone: v })}
                error={showErrors && detailsErrors.phone ? t('phoneInvalid') : undefined}
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="+974"
              />
              {isHome && (
                <Field
                  id="address"
                  label={t('address')}
                  hint={t('addressHint')}
                  value={details.address}
                  onChange={(v) => setDetails({ ...details, address: v })}
                  error={showErrors && detailsErrors.address ? t('required') : undefined}
                  autoComplete="street-address"
                  multiline
                />
              )}
              <Field
                id="notes"
                label={t('notes')}
                value={details.notes}
                onChange={(v) => setDetails({ ...details, notes: v })}
                multiline
              />
            </div>
          </>
        )}

        {step === 'review' && service && (
          <>
            <h2 id="step-heading" ref={headingRef} tabIndex={-1}>
              {t('reviewTitle')}
            </h2>
            <p className={styles.infoNote}>
              <Icon name="info" size={20} />
              <span>{t('reviewNotice')}</span>
            </p>
            <ReviewSummary
              rows={[
                [t('service'), service.name[locale]],
                [t('place'), isHome ? t('placeHome') : t('placeSalon')],
                ...(isHome && zone ? ([[t('zone'), zone.name[locale]]] as [string, string][]) : []),
                [t('date'), draft.date ? longDate(draft.date) : ''],
                [t('time'), draft.time ? timeLabel(draft.time) : ''],
                [
                  t('duration'),
                  service.durationMinutes
                    ? common('minutes', { count: formatNumber(service.durationMinutes, locale) })
                    : '',
                ],
              ]}
              price={priceText(service)}
              priceLabel={t('price')}
              priceIsPending={getPriceDisplay(service).kind !== 'fixed'}
              fee={
                isHome
                  ? {
                      label: t('visitFee'),
                      text:
                        typeof zone?.visitFee === 'number'
                          ? formatQar(zone.visitFee, locale)
                          : t('visitFeePending'),
                    }
                  : undefined
              }
              total={(() => {
                const amount = computeTotal(getPriceDisplay(service), zone?.visitFee, isHome);
                return amount === undefined
                  ? undefined
                  : { label: t('total'), text: formatQar(amount, locale) };
              })()}
            />
            {isDemo && (
              <p className={styles.demoNotice} role="note">
                {t('demoSubmitNotice')}
              </p>
            )}
          </>
        )}
      </section>

      <div className={styles.nav}>
        {stepIndex > 0 && (
          <Button variant="secondary" size="lg" onClick={back}>
            {common('back')}
          </Button>
        )}
        {step === 'review' ? (
          <Button
            size="lg"
            onClick={submit}
            disabled={submitState !== 'idle'}
            aria-busy={submitState === 'submitting'}
          >
            {submitState === 'submitting' ? t('submitting') : t('submit')}
          </Button>
        ) : (
          <Button size="lg" onClick={next} aria-disabled={!canContinue[step]}>
            {common('next')}
          </Button>
        )}
      </div>
    </div>
  );
}

function OptionCard(props: {
  checked: boolean;
  onSelect: () => void;
  title: string;
  hint?: string;
  icon?: 'salon' | 'home' | 'pin';
  badge?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={props.checked}
      disabled={props.disabled}
      onClick={props.onSelect}
      className={styles.option}
    >
      {props.icon && (
        <span className={styles.optionIcon}>
          <Icon name={props.icon} />
        </span>
      )}
      <span className={styles.optionText}>
        <span className={styles.optionTitle}>{props.title}</span>
        {props.hint && <span className={styles.optionHint}>{props.hint}</span>}
        {props.badge && <Badge tone="demo">{props.badge}</Badge>}
      </span>
      <span className={styles.radio} aria-hidden="true" />
    </button>
  );
}

function Field(props: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  multiline?: boolean;
  type?: string;
  autoComplete?: string;
  inputMode?: 'tel' | 'text';
  placeholder?: string;
}) {
  const describedBy =
    [props.hint && `${props.id}-hint`, props.error && `${props.id}-error`]
      .filter(Boolean)
      .join(' ') || undefined;
  const shared = {
    id: props.id,
    value: props.value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      props.onChange(e.target.value),
    'aria-invalid': props.error ? true : undefined,
    'aria-describedby': describedBy,
    autoComplete: props.autoComplete,
    className: styles.input,
  };
  return (
    <div className={styles.field}>
      <label htmlFor={props.id}>{props.label}</label>
      {props.hint && (
        <span id={`${props.id}-hint`} className={styles.hint}>
          {props.hint}
        </span>
      )}
      {props.multiline ? (
        <textarea rows={3} {...shared} />
      ) : (
        <input
          type={props.type ?? 'text'}
          inputMode={props.inputMode}
          placeholder={props.placeholder}
          dir={props.type === 'tel' ? 'ltr' : undefined}
          {...shared}
        />
      )}
      {props.error && (
        <span id={`${props.id}-error`} className={styles.error} role="alert">
          {props.error}
        </span>
      )}
    </div>
  );
}

function ReviewSummary(props: {
  rows: [string, string][];
  priceLabel: string;
  price: string;
  priceIsPending: boolean;
  fee?: { label: string; text: string };
  total?: { label: string; text: string };
}) {
  return (
    <dl className={styles.summary}>
      {props.rows.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
      <div>
        <dt>{props.priceLabel}</dt>
        <dd className={props.priceIsPending ? styles.pending : undefined}>{props.price}</dd>
      </div>
      {props.fee && (
        <div>
          <dt>{props.fee.label}</dt>
          <dd>{props.fee.text}</dd>
        </div>
      )}
      {props.total && (
        <div className={styles.totalRow}>
          <dt>{props.total.label}</dt>
          <dd>{props.total.text}</dd>
        </div>
      )}
    </dl>
  );
}
