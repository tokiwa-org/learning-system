import React from 'react';
import { ArrowRight, Clock, Target, Zap } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Button } from './ui/button';

export interface MissionCurriculum {
  id: string;
  // Standard fields
  title: string;
  description?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  progress: number;
  dueDate: string;
  category: string;
  totalItems: number;
  completedItems: number;
  // Mission format fields
  missionTitle?: string;
  missionSummary?: string;
  backgroundStory?: string;
  missionObjective?: string;
  displayFormat: 'STANDARD' | 'MISSION';
  // Step info for current item
  currentStepTitle?: string;
  currentStepNumber?: number;
}

interface MissionCardProps {
  curriculum: MissionCurriculum;
  onContinue?: () => void;
  onViewDetail?: () => void;
  compact?: boolean;
}

export const MissionCard: React.FC<MissionCardProps> = ({
  curriculum,
  onContinue,
  onViewDetail,
  compact = false,
}) => {
  const isMissionFormat = curriculum.displayFormat === 'MISSION' && curriculum.missionTitle;

  // Standard card for non-mission format
  if (!isMissionFormat) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className={compact ? 'py-4' : 'py-5'}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-medium text-gray-900">{curriculum.title}</h4>
              <p className="text-sm text-gray-500">{curriculum.category}</p>
            </div>
            <StatusBadge status={curriculum.status} />
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1 mr-4">
              <Progress value={curriculum.progress} showLabel />
            </div>
            <div className="text-sm text-gray-500">
              期限: {curriculum.dueDate}
            </div>
          </div>
          <Button
            variant={curriculum.status === 'IN_PROGRESS' ? 'default' : 'outline'}
            size="sm"
            className="w-full"
            onClick={onContinue}
          >
            {curriculum.status === 'IN_PROGRESS' ? '続きから学習' : curriculum.status === 'COMPLETED' ? '結果を確認' : '学習を開始'}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Mission format card
  return (
    <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-lg transition-all">
      <CardContent className={compact ? 'py-4' : 'py-5'}>
        {/* Mission Header */}
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-amber-600" />
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">MISSION</span>
        </div>

        {/* Mission Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {curriculum.missionTitle}
        </h3>

        {/* Mission Summary/Story */}
        {curriculum.missionSummary && (
          <div className="flex items-start gap-2 mb-4 text-sm text-gray-600">
            <span className="text-base">📖</span>
            <p className="line-clamp-2">{curriculum.missionSummary}</p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="font-medium text-gray-700">
              STEP {curriculum.completedItems + (curriculum.status === 'IN_PROGRESS' ? 1 : 0)}/{curriculum.totalItems}
            </span>
            <span className="text-gray-500">{curriculum.progress}%</span>
          </div>
          <div className="relative">
            <Progress value={curriculum.progress} className="h-2" />
          </div>
        </div>

        {/* Current Step */}
        {curriculum.currentStepTitle && curriculum.status !== 'COMPLETED' && (
          <div className="flex items-center gap-2 mb-3 text-sm">
            <Target className="w-4 h-4 text-amber-600" />
            <span className="text-gray-700">現在: <span className="font-medium">{curriculum.currentStepTitle}</span></span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>期限: {curriculum.dueDate}</span>
          </div>
          <Button
            variant={curriculum.status === 'IN_PROGRESS' ? 'default' : 'outline'}
            size="sm"
            onClick={curriculum.status === 'COMPLETED' ? onViewDetail : onContinue}
            className={curriculum.status === 'IN_PROGRESS' ? 'bg-amber-600 hover:bg-amber-700' : ''}
          >
            {curriculum.status === 'COMPLETED'
              ? '結果を確認'
              : curriculum.status === 'IN_PROGRESS'
                ? '続きから挑戦'
                : 'ミッション開始'}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Status Badge component
const StatusBadge: React.FC<{ status: MissionCurriculum['status'] }> = ({ status }) => {
  const variants = {
    COMPLETED: 'bg-green-100 text-green-700',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
    NOT_STARTED: 'bg-gray-100 text-gray-700',
  };

  const labels = {
    COMPLETED: '完了',
    IN_PROGRESS: '実行中',
    NOT_STARTED: '未実施',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${variants[status]}`}>
      {labels[status]}
    </span>
  );
};

export default MissionCard;
