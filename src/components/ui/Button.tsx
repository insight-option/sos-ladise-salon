import type { ButtonHTMLAttributes, ComponentProps } from 'react';
import { Link } from '@/i18n/navigation';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'solid' | 'inverse' | 'onDark';

interface StyleProps {
  variant?: ButtonVariant;
  size?: 'md' | 'lg';
  block?: boolean;
}

export function buttonClass(
  { variant = 'primary', size = 'md', block = false }: StyleProps,
  extra?: string,
) {
  return [styles.button, styles[variant], size === 'lg' && styles.lg, block && styles.block, extra]
    .filter(Boolean)
    .join(' ');
}

export function Button({
  variant,
  size,
  block,
  className,
  type = 'button',
  ...rest
}: StyleProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={buttonClass({ variant, size, block }, className)} {...rest} />
  );
}

export function ButtonLink({
  variant,
  size,
  block,
  className,
  ...rest
}: StyleProps & ComponentProps<typeof Link>) {
  return <Link className={buttonClass({ variant, size, block }, className)} {...rest} />;
}
