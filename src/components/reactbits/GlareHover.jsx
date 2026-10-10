// GlareHover adapted from React Bits by David Haz.
// https://github.com/DavidHDev/react-bits/tree/main/src/content/Animations/GlareHover
function rgbaDesdeHex(color, opacidad) {
  const hex = color.replace("#", "");
  if (!/^[\da-f]{3}([\da-f]{3})?$/i.test(hex)) return color;
  const completo = hex.length === 3 ? [...hex].map((caracter) => caracter + caracter).join("") : hex;
  const [rojo, verde, azul] = [0, 2, 4].map((indice) => Number.parseInt(completo.slice(indice, indice + 2), 16));
  return `rgba(${rojo}, ${verde}, ${azul}, ${opacidad})`;
}

export default function GlareHover({
  children,
  className = "",
  glareColor = "#fff2a8",
  glareOpacity = 0.42,
  glareAngle = -45,
  glareSize = 250,
  transitionDuration = 650,
}) {
  const variables = {
    "--gh-angle": `${glareAngle}deg`,
    "--gh-duration": `${transitionDuration}ms`,
    "--gh-size": `${glareSize}%`,
    "--gh-rgba": rgbaDesdeHex(glareColor, glareOpacity),
  };

  return (
    <div className={`glare-hover ${className}`.trim()} style={variables}>
      {children}
    </div>
  );
}
