'use client';

import { useEffect, useRef } from 'react';
import { Factory } from 'vexflow';

interface StaffRendererProps {
  notes: string[]; // e.g. ["C4", "E4", "G4"]
  timeSignature: string; // e.g. "4/4"
}

const StaffRenderer = ({ notes, timeSignature = "4/4" }: StaffRendererProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const vf = new Factory({
      renderer: {
        elementId: containerRef.current.id,
        width: 600,
        height: 150,
      },
    });

    const system = vf.System({ x: 10, y: 40, width: 300 });

    const score = vf.EasyScore();

    // Calculate how many beats are needed
    const beats = parseInt(timeSignature.split("/")[0]);
    const paddedNotes = [...notes.map(n => `${n}/q`)];

    while (paddedNotes.length < beats) {
      paddedNotes.push("B4/r"); // pad with rests
    }

    const voice = score.voice(score.notes(paddedNotes.join(", "), { stem: "up" }));

    system
      .addStave({ voices: [voice] })
      .addClef("treble")
      .addTimeSignature(timeSignature);

    vf.draw();
  }, [notes, timeSignature]);

  return (
    <div
      id="vex-staff"
      ref={containerRef}
      className="overflow-x-auto"
      style={{ paddingBottom: "20px" }}
    />
  );
};

export default StaffRenderer;