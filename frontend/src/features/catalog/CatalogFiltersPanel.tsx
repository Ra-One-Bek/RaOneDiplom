import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import type { CatalogFilters } from './catalog.types';

interface Props {
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
}

const CatalogFiltersPanel = ({ filters, onChange }: Props) => {
  return (
    <div className="grid gap-4 rounded-3xl bg-white p-5 shadow-sm lg:grid-cols-4">
      <Input
        label="Поиск"
        placeholder="Например, платье или кроссовки"
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />

      <Select
        label="Категория"
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
        label="Тип"
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
          { label: 'Рубашки', value: 'shirt' },
          { label: 'Куртки', value: 'jacket' },
          { label: 'Брюки', value: 'pants' },
          { label: 'Юбки', value: 'skirt' },
          { label: 'Платья', value: 'dress' },
          { label: 'Туфли', value: 'shoes' },
          { label: 'Кроссовки', value: 'sneakers' },
        ]}
      />

      <Select
        label="Сортировка"
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