import SiteLayout from "./(site)/layout";
import SiteNotFound from "./(site)/not-found";

// Unmatched URLs render here, outside the (site) group, so wrap in its layout.
export default function NotFound() {
  return (
    <SiteLayout>
      <SiteNotFound />
    </SiteLayout>
  );
}
