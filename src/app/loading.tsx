import { Container } from "@/components/ui/primitives";
export default function Loading() {
  return (
    <Container>
      <div className="loading-content" role="status">
        <h2>Loading the next page...</h2>
        <div className="loading-bar" aria-hidden="true" />
        <div className="loading-bar" aria-hidden="true" />
      </div>
    </Container>
  );
}
