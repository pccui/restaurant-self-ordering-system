import MenuList from '@/components/menu/MenuList';

/**
 * Menu page in local mode
 * Uses same component as server mode, but route determines data source
 */
export default function LocalMenuPage() {
  return <MenuList />;
}
