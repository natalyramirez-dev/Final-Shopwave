"use client";

import styles from "@/components/ui/scss/home.module.scss";

interface TeamCardProps {
  name: string;
  role: string;
  image: string;
}

export default function TeamCard({ name, role, image }: TeamCardProps) {
  return (
    <div className={styles.teamCard}>
      <div className={styles.teamImageWrapper}>
        <img
          src={image}
          alt={name}
          className={styles.teamImage}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/assets/camilo.jpg";
          }}
        />
      </div>
      <h3>{name}</h3>
      <p>{role}</p>
    </div>
  );
}