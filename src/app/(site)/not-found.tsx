import Link from "next/link";
import { Wave } from "@/components/site/Brand";

export default function NotFound() {
  return (
    <section className="hero hero-plain on-dark not-found">
      <div className="wrap">
        <div className="hero-content">
          <span className="script">Off course</span>
          <h1 className="disp">This page has drifted away</h1>
          <p className="sub" style={{ margin: 0 }}>
            It may have been moved, or the activity may no longer be running. Everything we offer is
            on the activities page.
          </p>
          <div className="hero-actions">
            <Link href="/activities" className="pill pill-solid">
              See activities <Wave />
            </Link>
            <Link href="/" className="pill">
              Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
