/**
 * Dependency Injection Container
 * Creates repositories and use cases from environment bindings
 */

import type { Env } from './env';

// Repositories
import {
  D1EmployeeRepository,
  D1EvaluationPeriodRepository,
  D1EvaluationCycleRepository,
  D1SelfEvaluationRepository,
  D1RoadmapRepository,
  D1NotificationRepository,
  D1ScenarioRepository,
  D1CurriculumRepository,
} from './adapters/out/persistence';

// Use Cases
import { GetCurrentUserUseCase } from './application/use-cases/get-current-user';
import { ListPeriodsUseCase } from './application/use-cases/list-periods';
import { GetPeriodUseCase } from './application/use-cases/get-period';
import { CreatePeriodUseCase } from './application/use-cases/create-period';
import { ListCyclesUseCase } from './application/use-cases/list-cycles';
import { GetCycleUseCase } from './application/use-cases/get-cycle';
import { GetSelfEvaluationUseCase } from './application/use-cases/get-self-evaluation';
import { SaveSelfEvaluationUseCase } from './application/use-cases/save-self-evaluation';
import { SubmitSelfEvaluationUseCase } from './application/use-cases/submit-self-evaluation';
import { ListEmployeesUseCase } from './application/use-cases/list-employees';
import { GetEmployeeUseCase } from './application/use-cases/get-employee';
import { GetSubordinatesUseCase } from './application/use-cases/get-subordinates';
import { GetDashboardUseCase } from './application/use-cases/get-dashboard';
import { ListRoadmapItemsUseCase } from './application/use-cases/list-roadmap-items';
import { GetRoadmapForGradeUseCase } from './application/use-cases/get-roadmap-for-grade';
import { ListNotificationsUseCase } from './application/use-cases/list-notifications';
import { MarkNotificationReadUseCase } from './application/use-cases/mark-notification-read';
import { MarkAllNotificationsReadUseCase } from './application/use-cases/mark-all-notifications-read';

export interface Container {
  // Repositories
  employeeRepository: D1EmployeeRepository;
  periodRepository: D1EvaluationPeriodRepository;
  cycleRepository: D1EvaluationCycleRepository;
  selfEvaluationRepository: D1SelfEvaluationRepository;
  roadmapRepository: D1RoadmapRepository;
  notificationRepository: D1NotificationRepository;
  scenarioRepository: D1ScenarioRepository;
  curriculumRepository: D1CurriculumRepository;

  // Use Cases - Auth
  getCurrentUser: GetCurrentUserUseCase;

  // Use Cases - Periods
  listPeriods: ListPeriodsUseCase;
  getPeriod: GetPeriodUseCase;
  createPeriod: CreatePeriodUseCase;

  // Use Cases - Cycles
  listCycles: ListCyclesUseCase;
  getCycle: GetCycleUseCase;
  getSelfEvaluation: GetSelfEvaluationUseCase;
  saveSelfEvaluation: SaveSelfEvaluationUseCase;
  submitSelfEvaluation: SubmitSelfEvaluationUseCase;

  // Use Cases - Employees
  listEmployees: ListEmployeesUseCase;
  getEmployee: GetEmployeeUseCase;
  getSubordinates: GetSubordinatesUseCase;

  // Use Cases - Dashboard
  getDashboard: GetDashboardUseCase;

  // Use Cases - Roadmap
  listRoadmapItems: ListRoadmapItemsUseCase;
  getRoadmapForGrade: GetRoadmapForGradeUseCase;

  // Use Cases - Notifications
  listNotifications: ListNotificationsUseCase;
  markNotificationRead: MarkNotificationReadUseCase;
  markAllNotificationsRead: MarkAllNotificationsReadUseCase;
}

export function createContainer(env: Env): Container {
  // Create Repositories
  const employeeRepository = new D1EmployeeRepository(env.DB);
  const periodRepository = new D1EvaluationPeriodRepository(env.DB);
  const cycleRepository = new D1EvaluationCycleRepository(env.DB);
  const selfEvaluationRepository = new D1SelfEvaluationRepository(env.DB);
  const roadmapRepository = new D1RoadmapRepository(env.DB);
  const notificationRepository = new D1NotificationRepository(env.DB);
  const scenarioRepository = new D1ScenarioRepository(env.DB);
  const curriculumRepository = new D1CurriculumRepository(env.DB);

  // Create Use Cases - Auth
  const getCurrentUser = new GetCurrentUserUseCase(employeeRepository);

  // Create Use Cases - Periods
  const listPeriods = new ListPeriodsUseCase(periodRepository);
  const getPeriod = new GetPeriodUseCase(periodRepository);
  const createPeriod = new CreatePeriodUseCase(periodRepository);

  // Create Use Cases - Cycles
  const listCycles = new ListCyclesUseCase(cycleRepository);
  const getCycle = new GetCycleUseCase(cycleRepository, employeeRepository);
  const getSelfEvaluation = new GetSelfEvaluationUseCase(cycleRepository, selfEvaluationRepository);
  const saveSelfEvaluation = new SaveSelfEvaluationUseCase(cycleRepository, selfEvaluationRepository);
  const submitSelfEvaluation = new SubmitSelfEvaluationUseCase(cycleRepository, selfEvaluationRepository);

  // Create Use Cases - Employees
  const listEmployees = new ListEmployeesUseCase(employeeRepository);
  const getEmployee = new GetEmployeeUseCase(employeeRepository);
  const getSubordinates = new GetSubordinatesUseCase(employeeRepository);

  // Create Use Cases - Dashboard
  const getDashboard = new GetDashboardUseCase(employeeRepository, cycleRepository, periodRepository);

  // Create Use Cases - Roadmap
  const listRoadmapItems = new ListRoadmapItemsUseCase(roadmapRepository);
  const getRoadmapForGrade = new GetRoadmapForGradeUseCase(roadmapRepository);

  // Create Use Cases - Notifications
  const listNotifications = new ListNotificationsUseCase(notificationRepository);
  const markNotificationRead = new MarkNotificationReadUseCase(notificationRepository);
  const markAllNotificationsRead = new MarkAllNotificationsReadUseCase(notificationRepository);

  return {
    // Repositories
    employeeRepository,
    periodRepository,
    cycleRepository,
    selfEvaluationRepository,
    roadmapRepository,
    notificationRepository,
    scenarioRepository,
    curriculumRepository,

    // Use Cases - Auth
    getCurrentUser,

    // Use Cases - Periods
    listPeriods,
    getPeriod,
    createPeriod,

    // Use Cases - Cycles
    listCycles,
    getCycle,
    getSelfEvaluation,
    saveSelfEvaluation,
    submitSelfEvaluation,

    // Use Cases - Employees
    listEmployees,
    getEmployee,
    getSubordinates,

    // Use Cases - Dashboard
    getDashboard,

    // Use Cases - Roadmap
    listRoadmapItems,
    getRoadmapForGrade,

    // Use Cases - Notifications
    listNotifications,
    markNotificationRead,
    markAllNotificationsRead,
  };
}
