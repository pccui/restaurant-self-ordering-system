export default function Card({ children, className='', shadow=true }: any) {
  return <div className={'bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden '+className}>{children}</div>
}
