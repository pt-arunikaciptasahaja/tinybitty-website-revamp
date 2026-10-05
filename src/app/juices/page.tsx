import { Container } from "@/components/ui/Container";
import { juiceLaunchImage, juiceLaunchVideo } from "@/content/juices";
import { JuiceCollection } from "@/features/juices/JuiceCollection";
import { buildMetadata, routeSeo } from "@/lib/seo";

export const metadata = buildMetadata(routeSeo.juices);

export default function JuicesPage() {
  return (
    <main>
      <Container className="py-12 sm:py-16">
        <header className="home-section__header">
          <div>
            <p className="home-kicker">New: Tiny Bitty Juice</p>
            <h1 className="text-4xl font-bold">Meet your new favorite sip.</h1>
          </div>
          <p>
            Explore four juices, each Rp20,000 for a 250 ml bottle. Availability, delivery, and
            payment are confirmed on WhatsApp.
          </p>
        </header>
        <figure className="juice-video-header">
          <video
            controls
            muted
            playsInline
            preload="metadata"
            poster={juiceLaunchImage.src}
            aria-label={juiceLaunchVideo.label}
            aria-describedby="juice-video-caption"
          >
            <source src={juiceLaunchVideo.src} type="video/mp4" />
            Your browser does not support this video.
          </video>
          <figcaption id="juice-video-caption">
            <span>A little preview of our new juice collection. Press play to watch.</span>
            <a href={juiceLaunchVideo.src}>Open video</a>
          </figcaption>
        </figure>
        <JuiceCollection />
      </Container>
    </main>
  );
}
