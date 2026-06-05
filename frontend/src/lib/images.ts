export function isBackendMediaUrl(src: string) {
  return (
    src.startsWith("http://localhost:8000/media/") ||
    src.startsWith("http://127.0.0.1:8000/media/") ||
    src.startsWith("/media/")
  );
}
