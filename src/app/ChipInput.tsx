"use client";
import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  ChangeEvent,
} from "react";
import styles from "./chipInput.module.css";
import data from "./utils/data.json";
import Chip from "./components/Chip/Chip";
import { getFirstLetter, stringToColor } from "./utils/utilityFunctions";
import { ChipInterface } from "./utils/interfaces";

const ChipInput: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [chips, setChips] = useState<ChipInterface[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<
    { id: string; value: string; email: string }[]
  >([]);
  const [isSuggestionListOpen, setIsSuggestionListOpen] =
    useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setFilteredSuggestions(data);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        suggestionListRef.current &&
        !suggestionListRef.current.contains(e.target as Node)
      ) {
        setIsSuggestionListOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Filter the suggestions based on user input
    const filteredItems = data.filter((item) =>
      item.value.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSuggestions(filteredItems);
    setIsSuggestionListOpen(true);
  };

  const handleSuggestionClick = (item: {
    id: string;
    value: string;
    email: string;
  }) => {
    setChips([...chips, item]);
    setFilteredSuggestions((prevSuggestions) =>
      prevSuggestions.filter((suggestion) => suggestion.id !== item.id)
    );
    setInputValue("");
    setIsSuggestionListOpen(true);
  };

  const handleChipRemove = (id: string) => {
    const updatedChips = chips.filter((chip) => chip.id !== id);
    const removedChip = chips.find((chip) => chip.id === id);

    if (removedChip) {
      setChips(updatedChips);
      setFilteredSuggestions([...filteredSuggestions, removedChip]);
    }
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      setIsSuggestionListOpen(false);
    } else if (e.key === "Backspace" && inputValue === "") {
      const lastChip = chips[chips.length - 1];
      if (lastChip) {
        setChips(chips.slice(0, -1));
        setFilteredSuggestions([...filteredSuggestions, lastChip]);
      }
    } else if (e.key === "ArrowDown" && inputValue !== "") {
      const firstSuggestion = filteredSuggestions[0];
      if (firstSuggestion) {
        const firstSuggestionChip = document.getElementById(
          `${"#" + firstSuggestion.id}`
        );
        if (firstSuggestionChip) {
          firstSuggestionChip.focus();
          firstSuggestionChip.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        }
      }
      inputRef.current?.blur();
    } else if (e.key === "ArrowUp" && inputValue !== "") {
      const lastSuggestion =
        filteredSuggestions[filteredSuggestions.length - 1];
      if (lastSuggestion) {
        const lastSuggestionChip = document.getElementById(
          `${"#" + lastSuggestion.id}`
        );
        if (lastSuggestionChip) {
          lastSuggestionChip.focus();
          lastSuggestionChip.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        }
      }
      inputRef.current?.blur();
    } else if (e.key === "ArrowLeft" && inputValue === "") {
      // Move focus to the last chip when Arrow Left is pressed and input is empty
      const lastChip = chips[chips.length - 1];
      if (lastChip) {
        const lastChipElement = document.getElementById(lastChip.id);
        if (lastChipElement) {
          lastChipElement.focus();
          lastChipElement.style.backgroundColor = "rgba(0,0,0,0.4)";
        }
      }
    } else if (e.key === "ArrowRight" && inputValue === "") {
      // Move focus to the first chip when Arrow Right is pressed and input is empty
      const firstChip = chips[0];
      if (firstChip) {
        const firstChipElement = document.getElementById(firstChip.id);
        if (firstChipElement) {
          firstChipElement.focus();
          firstChipElement.style.backgroundColor = "rgba(0,0,0,0.4)";
        }
      }
    } else if (e.key === "Enter") {
      // Call handleChipRemove when Enter is pressed and a chip is focused
      const focusedChip = document.activeElement as HTMLElement;
      if (focusedChip && focusedChip.classList.contains(styles.chip)) {
        const chipId = focusedChip.id;
        handleChipRemove(chipId);
      }
    }
  };

  const handleChipKeyDown = (e: KeyboardEvent<HTMLDivElement>, id: string) => {
    if (e.key === "ArrowLeft") {
      // Move focus to the previous chip when Arrow Left is pressed
      const currentIndex = chips.findIndex((chip) => chip.id === id);
      if (currentIndex > 0) {
        const previousChip = chips[currentIndex - 1];
        const previousChipElement = document.getElementById(previousChip.id);
        if (previousChipElement) {
          previousChipElement.focus();
          previousChipElement.style.backgroundColor = "rgba(0,0,0,0.4)";
        }
      }
    } else if (e.key === "ArrowRight") {
      // Move focus to the next chip when Arrow Right is pressed
      const currentIndex = chips.findIndex((chip) => chip.id === id);
      if (currentIndex < chips.length - 1) {
        const nextChip = chips[currentIndex + 1];
        const nextChipElement = document.getElementById(nextChip.id);
        if (nextChipElement) {
          nextChipElement.focus();
          nextChipElement.style.backgroundColor = "rgba(0,0,0,0.4)";
        }
      } else if (currentIndex === chips.length - 1) {
        // Move focus to the input box when Arrow Right is pressed on the last chip
        inputRef.current?.focus();
      }
    } else if (e.key === "Enter") {
      // Call handleChipRemove when Enter is pressed on a focused chip
      handleChipRemove(id);
    }
  };

  const handleDropdownKeyDown = (
    e: KeyboardEvent<HTMLDivElement>,
    id: string
  ) => {
    if (e.key === "ArrowDown") {
      const focusedSuggestion = document.activeElement as HTMLElement;
      const suggestionIndex = parseInt(
        focusedSuggestion.getAttribute("tabIndex") || "0",
        10
      );
      if (focusedSuggestion && suggestionIndex > 0) {
        const nextSuggestion = suggestionListRef.current?.querySelector(
          `[tabIndex="${suggestionIndex + 1}"]`
        ) as HTMLElement;
        if (nextSuggestion) {
          nextSuggestion.focus();
          nextSuggestion.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        }
      }
    } else if (e.key === "ArrowUp") {
      const focusedSuggestion = document.activeElement as HTMLElement;
      const suggestionIndex = parseInt(
        focusedSuggestion.getAttribute("tabIndex") || "0",
        10
      );
      if (focusedSuggestion && suggestionIndex > 0) {
        const previousSuggestion = suggestionListRef.current?.querySelector(
          `[tabIndex="${suggestionIndex - 1}"]`
        ) as HTMLElement;
        if (previousSuggestion) {
          previousSuggestion.focus();
          previousSuggestion.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      } else if (focusedSuggestion && suggestionIndex === 1) {
        suggestionListRef.current?.blur();
        inputRef.current?.focus();
      }
    } else if (e.key === "Enter") {
      const selectedSuggestion = filteredSuggestions.find(
        (suggestion) => suggestion.id === id
      );

      if (selectedSuggestion) {
        setChips([...chips, selectedSuggestion]);
        setFilteredSuggestions((prevSuggestions) =>
          prevSuggestions.filter((suggestion) => suggestion.id !== `${"#" + id}`)   
        );
        setInputValue("");
        setIsSuggestionListOpen(false);
        inputRef.current?.focus();
        inputRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }
    } else if (inputValue.trim() !== "") {
      const newChip: ChipInterface = {
        id: inputValue.toLowerCase(),
        value: inputValue,
        email: "",
      };
      setChips([...chips, newChip]);
      setInputValue("");
      setIsSuggestionListOpen(false);
    }
  };

  return (
    <div className={styles.chipInput}>
      <div className={styles.chipsBox}>
        <div className={styles.chipList}>
          {chips.map((chip) => (
            <Chip
              key={chip.id}
              chips={chips}
              chip={chip}
              setChips={setChips}
              setFilteredSuggestions={setFilteredSuggestions}
              handleChipKeyDown={handleChipKeyDown}
              filteredSuggestions={filteredSuggestions}
            />
          ))}
        </div>

        <input
          id="input-item"
          type="text"
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder="Type to add chips..."
          className={styles.inputItem}
          onBlur={() => {
            setChips((prevChips) => {
              const updatedChips = [...prevChips];
              updatedChips.forEach((chip) => {
                const chipElement = document.getElementById(chip.id);
                if (chipElement) {
                  chipElement.style.backgroundColor = "";
                }
              });
              return updatedChips;
            });
          }}
        />
      </div>

      {isSuggestionListOpen && inputValue && (
        <div ref={suggestionListRef} className={styles.suggestionList}>
          {filteredSuggestions.map((item, idx) => (
            <div
              key={item.id}
              id={`${"#" + item.id}`}
              className={styles.suggestedItem}
              onClick={() => handleSuggestionClick(item)}
              data-suggestion-id={item.id}
              tabIndex={idx + 1}
              onKeyDown={(e) => handleDropdownKeyDown(e, item.id)}
            >
              <div
                className={styles.avatar}
                style={{
                  background: `${stringToColor(item.value)}`,
                }}
              >
                {getFirstLetter(item.value)}
              </div>
              <p>{item.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChipInput;
