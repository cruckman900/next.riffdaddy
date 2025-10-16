'use client';

import { useState, useEffect, useRef } from 'react';
import { Factory } from 'vexflow';

interface TabRendererProps {
  tuning: string[]; // e.g. ["E4", "B3", "G3", "D3", "A2", "E2"]
  notes: { str: number; fret: number; duration?: string }[];
}

const TabRenderer = ({ tuning, notes }: TabRendererProps) => {
  const [timeSignature, setTimeSignature] = useState('4/4');
  const containerRef = useRef<HTMLDivElement>(null);

  const timeSignatures = ['4/4', '3/4', '6/8', '5/4'];

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const vf = new Factory({
      renderer: {
        elementId: containerRef.current.id,
        width: 800,
        height: 180,
      },
    });

    const system = vf.System({ x: 10, y: 40, width: 300 });

    const tabNotes = notes.map((n) =>
      vf.TabNote({
        positions: [{ str: n.str, fret: n.fret }],
        duration: n.duration || 'q',
      })
    );

    const voice = vf.Voice({ time: timeSignature }).addTickables(tabNotes);

    system
      .addStave({
        voices: [voice],
        options: { numLines: tuning.length },
      })
      .addClef('tab')
      .addTimeSignature(timeSignature);

    vf.draw();
  }, [tuning, notes, timeSignature]);

  return (
    <div
      id="vex-tab"
      ref={containerRef}
      className="overflow-x-auto"
      style={{ paddingBottom: '20px' }}
    />
  );
};

export default TabRenderer;