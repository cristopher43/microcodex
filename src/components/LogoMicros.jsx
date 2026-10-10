function Micro({ color, accent }) {
  return (
    <g>
      <path d="M10 8h101c7 0 11 2 16 8l22 19c4 4 6 8 6 14v8c0 5-3 8-8 8H11c-5 0-8-3-8-8V17c0-6 2-9 7-9Z" fill={color} />
      <path d="M12 44h141v12c0 5-3 8-8 8H11c-5 0-8-3-8-8v-5h9Z" fill="#f2f5f6" />
      <path d="M12 58h135v3H12z" fill={accent} opacity=".88" />
      <path d="M15 15h31v24H15zm35 0h26v24H50zm30 0h25v24H80z" fill="#183247" />
      <path d="M19 18h22v2H19zm35 0h18v2H54zm30 0h17v2H84z" fill="#bce7f2" opacity=".62" />
      <path d="M47 15v25M76 15v25M109 15v25" fill="none" stroke="#dce4e9" strokeWidth="2" />
      <path d="M112 13h11l22 19h-33z" fill="#183247" />
      <path d="M116 16h7l15 13h-22z" fill="#bce7f2" opacity=".52" />
      <path d="M120 42h32v10h-32z" fill={color} />
      <rect x="114" y="8" width="22" height="7" rx="2" fill="#ffcb3d" />
      <path d="M117 10h15" stroke="#9b6210" strokeWidth="1.5" />
      <path d="M12 43h95" stroke={accent} strokeWidth="2" opacity=".75" />
      <path d="M7 46h5v7H7z" fill="#ff6464" />
      <circle cx="36" cy="61" r="9" fill="#1c2934" stroke="#e9eef1" strokeWidth="3" />
      <circle cx="112" cy="61" r="9" fill="#1c2934" stroke="#e9eef1" strokeWidth="3" />
      <circle cx="36" cy="61" r="3" fill="#aeb9c0" />
      <circle cx="112" cy="61" r="3" fill="#aeb9c0" />
      <circle cx="149" cy="48" r="2.5" fill="#fff7c2" />
      <circle cx="149" cy="55" r="2" fill="#ffcf59" />
      <path d="M5 52h148" stroke="#fff" strokeWidth="1.2" opacity=".72" />
    </g>
  );
}

export default function LogoMicros({ className = "", etiqueta }) {
  return (
    <svg
      className={"logo-micros " + className}
      viewBox="0 0 190 112"
      role={etiqueta ? "img" : undefined}
      aria-label={etiqueta}
      aria-hidden={etiqueta ? undefined : "true"}
      focusable="false"
    >
      <g className="logo-micro logo-micro-azul"><g transform="translate(48 2) scale(.78)"><Micro color="#2585cb" accent="#116ba9" /></g></g>
      <g className="logo-micro logo-micro-amarilla"><g transform="translate(25 27) scale(.78)"><Micro color="#f5bd27" accent="#dd9414" /></g></g>
      <g className="logo-micro logo-micro-roja"><g transform="translate(3 52) scale(.78)"><Micro color="#d62d38" accent="#a81925" /></g></g>
    </svg>
  );
}
