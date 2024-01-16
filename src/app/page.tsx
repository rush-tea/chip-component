import styles from "./page.module.css";
import ChipInput from "./ChipInput";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.app}>
        <h1>Chip Component</h1>
        <ChipInput />
      </div>
    </main>
  );
}
