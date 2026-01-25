/**
 * Get Dashboard Use Case
 */

import type { UserContext } from '@/env';
import type { CycleStatus } from '@/domain/entities';
import type {
  EmployeeRepository,
  EvaluationCycleRepository,
  EvaluationPeriodRepository
} from '@/domain/ports/out';

export interface GetDashboardInput {
  user: UserContext;
}

export interface DashboardData {
  // Current Period
  currentPeriod?: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: string;
  };

  // My Evaluation Status (for EMPLOYEE)
  myCycle?: {
    id: string;
    status: CycleStatus;
    progress: number;
    nextAction?: string;
  };

  // Subordinates Summary (for MANAGER)
  subordinatesSummary?: {
    total: number;
    completed: number;
    inProgress: number;
    notStarted: number;
  };

  // Pending Tasks
  pendingTasks: PendingTask[];

  // Organization Summary (for HR/ADMIN)
  organizationSummary?: {
    totalCycles: number;
    byStatus: Record<CycleStatus, number>;
    completionRate: number;
  };
}

export interface PendingTask {
  type: 'SELF_EVALUATION' | 'PEER_EVALUATION' | 'MANAGER_EVALUATION' | 'APPROVAL';
  cycleId: string;
  employeeName?: string;
  dueDate?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export class GetDashboardUseCase {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly cycleRepository: EvaluationCycleRepository,
    private readonly periodRepository: EvaluationPeriodRepository
  ) {}

  async execute(input: GetDashboardInput): Promise<DashboardData> {
    const { user } = input;

    // Get current active period
    const currentPeriod = await this.periodRepository.findActive();

    const result: DashboardData = {
      currentPeriod: currentPeriod ? {
        id: currentPeriod.id,
        name: currentPeriod.name,
        startDate: currentPeriod.startDate,
        endDate: currentPeriod.endDate,
        status: currentPeriod.status,
      } : undefined,
      pendingTasks: [],
    };

    if (!currentPeriod) {
      return result;
    }

    // Get user's own cycle
    if (user.employeeId) {
      const myCycle = await this.cycleRepository.findByPeriodAndEmployee(
        currentPeriod.id,
        user.employeeId
      );

      if (myCycle) {
        result.myCycle = {
          id: myCycle.id,
          status: myCycle.status,
          progress: this.calculateProgress(myCycle.status),
          nextAction: this.getNextAction(myCycle.status, user.role),
        };

        // Add self evaluation task if needed
        if (myCycle.status === 'DRAFT') {
          result.pendingTasks.push({
            type: 'SELF_EVALUATION',
            cycleId: myCycle.id,
            priority: 'HIGH',
          });
        }
      }
    }

    // Get subordinates summary for managers
    if (user.role === 'MANAGER' && user.employeeId) {
      const subordinateCycles = await this.cycleRepository.findByManagerId(
        user.employeeId,
        currentPeriod.id
      );

      const summary = {
        total: subordinateCycles.length,
        completed: 0,
        inProgress: 0,
        notStarted: 0,
      };

      for (const cycle of subordinateCycles) {
        if (cycle.status === 'FINALIZED') {
          summary.completed++;
        } else if (cycle.status === 'DRAFT') {
          summary.notStarted++;
        } else {
          summary.inProgress++;
        }

        // Add manager evaluation tasks
        if (cycle.status === 'PEER_COMPLETED') {
          result.pendingTasks.push({
            type: 'MANAGER_EVALUATION',
            cycleId: cycle.id,
            priority: 'HIGH',
          });
        }

        // Add approval tasks
        if (cycle.status === 'MANAGER_SUBMITTED' && user.role === 'MANAGER') {
          result.pendingTasks.push({
            type: 'APPROVAL',
            cycleId: cycle.id,
            priority: 'MEDIUM',
          });
        }
      }

      result.subordinatesSummary = summary;
    }

    // Get organization summary for HR/Admin
    if (user.role === 'HR' || user.role === 'ADMIN') {
      const allCycles = await this.cycleRepository.findAll({
        periodId: currentPeriod.id,
        limit: 1000,
      });

      const byStatus: Record<string, number> = {};
      let completed = 0;

      for (const cycle of allCycles.data) {
        byStatus[cycle.status] = (byStatus[cycle.status] || 0) + 1;
        if (cycle.status === 'FINALIZED') {
          completed++;
        }
      }

      result.organizationSummary = {
        totalCycles: allCycles.total,
        byStatus: byStatus as Record<CycleStatus, number>,
        completionRate: allCycles.total > 0 ? (completed / allCycles.total) * 100 : 0,
      };

      // Add HR approval tasks
      if (user.role === 'HR' || user.role === 'ADMIN') {
        const hrApprovalCycles = allCycles.data.filter(c => c.status === 'MANAGER_APPROVED');
        for (const cycle of hrApprovalCycles) {
          result.pendingTasks.push({
            type: 'APPROVAL',
            cycleId: cycle.id,
            priority: 'HIGH',
          });
        }
      }
    }

    // Sort pending tasks by priority
    result.pendingTasks.sort((a, b) => {
      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    return result;
  }

  private calculateProgress(status: CycleStatus): number {
    const progressMap: Record<CycleStatus, number> = {
      DRAFT: 0,
      SELF_SUBMITTED: 20,
      PEER_COMPLETED: 40,
      MANAGER_SUBMITTED: 60,
      MANAGER_APPROVED: 70,
      HR_APPROVED: 90,
      FINALIZED: 100,
      REJECTED: 50,
    };
    return progressMap[status] ?? 0;
  }

  private getNextAction(status: CycleStatus, role: string): string | undefined {
    const actionMap: Record<CycleStatus, string> = {
      DRAFT: '自己評価を入力してください',
      SELF_SUBMITTED: '同僚評価の完了をお待ちください',
      PEER_COMPLETED: role === 'MANAGER' ? '上司評価を入力してください' : '上司評価をお待ちください',
      MANAGER_SUBMITTED: '上司承認をお待ちください',
      MANAGER_APPROVED: '人事承認をお待ちください',
      HR_APPROVED: '評価確定処理中です',
      FINALIZED: '評価が確定しました',
      REJECTED: '差戻しがあります。確認してください',
    };
    return actionMap[status];
  }
}
