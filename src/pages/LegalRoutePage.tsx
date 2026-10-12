import React from 'react';
import { useNavigate } from 'react-router-dom';
import LegalPage from './LegalPage';

interface LegalRoutePageProps {
  type: 'privacy' | 'cookies' | 'terms';
}

export default function LegalRoutePage({ type }: LegalRoutePageProps) {
  const navigate = useNavigate();
  return <LegalPage type={type} onBack={() => navigate('/')} />;
}
