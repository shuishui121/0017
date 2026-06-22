import { useState, useMemo } from 'react';
import { Plus, X, Search, UserPlus } from 'lucide-react';
import { Role, RoleType, ROLE_TYPE_LABELS } from '@/types';
import { PRESET_ROLES } from '@/data/roleRecommendations';

interface BatchRoleSelectorProps {
  selectedRoles: Role[];
  onRolesChange: (roles: Role[]) => void;
}

export default function BatchRoleSelector({
  selectedRoles,
  onRolesChange,
}: BatchRoleSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<RoleType | 'all'>('all');
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customRoleType, setCustomRoleType] = useState<RoleType>('custom');

  const filteredPresets = useMemo(() => {
    let result = PRESET_ROLES;

    if (filterType !== 'all') {
      result = result.filter(r => r.roleType === filterType);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        r =>
          r.name.toLowerCase().includes(query) ||
          r.description?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [filterType, searchQuery]);

  const selectedIds = useMemo(
    () => new Set(selectedRoles.map(r => r.id)),
    [selectedRoles]
  );

  const togglePresetRole = (preset: typeof PRESET_ROLES[number]) => {
    if (selectedIds.has(preset.id)) {
      onRolesChange(selectedRoles.filter(r => r.id !== preset.id));
    } else {
      const newRole: Role = {
        id: preset.id,
        name: preset.name,
        roleType: preset.roleType,
        description: preset.description,
      };
      onRolesChange([...selectedRoles, newRole]);
    }
  };

  const addCustomRole = () => {
    if (!customName.trim()) return;

    const newRole: Role = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      roleType: customRoleType,
    };
    onRolesChange([...selectedRoles, newRole]);
    setCustomName('');
    setCustomRoleType('custom');
    setShowCustomDialog(false);
  };

  const removeRole = (roleId: string) => {
    onRolesChange(selectedRoles.filter(r => r.id !== roleId));
  };

  const roleTypes: (RoleType | 'all')[] = [
    'all',
    'laosheng',
    'xiaosheng',
    'qingyi',
    'huadan',
    'wudan',
    'laodan',
    'hualian',
    'chou',
    'wensheng',
    'wusheng',
    'custom',
  ];

  return (
    <div className="bg-white rounded-lg shadow-opera p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-opera-red font-opera-display">
          选择角色
        </h2>
        <button
          onClick={() => setShowCustomDialog(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-opera-red text-white rounded-lg hover:bg-red-900 transition-colors text-sm"
        >
          <UserPlus size={16} />
          <span>自定义</span>
        </button>
      </div>

      {selectedRoles.length > 0 && (
        <div className="mb-4 p-3 bg-opera-cream rounded-lg border border-opera-gold/30">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-opera-dark">
              已选角色 ({selectedRoles.length})
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedRoles.map(role => (
              <div
                key={role.id}
                className="flex items-center gap-1 px-2 py-1 bg-opera-red/10 border border-opera-red/30 rounded-full"
              >
                <span className="text-xs text-opera-dark font-medium">
                  {role.name}
                </span>
                <span className="text-xs text-opera-red">
                  ({ROLE_TYPE_LABELS[role.roleType]})
                </span>
                <button
                  onClick={() => removeRole(role.id)}
                  className="ml-1 p-0.5 hover:bg-opera-red/20 rounded-full transition-colors"
                >
                  <X size={12} className="text-opera-red" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-3 flex gap-2">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜索角色..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-opera-gold text-sm"
          />
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-1">
        {roleTypes.map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-2 py-1 text-xs rounded-md transition-colors ${
              filterType === type
                ? 'bg-opera-red text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {type === 'all' ? '全部' : ROLE_TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      <div className="max-h-80 overflow-y-auto space-y-1">
        {filteredPresets.map(preset => {
          const isSelected = selectedIds.has(preset.id);
          return (
            <button
              key={preset.id}
              onClick={() => togglePresetRole(preset)}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all ${
                isSelected
                  ? 'bg-opera-red/10 border-2 border-opera-red'
                  : 'bg-gray-50 border-2 border-transparent hover:bg-opera-cream hover:border-opera-gold/50'
              }`}
            >
              <div>
                <p
                  className={`font-medium text-sm ${
                    isSelected ? 'text-opera-red' : 'text-opera-dark'
                  }`}
                >
                  {preset.name}
                </p>
                <p className="text-xs text-gray-500">
                  {ROLE_TYPE_LABELS[preset.roleType]}
                  {preset.description && ` · ${preset.description}`}
                </p>
              </div>
              {isSelected ? (
                <div className="w-5 h-5 bg-opera-red rounded-full flex items-center justify-center">
                  <X size={12} className="text-white" />
                </div>
              ) : (
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center">
                  <Plus size={12} className="text-gray-400" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {showCustomDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-opera-cream rounded-lg p-6 w-96 shadow-xl border-2 border-opera-gold">
            <h3 className="text-xl font-bold text-opera-red mb-4 font-opera-display">
              添加自定义角色
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-opera-dark mb-1">
                  角色名称
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  placeholder="请输入角色名称"
                  className="w-full px-3 py-2 border-2 border-opera-gold rounded-lg focus:outline-none focus:border-opera-red"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-opera-dark mb-1">
                  角色类型
                </label>
                <select
                  value={customRoleType}
                  onChange={e =>
                    setCustomRoleType(e.target.value as RoleType)
                  }
                  className="w-full px-3 py-2 border-2 border-opera-gold rounded-lg focus:outline-none focus:border-opera-red bg-white"
                >
                  {(
                    Object.keys(ROLE_TYPE_LABELS) as RoleType[]
                  ).map(type => (
                    <option key={type} value={type}>
                      {ROLE_TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => {
                  setShowCustomDialog(false);
                  setCustomName('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                取消
              </button>
              <button
                onClick={addCustomRole}
                disabled={!customName.trim()}
                className="px-4 py-2 bg-opera-red text-white rounded-lg hover:bg-red-900 transition-colors disabled:opacity-50"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
