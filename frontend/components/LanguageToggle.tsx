'use client'
import { useRouter } from 'next/navigation'

export default function LanguageToggle({ locale }: { locale: string }) {
  const router = useRouter();
  const switchTo = (l:string) => {
    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean);
    if (['en','zh-CN','de'].includes(parts[0])) {
      parts[0] = l;
    } else {
      parts.unshift(l);
    }
    router.push('/' + parts.join('/'));
  }
  return (
    <select onChange={e => switchTo(e.target.value)} defaultValue="en" className="px-2 py-1 rounded bg-gray-100 text-sm">
      <option value="en">EN</option>
      <option value="zh-CN">中文</option>
      <option value="de">DE</option>
    </select>
  )
}
