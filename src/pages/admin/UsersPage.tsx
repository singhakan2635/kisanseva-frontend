import { useState, useCallback } from 'react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { EmptyState } from '@/components/common/EmptyState';
import {
  Search,
  Download,
  Bell,
  Plus,
  ChevronLeft,
  ChevronRight,
  Users,
  X as _X,
} from 'lucide-react';

interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'farmer' | 'expert' | 'admin';
  crops: string[];
  createdAt: string;
  lastActive: string;
  diagnosesCount: number;
  status: 'active' | 'inactive';
}

const MOCK_USERS: AdminUser[] = Array.from({ length: 25 }, (_, i) => ({
  _id: `user-${i}`,
  firstName: ['Ramesh', 'Sunil', 'Priya', 'Amit', 'Kavita', 'Rajesh', 'Neha', 'Vikram'][i % 8],
  lastName: ['Kumar', 'Singh', 'Sharma', 'Patel', 'Gupta', 'Verma', 'Yadav', 'Joshi'][i % 8],
  phone: `+91${9000000000 + i * 111111}`,
  role: i < 2 ? 'admin' : i < 5 ? 'expert' : 'farmer',
  crops: [['Rice', 'Wheat'], ['Tomato', 'Potato'], ['Cotton'], ['Sugarcane', 'Maize'], ['Mango']][i % 5],
  createdAt: new Date(Date.now() - i * 86400000 * 3).toISOString(),
  lastActive: new Date(Date.now() - i * 3600000).toISOString(),
  diagnosesCount: Math.floor(Math.random() * 50),
  status: i % 7 === 0 ? 'inactive' : 'active',
}));

const roleBadge: Record<string, 'success' | 'info' | 'warning'> = {
  farmer: 'success',
  expert: 'info',
  admin: 'warning',
};

export function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ firstName: '', lastName: '', phone: '', role: 'farmer' });

  const perPage = 10;

  const filtered = MOCK_USERS.filter((u) => {
    const matchesSearch =
      !search ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const exportCSV = useCallback(() => {
    const headers = ['Name', 'Phone', 'Role', 'Crops', 'Joined', 'Diagnoses'];
    const rows = filtered.map((u) => [
      `${u.firstName} ${u.lastName}`,
      u.phone,
      u.role,
      u.crops.join('; '),
      new Date(u.createdAt).toLocaleDateString(),
      u.diagnosesCount,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kisanseva-users.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} users total</p>
        </div>
        <Button icon={Plus} size="sm" onClick={() => setShowAddModal(true)}>
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card variant="flat" noPadding>
        <div className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="all">All Roles</option>
            <option value="farmer">Farmer</option>
            <option value="expert">Expert</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </Card>

      {/* Bulk Actions */}
      <div className="flex gap-2">
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <Bell className="w-3.5 h-3.5" /> Send Notification
        </button>
      </div>

      {/* Table */}
      {paginated.length === 0 ? (
        <EmptyState icon={Users} title="No users found" description="Try adjusting your filters" />
      ) : (
        <Card variant="default" noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Name</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Phone</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Role</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-600 hidden md:table-cell">Crops</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-600 hidden lg:table-cell">Joined</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-600 hidden lg:table-cell">Last Active</th>
                  <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Diagnoses</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((u, i) => (
                  <tr
                    key={u._id}
                    onClick={() => setSelectedUser(u)}
                    className={`border-b border-gray-50 cursor-pointer hover:bg-primary-50/40 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                          {u.firstName[0]}{u.lastName[0]}
                        </div>
                        <span className="font-medium text-gray-900">{u.firstName} {u.lastName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-gray-600">{u.phone}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant={roleBadge[u.role] || 'neutral'} size="sm">{u.role}</Badge>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-600 hidden md:table-cell">{u.crops.join(', ')}</td>
                    <td className="px-4 py-2.5 text-xs text-gray-500 hidden lg:table-cell">
                      {new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-500 hidden lg:table-cell">
                      {new Date(u.lastActive).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-gray-900">{u.diagnosesCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* User Detail Panel */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="User Details"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
                {selectedUser.firstName[0]}{selectedUser.lastName[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{selectedUser.firstName} {selectedUser.lastName}</p>
                <Badge variant={roleBadge[selectedUser.role] || 'neutral'} size="sm">{selectedUser.role}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{selectedUser.phone}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <Badge variant={selectedUser.status === 'active' ? 'success' : 'neutral'} size="sm" showDot>
                  {selectedUser.status}
                </Badge>
              </div>
              <div>
                <p className="text-gray-500">Crops</p>
                <p className="font-medium text-gray-900">{selectedUser.crops.join(', ') || 'None'}</p>
              </div>
              <div>
                <p className="text-gray-500">Diagnoses</p>
                <p className="font-medium text-gray-900">{selectedUser.diagnosesCount}</p>
              </div>
              <div>
                <p className="text-gray-500">Joined</p>
                <p className="font-medium text-gray-900">
                  {new Date(selectedUser.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Last Active</p>
                <p className="font-medium text-gray-900">
                  {new Date(selectedUser.lastActive).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New User"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => setShowAddModal(false)}>
              Add User
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="First Name"
            value={addForm.firstName}
            onChange={(e) => setAddForm((f) => ({ ...f, firstName: e.target.value }))}
            placeholder="Enter first name"
          />
          <Input
            label="Last Name"
            value={addForm.lastName}
            onChange={(e) => setAddForm((f) => ({ ...f, lastName: e.target.value }))}
            placeholder="Enter last name"
          />
          <Input
            label="Phone Number"
            variant="phone"
            value={addForm.phone}
            onChange={(e) => setAddForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="9876543210"
          />
          <div>
            <label className="block text-base font-semibold text-earth-800 mb-1.5">Role</label>
            <select
              value={addForm.role}
              onChange={(e) => setAddForm((f) => ({ ...f, role: e.target.value }))}
              className="w-full min-h-[56px] px-4 py-3 border-2 border-earth-300 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              <option value="farmer">Farmer</option>
              <option value="expert">Expert</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
