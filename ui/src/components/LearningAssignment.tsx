import React, { useState } from "react";
import { Layout } from "./Layout";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import {
  Search,
  Send,
  Users,
  BookOpen,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Filter,
  UserPlus,
  Calendar,
} from "lucide-react";

interface Employee {
  id: number;
  name: string;
  department: string;
  grade: string;
  avatar: string;
  assignedTasks: number;
  completedTasks: number;
}

interface Curriculum {
  id: number;
  title: string;
  targetGrade: string;
  itemCount: number;
  estimatedMinutes: number;
}

interface Assignment {
  id: number;
  employeeId: number;
  employeeName: string;
  department: string;
  curriculumTitle: string;
  status: "assigned" | "in_progress" | "completed" | "overdue";
  progress: number;
  assignedAt: string;
  dueDate: string;
}

export const LearningAssignment: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [selectedCurriculum, setSelectedCurriculum] = useState<number | null>(null);

  const stats = {
    totalAssigned: 45,
    inProgress: 28,
    completed: 12,
    overdue: 5,
  };

  const departments = ["開発部", "営業部", "総務部", "企画部"];

  const employees: Employee[] = [
    { id: 1, name: "佐藤 花子", department: "開発部", grade: "L2", avatar: "SH", assignedTasks: 3, completedTasks: 1 },
    { id: 2, name: "田中 太郎", department: "開発部", grade: "L3", avatar: "TT", assignedTasks: 2, completedTasks: 2 },
    { id: 3, name: "山田 次郎", department: "営業部", grade: "L2", avatar: "YJ", assignedTasks: 1, completedTasks: 0 },
    { id: 4, name: "鈴木 三郎", department: "総務部", grade: "L1", avatar: "SS", assignedTasks: 2, completedTasks: 1 },
    { id: 5, name: "高橋 四郎", department: "開発部", grade: "L2", avatar: "TS", assignedTasks: 1, completedTasks: 0 },
  ];

  const curriculums: Curriculum[] = [
    { id: 1, title: "AWS障害対応基礎カリキュラム", targetGrade: "L2", itemCount: 8, estimatedMinutes: 120 },
    { id: 2, title: "チームリーダーシップ育成カリキュラム", targetGrade: "L3", itemCount: 10, estimatedMinutes: 180 },
    { id: 3, title: "セキュリティ基礎カリキュラム", targetGrade: "L3", itemCount: 12, estimatedMinutes: 150 },
    { id: 4, title: "コードレビュー実践カリキュラム", targetGrade: "L2", itemCount: 6, estimatedMinutes: 90 },
  ];

  const assignments: Assignment[] = [
    {
      id: 1,
      employeeId: 1,
      employeeName: "佐藤 花子",
      department: "開発部",
      curriculumTitle: "AWS障害対応基礎カリキュラム",
      status: "in_progress",
      progress: 60,
      assignedAt: "2025-01-15",
      dueDate: "2025-02-15",
    },
    {
      id: 2,
      employeeId: 2,
      employeeName: "田中 太郎",
      department: "開発部",
      curriculumTitle: "チームリーダーシップ育成カリキュラム",
      status: "completed",
      progress: 100,
      assignedAt: "2025-01-10",
      dueDate: "2025-02-10",
    },
    {
      id: 3,
      employeeId: 3,
      employeeName: "山田 次郎",
      department: "営業部",
      curriculumTitle: "セキュリティ基礎カリキュラム",
      status: "overdue",
      progress: 30,
      assignedAt: "2025-01-01",
      dueDate: "2025-01-20",
    },
    {
      id: 4,
      employeeId: 4,
      employeeName: "鈴木 三郎",
      department: "総務部",
      curriculumTitle: "コードレビュー実践カリキュラム",
      status: "assigned",
      progress: 0,
      assignedAt: "2025-01-20",
      dueDate: "2025-02-20",
    },
    {
      id: 5,
      employeeId: 5,
      employeeName: "高橋 四郎",
      department: "開発部",
      curriculumTitle: "AWS障害対応基礎カリキュラム",
      status: "in_progress",
      progress: 25,
      assignedAt: "2025-01-18",
      dueDate: "2025-02-18",
    },
  ];

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.employeeName.includes(searchQuery) ||
      assignment.curriculumTitle.includes(searchQuery);
    const matchesDepartment =
      departmentFilter === "all" || assignment.department === departmentFilter;
    const matchesStatus =
      statusFilter === "all" || assignment.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">完了</Badge>;
      case "in_progress":
        return <Badge variant="default">学習中</Badge>;
      case "assigned":
        return <Badge variant="gray">未着手</Badge>;
      case "overdue":
        return <Badge variant="error">期限超過</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  const toggleEmployeeSelection = (id: number) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleAssign = () => {
    // Assign logic here
    setIsAssignModalOpen(false);
    setSelectedEmployees([]);
    setSelectedCurriculum(null);
  };

  return (
    <Layout userRole="admin">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">学習課題割り当て</h1>
            <p className="text-gray-600 mt-1">
              社員への学習課題の配信・進捗管理
            </p>
          </div>
          <Button onClick={() => setIsAssignModalOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            新規割り当て
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">総割り当て</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalAssigned}件
                  </p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <BookOpen className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">学習中</p>
                  <p className="text-3xl font-bold text-[#1971c2]">
                    {stats.inProgress}件
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-[#1971c2]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">完了</p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.completed}件
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">期限超過</p>
                  <p className="text-3xl font-bold text-red-600">
                    {stats.overdue}件
                  </p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="社員名またはカリキュラムで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1971c2]"
              >
                <option value="all">すべての部署</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1971c2]"
              >
                <option value="all">すべてのステータス</option>
                <option value="assigned">未着手</option>
                <option value="in_progress">学習中</option>
                <option value="completed">完了</option>
                <option value="overdue">期限超過</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Assignments Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      社員
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      カリキュラム
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      進捗
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      期限
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ステータス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAssignments.map((assignment) => (
                    <tr
                      key={assignment.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#1971c2] text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {assignment.employeeName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {assignment.employeeName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {assignment.department}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {assignment.curriculumTitle}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Progress value={assignment.progress} className="w-20" />
                          <span className="text-sm text-gray-500">
                            {assignment.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {assignment.dueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(assignment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            詳細
                          </Button>
                          {assignment.status === "overdue" && (
                            <Button variant="ghost" size="sm">
                              <Send className="w-4 h-4 text-[#1971c2]" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Assign Modal */}
        {isAssignModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  学習課題の新規割り当て
                </h2>
                <button
                  onClick={() => setIsAssignModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Curriculum Selection */}
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold text-gray-900">カリキュラムを選択</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {curriculums.map((curriculum) => (
                        <label
                          key={curriculum.id}
                          className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedCurriculum === curriculum.id
                              ? "border-[#1971c2] bg-blue-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="curriculum"
                              checked={selectedCurriculum === curriculum.id}
                              onChange={() => setSelectedCurriculum(curriculum.id)}
                              className="w-4 h-4 text-[#1971c2] border-gray-300 focus:ring-[#1971c2]"
                            />
                            <div>
                              <p className="font-medium text-gray-900">
                                {curriculum.title}
                              </p>
                              <p className="text-sm text-gray-500">
                                {curriculum.itemCount}項目 / 約{curriculum.estimatedMinutes}分
                              </p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                            {curriculum.targetGrade}
                          </span>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Employee Selection */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">対象社員を選択</h3>
                      <span className="text-sm text-gray-500">
                        {selectedEmployees.length}名選択中
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {employees.map((employee) => (
                        <label
                          key={employee.id}
                          className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedEmployees.includes(employee.id)
                              ? "border-[#1971c2] bg-blue-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedEmployees.includes(employee.id)}
                              onChange={() => toggleEmployeeSelection(employee.id)}
                              className="w-4 h-4 text-[#1971c2] border-gray-300 rounded focus:ring-[#1971c2]"
                            />
                            <div className="w-8 h-8 bg-[#1971c2] text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {employee.avatar}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {employee.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {employee.department} / {employee.grade}
                              </p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            課題: {employee.completedTasks}/{employee.assignedTasks}完了
                          </div>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Due Date */}
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold text-gray-900">期限設定</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <Input type="date" className="w-48" />
                      <span className="text-sm text-gray-500">
                        ※ 未設定の場合は30日後が期限となります
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>
                  キャンセル
                </Button>
                <Button
                  onClick={handleAssign}
                  disabled={!selectedCurriculum || selectedEmployees.length === 0}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {selectedEmployees.length}名に割り当て
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
