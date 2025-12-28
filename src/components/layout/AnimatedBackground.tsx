import { Activity, Heart, Pill, Stethoscope, Cross, Syringe } from 'lucide-react';

export default function AnimatedBackground() {
  const icons = [
    { Icon: Activity, style: { top: '10%', left: '15%', animationDelay: '0s' } },
    { Icon: Heart, style: { top: '60%', left: '80%', animationDelay: '2s' } },
    { Icon: Pill, style: { top: '75%', left: '10%', animationDelay: '4s' } },
    { Icon: Stethoscope, style: { top: '25%', left: '85%', animationDelay: '1s' } },
    { Icon: Cross, style: { top: '45%', left: '25%', animationDelay: '3s' } },
    { Icon: Syringe, style: { top: '85%', left: '65%', animationDelay: '5s' } },
    { Icon: Activity, style: { top: '15%', left: '60%', animationDelay: '2.5s' } },
    { Icon: Heart, style: { top: '90%', left: '35%', animationDelay: '4.5s' } },
  ];

  return (
    <>
      <div className="medical-background" />
      <div className="floating-icons">
        {icons.map(({ Icon, style }, index) => (
          <Icon 
            key={index} 
            className="floating-icon" 
            style={style}
            size={60}
          />
        ))}
      </div>
    </>
  );
}
