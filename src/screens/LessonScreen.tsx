import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { modules } from '@/data/modules';
import { Button } from '@/components/UI/Card';
import { GenyBubble } from '@/components/UI/GenyBubble';

export function LessonScreen() {
  const setScreen = useAppStore((state) => state.setScreen);
  const activeLessonIndex = useAppStore((state) => state.activeLessonIndex);
  const completeLesson = useAppStore((state) => state.completeLesson);
  
  if (activeLessonIndex === null) {
    setScreen('home');
    return null;
  }

  // Find the actual lesson object by flattening the modules
  const allLessons = [...modules.basico.lessons, ...modules.avanzado.lessons];
  const lesson = allLessons[activeLessonIndex];

  if (!lesson) {
    setScreen('home');
    return null;
  }

  const handleComplete = () => {
    completeLesson(lesson.xp);
    setScreen('home');
  };

  return (
    <div className="flex flex-col flex-1 p-4 pb-[90px] overflow-y-auto overflow-x-hidden relative">
      <div className="flex justify-start my-1.5">
        <button onClick={() => setScreen('home')} className="bg-transparent border-none text-text-lo text-[20px] cursor-pointer leading-none">
          ←
        </button>
      </div>

      <div className="flex justify-center my-6">
        <div className="w-[80px] h-[80px] rounded-full flex items-center justify-center text-[34px] border-2 border-electric bg-[rgba(0,210,255,0.1)] shadow-[0_0_18px_rgba(0,210,255,0.3)]">
          {lesson.ic}
        </div>
      </div>

      <div className="font-montserrat font-extrabold text-[24px] text-center text-text-hi mb-6">
        {lesson.t}
      </div>

      <GenyBubble smallAvatar={false}>
        {lesson.geny || 'Esta es una lección interactiva.'}
      </GenyBubble>

      <div className="mt-auto pt-6">
        <Button onClick={handleComplete}>
          Completar lección (+{lesson.xp} XP)
        </Button>
      </div>
    </div>
  );
}
