'use client'
import { useDemoMode } from '@/lib/store/useDemoMode';

export default function ModeToggle() {
  const { mode, setMode } = useDemoMode();
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => setMode('online')} className={'px-2 py-1 rounded ' + (mode==='online' ? 'bg-sky-500 text-white' : 'bg-gray-100')}>Online</button>
      <button onClick={() => setMode('offline')} className={'px-2 py-1 rounded ' + (mode==='offline' ? 'bg-sky-500 text-white' : 'bg-gray-100')}>Offline</button>
    </div>
  )
}
