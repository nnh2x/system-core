import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Drawer,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
  Transfer,
  Tabs,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SafetyOutlined } from '@ant-design/icons';
import { Role, Permission } from '@/types';
import { rbacService } from '@/services/rbac.service';
import type { ColumnsType } from 'antd/es/table';

const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [permissionDrawerVisible, setPermissionDrawerVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [form] = Form.useForm();
  const [permissionForm] = Form.useForm();

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await rbacService.getRoles();
      setRoles(data);
    } catch (error: any) {
      message.error('Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const data = await rbacService.getPermissions();
      setPermissions(data);
    } catch (error) {
      message.error('Failed to fetch permissions');
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const handleCreate = () => {
    setEditingRole(null);
    form.resetFields();
    setDrawerVisible(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    form.setFieldsValue({
      name: role.name,
      description: role.description,
    });
    setDrawerVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await rbacService.deleteRole(id);
      message.success('Role deleted successfully');
      fetchRoles();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to delete role');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingRole) {
        await rbacService.updateRole(editingRole.id, values);
        message.success('Role updated successfully');
      } else {
        await rbacService.createRole(values);
        message.success('Role created successfully');
      }
      setDrawerVisible(false);
      fetchRoles();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to save role');
    }
  };

  const handleManagePermissions = (role: Role) => {
    setSelectedRole(role);
    const rolePermissionIds = role.permissions?.map((p) => p.id) || [];
    setTargetKeys(rolePermissionIds);
    setPermissionDrawerVisible(true);
  };

  const handlePermissionChange = (newTargetKeys: string[]) => {
    setTargetKeys(newTargetKeys);
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;

    try {
      const currentPermissionIds = selectedRole.permissions?.map((p) => p.id) || [];
      const toAdd = targetKeys.filter((id) => !currentPermissionIds.includes(id));
      const toRemove = currentPermissionIds.filter((id) => !targetKeys.includes(id));

      await Promise.all([
        ...toAdd.map((permId) => rbacService.assignPermission(selectedRole.id, permId)),
        ...toRemove.map((permId) => rbacService.removePermission(selectedRole.id, permId)),
      ]);

      message.success('Permissions updated successfully');
      setPermissionDrawerVisible(false);
      fetchRoles();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to update permissions');
    }
  };

  const handleCreatePermission = async (values: any) => {
    try {
      await rbacService.createPermission(values);
      message.success('Permission created successfully');
      permissionForm.resetFields();
      fetchPermissions();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to create permission');
    }
  };

  const roleColumns: ColumnsType<Role> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: Permission[]) => permissions?.length || 0,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Role) => (
        <Space>
          <Button
            type="link"
            icon={<SafetyOutlined />}
            onClick={() => handleManagePermissions(record)}
          >
            Permissions
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this role?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const permissionColumns: ColumnsType<Permission> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Resource',
      dataIndex: 'resource',
      key: 'resource',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  return (
    <div>
      <Tabs
        defaultActiveKey="roles"
        items={[
          {
            key: 'roles',
            label: 'Roles',
            children: (
              <>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                  <h2>Roles Management</h2>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                    Add Role
                  </Button>
                </div>
                <Table
                  columns={roleColumns}
                  dataSource={roles}
                  rowKey="id"
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                />
              </>
            ),
          },
          {
            key: 'permissions',
            label: 'Permissions',
            children: (
              <>
                <div style={{ marginBottom: 16 }}>
                  <h2>Permissions</h2>
                  <Form
                    form={permissionForm}
                    layout="inline"
                    onFinish={handleCreatePermission}
                    style={{ marginTop: 16 }}
                  >
                    <Form.Item name="name" rules={[{ required: true }]}>
                      <Input placeholder="Permission Name" />
                    </Form.Item>
                    <Form.Item name="resource" rules={[{ required: true }]}>
                      <Input placeholder="Resource (e.g., users)" />
                    </Form.Item>
                    <Form.Item name="action" rules={[{ required: true }]}>
                      <Input placeholder="Action (e.g., read)" />
                    </Form.Item>
                    <Form.Item name="description">
                      <Input placeholder="Description" />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Add Permission
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
                <Table
                  columns={permissionColumns}
                  dataSource={permissions}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              </>
            ),
          },
        ]}
      />

      <Drawer
        title={editingRole ? 'Edit Role' : 'Create Role'}
        width={480}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setDrawerVisible(false)}>Cancel</Button>
              <Button type="primary" onClick={() => form.submit()}>
                {editingRole ? 'Update' : 'Create'}
              </Button>
            </Space>
          </div>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Role Name"
            rules={[{ required: true, message: 'Please input role name!' }]}
          >
            <Input placeholder="Administrator" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Role description" rows={4} />
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title={`Manage Permissions - ${selectedRole?.name}`}
        width={720}
        open={permissionDrawerVisible}
        onClose={() => setPermissionDrawerVisible(false)}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setPermissionDrawerVisible(false)}>Cancel</Button>
              <Button type="primary" onClick={handleSavePermissions}>
                Save
              </Button>
            </Space>
          </div>
        }
      >
        <Transfer
          dataSource={permissions.map((p) => ({ key: p.id, title: p.name, description: `${p.resource}:${p.action}` }))}
          titles={['Available', 'Assigned']}
          targetKeys={targetKeys}
          onChange={handlePermissionChange}
          render={(item) => `${item.title} - ${item.description}`}
          listStyle={{ width: 300, height: 400 }}
        />
      </Drawer>
    </div>
  );
};

export default RolesPage;
