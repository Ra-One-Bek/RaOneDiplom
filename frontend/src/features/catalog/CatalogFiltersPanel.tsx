import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import type { CatalogFilters } from './catalog.types';

interface Props {
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
}

const CatalogFiltersPanel = ({ filters, onChange }: Props) => {
  return (
    <div className="grid gap-4 rounded-3xl border border-neutral-200 bg-white p-6 md:grid-cols-4">
      <Input
        placeholder="Поиск..."
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />

      <Select
        value={filters.category}
        onChange={(e) =>
          onChange({
            ...filters,
            category: e.target.value as CatalogFilters['category'],
          })
        }
        options={[
          { label: 'Все', value: 'all' },
          { label: 'Мужское', value: 'male' },
          { label: 'Женское', value: 'female' },
        ]}
      />

      <Select
        value={filters.type}
        onChange={(e) =>
          onChange({
            ...filters,
            type: e.target.value as CatalogFilters['type'],
          })
        }
        options={[
          { label: 'Все типы', value: 'all' },
          { label: 'Футболки', value: 'tshirt' },
          { label: 'Куртки', value: 'jacket' },
          { label: 'Брюки', value: 'pants' },
          { label: 'Платья', value: 'dress' },
          { label: 'Обувь', value: 'shoes' },
          { label: 'Кроссовки', value: 'sneakers' },
        ]}
      />

      <Select
        value={filters.sort}
        onChange={(e) =>
          onChange({
            ...filters,
            sort: e.target.value as CatalogFilters['sort'],
          })
        }
        options={[
          { label: 'Популярные', value: 'popular' },
          { label: 'Цена ↑', value: 'price-asc' },
          { label: 'Цена ↓', value: 'price-desc' },
          { label: 'Новинки', value: 'newest' },
        ]}
      />
    </div>
  );
};

export default CatalogFiltersPanel;