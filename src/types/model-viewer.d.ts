declare namespace JSX {
  interface IntrinsicElements {
    "model-viewer": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string;
        "auto-rotate"?: boolean;
        "camera-controls"?: boolean;
        ar?: boolean;
        "ar-modes"?: string;
        exposure?: string;
        "shadow-intensity"?: string;
        "environment-image"?: string;
        "tone-mapping"?: string;
      },
      HTMLElement
    >;
  }
}
