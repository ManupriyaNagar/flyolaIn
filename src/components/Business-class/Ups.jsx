
import { Container } from "./Container";
import { FadeIn } from "./Fade";


export const Usps = () => {
  return (  
      <Container className="relative z-10 max-w-[692px] space-y-12 py-36 text-3xl font-bold text-black md:text-4xl mt-30">
      <FadeIn>
        <p>New Apple Originals every month — always ad‑free.</p>
      </FadeIn>
      <FadeIn>
        <p>
          Stream on the Apple TV app on Apple devices, smart TVs, consoles, or
          sticks.
        </p>
      </FadeIn>
      <FadeIn>
        <p>Watch in 4K HDR video with immersive Spatial Audio.</p>
      </FadeIn>
      <FadeIn>
        <p>Share a single subscription with up to five people.</p>
      </FadeIn>
    </Container>
  );
};
