import React, { useState } from "react";
import { Layout } from "./Layout";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { 
  Users, 
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Building2,
  Mail,
  Phone,
  Calendar,
  UserCog,
  ChevronRight,
  MoreVertical,
  CheckCircle,
  XCircle
} from "lucide-react";

interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  nameKana: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  role: "employee" | "manager" | "admin";
  status: "active" | "inactive" | "leave";
  joinDate: string;
  avatarColor: string;
}

interface Department {
  id: string;
  name: string;
  managerName: string;
  employeeCount: number;
  description: string;
}

export const UserManagement: React.FC = () => {
  const [view, setView] = useState<"employees" | "departments">("employees");
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);

  // 社員データ
  const employees: Employee[] = [
    {
      id: "1",
      employeeCode: "EMP001",
      name: "田中 太郎",
      nameKana: "タナカ タロウ",
      email: "tanaka@example.com",
      phone: "090-1234-5678",
      department: "営業部",
      position: "部長",
      role: "manager",
      status: "active",
      joinDate: "2015-04-01",
      avatarColor: "bg-blue-500"
    },
    {
      id: "2",
      employeeCode: "EMP002",
      name: "山田 花子",
      nameKana: "ヤマダ ハナコ",
      email: "yamada@example.com",
      phone: "090-2345-6789",
      department: "営業部",
      position: "課長",
      role: "manager",
      status: "active",
      joinDate: "2017-04-01",
      avatarColor: "bg-pink-500"
    },
    {
      id: "3",
      employeeCode: "EMP003",
      name: "佐藤 次郎",
      nameKana: "サトウ ジロウ",
      email: "sato@example.com",
      phone: "090-3456-7890",
      department: "営業部",
      position: "主任",
      role: "employee",
      status: "active",
      joinDate: "2019-04-01",
      avatarColor: "bg-green-500"
    },
    {
      id: "4",
      employeeCode: "EMP004",
      name: "鈴木 美咲",
      nameKana: "スズキ ミサキ",
      email: "suzuki@example.com",
      phone: "090-4567-8901",
      department: "開発部",
      position: "部長",
      role: "manager",
      status: "active",
      joinDate: "2014-04-01",
      avatarColor: "bg-purple-500"
    },
    {
      id: "5",
      employeeCode: "EMP005",
      name: "高橋 健一",
      nameKana: "タカハシ ケンイチ",
      email: "takahashi@example.com",
      phone: "090-5678-9012",
      department: "開発部",
      position: "シニアエンジニア",
      role: "employee",
      status: "active",
      joinDate: "2018-04-01",
      avatarColor: "bg-yellow-500"
    },
    {
      id: "6",
      employeeCode: "EMP006",
      name: "伊藤 美香",
      nameKana: "イトウ ミカ",
      email: "ito@example.com",
      phone: "090-6789-0123",
      department: "人事部",
      position: "部長",
      role: "admin",
      status: "active",
      joinDate: "2012-04-01",
      avatarColor: "bg-red-500"
    },
    {
      id: "7",
      employeeCode: "EMP007",
      name: "渡辺 誠",
      nameKana: "ワタナベ マコト",
      email: "watanabe@example.com",
      phone: "090-7890-1234",
      department: "人事部",
      position: "課長",
      role: "employee",
      status: "active",
      joinDate: "2016-04-01",
      avatarColor: "bg-indigo-500"
    },
    {
      id: "8",
      employeeCode: "EMP008",
      name: "中村 里美",
      nameKana: "ナカムラ サトミ",
      email: "nakamura@example.com",
      phone: "090-8901-2345",
      department: "経理部",
      position: "部長",
      role: "manager",
      status: "active",
      joinDate: "2013-04-01",
      avatarColor: "bg-teal-500"
    }
  ];

  // 部署データ
  const departments: Department[] = [
    {
      id: "1",
      name: "営業部",
      managerName: "田中 太郎",
      employeeCount: 28,
      description: "法人営業、新規開拓を担当"
    },
    {
      id: "2",
      name: "開発部",
      managerName: "鈴木 美咲",
      employeeCount: 45,
      description: "プロダクト開発、システム保守を担当"
    },
    {
      id: "3",
      name: "人事部",
      managerName: "伊藤 美香",
      employeeCount: 12,
      description: "採用、労務、人事考課を担当"
    },
    {
      id: "4",
      name: "経理部",
      managerName: "中村 里美",
      employeeCount: 8,
      description: "会計、財務、予算管理を担当"
    },
    {
      id: "5",
      name: "マーケティング部",
      managerName: "小林 浩二",
      employeeCount: 15,
      description: "広報、プロモーション、市場調査を担当"
    }
  ];

  // フィルタリング
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.includes(searchQuery) ||
      emp.nameKana.includes(searchQuery) ||
      emp.email.includes(searchQuery) ||
      emp.employeeCode.includes(searchQuery);
    const matchesDepartment = departmentFilter === "all" || emp.department === departmentFilter;
    const matchesRole = roleFilter === "all" || emp.role === roleFilter;
    const matchesStatus = statusFilter === "all" || emp.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
  });

  const filteredDepartments = departments.filter((dept) => {
    return dept.name.includes(searchQuery) || dept.managerName.includes(searchQuery);
  });

  // ステータスバッジ
  const getStatusBadge = (status: Employee["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="success">在籍</Badge>;
      case "inactive":
        return <Badge variant="secondary">休職中</Badge>;
      case "leave":
        return <Badge variant="outline">退職</Badge>;
    }
  };

  // ロールバッジ
  const getRoleBadge = (role: Employee["role"]) => {
    switch (role) {
      case "admin":
        return <Badge variant="default">管理者</Badge>;
      case "manager":
        return <Badge variant="outline">上司</Badge>;
      case "employee":
        return <Badge variant="secondary">社員</Badge>;
    }
  };

  // ユニークな部署リスト
  const uniqueDepartments = Array.from(new Set(employees.map(e => e.department)));

  return (
    <Layout userRole="admin">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">組織・社員管理</h1>
            <p className="text-gray-600 mt-1">社員情報と組織構造を管理します</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              エクスポート
            </Button>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              インポート
            </Button>
            <Button onClick={() => view === "employees" ? setShowEmployeeModal(true) : setShowDepartmentModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {view === "employees" ? "社員を追加" : "部署を追加"}
            </Button>
          </div>
        </div>

        {/* タブ切り替え */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setView("employees")}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              view === "employees"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Users className="w-4 h-4 inline-block mr-2" />
            社員管理
          </button>
          <button
            onClick={() => setView("departments")}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              view === "departments"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Building2 className="w-4 h-4 inline-block mr-2" />
            部署管理
          </button>
        </div>

        {/* 社員管理ビュー */}
        {view === "employees" && (
          <>
            {/* 統計サマリー */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">総社員数</p>
                      <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">在籍</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {employees.filter(e => e.status === "active").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <UserCog className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">管理者</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {employees.filter(e => e.role === "admin").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Building2 className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">部署数</p>
                      <p className="text-2xl font-bold text-gray-900">{uniqueDepartments.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 検索とフィルター */}
            <Card>
              <CardContent className="py-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="社員名、メールアドレス、社員番号で検索..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="all">すべての部署</option>
                      {uniqueDepartments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="all">すべてのロール</option>
                      <option value="admin">管理者</option>
                      <option value="manager">上司</option>
                      <option value="employee">社員</option>
                    </select>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="all">すべてのステータス</option>
                      <option value="active">在籍</option>
                      <option value="inactive">休職中</option>
                      <option value="leave">退職</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 社員一覧テーブル */}
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
                          社員番号
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          部署
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          役職
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ロール
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ステータス
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          連絡先
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          アクション
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEmployees.map((employee) => (
                        <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 ${employee.avatarColor} rounded-full flex items-center justify-center text-white font-semibold`}>
                                {employee.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{employee.name}</p>
                                <p className="text-sm text-gray-500">{employee.nameKana}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{employee.employeeCode}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{employee.department}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{employee.position}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getRoleBadge(employee.role)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(employee.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              <div className="flex items-center gap-1 text-gray-900">
                                <Mail className="w-3 h-3 text-gray-400" />
                                {employee.email}
                              </div>
                              <div className="flex items-center gap-1 text-gray-500 mt-1">
                                <Phone className="w-3 h-3 text-gray-400" />
                                {employee.phone}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" title="編集">
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="削除" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 結果が0件の場合 */}
                {filteredEmployees.length === 0 && (
                  <div className="py-12 text-center">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">該当する社員が見つかりませんでした</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* 部署管理ビュー */}
        {view === "departments" && (
          <>
            {/* 検索 */}
            <Card>
              <CardContent className="py-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="部署名、責任者名で検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* 部署一覧 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDepartments.map((dept) => (
                <Card key={dept.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="py-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Building2 className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
                            <p className="text-sm text-gray-500">{dept.description}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <UserCog className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">責任者:</span>
                            <span className="font-medium text-gray-900">{dept.managerName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">社員数:</span>
                            <span className="font-medium text-gray-900">{dept.employeeCount}名</span>
                          </div>
                        </div>
                      </div>

                      {/* アクションボタン */}
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" title="編集">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="削除" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 結果が0件の場合 */}
            {filteredDepartments.length === 0 && (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">該当する部署が見つかりませんでした</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {/* 社員追加モーダル */}
      {showEmployeeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">新規社員を追加</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowEmployeeModal(false)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    社員番号 <span className="text-red-500">*</span>
                  </label>
                  <Input type="text" placeholder="EMP001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    入社日 <span className="text-red-500">*</span>
                  </label>
                  <Input type="date" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    氏名 <span className="text-red-500">*</span>
                  </label>
                  <Input type="text" placeholder="山田 太郎" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    フリガナ <span className="text-red-500">*</span>
                  </label>
                  <Input type="text" placeholder="ヤマダ タロウ" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    メールアドレス <span className="text-red-500">*</span>
                  </label>
                  <Input type="email" placeholder="yamada@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    電話番号
                  </label>
                  <Input type="tel" placeholder="090-1234-5678" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    部署 <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">選択してください</option>
                    {uniqueDepartments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    役職 <span className="text-red-500">*</span>
                  </label>
                  <Input type="text" placeholder="一般社員" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ロール <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="employee">社員</option>
                    <option value="manager">上司</option>
                    <option value="admin">管理者</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowEmployeeModal(false)}>
                  キャンセル
                </Button>
                <Button onClick={() => setShowEmployeeModal(false)}>
                  追加
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 部署追加モーダル */}
      {showDepartmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">新規部署を追加</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowDepartmentModal(false)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  部署名 <span className="text-red-500">*</span>
                </label>
                <Input type="text" placeholder="例: 営業部" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  責任者 <span className="text-red-500">*</span>
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">選択してください</option>
                  {employees.filter(e => e.role === "manager" || e.role === "admin").map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  説明
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="部署の役割や業務内容を入力してください"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowDepartmentModal(false)}>
                  キャンセル
                </Button>
                <Button onClick={() => setShowDepartmentModal(false)}>
                  追加
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Layout>
  );
};
