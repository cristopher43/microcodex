import {
  Award,
  BusFront,
  CircleDot,
  Crown,
  Eye,
  Flame,
  Fuel,
  Globe,
  Landmark,
  Map,
  Medal,
  Moon,
  MoveHorizontal,
  Route,
  Sunrise,
  TrainFront,
  Trophy,
  Zap,
} from "lucide-react";

const ICONOS = {
  micro: BusFront,
  electricidad: Zap,
  articulada: MoveHorizontal,
  combustible: Fuel,
  rara: Eye,
  epica: CircleDot,
  corona: Crown,
  tranvia: TrainFront,
  historia: Landmark,
  ruta: Route,
  mundo: Globe,
  amanecer: Sunrise,
  noche: Moon,
  mapa: Map,
  fuego: Flame,
  medalla: Medal,
  premio: Award,
  insignia: Medal,
  trofeo: Trophy,
};

export default function IconoLogro({ nombre, ...props }) {
  const Icono = ICONOS[nombre] || Medal;
  return <Icono {...props} />;
}
