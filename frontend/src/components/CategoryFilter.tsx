import { ALL_CATEGORIES, CATEGORIES } from "../lib/categories";
import type { CategoryId } from "../lib/categories";

interface CategoryFilterProps {
  selected: CategoryId[];
  onChange: (selected: CategoryId[]) => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  function toggle(id: CategoryId) {
    // On reconstruit la liste dans l'ordre d'origine des catégories
    onChange(
      ALL_CATEGORIES.filter((category) =>
        category === id ? !selected.includes(category) : selected.includes(category)
      )
    );
  }

  return (
    <fieldset>
      <legend>Données à afficher</legend>
      {CATEGORIES.map((category) => (
        <label key={category.id} className="filter-option">
          <input
            type="checkbox"
            checked={selected.includes(category.id)}
            onChange={() => toggle(category.id)}
          />{" "}
          {category.label}
        </label>
      ))}
      <button
        type="button"
        onClick={() => onChange(ALL_CATEGORIES)}
        disabled={selected.length === ALL_CATEGORIES.length}
      >
        Tout afficher
      </button>
    </fieldset>
  );
}