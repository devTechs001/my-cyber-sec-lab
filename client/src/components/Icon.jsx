// Inline SVG icon set — crisp at any size, themeable via currentColor.
const paths = {
  dashboard: "M3 3h8v10H3zM13 3h8v6h-8zM13 11h8v10h-8zM3 15h8v6H3z",
  book: "M4 4a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 20a2 2 0 0 1 2-2h13M8 7h7",
  flask: "M9 3h6M10 3v5L4.5 18a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 8V3M7 14h10",
  terminal: "M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM7 9l3 3-3 3M12 15h5",
  server: "M3 4h18v6H3zM3 14h18v6H3zM7 7h.01M7 17h.01",
  tools: "M14.7 6.3a4.5 4.5 0 0 0-6 6L3 18l3 3 5.7-5.7a4.5 4.5 0 0 0 6-6L14 13l-3-3z",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z",
  link: "M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5",
  map: "M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14",
  shield: "M12 3l8 3v6c0 4.5-3.2 7.7-8 9-4.8-1.3-8-4.5-8-9V6zM9 12l2 2 4-4",
  bolt: "M13 2L4 14h6l-1 8 9-12h-6z",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  moon: "M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z",
  rocket: "M12 15c-2 0-3-1-3-3 0-4 3-8 3-8s3 4 3 8c0 2-1 3-3 3zM12 15v4M7 10c-2 1-3 4-3 6 2 0 5-1 6-3M17 10c2 1 3 4 3 6-2 0-5-1-6-3",
  target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0-2z",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  cpu: "M6 6h12v12H6zM9 9h6v6H9zM2 10h4M2 14h4M18 10h4M18 14h4M10 2v4M14 2v4M10 18v4M14 18v4",
  clock: "M12 8v4l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  alert: "M10.3 4.3 2.8 18a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3l-7.5-13.7a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01",
  check: "M5 12l4 4L19 6",
  folder: "M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 9h18",
  network: "M12 5v6M6 19v-4h12v4M6 15l6-4 6 4M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM6 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  download: "M12 3v12m0 0 4-4m-4 4-4-4M4 17v3h16v-3",
  refresh: "M20 7v5h-5M4 17v-5h5M5.6 9A7 7 0 0 1 18 6l2 2M4 16l2 2a7 7 0 0 0 12.4-3",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  file: "M6 2h8l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM14 2v6h6M8 13h8M8 17h8",
  cloud: "M7 18a5 5 0 1 1 .7-9.95A6 6 0 0 1 19 10a4 4 0 0 1 0 8z",
  layers: "m12 3 9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 16l9 5 9-5",
  timer: "M10 2h4M12 14l3-3M12 8v5M20 13a8 8 0 1 1-16 0 8 8 0 0 1 16 0z",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  key: "M21 2l-2 2m-7.6 7.6a5 5 0 1 1-7.1-7.1 5 5 0 0 1 7.1 7.1zm0 0L15 15h4v4h4v-4l-7.6-7.6",
};

export default function Icon({ name, size = 20, className = "" }) {
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.shield} />
    </svg>
  );
}
