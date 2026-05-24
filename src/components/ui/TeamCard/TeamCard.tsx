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
            (e.target as HTMLImageElement).src =
              `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=0a0a0f&textColor=ffffff`;
          }}
        />
      </div>
      <h3>{name}</h3>
      <p>{role}</p>
    </div>
  );
}