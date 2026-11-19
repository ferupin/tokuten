"use client";

import Link from "next/link";
import { profileList, profileRoute } from "@/profiles";
import { useI18n } from "@/i18n";

/**
 * Chooses the evaluation method. Each choice is a real link to the route of its profile,
 * so the browser back button, a refreshed page and a shared address all agree, and the
 * framework swaps only the part of the page that differs, with no reload. The grades of
 * each profile stay in memory while the page is open.
 */
export function ProfileSwitch({ current }: { current: string }) {
  const { t } = useI18n();
  const active = profileList.find((p) => p.id === current);
  return (
    <div>
      <nav aria-label={t("ui.profileSwitch")} className="profile-switch">
        {profileList.map((profile) => {
          const on = profile.id === current;
          return (
            <Link
              key={profile.id}
              href={profileRoute(profile.id)}
              scroll={false}
              aria-current={on ? "page" : undefined}
              className="profile-switch-item"
              data-on={on || undefined}
            >
              {t(`profiles.${profile.id}.title`)}
              <span lang="ja" aria-hidden>{t(`profiles.${profile.id}.titleJa`)}</span>
            </Link>
          );
        })}
      </nav>
      {active?.provisional && (
        <p className="m-0 mt-3 max-w-2xl text-[13px] leading-snug text-soft">
          <span className="profile-tag mr-1.5">{t("ui.provisional")}</span>
          {t("ui.provisionalNote")}
        </p>
      )}
    </div>
  );
}
