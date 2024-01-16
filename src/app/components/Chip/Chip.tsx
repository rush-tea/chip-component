import React from "react";
import styles from "../../chipInput.module.css";
import { getFirstLetter, stringToColor } from "@/app/utils/utilityFunctions";

interface Chip {
  id: string;
  value: string;
  email: string;
}

interface ChipProps {
  chips: Array<Chip>;
  setChips: React.Dispatch<React.SetStateAction<Chip[]>>;
  setFilteredSuggestions: React.Dispatch<React.SetStateAction<Chip[]>>;
  filteredSuggestions: Array<Chip>;
  chip: Chip;
  handleChipKeyDown: (
    e: React.KeyboardEvent<HTMLDivElement>,
    id: string
  ) => void;
}

const Chip = ({
  chips,
  setChips,
  filteredSuggestions,
  setFilteredSuggestions,
  chip,
  handleChipKeyDown,
}: ChipProps) => {
  const handleChipRemove = (id: string) => {
    const updatedChips = chips.filter((chip) => chip.id !== id);
    const removedChip = chips.find((chip) => chip.id === id);

    if (removedChip) {
      setChips(updatedChips);
      setFilteredSuggestions([...filteredSuggestions, removedChip]);
    }
  };

  return (
    <div
      key={chip.id}
      className={styles.chip}
      id={chip.id}
      tabIndex={0}
      onKeyDown={(e) => handleChipKeyDown(e, chip.id)}
    >
      <div
        className={styles.avatar}
        style={{
          background: `${stringToColor(chip.value)}`,
        }}
      >
        {getFirstLetter(chip.value)}
      </div>
      <p>{chip.value}</p>
      <button
        className={styles.removeChip}
        onClick={() => handleChipRemove(chip.id)}
      >
        X
      </button>
    </div>
  );
};

export default Chip;
