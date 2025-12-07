import 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          'auto-rotate'?: boolean;
          'camera-controls'?: boolean;
          'camera-orbit'?: string;
          exposure?: string;
          'shadow-intensity'?: string;
          'tone-mapping'?: string;
          ar?: boolean;
          style?: React.CSSProperties;
        },
        HTMLElement
      >;
    }
  }
}
