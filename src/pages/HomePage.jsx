import { useNavigate } from 'react-router-dom';
import LineWaves from '../components/LineWaves';
import CircularText from '../components/CircularText';
import FuzzyText from '../components/FuzzyText';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <LineWaves
        speed={0.3}
        innerLineCount={28}
        outerLineCount={32}
        warpIntensity={1.0}
        rotation={-40}
        edgeFadeWidth={0}
        colorCycleSpeed={0.6}
        brightness={1.0}
        color1="#000000"
        color2="#000000"
        color3="#000000"
        enableMouseInteraction={true}
        mouseInfluence={2.0}
      />
      <div className="home-overlay">
        <CircularText
          text="DESIGNYOURSELF"
          spinDuration={18}
          onHover="speedUp"
        />
        <button
          className="home-btn"
          onClick={() => navigate('/builder')}
        >
          <FuzzyText
            baseIntensity={0.1}
            hoverIntensity={0.35}
            enableHover={true}
            fontSize="1.2rem"
            fontWeight={700}
            color="#000000"
            direction="horizontal"
            fuzzRange={20}
            letterSpacing={3.5}
          >
            开启你的设计之旅
          </FuzzyText>
        </button>
      </div>
    </div>
  );
}