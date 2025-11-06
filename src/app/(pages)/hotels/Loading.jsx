import React from 'react'
import styles from './loading.module.css'
import Image from 'next/image'
export default function Loading() {
  return (<>
  <div className={styles.chatLoader}>
  <div className={styles.loaderBubble}>
        <Image
          src={"/images/bubble.png"}
          alt={"loading"}
          width={60}
          height={60}
          className={styles.bubbleImg}
        />
      </div>
    <div className={styles.loaderText}>
        <strong>خليني القطها لك</strong>
        <p className={styles.loaderDescription}>جاري جمع الموارد...</p>
    </div>
    </div>
  </>
  )
}
