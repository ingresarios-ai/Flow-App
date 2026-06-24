'use client';

import { useAppStore } from '@/store/useAppStore';
import AppContainer from '@/components/Layout/AppContainer';
import { BottomNav } from '@/components/Layout/BottomNav';
import { IntroScreen } from '@/screens/IntroScreen';
import { SignupScreen } from '@/screens/SignupScreen';
import { LoginScreen } from '@/screens/LoginScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { SimulatorScreen } from '@/screens/SimulatorScreen';
import { ProgressScreen } from '@/screens/ProgressScreen';
import { LessonScreen } from '@/screens/LessonScreen';

export default function Home() {
  const currentScreen = useAppStore((state) => state.currentScreen);

  return (
    <AppContainer>
      {currentScreen === 'intro' && <IntroScreen />}
      {currentScreen === 'signup' && <SignupScreen />}
      {currentScreen === 'login' && <LoginScreen />}
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'sim' && <SimulatorScreen />}
      {currentScreen === 'prog' && <ProgressScreen />}
      {currentScreen === 'lesson' && <LessonScreen />}
      
      <BottomNav />
    </AppContainer>
  );
}
