import type { Metadata } from "next";
import { PageHero } from "@/components/site/ui";
import { allCredits } from "@/lib/media";

export const metadata: Metadata = {
  title: "Photo credits",
  robots: { index: false },
};

/**
 * Attribution for the stand-in photography. Required by the CC BY and CC BY-SA
 * licences. Remove entries as AquaSail's own photographs replace them.
 */
export default function CreditsPage() {
  const credits = allCredits();
  return (
    <>
      <PageHero
        script="With thanks"
        title="Photo credits"
        lede="Photographs on this site that were not taken by AquaSail, with their authors and licences."
      />
      <section className="band">
        <div className="wrap">
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th scope="col">Photo</th>
                  <th scope="col">Author</th>
                  <th scope="col">Licence</th>
                  <th scope="col">Source</th>
                </tr>
              </thead>
              <tbody>
                {credits.map(([key, c]) => (
                  <tr key={key}>
                    <td>{c.title?.replace(/^File:/, "") ?? key}</td>
                    <td>{c.author}</td>
                    <td>{c.license}</td>
                    <td>
                      <a href={c.page} target="_blank" rel="noopener noreferrer">
                        {c.source}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
