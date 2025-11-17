export default function Badge({ children, variant='default' }: any) {
  const base = 'inline-block text-xs px-2 py-0.5 rounded-full';
  const v = variant === 'accent' ? 'bg-accent-50 text-accent-500 dark:bg-accent-500/10 dark:text-accent-50' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  return <span className={base + ' ' + v}>{children}</span>
}
