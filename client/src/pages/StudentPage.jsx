import StudentPortal from '../components/StudentPortal.jsx';
import { useNavigate } from 'react-router-dom';

export default function StudentPage() {
  const navigate = useNavigate();

  return (
    <main className="student-page">
      <StudentPortal onBackToHome={() => navigate('/')} />
    </main>
  );
}
