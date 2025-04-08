import React, { useRef, useEffect, useState } from "react";
import { Crown } from 'lucide-react';

export interface PodiumItem {
  name: string;
  value: number;
}

interface PodiumChartProps {
  data: PodiumItem[];
  title?: string;
  colors?: string[];
}

const TourTop3: React.FC<PodiumChartProps> = ({
  data,
  title = "순위",
  colors = ["#fbbf24", "#d1d5db", "#fb923c"], // Tailwind 색상에 해당하는 HEX 값
}) => {
    const [maxHeight, setMaxHeight] = useState(300); 

  const containerRef = useRef<HTMLDivElement>(null);
  const maxValue = Math.max(...data.map((item) => item.value)) || 1;

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        setMaxHeight(Math.max(containerHeight - 100, 100)); // 최소 높이 100px
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <div className="card h-200">
      <div className="card-header py-3">
        <h6 className="m-0 fw-bold">{title}</h6>
      </div>
      <div className="card-body" ref={containerRef}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', height: `${maxHeight}px`, padding: '20px 0' }}>
          {data.slice(0, 3).map((item, index) => {
            const height = `${(item.value / maxValue) * (maxHeight - 60)}px`; // 60px for labels
            const order = index === 1 ? 1 : index === 0 ? 2 : 3;

            return (
              <div key={item.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', order, margin: '0 10px', width: '30%', maxWidth: '100px' }}>
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', width: '100%', height: `${maxHeight - 40}px` }}>
                  {index === 0 && (
                    <Crown style={{ position: 'absolute', top: '-25px', color: '#fbbf24' }} size={24} />
                  )}
                  <div style={{ width: '100%', height, backgroundColor: colors[index], borderTopLeftRadius: '4px', borderTopRightRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                    <span style={{ fontWeight: 'bold', color: 'white', fontSize: '0.8rem' }}>{item.value}</span>
                  </div>
                </div>
                <div style={{ width: '100%', height: '24px', backgroundColor: colors[index], marginTop: '2px', borderBottomLeftRadius: '4px', borderBottomRightRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                  <span style={{ fontWeight: '600', color: 'white', fontSize: '0.7rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '90%' }}>{item.name}</span>
                </div>
                <div style={{ marginTop: '4px', textAlign: 'center' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>{index + 1}위</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TourTop3;