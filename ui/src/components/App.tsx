import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Cloud } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent } from './ui/card';
import { Dashboard } from './Dashboard';
import { EvaluationResult } from './EvaluationResult';
import { SkillMap } from './SkillMap';
import { Notifications } from './Notifications';
import { Profile } from './Profile';
import { ManagerDashboard } from './ManagerDashboard';
import { ManagerEvaluation } from './ManagerEvaluation';
import { EvaluationApproval } from './EvaluationApproval';
import { SubordinateList } from './SubordinateList';
import { AdminDashboard } from './AdminDashboard';
import { EvaluationPeriodSettings } from './EvaluationPeriodSettings';
import { UserManagement } from './UserManagement';
import { EvaluationTemplate } from './EvaluationTemplate';
import { AllEvaluations } from './AllEvaluations';
import { EvaluationAnalytics } from './EvaluationAnalytics';
import { SystemSettings } from './SystemSettings';
import { AuditLogs } from './AuditLogs';
import { HelpDocumentation } from './HelpDocumentation';
import { LearningTasks } from './LearningTasks';
import { LearningExecution } from './LearningExecution';
import { LearningResult } from './LearningResult';
import { SkillRoadmapDetail } from './SkillRoadmapDetail';
import { SubordinateSkillCheck } from './SubordinateSkillCheck';
import { PromotionManagement } from './PromotionManagement';
import { ScenarioManagement } from './ScenarioManagement';
import { CurriculumManagement } from './CurriculumManagement';
import { LearningAssignment } from './LearningAssignment';
import { ExerciseContent } from './ExerciseContent';
import { MissionDetail } from './MissionDetail';
import { CurriculumBook } from './CurriculumBook';

type Page =
  | 'login'
  | 'dashboard'
  | 'evaluation-result'
  | 'skill-map'
  | 'skill-roadmap-detail'
  | 'notifications'
  | 'profile'
  | 'learning-tasks'
  | 'learning-execution'
  | 'learning-result'
  | 'mission-detail'
  | 'exercise-content'
  | 'curriculum-book'
  | 'manager-dashboard'
  | 'manager-evaluation'
  | 'evaluation-approval'
  | 'subordinate-list'
  | 'subordinate-skill-check'
  | 'admin-dashboard'
  | 'user-management'
  | 'department-management'
  | 'evaluation-settings'
  | 'evaluation-template'
  | 'all-evaluations'
  | 'promotion-management'
  | 'evaluation-analytics'
  | 'system-settings'
  | 'audit-logs'
  | 'scenario-management'
  | 'curriculum-management'
  | 'learning-assignment'
  | 'help-documentation';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [userRole, setUserRole] = useState<'employee' | 'manager' | 'admin'>('employee');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // メールアドレスに"admin"が含まれていたら管理者ロール
    if (email.toLowerCase().includes('admin')) {
      setUserRole('admin');
      setCurrentPage('admin-dashboard');
    } else if (email.toLowerCase().includes('manager')) {
      // メールアドレスに"manager"が含まれていたら上司ロール
      setUserRole('manager');
      setCurrentPage('manager-dashboard');
    } else {
      setUserRole('employee');
      setCurrentPage('dashboard');
    }
  };

  // ページルーティング
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) as Page;
      if (hash && currentPage !== 'login') {
        setCurrentPage(hash || 'dashboard');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentPage]);

  // ログイン画面
  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border border-gray-200">
            <CardContent className="pt-8 pb-8">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-2xl font-semibold">T</span>
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">人事考課システム</h1>
                <p className="text-sm text-gray-600">ログイン</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    メールアドレス
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    パスワード
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4.5 h-4.5" />
                      ) : (
                        <Eye className="w-4.5 h-4.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center pt-1">
                  <Checkbox
                    id="remember"
                    label="ログイン状態を保持する"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full mt-6 h-11 text-sm font-medium bg-gray-900 hover:bg-gray-800"
                  size="lg"
                >
                  ログイン
                </Button>

                {/* Divider */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-white text-xs text-gray-500">または</span>
                  </div>
                </div>

                {/* Cloudflare Access Button */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 border-gray-300 hover:bg-gray-50 text-sm font-medium"
                  size="lg"
                >
                  <Cloud className="w-5 h-5 mr-2 text-orange-500" />
                  Cloudflare Access でログイン
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">© 2026 トキワテック</p>
          </div>
        </div>
      </div>
    );
  }

  // その他のページ
  switch (currentPage) {
    case 'dashboard':
      return <Dashboard />;
    case 'evaluation-result':
      return <EvaluationResult />;
    case 'skill-map':
      return <SkillMap />;
    case 'skill-roadmap-detail':
      return <SkillRoadmapDetail />;
    case 'notifications':
      return <Notifications />;
    case 'profile':
      return <Profile />;
    case 'manager-dashboard':
      return <ManagerDashboard />;
    case 'manager-evaluation':
      return <ManagerEvaluation />;
    case 'evaluation-approval':
      return <EvaluationApproval />;
    case 'subordinate-list':
      return <SubordinateList />;
    case 'subordinate-skill-check':
      return <SubordinateSkillCheck />;
    case 'admin-dashboard':
      return <AdminDashboard />;
    case 'evaluation-settings':
      return <EvaluationPeriodSettings />;
    case 'user-management':
      return <UserManagement />;
    case 'evaluation-template':
      return <EvaluationTemplate />;
    case 'all-evaluations':
      return <AllEvaluations />;
    case 'promotion-management':
      return <PromotionManagement />;
    case 'evaluation-analytics':
      return <EvaluationAnalytics />;
    case 'system-settings':
      return <SystemSettings />;
    case 'audit-logs':
      return <AuditLogs />;
    case 'scenario-management':
      return <ScenarioManagement />;
    case 'curriculum-management':
      return <CurriculumManagement />;
    case 'learning-assignment':
      return <LearningAssignment />;
    case 'help-documentation':
      return <HelpDocumentation />;
    case 'learning-tasks':
      return <LearningTasks />;
    case 'learning-execution':
      return <LearningExecution />;
    case 'learning-result':
      return <LearningResult />;
    case 'mission-detail':
      return <MissionDetail />;
    case 'exercise-content':
      return <ExerciseContent />;
    case 'curriculum-book':
      return <CurriculumBook />;
    default:
      return <Dashboard />;
  }
}
