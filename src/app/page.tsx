import ChipInput from './ChipInput'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Custom Chip Component</h1>
      <div className={styles.app}>
        <ChipInput />
      </div>
    </main>
  )
}
